/* Verbo Crianças: ligação com o Firebase (login, Firestore e notificações).
   Só liga quando firebase-config.js tem apiKey. Sem isso, o app roda como protótipo local.
   Como funciona: o app guarda tudo em listas na memória (ROOMS, KIDS, FAMS...). Aqui, cada lista
   vira uma coleção do Firestore. A cada tela desenhada, o que mudou localmente é enviado (sync),
   e o que chega do servidor substitui as listas (apply). Quem pode ler e gravar o quê é decidido
   pelas regras em firestore.rules, não por este arquivo. */
(function () {
  const cfg = window.VERBO_FIREBASE || {};
  const C = window.Cloud = { enabled: !!(cfg.apiKey && cfg.projectId), ready: false, profile: null, anon: false, needsSetup: false, app: null };
  if (!C.enabled) return;

  const SDK = 'https://www.gstatic.com/firebasejs/10.12.5/';
  const REGION = 'southamerica-east1';
  let auth, db, fns, unsubs = [], loaded = {}, last = {}, loggingIn = false, pending = false, visitAlertsFam = null, anonKidsSeen = false, readyResolve;
  const readyPromise = new Promise(r => { readyResolve = r; });

  const digits = s => String(s || '').replace(/\D/g, '');
  const stable = o => JSON.stringify(o, (k, v) => (v && typeof v === 'object' && !Array.isArray(v)) ? Object.keys(v).sort().reduce((a, x) => { if (v[x] !== undefined) a[x] = v[x]; return a; }, {}) : v);
  const COLS = () => ({ rooms: ROOMS, tias: TIAS, families: FAMS, kids: KIDS, alerts: state.alerts, audit: state.audit, users: USERS, events: EVENTS });
  const STRIP = { users: ['pass', 'tokens'] };
  const ser = (col, o) => { const c = Object.assign({}, o); (STRIP[col] || []).forEach(k => delete c[k]); return c; };
  const appOf = role => role === 'pais' ? 'pais' : role === 'tia' ? 'tias' : 'gestao';
  const isText = el => !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);

  function msg(e) {
    const c = (e && e.code) || '';
    if (/invalid-credential|wrong-password|user-not-found|invalid-email|invalid-login/.test(c)) return null;
    if (c === 'auth/too-many-requests') return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
    if (c === 'auth/network-request-failed') return 'Sem conexão com a internet.';
    if (c === 'auth/user-disabled') return 'Esta conta está desativada. Fale com a coordenação.';
    if (c === 'auth/email-already-in-use') return 'Este e-mail já tem uma conta.';
    if (c === 'auth/weak-password') return 'A senha precisa ter pelo menos 8 caracteres.';
    if (c === 'auth/requires-recent-login') return 'Por segurança, saia da conta, entre de novo e tente outra vez.';
    if (c === 'permission-denied') return 'Sem permissão para esta ação. Confira se as regras do Firestore foram publicadas.';
    return (e && e.message) || 'Algo deu errado. Tente de novo.';
  }

  function loadScripts(list) {
    return list.reduce((p, src) => p.then(() => new Promise((ok, no) => {
      const s = document.createElement('script'); s.src = SDK + src; s.onload = ok; s.onerror = () => no(new Error('Não foi possível carregar o Firebase. Confira a internet.')); document.head.appendChild(s);
    })), Promise.resolve());
  }

  /* ---------- tela: só redesenha quando a pessoa não está digitando ---------- */
  function rerender() {
    if (isText(document.activeElement)) { pending = true; return; }
    render();
  }
  document.addEventListener('focusout', () => {
    if (!pending) return;
    setTimeout(() => { if (!isText(document.activeElement)) { pending = false; render(); } }, 200);
  });

  /* ---------- Firestore -> listas ---------- */
  function apply(col, docs) {
    const arr = COLS()[col], old = last[col] || {};
    const items = docs.map(d => Object.assign({}, d.data(), { id: d.id }));
    if (col === 'rooms' && !items.length) { loaded[col] = true; return; }
    if (['audit', 'alerts', 'events'].includes(col)) items.sort((a, b) => (a.at || 0) - (b.at || 0));
    // itens criados aqui e ainda não gravados continuam na lista
    const keep = arr.filter(o => o.id && !(o.id in old) && !items.some(i => i.id === o.id));
    arr.splice(0, arr.length, ...items, ...keep);
    const seen = last[col] = {};
    items.forEach(o => { seen[o.id] = stable(ser(col, o)); });
    loaded[col] = true;
    if (col === 'kids' && C.anon && !anonKidsSeen) {
      anonKidsSeen = true;
      if (items.length) { state.visit = items[items.length - 1].id; watchVisitorAlerts(items[items.length - 1].fam); }
    }
    rerender();
  }

  function denied(col, e) {
    console.warn('Firestore', col, e && e.code);
    if (e && e.code === 'permission-denied' && !C.anon && C.profile) C.kick('Seu acesso foi encerrado. Fale com a coordenação.');
  }

  function sub(col, ref) {
    unsubs.push(ref.onSnapshot(s => apply(col, s.docs ? s.docs : (s.exists ? [s] : [])), e => denied(col, e)));
  }

  function stop() { unsubs.forEach(u => { try { u(); } catch (e) { /* já encerrado */ } }); unsubs = []; }

  function watchPublic() {
    unsubs.push(db.doc('config/main').onSnapshot(s => {
      if (s.exists) { const d = s.data(); state.open = d.open !== false; state.counts = d.counts || {}; }
      C.needsSetup = !s.exists; loaded.config = true; rerender();
    }, e => console.warn('config', e && e.code)));
  }

  function watchVisitorAlerts(fam) {
    if (visitAlertsFam === fam) return; visitAlertsFam = fam;
    sub('alerts', db.collection('alerts').where('fam', '==', fam));
  }

  function listen(p) {
    stop(); loaded = { audit: p.role !== 'admin' }; last = { audit: {} };
    watchPublic();
    const c = n => db.collection(n);
    sub('rooms', c('rooms')); sub('events', c('events'));
    if (p.role === 'pais') {
      sub('families', c('families').doc(p.fam)); sub('kids', c('kids').where('fam', '==', p.fam));
      sub('alerts', c('alerts').where('fam', '==', p.fam)); sub('tias', c('tias')); sub('users', c('users').doc(p.id));
    } else if (p.role === 'tia') {
      sub('families', c('families')); sub('kids', c('kids')); sub('alerts', c('alerts')); sub('tias', c('tias')); sub('users', c('users').doc(p.id));
    } else {
      sub('families', c('families')); sub('kids', c('kids')); sub('alerts', c('alerts')); sub('tias', c('tias')); sub('users', c('users'));
      if (p.role === 'admin') sub('audit', c('audit'));
    }
  }

  function listenAnon(u) {
    stop(); loaded = { audit: true, users: true, tias: true, rooms: true, events: true, alerts: true }; last = { audit: {} }; visitAlertsFam = null; anonKidsSeen = false;
    watchPublic();
    sub('families', db.collection('families').where('owner', '==', u.uid));
    sub('kids', db.collection('kids').where('owner', '==', u.uid));
    sub('rooms', db.collection('rooms'));
  }

  /* ---------- listas -> Firestore ---------- */
  function writable() {
    const p = C.profile;
    if (!p) return C.anon ? ['families', 'kids', 'audit'] : [];
    if (p.role === 'pais') return ['kids', 'alerts', 'audit'];
    if (p.role === 'tia') return ['kids', 'alerts', 'audit', 'config'];
    if (p.role === 'recepcao') return ['families', 'kids', 'alerts', 'audit', 'config'];
    if (p.role === 'coord') return ['rooms', 'tias', 'families', 'kids', 'alerts', 'audit', 'events', 'config'];
    return ['rooms', 'tias', 'families', 'kids', 'alerts', 'audit', 'events', 'config'];
  }

  function fail(col, e) {
    console.warn('Gravação recusada em', col, e && e.code);
    if (e && e.code === 'permission-denied') toast('O servidor não aceitou esta alteração. Confira as permissões.');
  }

  C.sync = function () {
    if (!C.ready) return;
    const cols = COLS();
    writable().forEach(col => {
      if (col === 'config') return syncConfig();
      if (!loaded[col]) return;
      const seen = last[col] || (last[col] = {});
      cols[col].forEach(o => {
        if (!o.id) return;
        const s = stable(ser(col, o));
        if (seen[o.id] === s) return;
        seen[o.id] = s;
        db.collection(col).doc(o.id).set(JSON.parse(s), { merge: col === 'users' }).catch(e => fail(col, e));
      });
    });
  };

  function syncConfig() {
    if (!loaded.config || C.needsSetup) return;
    const counts = {};
    ROOMS.forEach(r => { counts[r.id] = KIDS.filter(k => k.room === r.id && k.status === 'in').length; });
    const doc = { open: state.open, counts, bootstrapped: true }, s = stable(doc);
    if (last.config === s) return;
    last.config = s;
    db.doc('config/main').set(doc).catch(e => fail('config', e));
  }

  /* ---------- sessão ---------- */
  function resetLocal() {
    stop(); loaded = {}; last = {}; C.profile = null;
    [USERS, FAMS, KIDS, TIAS, EVENTS, state.alerts, state.audit].forEach(a => a.splice(0, a.length));
    state.sess = { pais: null, tias: null, gestao: null }; state.visit = null;
    state.p = newP(); state.t = newT(); state.notice = null;
  }

  function adopt(p) {
    C.profile = p; C.anon = false; C.app = appOf(p.role);
    USERS.splice(0, USERS.length, p);
    state.sess = { pais: null, tias: null, gestao: null }; state.sess[C.app] = p.id;
    if (C.app === 'pais') { state.fam = p.fam; state.p = newP(); }
    if (C.app === 'tias') { state.tia = p.tia; state.t = newT(); }
    if (C.app === 'gestao') { state.g = 'painel'; state.gform = false; state.eform = false; state.aform = false; state.gq = ''; state.notice = null; }
    listen(p);
    if (C.app === 'pais') refreshPush();
    render();
  }

  function init() {
    firebase.initializeApp(cfg);
    auth = firebase.auth(); db = firebase.firestore(); fns = firebase.app().functions(REGION);
    auth.onAuthStateChanged(async u => {
      if (loggingIn) return;
      if (!u) { resetLocal(); C.anon = false; watchPublic(); render(); return; }
      if (u.isAnonymous) { C.anon = true; C.profile = null; listenAnon(u); render(); return; }
      let snap = null;
      try { snap = await db.collection('users').doc(u.uid).get(); } catch (e) { snap = null; }
      if (!snap || !snap.exists || snap.data().active === false) { await auth.signOut(); return; }
      adopt(Object.assign({}, snap.data(), { id: u.uid }));
    });
    C.ready = true; readyResolve();
  }

  C.boot = function () {
    [USERS, FAMS, KIDS, TIAS, EVENTS, state.alerts, state.audit].forEach(a => a.splice(0, a.length));
    loadScripts(['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js', 'firebase-functions-compat.js', 'firebase-messaging-compat.js'])
      .then(init)
      .catch(e => { state.lerr.pais = state.lerr.tias = state.lerr.gestao = e.message; render(); });
  };

  /* ---------- ações chamadas pelo app ---------- */
  C.uid = () => (auth && auth.currentUser) ? auth.currentUser.uid : null;
  C.useCounts = () => !!(C.anon || (C.profile && C.profile.role === 'pais'));

  C.login = async function (app, id, pass) {
    await readyPromise;
    const email = id.includes('@') ? id.toLowerCase() : 'p' + digits(id) + '@pais.verbo.app';
    const copy = LOGIN_COPY[app];
    loggingIn = true;
    try {
      const cred = await auth.signInWithEmailAndPassword(email, pass);
      const snap = await db.collection('users').doc(cred.user.uid).get();
      const p = snap.exists ? Object.assign({}, snap.data(), { id: cred.user.uid }) : null;
      if (!p || !appRoles(app).includes(p.role)) { await auth.signOut(); return { err: copy.wrong }; }
      if (p.active === false) { await auth.signOut(); return { err: 'Esta conta está desativada. Fale com a coordenação.' }; }
      adopt(p);
      return { user: p };
    } catch (e) {
      return { err: msg(e) || copy.wrong };
    } finally { loggingIn = false; }
  };

  C.logout = function () { return auth ? auth.signOut() : Promise.resolve(); };
  C.kick = function (text) { Object.keys(state.lerr).forEach(a => { state.lerr[a] = text; }); return C.logout(); };

  C.bootstrap = async function (name, email, pass) {
    await readyPromise;
    if (pass.length < 8) return { err: 'A senha precisa ter pelo menos 8 caracteres.' };
    loggingIn = true;
    try {
      let cred;
      try { cred = await auth.createUserWithEmailAndPassword(email, pass); }
      catch (e) { if (e.code === 'auth/email-already-in-use') cred = await auth.signInWithEmailAndPassword(email, pass); else throw e; }
      const profile = { id: cred.user.uid, role: 'admin', name, login: email.toLowerCase(), active: true };
      const b = db.batch();
      b.set(db.collection('users').doc(profile.id), profile);
      b.set(db.doc('config/main'), { open: true, counts: {}, bootstrapped: true });
      ROOMS.forEach(r => b.set(db.collection('rooms').doc(r.id), r));
      await b.commit();
      C.needsSetup = false;
      adopt(profile);
      return { user: profile };
    } catch (e) { return { err: msg(e) || 'Não foi possível criar o administrador.' }; }
    finally { loggingIn = false; }
  };

  C.call = (name, data) => fns.httpsCallable(name)(data).then(r => r.data).catch(e => { throw new Error(e.code === 'functions/not-found' ? 'As funções do Firebase ainda não foram publicadas (firebase deploy --only functions).' : (e.message || 'Não foi possível concluir.')); });

  C.forgot = async function (email) {
    await readyPromise;
    try { await auth.sendPasswordResetEmail(email); } catch (e) { /* resposta igual, para não revelar quem tem conta */ }
  };

  C.changePassword = async function (pass) {
    if (pass.length < 8) return { err: 'A senha precisa ter pelo menos 8 caracteres.' };
    try { await auth.currentUser.updatePassword(pass); return { ok: true }; } catch (e) { return { err: msg(e) }; }
  };

  C.ensureAnon = async function () {
    await readyPromise;
    if (!auth.currentUser) await auth.signInAnonymously();
    for (let i = 0; i < 50 && !(loaded.families && loaded.kids); i++) await new Promise(r => setTimeout(r, 100));
    return auth.currentUser;
  };

  /* ---------- notificações push ---------- */
  async function getToken(askPermission) {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) return { err: 'Este navegador não permite notificações. No iPhone, adicione o site à tela inicial e abra por lá.' };
    if (!cfg.vapidKey) return { err: 'A chave de notificações (vapidKey) ainda não foi configurada.' };
    if (askPermission && Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return { err: 'As notificações foram bloqueadas neste aparelho. Libere nas configurações do navegador.' };
    }
    if (Notification.permission !== 'granted') return { err: 'sem permissão' };
    const reg = await navigator.serviceWorker.register('firebase-messaging-sw.js');
    const messaging = firebase.messaging();
    const token = await messaging.getToken({ vapidKey: cfg.vapidKey, serviceWorkerRegistration: reg });
    if (!token) return { err: 'Não foi possível ativar as notificações.' };
    await db.collection('users').doc(C.profile.id).update({ tokens: firebase.firestore.FieldValue.arrayUnion(token) });
    messaging.onMessage(p => { const d = p.data || {}; toast((d.body || 'Novo aviso da equipe.')); });
    return { ok: true };
  }
  C.enablePush = () => getToken(true).catch(e => ({ err: msg(e) }));
  function refreshPush() { if (window.Notification && Notification.permission === 'granted') getToken(false).catch(() => {}); }
  C.pushState = () => (window.Notification ? Notification.permission : 'unsupported');
})();
