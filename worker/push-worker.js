/* Servidor de avisos do Verbo Crianças (Cloudflare Workers, plano gratuito).
   Recebe do app da tia o pedido "avise esta família", confere quem pediu e envia o Web Push
   (padrão do navegador, com VAPID e criptografia aes128gcm) para os aparelhos dos pais.
   Variáveis (Settings > Variables and Secrets do Worker):
     PROJECT_ID      id do projeto no Firebase (o mesmo projectId do firebase-config.js)
     VAPID_PUBLIC    chave pública gerada em chaves.html
     VAPID_PRIVATE   chave privada gerada em chaves.html (guarde como Secret)
     VAPID_SUBJECT   mailto:seu-email@exemplo.com
     ALLOWED_ORIGIN  endereço do site, ex.: https://russo-speack.github.io */

const enc = new TextEncoder();
const b64uToBytes = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
const bytesToB64u = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const concat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; a.forEach(x => { o.set(x, i); i += x.length; }); return o; };
const PUSH_HOSTS = [/(^|\.)fcm\.googleapis\.com$/, /(^|\.)push\.services\.mozilla\.com$/, /(^|\.)push\.apple\.com$/, /(^|\.)notify\.windows\.com$/];

async function hkdf(salt, ikm, info, len) {
  const k = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, k, len * 8));
}

/* RFC 8291: criptografia da mensagem para o aparelho */
async function encryptPayload(sub, text) {
  const uaPub = b64uToBytes(sub.keys.p256dh), authSecret = b64uToBytes(sub.keys.auth);
  const pair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, pair.privateKey, 256));
  const ikm = await hkdf(authSecret, shared, concat(enc.encode('WebPush: info\0'), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const data = concat(enc.encode(text), new Uint8Array([2]));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, data));
  return concat(salt, new Uint8Array([0, 0, 16, 0, 65]), asPub, ct);
}

/* RFC 8292: identificação do servidor (VAPID) */
async function vapidHeader(endpoint, env) {
  const pub = b64uToBytes(env.VAPID_PUBLIC);
  const jwk = { kty: 'EC', crv: 'P-256', x: bytesToB64u(pub.slice(1, 33)), y: bytesToB64u(pub.slice(33, 65)), d: env.VAPID_PRIVATE };
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const head = bytesToB64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = bytesToB64u(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: env.VAPID_SUBJECT })));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(head + '.' + body));
  return 'vapid t=' + head + '.' + body + '.' + bytesToB64u(sig) + ', k=' + env.VAPID_PUBLIC;
}

/* Confere o login do Firebase de quem está pedindo */
async function verifyFirebaseToken(token, projectId) {
  const [h, p, s] = String(token || '').split('.');
  if (!h || !p || !s) throw new Error('token');
  const dec = x => JSON.parse(new TextDecoder().decode(b64uToBytes(x)));
  const head = dec(h), pay = dec(p), now = Math.floor(Date.now() / 1000);
  if (head.alg !== 'RS256' || pay.aud !== projectId || pay.iss !== 'https://securetoken.google.com/' + projectId || !pay.sub || pay.exp < now || pay.iat > now + 300) throw new Error('token');
  const jwks = await (await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')).json();
  const jwk = (jwks.keys || []).find(k => k.kid === head.kid);
  if (!jwk) throw new Error('token');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  if (!(await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64uToBytes(s), enc.encode(h + '.' + p)))) throw new Error('token');
  if (!pay.firebase || pay.firebase.sign_in_provider === 'anonymous') throw new Error('anon');
  return pay;
}

async function sendOne(sub, message, env) {
  const url = new URL(sub.endpoint);
  if (url.protocol !== 'https:' || !PUSH_HOSTS.some(r => r.test(url.hostname))) return { endpoint: sub.endpoint, status: 400 };
  const res = await fetch(sub.endpoint, {
    method: 'POST',
    headers: { 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '3600', Urgency: 'high', Authorization: await vapidHeader(sub.endpoint, env) },
    body: await encryptPayload(sub, message)
  });
  return { endpoint: sub.endpoint, status: res.status };
}

export default {
  async fetch(req, env) {
    const cors = { 'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' };
    const out = (o, st) => new Response(JSON.stringify(o), { status: st || 200, headers: Object.assign({ 'Content-Type': 'application/json' }, cors) });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return out({ ok: true, name: 'verbo-criancas-push' });
    try { await verifyFirebaseToken((req.headers.get('Authorization') || '').replace(/^Bearer /, ''), env.PROJECT_ID); }
    catch (e) { return out({ error: 'Não autorizado.' }, 401); }
    let d; try { d = await req.json(); } catch (e) { return out({ error: 'Pedido inválido.' }, 400); }
    const subs = (Array.isArray(d.subs) ? d.subs : []).filter(s => s && s.endpoint && s.keys && s.keys.p256dh && s.keys.auth).slice(0, 20);
    const message = JSON.stringify({ title: String(d.title || 'Verbo Crianças').slice(0, 60), body: String(d.body || '').slice(0, 240), url: String(d.url || './#pais').slice(0, 100) });
    const results = await Promise.all(subs.map(s => sendOne(s, message, env).catch(() => ({ endpoint: s.endpoint, status: 0 }))));
    return out({ sent: results.filter(r => r.status >= 200 && r.status < 300).length, dead: results.filter(r => r.status === 404 || r.status === 410).map(r => r.endpoint) });
  }
};
