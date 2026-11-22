/* Funções do Verbo Crianças (exigem o plano Blaze do Firebase).
   - createAccount / resetPassword / setActive: gestão de acessos feita no servidor.
   - notifyAlert: envia a notificação push aos pais quando uma tia cria um aviso. */
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();
const REGION = 'southamerica-east1';
const STAFF = ['recepcao', 'coord', 'admin'];
const ROLES = ['pais', 'tia', 'recepcao', 'coord', 'admin'];
const digits = s => String(s || '').replace(/\D/g, '');
const phoneEmail = p => 'p' + digits(p) + '@pais.verbo.app';
const safeId = s => /^[\w-]{1,40}$/.test(String(s || ''));

function genPass() {
  const a = 'abcdefghjkmnpqrstuvwxyz23456789', b = crypto.randomBytes(10);
  let s = ''; for (let i = 0; i < 10; i++) s += a[b[i] % a.length];
  return s;
}

async function caller(req) {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Entre na sua conta.');
  const s = await db.doc('users/' + req.auth.uid).get();
  const u = s.data();
  if (!u || u.active !== true) throw new HttpsError('permission-denied', 'Sua conta está desativada.');
  return Object.assign({ id: req.auth.uid }, u);
}

exports.createAccount = onCall({ region: REGION }, async req => {
  const me = await caller(req), d = req.data || {}, role = d.role;
  if (!ROLES.includes(role)) throw new HttpsError('invalid-argument', 'Perfil inválido.');
  if (role === 'pais' ? !STAFF.includes(me.role) : me.role !== 'admin') throw new HttpsError('permission-denied', 'Você não tem permissão para criar este acesso.');
  const name = String(d.name || '').trim().slice(0, 80);
  if (!name) throw new HttpsError('invalid-argument', 'Informe o nome.');
  let email;
  if (role === 'pais') {
    if (digits(d.phone).length < 8) throw new HttpsError('invalid-argument', 'Informe um telefone válido, com DDD.');
    if (!safeId(d.fam)) throw new HttpsError('invalid-argument', 'Família inválida.');
    email = phoneEmail(d.phone);
  } else {
    email = String(d.login || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpsError('invalid-argument', 'Informe um e-mail válido.');
    if (role === 'tia' && !safeId(d.tia)) throw new HttpsError('invalid-argument', 'Tia inválida.');
  }
  const pass = genPass();
  let user;
  try { user = await admin.auth().createUser({ email, password: pass, displayName: name }); }
  catch (e) {
    if (e.code === 'auth/email-already-exists') throw new HttpsError('already-exists', 'Já existe um acesso com este login.');
    throw new HttpsError('internal', 'Não foi possível criar o acesso.');
  }
  const profile = { id: user.uid, role, name, login: role === 'pais' ? '' : email, phone: role === 'pais' ? String(d.phone).slice(0, 30) : '', active: true };
  if (role === 'pais') profile.fam = String(d.fam);
  if (role === 'tia') profile.tia = String(d.tia);
  await db.doc('users/' + user.uid).set(profile);
  return { uid: user.uid, pass, profile };
});

exports.resetPassword = onCall({ region: REGION }, async req => {
  const me = await caller(req), uid = String((req.data || {}).uid || '');
  const t = (await db.doc('users/' + uid).get()).data();
  if (!t) throw new HttpsError('not-found', 'Acesso não encontrado.');
  if (me.role !== 'admin' && !(STAFF.includes(me.role) && t.role === 'pais')) throw new HttpsError('permission-denied', 'Você não tem permissão.');
  const pass = genPass();
  await admin.auth().updateUser(uid, { password: pass });
  await admin.auth().revokeRefreshTokens(uid);
  return { pass };
});

exports.setActive = onCall({ region: REGION }, async req => {
  const me = await caller(req), d = req.data || {}, uid = String(d.uid || '');
  if (me.role !== 'admin') throw new HttpsError('permission-denied', 'Só o administrador muda o estado de um acesso.');
  if (uid === me.id) throw new HttpsError('failed-precondition', 'Você não pode desativar o seu próprio acesso.');
  const active = d.active === true;
  if (!(await db.doc('users/' + uid).get()).exists) throw new HttpsError('not-found', 'Acesso não encontrado.');
  await db.doc('users/' + uid).update({ active });
  await admin.auth().updateUser(uid, { disabled: !active });
  if (!active) await admin.auth().revokeRefreshTokens(uid);
  return { ok: true };
});

exports.notifyAlert = onDocumentCreated({ document: 'alerts/{id}', region: REGION }, async ev => {
  const a = ev.data && ev.data.data();
  if (!a || !a.fam) return;
  const snap = await db.collection('users').where('fam', '==', a.fam).where('active', '==', true).get();
  const items = [];
  snap.forEach(doc => (doc.data().tokens || []).forEach(t => items.push({ t, ref: doc.ref })));
  if (!items.length) return;
  const res = await admin.messaging().sendEachForMulticast({
    tokens: items.map(x => x.t),
    data: { title: 'Verbo Crianças', body: String(a.text || '').slice(0, 200), url: './#pais' },
    webpush: { headers: { Urgency: 'high', TTL: '3600' } }
  });
  const dead = [];
  res.responses.forEach((r, i) => {
    const c = r.error && r.error.code;
    if (c === 'messaging/registration-token-not-registered' || c === 'messaging/invalid-registration-token') dead.push(items[i]);
  });
  await Promise.all(dead.map(x => x.ref.update({ tokens: admin.firestore.FieldValue.arrayRemove(x.t) })));
});
