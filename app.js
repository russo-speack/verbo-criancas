const ROOMS = [
  { id: 'bercario', name: 'Berçário', ages: '0 a 2 anos', cap: 6 },
  { id: 'maternal', name: 'Maternal', ages: '3 e 4 anos', cap: 8 },
  { id: 'juniores', name: 'Juniores', ages: '5 a 7 anos', cap: 10 },
  { id: 'kids', name: 'Kids', ages: '8 a 11 anos', cap: 12 }
];
const TIAS = [
  { id: 't1', name: 'Tia Raquel', room: 'bercario' },
  { id: 't2', name: 'Tia Joana', room: 'maternal' },
  { id: 't3', name: 'Tio Mateus', room: 'juniores' },
  { id: 't4', name: 'Tia Lia', room: 'kids' }
];
/* Acessos. Cada app tem o seu login, e a gestão tem perfis com permissões diferentes. */
const ROLES = { pais: 'Responsável', tia: 'Equipe de sala', recepcao: 'Recepção', coord: 'Coordenação', admin: 'Administrador' };
const STAFF_ROLES = ['recepcao', 'coord', 'admin'];
const SECTIONS = [['painel', 'Painel'], ['familias', 'Famílias'], ['equipe', 'Equipe'], ['agenda', 'Agenda'], ['relatorios', 'Relatórios'], ['acessos', 'Acessos'], ['registro', 'Registro']];
const PERMS = {
  recepcao: ['painel', 'familias'],
  coord: ['painel', 'familias', 'equipe', 'agenda', 'relatorios'],
  admin: ['painel', 'familias', 'equipe', 'agenda', 'relatorios', 'acessos', 'registro']
};
// Contas de exemplo do protótipo. No sistema real a senha nunca fica no código: ela é conferida no servidor.
const USERS = [
  { id: 'u1', role: 'pais', name: 'Maria Souza', login: 'maria@email.example', phone: '(00) 90000-0001', pass: 'souza123', active: true, fam: 'souza' },
  { id: 'u2', role: 'pais', name: 'Carla Almeida', login: 'carla@email.example', phone: '(00) 90000-0002', pass: 'almeida123', active: true, fam: 'almeida' },
  { id: 'u3', role: 'pais', name: 'Rafael Ferreira', login: 'rafael@email.example', phone: '(00) 90000-0003', pass: 'ferreira123', active: true, fam: 'ferreira' },
  { id: 'u4', role: 'pais', name: 'Ana Costa', login: 'ana@email.example', phone: '(00) 90000-0004', pass: 'costa123', active: true, fam: 'costa' },
  { id: 'u5', role: 'pais', name: 'Bruno Lima', login: 'bruno@email.example', phone: '(00) 90000-0005', pass: 'lima123', active: true, fam: 'lima' },
  { id: 'u6', role: 'tia', name: 'Tia Raquel', login: 'raquel@verbo.example', pass: 'raquel123', active: true, tia: 't1' },
  { id: 'u7', role: 'tia', name: 'Tia Joana', login: 'joana@verbo.example', pass: 'joana123', active: true, tia: 't2' },
  { id: 'u8', role: 'tia', name: 'Tio Mateus', login: 'mateus@verbo.example', pass: 'mateus123', active: true, tia: 't3', fam: 'ferreira' },
  { id: 'u9', role: 'tia', name: 'Tia Lia', login: 'lia@verbo.example', pass: 'lia123', active: true, tia: 't4' },
  { id: 'u10', role: 'admin', name: 'Paulo Mendes', login: 'admin@verbo.example', pass: 'admin123', active: true },
  { id: 'u11', role: 'coord', name: 'Débora Dias', login: 'coord@verbo.example', pass: 'coord123', active: true },
  { id: 'u12', role: 'recepcao', name: 'Lúcia Prado', login: 'recepcao@verbo.example', pass: 'recepcao123', active: true }
];
const MODE = window.VERBO_APP || 'familia';
const LOGIN_COPY = {
  familia: { label: 'Telefone ou e-mail', sub: 'Entre com o acesso que a igreja cadastrou. O app abre sozinho na área certa, seja você da família ou da equipe.', hint: 'Famílias entram com o telefone cadastrado. A equipe, com o e-mail.', empty: 'Informe o telefone ou e-mail e a senha.', wrong: 'Telefone, e-mail ou senha incorretos.' },
  gestao: { label: 'E-mail', sub: 'Cadastros, salas, equipe, agenda e relatórios. Cada perfil vê só o que pode usar.', hint: 'Entre com o e-mail do seu acesso.', empty: 'Informe o e-mail e a senha.', wrong: 'E-mail ou senha incorretos.' }
};

const FAMS = [
  { id: 'souza', name: 'Souza', phone: '(00) 90000-0001', guardians: ['Maria Souza (mãe)', 'João Souza (pai)', 'Dona Leila (avó)'] },
  { id: 'almeida', name: 'Almeida', phone: '(00) 90000-0002', guardians: ['Carla Almeida (mãe)', 'Tia Renata (madrinha)'] },
  { id: 'ferreira', name: 'Ferreira', phone: '(00) 90000-0003', guardians: ['Rafael Ferreira (pai)', 'Paula Ferreira (mãe)'] },
  { id: 'costa', name: 'Costa', phone: '(00) 90000-0004', guardians: ['Ana Costa (mãe)', 'Marcos Costa (pai)'] },
  { id: 'lima', name: 'Lima', phone: '(00) 90000-0005', guardians: ['Bruno Lima (pai)', 'Sônia Lima (avó)'] }
];
const KIDS = [
  { id: 'k1', name: 'Davi Souza', age: '4 anos', room: 'maternal', fam: 'souza', note: '', obs: '', status: 'in', time: '09:02', out: '', by: 'Maria Souza', code: 'DAVI-4821' },
  { id: 'k2', name: 'Lívia Souza', age: '1 ano', room: 'bercario', fam: 'souza', note: 'Alergia a leite de vaca e derivados', obs: 'Dorme com a chupeta', status: 'in', time: '09:02', out: '', by: 'Maria Souza', code: 'LIVI-1937' },
  { id: 'k3', name: 'Pedro Almeida', age: '6 anos', room: 'juniores', fam: 'almeida', note: '', obs: '', status: 'in', time: '09:05', out: '', by: 'Carla Almeida', code: 'PEDR-7710' },
  { id: 'k4', name: 'Sofia Ferreira', age: '9 anos', room: 'kids', fam: 'ferreira', note: '', obs: '', status: 'in', time: '09:08', out: '', by: 'Rafael Ferreira', code: 'SOFI-3302' },
  { id: 'k5', name: 'Miguel Ferreira', age: '6 anos', room: 'juniores', fam: 'ferreira', note: 'Alergia a amendoim', obs: '', status: 'in', time: '09:08', out: '', by: 'Rafael Ferreira', code: 'MIGU-5568' },
  { id: 'k6', name: 'Helena Costa', age: '3 anos', room: 'maternal', fam: 'costa', note: '', obs: '', status: 'out', time: '', out: '', by: '', code: 'HELE-2094' },
  { id: 'k7', name: 'Théo Lima', age: '2 anos', room: 'bercario', fam: 'lima', note: '', obs: '', status: 'out', time: '', out: '', by: '', code: 'THEO-6641' },
  { id: 'k8', name: 'Arthur Lima', age: '8 anos', room: 'kids', fam: 'lima', note: '', obs: '', status: 'left', time: '09:10', out: '10:12', by: 'Bruno Lima', code: 'ARTH-9150' }
];
const EVENTS = [
  { day: '08', mon: 'nov', w: 'Domingo', t: '9h', n: 'Culto infantil', note: 'Check-in a partir das 8h30.' },
  { day: '15', mon: 'nov', w: 'Domingo', t: '9h', n: 'Culto infantil', note: 'Se a criança tiver Bíblia, pode trazer.' },
  { day: '18', mon: 'nov', w: 'Quarta', t: '19h30', n: 'Encontro de pais', note: 'Conversa com a coordenação infantil sobre rotina e cuidado.' },
  { day: '22', mon: 'nov', w: 'Domingo', t: '9h', n: 'Culto infantil', note: 'Dia de histórias em família.' }
];
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const PAST = [
  { d: '25/10', c: 38, v: 2, avg: '1h 48min' }, { d: '18/10', c: 44, v: 5, avg: '1h 55min' },
  { d: '11/10', c: 36, v: 1, avg: '1h 42min' }, { d: '04/10', c: 41, v: 3, avg: '1h 50min' }
];
const QUICK = [
  { key: 'choro', label: 'Chorando', text: n => n + ' está chorando e não se acalma. Pode vir até a sala?' },
  { key: 'fralda', label: 'Trocar fralda', text: n => 'Precisamos trocar a fralda de ' + n + '. Pode vir até a sala?' },
  { key: 'mal', label: 'Mal-estar', text: n => n + ' está com sinais de mal-estar. Venha até a sala, por favor.' },
  { key: 'colo', label: 'Quer o colo', text: n => n + ' quer ficar com você. Pode vir até a sala?' },
  { key: 'livre', label: 'Mensagem livre', text: n => '' }
];
const newP = () => ({ tab: 'home', screen: null, sel: [], ckid: null, card: null, done: [] });
const newT = () => ({ tab: 'sala', screen: null, room: null, kid: null });
const state = {
  mode: 'equipe',
  fam: 'souza', sheet: null, visit: null, vn: 0, open: true, p: newP(), t: newT(), tia: 't2',
  g: 'painel', gq: '', gform: false, eform: false, alerts: [], audit: [],
  sess: { pais: null, tias: null, gestao: null }, lerr: { familia: null, gestao: null }, lval: { familia: '', gestao: '' },
  notice: null, aform: false, af: 'todos',
  prefs: { avisos: true, lembretes: true, novidades: false, fotos: false }
};
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const kid = id => KIDS.find(k => k.id === id);
const fam = id => FAMS.find(f => f.id === id);
const room = id => ROOMS.find(r => r.id === id);
const tia = () => TIAS.find(x => x.id === state.tia);
const inRoom = id => (cloudOn() && Cloud.useCounts()) ? ((state.counts || {})[id] || 0) : KIDS.filter(k => k.room === id && k.status === 'in').length;
const kidAlerts = id => state.alerts.filter(a => a.kid === id);
const first = s => s.split(' (')[0].split(' ')[0];
const roomForAge = a => a <= 2 ? 'bercario' : a <= 4 ? 'maternal' : a <= 7 ? 'juniores' : 'kids';
const ageLabel = a => a < 1 ? 'menos de 1 ano' : a === 1 ? '1 ano' : a + ' anos';
const mins = t => { const x = t.split(':').map(Number); return x[0] * 60 + x[1]; };
const dur = (a, b) => { const d = Math.max(0, mins(b) - mins(a)); const h = Math.floor(d / 60); return (h ? h + 'h ' : '') + (d % 60) + 'min'; };
const uid8 = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
const cloudOn = () => !!(window.Cloud && Cloud.enabled);
const log = (who, text) => state.audit.push({ id: 'l' + uid8(), at: Date.now(), t: now(), who, text });
const actor = () => { const u = USERS.find(x => x.id === state.sess.gestao); return u ? u.name : 'Gestão'; };
const digits = s => String(s).replace(/\D/g, '');
const newPass = () => 'v' + (1000 + Math.floor(Math.random() * 9000));
const canManage = () => { const u = USERS.find(x => x.id === state.sess.gestao); return !!u && u.role !== 'recepcao'; };
const appRoles = app => app === 'gestao' ? STAFF_ROLES : ['pais', 'tia'];

// Devolve a pessoa conectada no app. Se a conta foi desativada enquanto a pessoa estava dentro, a sessão cai.
function sessUser(app) {
  const id = state.sess[app]; if (!id) return null;
  const u = USERS.find(x => x.id === id);
  if (!u || !u.active) { state.sess[app] = null; state.lerr[app === 'gestao' ? 'gestao' : 'familia'] = 'Sua conta foi desativada. Fale com a coordenação.'; if (cloudOn()) Cloud.logout(); return null; }
  return u;
}

function tryLogin(app, id, pass) {
  const c = LOGIN_COPY[app];
  if (!id || !pass) return { err: c.empty };
  const key = id.toLowerCase(), dg = digits(id);
  const u = USERS.find(x => appRoles(app).includes(x.role) && ((x.login && x.login.toLowerCase() === key) || (x.phone && dg && digits(x.phone) === dg)));
  if (!u || u.pass !== pass) return { err: c.wrong };
  if (!u.active) return { err: 'Esta conta está desativada. Fale com a coordenação.' };
  return { user: u };
}

function logout() {
  const app = MODE === 'gestao' ? 'gestao' : 'familia';
  const u = USERS.find(x => x.id === (app === 'gestao' ? state.sess.gestao : (state.sess.pais || state.sess.tias)));
  state.sess = { pais: null, tias: null, gestao: null }; state.lerr[app] = null;
  if (u && !cloudOn()) log(u.name, 'Saiu do app.');
  state.p = newP(); state.t = newT(); state.mode = 'equipe';
  if (app === 'gestao') { state.g = 'painel'; state.gform = false; state.eform = false; state.aform = false; state.gq = ''; state.notice = null; }
  if (cloudOn()) Cloud.logout();
  render(); toast('Você saiu da conta.');
}
function ageOpts(sel) {
  const labels = ['Menos de 1 ano', '1 ano'];
  for (let i = 2; i <= 11; i++) labels.push(i + ' anos');
  return labels.map((l, i) => '<option value="' + i + '"' + (i === sel ? ' selected' : '') + '>' + l + '</option>').join('');
}

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
}

const CROWN = '<svg class="cr" viewBox="0 0 44 22" aria-hidden="true" focusable="false"><path d="M0 22L6 4l8 12L22 2l8 14 8-12 6 18z" fill="#ffc928"/></svg>';
const logo = stacked => '<span class="logo' + (stacked ? ' st' : '') + '" role="img" aria-label="Verbo Crianças">' + CROWN + '<span class="line"><span class="lv">Verbo</span><span class="lc">Crianças</span></span></span>';
const logoH = () => logo(false);
const logoS = () => logo(true);

function qr(text) {
  const m = makeQR(String(text)), n = m.length, q = 4;
  let d = '';
  m.forEach((row, y) => { let x = 0; while (x < n) { if (!row[x]) { x++; continue; } let w = 0; while (x + w < n && row[x + w]) w++; d += 'M' + (x + q) + ' ' + (y + q) + 'h' + w + 'v1h-' + w + 'z'; x += w; } });
  return '<svg class="qr" viewBox="0 0 ' + (n + 2 * q) + ' ' + (n + 2 * q) + '" role="img" aria-label="QR Code" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#0b2a52"/></svg>';
}
const visitorUrl = () => { try { return new URL('visitante.html', location.href).href; } catch (e) { return 'visitante.html'; } };

const ico = d => '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const IC = {
  back: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  home: ico('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>'),
  kid: ico('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'),
  cal: ico('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  bell: ico('<path d="M6 17V11a6 6 0 0112 0v6l2 2H4z"/><path d="M10 21h4"/>'),
  door: ico('<path d="M5 21V4h10v17"/><path d="M3 21h14"/><circle cx="12" cy="13" r=".8"/>'),
  out: ico('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>'),
  grid: ico('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  user: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  check: '<svg viewBox="0 0 80 80" width="88" height="88" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="34" stroke="#78c943" stroke-width="6"/><path d="M25 41l11 11 20-23" stroke="#78c943" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  qr: ico('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 19h2M14 20h1M20 14h1"/>'),
  clock: '<svg viewBox="0 0 80 80" width="88" height="88" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="32" stroke="#ffc928" stroke-width="6"/><path d="M40 22v19l12 7" stroke="#ffc928" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function doCheckIn(k, by) {
  k.status = 'in'; k.time = now(); k.out = ''; k.by = by;
}

function statusChip(k) {
  if (k.status === 'left') return '<span class="chip left">Saiu</span>';
  const a = kidAlerts(k.id).slice(-1)[0];
  if (a && a.reply) return '<span class="chip ok">Responsável a caminho</span>';
  if (a) return '<span class="chip sun">Aviso enviado ' + a.time + '</span>';
  return '<span class="chip">Em sala</span>';
}

const bandLogo = () => '<div class="appbar">' + logoS() + '<button type="button" class="pbtn" data-perfil>' + IC.user + 'Perfil</button></div>';
const bandBack = (title, sub) => '<div class="appbar"><div class="back"><button type="button" class="iconbtn" data-back aria-label="Voltar">' + IC.back + '</button><div class="bt"><strong>' + title + '</strong>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div></div>';
const bandTia = t => '<div class="appbar">' + logoS() + '<div class="rolewrap"><div class="role"><strong>' + esc(t.name) + '</strong><small>Equipe · ' + room(t.room).name + '</small></div><button type="button" class="iconbtn" data-logout aria-label="Sair da conta">' + IC.out + '</button></div></div>';

/* ================= LOGIN ================= */
function demoCard(app) {
  if (cloudOn()) return '';
  const list = USERS.filter(u => appRoles(app).includes(u.role));
  return '<section class="card"><p class="sec">Contas de exemplo</p>' + list.map(u =>
    '<div class="demo"><div><strong>' + esc(u.name) + '</strong>' + ' <span class="chip">' + ROLES[u.role] + (u.fam && u.role === 'tia' ? ' + família' : '') + '</span>' +
    '<div class="meta">' + esc(u.login || u.phone) + ' · senha ' + esc(u.pass) + (u.active ? '' : ' · desativada') + '</div></div>' +
    '<button type="button" class="link" data-fill="' + u.id + '">Preencher</button></div>').join('') +
    '<p class="hint">Protótipo com contas de exemplo. No sistema real, a senha é conferida no servidor e nunca aparece na tela.</p></section>';
}

function loginForm(app) {
  const c = LOGIN_COPY[app], err = state.lerr[app];
  return '<form class="form" id="lf-' + app + '" data-app="' + app + '" novalidate>' +
    '<label>' + c.label + '<input type="text" id="l-user" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" value="' + esc(state.lval[app]) + '"></label>' +
    '<label>Senha<span class="passrow"><input type="password" id="l-pass" name="password" autocomplete="current-password"><button type="button" class="link" data-showpass>Mostrar</button></span></label>' +
    (err ? '<div class="block" role="alert">' + esc(err) + '</div>' : '') +
    '<button type="submit" class="btn primary wide">Entrar</button>' +
    '<button type="button" class="link" data-forgot>Esqueci minha senha</button></form>';
}

function setupBox() {
  const err = state.lerr.setup;
  return '<section class="card"><p class="sec">Primeiro acesso</p><p class="meta">Ainda não existe nenhum administrador neste sistema. Crie o primeiro agora, antes de divulgar o endereço. Depois disso, este formulário some.</p>' +
    '<form class="form" id="bs" novalidate><label>Nome<input type="text" id="bs-n" autocomplete="name"></label><label>E-mail<input type="text" id="bs-e" inputmode="email" autocapitalize="none" autocomplete="username"></label><label>Senha (mínimo 8 caracteres)<input type="password" id="bs-p" autocomplete="new-password"></label>' +
    (err ? '<div class="block" role="alert">' + esc(err) + '</div>' : '') + '<button type="submit" class="btn primary wide">Criar administrador</button></form></section>';
}

function appLogin(app) {
  const c = LOGIN_COPY[app];
  if (app === 'gestao') return '<div class="loginbox"><div><h1>Entrar na Gestão</h1><p class="sub">' + c.sub + '</p></div>' + (cloudOn() && Cloud.needsSetup ? setupBox() : loginForm(app)) + demoCard(app) + '</div>';
  return '<div class="app loginapp"><div class="hero">' + logoH() + '<p>Aprender. Adorar. Crescer com Jesus.</p></div>' +
    '<div class="scr"><div><h1>Entrar</h1><p class="sub">' + c.sub + '</p></div>' + loginForm(app) + demoCard(app) + '</div></div>';
}

/* ================= APP DOS PAIS ================= */
function tabHome(f, mine) {
  const ids = mine.map(k => k.id), ev = EVENTS[0];
  const last = state.alerts.filter(a => ids.includes(a.kid)).slice(-1)[0];
  return '<div><h2>Olá! Que bom ter vocês aqui.</h2><p class="sub">Acompanhe a jornada da sua criança.</p></div>' +
    '<div class="tiles"><button type="button" class="tile blue" data-tab="crianca"><strong>Minha criança</strong><span>Acessar</span></button>' +
    '<button type="button" class="tile yel" data-tab="agenda"><strong>Agenda</strong><span>Acessar</span></button></div>' +
    '<section class="card"><p class="sec">Próximo encontro</p>' + (ev ? '<strong>' + esc(ev.n) + '</strong><span class="meta">' + ev.w + ', ' + ev.day + '/' + (MONTHS.indexOf(ev.mon) + 1) + ' · ' + esc(ev.t) + '</span>' : '<strong>Em breve</strong><span class="meta">A coordenação ainda não publicou o próximo encontro.</span>') + '<span><span class="chip' + (state.open ? ' ok' : ' sun') + '">' + (state.open ? 'Check-in aberto' : 'Check-in começa às 8h30') + '</span></span></section>' +
    '<section class="card"><p class="sec">Aviso recente</p>' + (last ? '<span class="time">' + last.time + ' · ' + esc(kid(last.kid).name) + '</span><span>' + esc(last.text) + '</span><button type="button" class="btn" data-tab="avisos">Ver avisos</button>' : '<span class="hint">Ainda não há avisos para esta turma.</span>') + '</section>';
}

function tabCrianca(f, mine) {
  const p = state.p;
  const rows = mine.map(k => {
    const can = state.open && k.status === 'out';
    const info = '<span class="meta">' + room(k.room).name + ' · ' + (k.status === 'in' ? 'em sala desde ' + k.time : k.status === 'left' ? 'saiu às ' + k.out : 'aguardando check-in') + '</span>';
    return '<div class="krow">' + (can
      ? '<label><input type="checkbox" data-pick="' + k.id + '"' + (p.sel.includes(k.id) ? ' checked' : '') + '><span>' + esc(k.name) + '<br>' + info + '</span></label>'
      : '<div><strong>' + esc(k.name) + '</strong><br>' + info + '</div>') +
      '<button type="button" class="link" data-detail="' + k.id + '">Detalhes</button></div>';
  }).join('');
  const anyOut = mine.some(k => k.status === 'out');
  const top = !state.open
    ? '<div class="hero wait">' + IC.clock + '<h2>Ainda não abriu</h2><p>O check-in começa às 8h30. Volte em alguns minutinhos.</p></div>'
    : '<p class="hint">' + (anyOut ? 'Marque quem vai para a sala e toque em Fazer check-in.' : 'Tudo certo por aqui. Bom culto!') + '</p>';
  return '<h2>Minha criança</h2>' + top + '<div style="display:grid;gap:10px">' + rows + '</div>' +
    (state.open && anyOut ? '<button type="button" class="btn primary wide" id="doci" data-docheckin' + (p.sel.length ? '' : ' disabled') + '>' + (p.sel.length ? 'Fazer check-in (' + p.sel.length + ')' : 'Fazer check-in') + '</button>' : '');
}

function tabAgenda() {
  return '<div><h2>Agenda</h2><p class="sub">Cultos, encontros e orientações.</p></div>' +
    EVENTS.map(e => '<article class="card ev"><div class="date"><b>' + esc(e.day) + '</b><small>' + esc(e.mon) + '</small></div><div><strong>' + esc(e.n) + '</strong><span class="meta">' + esc(e.w) + ' · ' + esc(e.t) + '</span><span class="meta">' + esc(e.note) + '</span></div></article>').join('');
}

function alertCard(a, withBtn) {
  return '<article class="notif' + (a.reply ? ' done' : '') + '"><div class="time">' + a.time + ' · ' + esc(kid(a.kid).name) + ' · ' + room(kid(a.kid).room).name + (a.by ? ' · ' + esc(a.by) : '') + '</div><p>' + esc(a.text) + '</p>' +
    (a.reply ? '<span><span class="chip ok">Você respondeu: estou indo</span></span>' : withBtn ? '<button type="button" class="btn primary" data-reply="' + a.id + '">Estou indo</button>' : '') + '</article>';
}

function tabAvisos(mine) {
  const ids = mine.map(k => k.id);
  const notes = state.alerts.filter(a => ids.includes(a.kid)).slice().reverse();
  return '<h2>Avisos</h2>' + (notes.length ? notes.map(a => alertCard(a, true)).join('') : '<p class="hint">Ainda não há avisos para esta turma.</p>');
}

function screenDone() {
  const p = state.p, names = p.done.map(id => esc(kid(id).name.split(' ')[0]));
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' e ' + names[names.length - 1] : names[0];
  return '<div class="hero">' + IC.check + '<h2>Check-in feito!</h2><p>' + list + (names.length > 1 ? ' já estão' : ' já está') + ' na sala. Fique tranquilo: se precisarmos de você, a equipe avisa por notificação aqui no app.</p></div>' +
    '<button type="button" class="btn wide" data-back>Voltar ao início</button>';
}

function screenDetail(k, staff) {
  const f = fam(k.fam), phone = f.phone || '';
  return (k.by ? '<p class="sec">Responsável pelo check-in</p><div class="kv"><div class="full"><strong>' + esc(k.by) + '</strong><small>Telefone ' + esc(phone) + '</small></div></div>' : '<p class="hint">Ainda não houve check-in hoje.</p>') +
    '<div class="care"><strong>Cuidados da criança</strong><span><b>Restrições alimentares:</b> ' + esc(k.note || 'Nenhuma informada') + '</span><span><b>Observações:</b> ' + esc(k.obs || 'Nenhuma') + '</span><span><b>Necessidades específicas:</b> Não informado</span></div>' +
    (k.status !== 'out' ? '<div class="kv"><div><small>Check-in</small><strong>' + k.time + '</strong></div><div><small>Check-out</small><strong>' + (k.out || 'Ainda na sala') + '</strong></div>' +
      '<div class="full"><small>Tempo de permanência</small><strong>' + dur(k.time, k.out || now()) + (k.out ? '' : ' até agora') + '</strong></div>' +
      '<div class="full"><small>Identificação da criança</small><strong>#' + esc(k.code) + '</strong></div></div>' : '') +
    (!staff && k.status === 'in' ? '<div class="pkid"><div><strong>QR Code de retirada</strong><p class="meta" style="margin:4px 0 0">Mostre à equipe na saída.</p></div>' + qr(k.code) + '</div>' : '') +
    (staff && k.status === 'in' ? '<div class="actions"><button type="button" class="btn hl" data-alert="' + k.id + '">Avisar pais</button><button type="button" class="btn" data-out="' + k.id + '">Check-out</button></div>' : '');
}

function cloudPerfil() {
  if (!cloudOn()) return '';
  const st = Cloud.pushState();
  const push = st === 'granted' ? '<p class="meta"><span class="chip ok">Ativadas neste aparelho</span></p>' : st === 'denied' ? '<p class="meta">As notificações estão bloqueadas neste aparelho. Libere nas configurações do navegador.</p>' : st === 'unsupported' ? '<p class="meta">Este navegador não mostra notificações. No iPhone, adicione o site à tela inicial e abra por lá.</p>' : '<button type="button" class="btn primary" data-pushon>Ativar avisos neste aparelho</button>';
  return '<p class="sec">Avisos neste aparelho</p><div class="card"><p class="meta">' + (Cloud.pushClosed() ? 'Ative para receber os avisos da equipe como notificação do aparelho, mesmo com o app fechado ou o celular bloqueado.' : 'Ative para os avisos da equipe aparecerem como notificação do aparelho. Eles chegam enquanto o app estiver aberto, mesmo em segundo plano.') + '</p>' + push + '</div>' +
    '<p class="sec">Trocar senha</p><form class="card form" id="pw" novalidate><label>Nova senha (mínimo 8 caracteres)<input type="password" id="pw-n" autocomplete="new-password"></label><button type="submit" class="btn">Trocar senha</button></form>';
}

function screenPerfil(f) {
  const pr = state.prefs;
  const chk = (key, label, hint, locked) => '<label class="prow"><input type="checkbox" data-pref="' + key + '"' + (pr[key] || locked ? ' checked' : '') + (locked ? ' disabled' : '') + '><span><strong>' + label + '</strong><small>' + hint + '</small></span></label>';
  return '<div class="kv"><div class="full"><strong>' + esc(f.guardians[0].split(' (')[0]) + '</strong><small>Telefone ' + esc(f.phone) + '</small></div></div>' +
    '<p class="sec">Pessoas autorizadas a retirar</p><div class="card">' + f.guardians.map(g => '<div>' + esc(g) + '</div>').join('') + '</div>' +
    '<p class="sec">Notificações</p><div class="card">' + chk('avisos', 'Avisos da equipe', 'Sempre ativo, para a equipe conseguir chamar você durante o culto.', true) + chk('lembretes', 'Lembretes de encontros', 'Um dia antes de cada culto.') + chk('novidades', 'Novidades e conteúdos', 'Novas histórias e conquistas.') + '</div>' +
    cloudPerfil() +
    '<p class="sec">Consentimento</p><div class="card">' + chk('fotos', 'Fotos e vídeos', 'Autorizo o uso de imagens da criança em materiais da igreja. Você pode mudar quando quiser.') + '</div>' +
    '<p class="hint">Usamos os dados apenas para cuidar da criança, conforme a LGPD. Você pode pedir correção ou exclusão à coordenação infantil.</p>' +
    '<button type="button" class="btn primary wide" data-save>Salvar</button>' +
    '<button type="button" class="btn wide" data-logout>Sair da conta</button>';
}

function renderParent(me) {
  state.fam = me.fam;
  const f = fam(state.fam), p = state.p;
  if (!f) return '<div class="app"><div class="scr"><p class="sub">Carregando os dados da família…</p></div></div>';
  const mine = KIDS.filter(k => k.fam === f.id);
  const ids = mine.map(k => k.id);
  const unread = state.alerts.filter(a => ids.includes(a.kid) && !a.reply).length;
  const unseen = state.alerts.filter(a => ids.includes(a.kid) && !a.seen);
  let head, body, tabbar = false;
  if (p.screen === 'done') { head = bandLogo(); body = screenDone(); }
  else if (p.screen === 'detail') { const k = kid(p.card); head = bandBack(esc(k.name), k.age + ' · ' + room(k.room).name); body = screenDetail(k, false); }
  else if (p.screen === 'perfil') { head = bandBack('Perfil', 'Família ' + esc(f.name)); body = screenPerfil(f); }
  else {
    tabbar = true; head = bandLogo();
    body = p.tab === 'crianca' ? tabCrianca(f, mine) : p.tab === 'agenda' ? tabAgenda() : p.tab === 'avisos' ? tabAvisos(mine) : tabHome(f, mine);
  }
  const tb = tabbar ? '<nav class="tabbar" aria-label="Menu do app">' +
    [['home', 'Início', IC.home], ['crianca', 'Minha criança', IC.kid], ['agenda', 'Agenda', IC.cal], ['avisos', 'Avisos', IC.bell]].map(t =>
      '<button type="button" data-tab="' + t[0] + '"' + (p.tab === t[0] ? ' aria-current="page"' : '') + '>' + t[2] + t[1] + (t[0] === 'avisos' && unread ? '<span class="badge" aria-label="' + unread + ' não respondidos">' + unread + '</span>' : '') + '</button>').join('') + '</nav>' : '';
  const push = unseen.length ? '<div class="push" role="alert"><small><span>Verbo Crianças</span><span>agora</span></small><p>' + esc(unseen[unseen.length - 1].text) + '</p><div class="actions"><button type="button" class="btn primary" data-pushopen>Abrir</button><button type="button" class="btn" data-pushclose>Fechar</button></div></div>' : '';
  return '<div class="app">' + head + '<div class="scr">' + push + body + '</div>' + tb + '</div>';
}

/* ================= APP DAS TIAS ================= */
function kidRow(k) {
  return '<article class="trow"><div class="row"><div><button type="button" class="link name" data-tkid="' + k.id + '">' + esc(k.name) + '</button><div class="meta">' + k.age + ' · desde ' + k.time + '</div></div>' + statusChip(k) + '</div>' +
    (k.note ? '<div class="note"><b>Atenção:</b> ' + esc(k.note) + '</div>' : '') +
    '<div class="actions"><button type="button" class="btn hl" data-alert="' + k.id + '">Avisar pais</button><button type="button" class="btn" data-out="' + k.id + '">Check-out</button></div></article>';
}

function roomView(rid) {
  const r = room(rid), all = KIDS.filter(k => k.room === rid);
  const inn = all.filter(k => k.status === 'in'), exp = all.filter(k => k.status === 'out'), lf = all.filter(k => k.status === 'left');
  const c = inn.length;
  return '<div><h2>' + r.name + '</h2><p class="sub">' + r.ages + '</p></div>' +
    '<div class="pills2"><span class="chip' + (c >= r.cap ? ' sun' : '') + '">' + c + ' de ' + r.cap + ' vagas' + (c >= r.cap ? ' · lotada' : '') + '</span><span class="chip ' + (state.open ? 'ok' : 'sun') + '">' + (state.open ? 'Check-in aberto' : 'Check-in fechado') + '</span></div>' +
    '<p class="sec">Em sala</p>' + (inn.length ? inn.map(k => kidRow(k)).join('') : '<p class="hint">Ainda não há crianças nesta sala.</p>') +
    (exp.length ? '<p class="sec">Esperados</p>' + exp.map(k => '<article class="trow"><div class="row"><div><strong>' + esc(k.name) + '</strong><div class="meta">' + k.age + '</div></div><button type="button" class="btn primary" data-tin="' + k.id + '"' + (state.open && c < r.cap ? '' : ' disabled') + '>Check-in</button></div></article>').join('') : '') +
    (lf.length ? '<p class="sec">Já saíram</p>' + lf.map(k => '<div class="krow"><div><strong>' + esc(k.name) + '</strong><br><span class="meta">saiu às ' + k.out + '</span></div></div>').join('') : '');
}

function renderTia(me) {
  state.tia = me.tia;
  const t = tia(), s = state.t;
  if (!t) return '<div class="app"><div class="scr"><p class="sub">Carregando os dados da equipe…</p></div></div>';
  let head, body, tabbar = false;
  if (s.screen === 'kid') { const k = kid(s.kid); head = bandBack(esc(k.name), k.age + ' · ' + room(k.room).name); body = screenDetail(k, true); }
  else if (s.screen === 'room') { head = bandBack(room(s.room).name, 'Visão da sala'); body = roomView(s.room); }
  else {
    tabbar = true; head = bandTia(t);
    if (s.tab === 'salas') {
      body = '<div><h2>Todas as salas</h2><p class="sub">Toque em uma sala para ver as crianças.</p></div>' + ROOMS.map(r => { const c = inRoom(r.id); return '<button type="button" class="roomcard" data-troom="' + r.id + '"><div class="row"><strong>' + r.name + '</strong><span class="chip' + (c >= r.cap ? ' sun' : '') + '">' + c + '/' + r.cap + (c >= r.cap ? ' · lotada' : '') + '</span></div><span class="meta">' + r.ages + '</span></button>'; }).join('');
    } else if (s.tab === 'avisos') {
      const all = state.alerts.slice().reverse();
      body = '<div><h2>Avisos enviados</h2><p class="sub">Acompanhe quem já respondeu.</p></div>' + (all.length ? all.map(a => '<article class="trow"><div class="time">' + a.time + ' · ' + esc(a.by || 'Equipe') + '</div><div><strong>' + esc(kid(a.kid).name) + '</strong><div>' + esc(a.text) + '</div></div><span>' + (a.reply ? '<span class="chip ok">Responsável a caminho</span>' : '<span class="chip sun">Sem resposta ainda</span>') + '</span></article>').join('') : '<p class="hint">Ainda não há avisos neste culto.</p>');
    } else if (s.tab === 'visitantes') {
      body = visitorsTab();
    } else body = roomView(t.room);
  }
  const tb = tabbar ? '<nav class="tabbar" style="--n:4" aria-label="Menu da equipe">' +
    [['sala', 'Minha sala', IC.door], ['salas', 'Todas as salas', IC.grid], ['avisos', 'Avisos', IC.bell], ['visitantes', 'Visitantes', IC.qr]].map(x => '<button type="button" data-ttab="' + x[0] + '"' + (s.tab === x[0] ? ' aria-current="page"' : '') + '>' + x[2] + x[1] + '</button>').join('') + '</nav>' : '';
  return '<div class="app">' + head + '<div class="scr">' + body + '</div>' + tb + '</div>';
}

function visitorsTab() {
  return '<div><h2>Visitantes</h2><p class="sub">O visitante aponta a câmera do celular para o QR Code e faz o check-in sozinho, sem baixar nada.</p></div>' +
    '<section class="card qrcard">' + qr(visitorUrl()) + '<p class="meta">Mostre esta tela na entrada ou imprima e fixe o QR Code.</p>' +
    '<div class="actions"><a class="btn primary" href="' + esc(visitorUrl()) + '" target="_blank" rel="noopener">Abrir página do visitante</a><button type="button" class="btn" data-print>Imprimir</button></div></section>' +
    '<p class="sec">Como funciona</p><ol class="steps"><li>O visitante escaneia o QR Code com a câmera do celular.</li><li>Preenche o nome, a criança e a idade em um minuto.</li><li>A criança aparece na lista da sala certa, e a família recebe um QR Code de retirada.</li></ol>';
}

// quem é da equipe e também responsável por uma família troca de área sem sair da conta
function withSwitch(html, u) {
  if (!u || !u.fam || html.indexOf('class="tabbar"') < 0) return html;
  const b = (m, l) => '<button type="button" data-mode="' + m + '" aria-pressed="' + (state.mode === m) + '">' + l + '</button>';
  return html.replace('<div class="scr">', '<div class="modebar" role="group" aria-label="Trocar de área">' + b('equipe', 'Equipe') + b('familia', 'Minha família') + '</div><div class="scr">');
}

function renderFamilia() {
  const pu = sessUser('pais'), tu = pu ? null : sessUser('tias');
  if (pu) return withSwitch(renderParent(pu), null);
  if (tu) return withSwitch(tu.fam && state.mode === 'familia' ? renderParent(tu) : renderTia(tu), tu);
  return appLogin('familia');
}

/* ================= GESTÃO ================= */
function gPainel() {
  const inside = KIDS.filter(k => k.status === 'in').length, entered = KIDS.filter(k => k.status !== 'out').length;
  const left = KIDS.filter(k => k.status === 'left').length, vis = KIDS.filter(k => k.visitor).length;
  const rooms = ROOMS.map(r => {
    const c = inRoom(r.id), tt = TIAS.find(x => x.room === r.id), pct = Math.min(100, Math.round(c / r.cap * 100));
    return '<article class="rc"><div class="row2"><h3>' + r.name + '</h3><span class="chip' + (c >= r.cap ? ' sun' : '') + '">' + c + '/' + r.cap + (c >= r.cap ? ' · lotada' : '') + '</span></div>' +
      '<span class="meta">' + r.ages + ' · ' + (tt ? esc(tt.name) : 'Sem tia definida') + '</span><div class="occ" aria-hidden="true"><i class="' + (c >= r.cap ? 'full' : '') + '" style="width:' + pct + '%"></i></div>' +
      (canManage() ? '<label>Capacidade da sala<input type="number" min="1" max="40" value="' + r.cap + '" data-cap="' + r.id + '"></label>' : '<span class="meta">Capacidade: ' + r.cap + ' crianças</span>') + '</article>';
  }).join('');
  return '<section class="stats" aria-label="Contagem"><div class="stat main"><b>' + inside + '</b><span>em sala agora</span></div><div class="stat"><b>' + entered + '</b><span>entraram</span></div><div class="stat"><b>' + left + '</b><span>já saíram</span></div><div class="stat"><b>' + vis + '</b><span>visitantes</span></div></section>' +
    '<section class="panel"><div class="vqrow"><div><h2>Check-in do culto</h2><p class="meta">Culto infantil · domingo, 08/11 · 9h. ' + (state.open ? 'As famílias já podem fazer check-in.' : 'As famílias ainda não conseguem entrar.') + '</p><button type="button" class="btn ' + (state.open ? '' : 'hl') + '" data-toggle>' + (state.open ? 'Check-in aberto · fechar' : 'Check-in fechado · abrir') + '</button></div></div></section>' +
    '<h2>Salas</h2><div class="rcards rooms">' + rooms + '</div>' +
    '<section class="panel"><div class="vqrow">' + qr(visitorUrl()) + '<div><h2>QR Code para visitantes</h2><p class="meta">Imprima e fixe na entrada. O visitante aponta a câmera do celular e faz o check-in sozinho, sem baixar nada. A equipe também tem este QR Code no app, na aba Visitantes.</p><a class="btn" href="' + esc(visitorUrl()) + '" target="_blank" rel="noopener">Abrir página do visitante</a></div></div></section>';
}

function famCards() {
  const q = state.gq.trim().toLowerCase();
  const list = FAMS.filter(f => !q || (f.name + ' ' + f.guardians.join(' ') + ' ' + KIDS.filter(k => k.fam === f.id).map(k => k.name).join(' ')).toLowerCase().includes(q));
  return list.length ? list.map(f => {
    const ks = KIDS.filter(k => k.fam === f.id);
    return '<article class="rc"><div class="row2"><h3>Família ' + esc(f.name) + '</h3>' + (f.visitor ? '<span class="chip sun">Visitante</span>' : '') + '</div><span class="meta">Telefone ' + esc(f.phone) + '</span>' +
      '<div><p class="sec">Autorizados a retirar</p>' + f.guardians.map(g => '<div>' + esc(g) + '</div>').join('') + '</div>' +
      '<div><p class="sec">Crianças</p>' + ks.map(k => '<div>' + esc(k.name) + ' <span class="meta">· ' + k.age + ' · ' + room(k.room).name + '</span></div>').join('') + '</div></article>';
  }).join('') : '<div class="empty">Nenhuma família encontrada.</div>';
}

function gFamilias() {
  const form = state.gform ? '<form class="form inline" id="nf" autocomplete="off"><label>Sobrenome da família<input type="text" id="nf-s"></label><label>Responsável<input type="text" id="nf-g" placeholder="Nome completo"></label><label>Telefone<input type="tel" id="nf-p" placeholder="(00) 90000-0000"></label><label>Nome da criança<input type="text" id="nf-n"></label><label>Idade<select id="nf-a">' + ageOpts(3) + '</select></label><label>Alergias ou cuidados<input type="text" id="nf-o" placeholder="Opcional"></label><button type="submit" class="btn primary">Salvar cadastro</button></form>' : '';
  return noticeHtml() + '<div class="head" style="margin:0"><div><h2>Famílias</h2><p class="sub">' + FAMS.length + ' famílias cadastradas</p></div><button type="button" class="btn primary" data-gform>' + (state.gform ? 'Fechar formulário' : 'Nova família') + '</button></div>' + form +
    '<label class="form" style="padding:12px"><span style="font-size:14px;font-weight:600;color:var(--muted)">Buscar por família, responsável ou criança</span><input type="text" id="g-q" value="' + esc(state.gq) + '" placeholder="Digite um nome"></label>' +
    '<div class="rcards" id="flist">' + famCards() + '</div>';
}

function gEquipe() {
  const rows = TIAS.map(x => { const acc = USERS.find(u => u.tia === x.id), on = !acc || acc.active; return '<article class="rc"><div class="row2"><h3>' + esc(x.name) + '</h3><span class="chip ' + (on ? 'ok' : 'left') + '">' + (on ? 'Ativa hoje' : 'Acesso desativado') + '</span></div><label>Sala de hoje<select data-tiaroom="' + x.id + '">' + ROOMS.map(r => '<option value="' + r.id + '"' + (r.id === x.room ? ' selected' : '') + '>' + r.name + '</option>').join('') + '</select></label></article>'; }).join('');
  const roles = [['App dos pais', 'Responsável', 'Ver os próprios filhos, fazer check-in, receber avisos, responder “estou indo” e ver a agenda.'], ['App das tias', 'Equipe de sala', 'Ver as salas, fazer check-in e check-out, ler cuidados da criança e enviar avisos aos pais.'], ['Gestão · Recepção', 'Recepção', 'Ver o painel, cadastrar famílias e abrir o check-in.'], ['Gestão · Coordenação', 'Coordenação', 'Tudo da recepção, mais equipe, capacidade das salas, agenda e relatórios.'], ['Gestão · Administrador', 'Administrador', 'Tudo da coordenação, mais acessos e registro de ações.']];
  return '<div><h2>Equipe</h2><p class="sub">Defina em que sala cada tia está hoje. O app dela já abre na sala certa.</p></div><div class="rcards">' + rows + '</div>' +
    '<h2>Funções e acessos</h2><div class="rcards">' + roles.map(r => '<article class="rc"><h3>' + r[0] + '</h3><span class="chip" style="justify-self:start">' + r[1] + '</span><span>' + r[2] + '</span></article>').join('') + '</div>';
}

function gAgenda() {
  const form = state.eform ? '<form class="form inline" id="ne" autocomplete="off"><label>Data (dia/mês)<input type="text" id="ne-d" placeholder="29/11"></label><label>Dia da semana<select id="ne-w">' + ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(x => '<option>' + x + '</option>').join('') + '</select></label><label>Horário<input type="text" id="ne-t" placeholder="9h"></label><label>Título<input type="text" id="ne-n" placeholder="Culto infantil"></label><label>Observação<input type="text" id="ne-o" placeholder="Opcional"></label><button type="submit" class="btn primary">Salvar evento</button></form>' : '';
  return '<div class="head" style="margin:0"><div><h2>Agenda</h2><p class="sub">O que você publicar aparece no app dos pais.</p></div><button type="button" class="btn primary" data-eform>' + (state.eform ? 'Fechar formulário' : 'Novo evento') + '</button></div>' + form +
    '<div class="rcards">' + EVENTS.map(e => '<article class="rc ev" style="grid-template-columns:auto 1fr;display:grid;align-items:center;gap:14px"><div class="date"><b>' + esc(e.day) + '</b><small>' + esc(e.mon) + '</small></div><div><strong>' + esc(e.n) + '</strong><span class="meta">' + esc(e.w) + ' · ' + esc(e.t) + '</span><span class="meta">' + esc(e.note) + '</span></div></article>').join('') + '</div>';
}

function gRelatorios() {
  const entered = KIDS.filter(k => k.status !== 'out').length, vis = KIDS.filter(k => k.visitor).length;
  const rows = [{ d: '08/11 (hoje)', c: entered, v: vis, avg: 'em andamento' }].concat(PAST);
  const max = Math.max(50, ...rows.map(r => r.c));
  return '<div><h2>Relatórios</h2><p class="sub">Presença por culto. Os cultos anteriores são dados de exemplo.</p></div>' +
    '<div class="tbl"><table><thead><tr><th>Culto</th><th>Check-ins</th><th></th><th>Visitantes</th><th>Permanência média</th></tr></thead><tbody>' +
    rows.map(r => '<tr><td>' + r.d + '</td><td>' + r.c + '</td><td><div class="bar2" aria-hidden="true"><i style="width:' + Math.round(r.c / max * 100) + '%"></i></div></td><td>' + r.v + '</td><td>' + r.avg + '</td></tr>').join('') + '</tbody></table></div>';
}

function gRegistro() {
  const rows = state.audit.slice().reverse();
  return '<div><h2>Registro de ações</h2><p class="sub">Quem fez o quê, para dar transparência e segurança ao cuidado das crianças.</p></div>' +
    '<section class="panel">' + (rows.length ? '<ul class="log">' + rows.map(a => '<li><span class="time">' + a.t + '</span><b>' + esc(a.who) + '</b><span>' + esc(a.text) + '</span></li>').join('') + '</ul>' : '<p class="hint">Ainda não há ações registradas.</p>') + '</section>';
}

function noticeHtml() {
  const n = state.notice; if (!n) return '';
  return '<section class="panel notice" role="status"><div><strong>' + esc(n.title) + '</strong><p class="meta">' + esc(n.text) + '</p></div><button type="button" class="btn sm" data-ndismiss>Entendi</button></section>';
}

const famOpts = sel => FAMS.filter(f => !f.visitor).map(f => '<option value="' + f.id + '"' + (f.id === sel ? ' selected' : '') + '>Família ' + esc(f.name) + '</option>').join('');

function gAcessos() {
  const me = sessUser('gestao'), f = state.af;
  const list = USERS.filter(u => !u.replaced).filter(u => f === 'todos' || (f === 'pais' && u.role === 'pais') || (f === 'tias' && u.role === 'tia') || (f === 'gestao' && STAFF_ROLES.includes(u.role)));
  const pills = [['todos', 'Todos'], ['pais', 'Pais'], ['tias', 'Tias'], ['gestao', 'Gestão']].map(x => '<button type="button" data-af="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + '</button>').join('');
  const form = state.aform ? '<form class="form inline" id="na" autocomplete="off"><label>Nome<input type="text" id="na-n" placeholder="Nome completo"></label><label>E-mail<input type="text" id="na-e" inputmode="email" autocapitalize="none" placeholder="nome@exemplo.com"></label><label>Perfil<select id="na-r">' + [['tia', 'Equipe de sala (tia)'], ['recepcao', 'Recepção'], ['coord', 'Coordenação'], ['admin', 'Administrador']].map(x => '<option value="' + x[0] + '">' + x[1] + '</option>').join('') + '</select></label><label>Sala (só para tias)<select id="na-s">' + ROOMS.map(r => '<option value="' + r.id + '">' + r.name + '</option>').join('') + '</select></label><label>Também é responsável por uma família (só para tias)<select id="na-f"><option value="">Nenhuma</option>' + famOpts('') + '</select></label><button type="submit" class="btn primary">Criar acesso</button></form>' : '';
  const rows = list.map(u => '<tr><td>' + esc(u.name) + '</td><td>' + ROLES[u.role] + (u.role === 'tia' ? '<select class="mini" data-ulink="' + u.id + '" aria-label="Família de ' + esc(u.name) + '"><option value="">Sem família</option>' + famOpts(u.fam) + '</select>' : '') + '</td><td>' + esc(u.login || u.phone) + '</td><td><span class="chip ' + (u.active ? 'ok' : 'left') + '">' + (u.active ? 'Ativo' : 'Desativado') + '</span></td><td><div class="acts">' +
    (u.id === me.id ? '<span class="meta">Você</span>' : '<button type="button" class="btn sm" data-utoggle="' + u.id + '">' + (u.active ? 'Desativar' : 'Reativar') + '</button>') +
    '<button type="button" class="btn sm" data-ureset="' + u.id + '">Redefinir senha</button></div></td></tr>').join('');
  return noticeHtml() + '<div class="head" style="margin:0"><div><h2>Acessos</h2><p class="sub">Quem pode entrar em cada app. Desativar uma conta tira a pessoa do app na hora.</p></div><button type="button" class="btn primary" data-aform>' + (state.aform ? 'Fechar formulário' : 'Novo acesso') + '</button></div>' + form +
    '<div class="pills" role="group" aria-label="Filtrar acessos">' + pills + '</div>' +
    '<div class="tbl"><table><thead><tr><th>Nome</th><th>Perfil</th><th>Login</th><th>Estado</th><th>Ações</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function renderGestao() {
  const u = sessUser('gestao');
  if (!u) return appLogin('gestao');
  const allowed = PERMS[u.role];
  if (!allowed.includes(state.g)) state.g = 'painel';
  const nav = '<nav class="anav" aria-label="Seções da gestão">' + SECTIONS.filter(s => allowed.includes(s[0])).map(s => '<button type="button" data-gs="' + s[0] + '"' + (state.g === s[0] ? ' aria-current="page"' : '') + '>' + s[1] + '</button>').join('') + '</nav>';
  const body = ({ painel: gPainel, familias: gFamilias, equipe: gEquipe, agenda: gAgenda, relatorios: gRelatorios, acessos: gAcessos, registro: gRegistro })[state.g]();
  return '<div class="head"><div><h1>Gestão</h1><p class="sub">Cadastros, salas, equipe, agenda e relatórios do Verbo Crianças.</p></div><div class="who"><span class="chip">' + esc(u.name) + ' · ' + ROLES[u.role] + '</span><button type="button" class="btn" data-logout>Sair</button></div></div><div class="adm">' + nav + '<div class="acontent">' + body + '</div></div>';
}

/* ================= VISITANTE ================= */
function renderVisitor() {
  if (state.visit) {
    const k = kid(state.visit), f = fam(k.fam), g = first(f.guardians[0]);
    const als = kidAlerts(k.id).slice().reverse();
    return '<div class="phone"><div><h1>Tudo certo, ' + esc(g) + '!</h1><p class="sub">' + esc(k.name) + ' já está na sala ' + room(k.room).name + '. Sejam bem-vindos!</p></div>' +
      '<section class="pkid"><div><h3>QR Code de retirada</h3><p class="meta">Mostre este código à equipe na saída. Só quem fez o cadastro pode retirar a criança.</p></div>' + qr(k.code) + '</section>' +
      '<p class="meta">Deixe esta página aberta durante o culto. Se a equipe precisar de você, o aviso aparece aqui e, se você permitir notificações no navegador, também chega como notificação. Você não precisou baixar nenhum aplicativo.</p>' +
      '<p class="sec">Avisos da equipe</p>' + (als.length ? als.map(a => alertCard(a, true)).join('') : '<p class="hint">Ainda não há avisos.</p>') +
      '<div class="actions"><button type="button" class="btn primary" data-newvisit>Cadastrar outro visitante</button></div></div>';
  }
  return '<div class="phone"><div><h1>Que bom ter vocês aqui!</h1><p class="sub">Primeira vez no Verbo Crianças? Preencha em um minuto. Não precisa baixar aplicativo.</p></div>' +
    '<form class="form" id="vf" autocomplete="off">' +
    '<label>Seu nome<input type="text" id="v-g" placeholder="Nome do responsável"></label>' +
    '<label>Telefone<input type="tel" id="v-p" placeholder="(00) 90000-0000"></label>' +
    '<label>Nome da criança<input type="text" id="v-n"></label>' +
    '<label>Idade<select id="v-a">' + ageOpts(3) + '</select></label>' +
    '<label>Alergias ou cuidados<textarea id="v-note" rows="2" placeholder="Opcional"></textarea></label>' +
    '<label class="check"><input type="checkbox" id="v-ok"><span>Autorizo o uso destes dados apenas para o cuidado da criança durante o culto, conforme a LGPD.</span></label>' +
    '<button type="submit" class="btn primary wide">Fazer check-in</button></form></div>';
}

function submitVisitor() {
  const g = $('#v-g').value.trim(), p = $('#v-p').value.trim(), n = $('#v-n').value.trim(), a = +$('#v-a').value, note = $('#v-note').value.trim();
  if (!state.open) { toast('O check-in ainda não abriu. Aguarde a equipe.'); return; }
  if (!g || !p || !n) { toast('Preencha seu nome, o telefone e o nome da criança.'); return; }
  if (!$('#v-ok').checked) { toast('Marque a autorização para continuar.'); return; }
  const rid = roomForAge(a);
  if (inRoom(rid) >= room(rid).cap) { toast(room(rid).name + ' está lotada. Fale com a equipe na entrada.'); return; }
  const go = () => {
    const owner = cloudOn() ? Cloud.uid() : undefined, fid = 'v' + uid8();
    FAMS.push({ id: fid, name: g, visitor: true, owner, phone: p, guardians: [g + ' (responsável)'] });
    const k = { id: 'kv' + uid8(), name: n, age: ageLabel(a), room: rid, fam: fid, owner, note, obs: '', status: 'in', time: now(), out: '', by: g, code: 'VIS-' + (1000 + Math.floor(Math.random() * 9000)), visitor: true };
    KIDS.push(k); state.visit = k.id; log('Visitante', 'Check-in de ' + n + ' (' + room(rid).name + ').'); render();
    toast('Check-in feito. A equipe já viu ' + n.split(' ')[0] + ' na lista.');
  };
  if (cloudOn()) Cloud.ensureAnon().then(go).catch(() => toast('Sem conexão. Tente de novo em instantes.')); else go();
}

function renderSheet() {
  const s = state.sheet; if (!s) return '';
  const k = kid(s.kid), f = fam(k.fam);
  if (s.type === 'alert') {
    const q = QUICK.map(x => '<button type="button" data-quick="' + x.key + '" aria-pressed="' + (s.key === x.key) + '">' + x.label + '</button>').join('');
    return '<div class="overlay" data-close><div class="sheet" role="dialog" aria-modal="true" aria-label="Avisar pais" data-sheet>' +
      '<h2>Avisar pais de ' + esc(k.name) + '</h2><p class="meta">Vai por notificação para: ' + (f.visitor ? esc(f.guardians[0].split(' (')[0]) + ' (página do visitante)' : f.guardians.filter(g => !/avó|madrinha/.test(g)).map(g => esc(g.split(' (')[0])).join(' e ')) + '</p>' +
      '<div class="quick">' + q + '</div><textarea id="msg" rows="3" aria-label="Mensagem" placeholder="Escreva a mensagem">' + esc(s.text) + '</textarea>' +
      '<div class="actions"><button type="button" class="btn primary" data-send>Enviar aviso</button><button type="button" class="btn" data-cancel>Cancelar</button></div></div></div>';
  }
  const opts = f.guardians.map((g, i) => '<label><input type="radio" name="who" value="' + i + '"' + (s.who === String(i) ? ' checked' : '') + '>' + esc(g) + '</label>').join('') +
    '<label><input type="radio" name="who" value="x"' + (s.who === 'x' ? ' checked' : '') + '>Outra pessoa, não cadastrada</label>';
  return '<div class="overlay" data-close><div class="sheet" role="dialog" aria-modal="true" aria-label="Check-out" data-sheet>' +
    '<h2>Check-out de ' + esc(k.name) + '</h2><p class="meta">Quem está retirando a criança? Só pessoas autorizadas na ficha da família podem levar.</p>' +
    '<div class="opts">' + opts + '</div>' + (s.blocked ? '<div class="block">Atenção: pessoa não autorizada. Chame o responsável pelo aviso e não libere a criança.</div>' : '') +
    '<div class="actions"><button type="button" class="btn primary" data-confirm>Confirmar saída</button><button type="button" class="btn" data-cancel>Cancelar</button></div></div></div>';
}

function render() {
  $('#app').innerHTML = MODE === 'gestao' ? renderGestao() : MODE === 'visitante' ? renderVisitor() : renderFamilia();
  $('#layer').innerHTML = renderSheet();
  if (cloudOn()) Cloud.sync();
}

function markSeen() {
  const ids = KIDS.filter(k => k.fam === state.fam).map(k => k.id);
  state.alerts.forEach(a => { if (ids.includes(a.kid)) a.seen = true; });
}

document.addEventListener('click', e => {
  const t = e.target.closest('button, [data-close]'); if (!t) return;
  const d = t.dataset, p = state.p, ts = state.t;
  if ('print' in d) { window.print(); return; }
  if ('newvisit' in d) { state.visit = null; return render(); }
  if (d.fill) {
    const u = USERS.find(x => x.id === d.fill), a = $('#l-user'), b = $('#l-pass');
    if (u && a && b) { a.value = u.login || u.phone; b.value = u.pass; b.type = 'password'; const s = $('[data-showpass]'); if (s) s.textContent = 'Mostrar'; b.focus(); }
    return;
  }
  if ('pushon' in d) { Cloud.enablePush().then(r => { toast(r.ok ? 'Notificações ativadas neste aparelho.' : r.err); render(); }); return; }
  if ('showpass' in d) { const b = $('#l-pass'); b.type = b.type === 'password' ? 'text' : 'password'; t.textContent = b.type === 'password' ? 'Mostrar' : 'Ocultar'; return; }
  if ('forgot' in d) {
    if (cloudOn()) {
      const v = ($('#l-user') || {}).value || '';
      if (/^\S+@\S+\.\S+$/.test(v.trim())) { Cloud.forgot(v.trim()); toast('Se este e-mail estiver cadastrado, enviamos um link para criar uma nova senha.'); }
      else toast('Digite seu e-mail acima. Quem entra com telefone deve pedir uma nova senha à coordenação.');
      return;
    }
    toast('Se este acesso existir, a coordenação recebe o pedido para redefinir a senha.'); return;
  }
  if ('logout' in d) return logout();
  if ('ndismiss' in d) { state.notice = null; return render(); }
  if ('aform' in d) { state.aform = !state.aform; return render(); }
  if (d.af) { state.af = d.af; return render(); }
  if (d.utoggle) {
    const u = USERS.find(x => x.id === d.utoggle); if (!u || u.id === state.sess.gestao) return;
    if (cloudOn()) {
      const to = !u.active;
      Cloud.call('setActive', { uid: u.id, active: to }).then(() => { log(actor(), 'Acesso de ' + u.name + (to ? ' reativado.' : ' desativado.')); render(); toast(to ? 'Acesso reativado.' : 'Acesso desativado. A pessoa já não consegue entrar.'); }).catch(err => toast(err.message));
      return;
    }
    u.active = !u.active; log(actor(), 'Acesso de ' + u.name + (u.active ? ' reativado.' : ' desativado.')); render();
    toast(u.active ? 'Acesso reativado.' : 'Acesso desativado. A pessoa já não consegue entrar.'); return;
  }
  if (d.ureset) {
    const u = USERS.find(x => x.id === d.ureset); if (!u) return;
    if (cloudOn()) {
      Cloud.call('resetPassword', { uid: u.id }).then(r => { log(actor(), 'Senha de ' + u.name + ' redefinida.'); state.notice = { title: 'Senha redefinida para ' + u.name, text: r.email ? 'Enviamos um link para ' + r.email + '. A pessoa cria a nova senha por ele.' : 'Nova senha provisória: ' + r.pass + '. Anote agora: ela não aparece de novo. A senha antiga deixou de valer.' }; render(); }).catch(err => toast(err.message));
      return;
    }
    u.pass = newPass(); log(actor(), 'Senha de ' + u.name + ' redefinida.');
    state.notice = { title: 'Senha redefinida para ' + u.name, text: 'Nova senha provisória: ' + u.pass + '. No sistema real, a pessoa recebe um link para criar uma nova senha.' };
    return render();
  }
  if ('toggle' in d) { state.open = !state.open; log(actor(), state.open ? 'Check-in aberto para o culto.' : 'Check-in fechado.'); render(); toast(state.open ? 'Check-in aberto. As famílias já podem entrar.' : 'Check-in fechado.'); return; }
  if (d.gs) { state.g = d.gs; state.notice = null; return render(); }
  if ('gform' in d) { state.gform = !state.gform; return render(); }
  if ('eform' in d) { state.eform = !state.eform; return render(); }
  if (d.tab) { p.tab = d.tab; p.screen = null; if (d.tab === 'avisos') markSeen(); return render(); }
  if ('pushopen' in d) { markSeen(); p.tab = 'avisos'; p.screen = null; return render(); }
  if ('pushclose' in d) { markSeen(); return render(); }
  if ('back' in d) { (state.sess.tias ? ts : p).screen = null; return render(); }
  if (d.mode) { state.mode = d.mode; state.p = newP(); state.t = newT(); return render(); }
  if ('perfil' in d) { p.screen = 'perfil'; return render(); }
  if ('save' in d) { toast('Cadastro atualizado.'); return; }
  if (d.detail) { p.screen = 'detail'; p.card = d.detail; return render(); }
  if (d.ckid) { p.ckid = d.ckid; return render(); }
  if ('docheckin' in d) {
    const f = fam(state.fam), ok = [], full = [];
    p.sel.forEach(id => {
      const k = kid(id);
      if (inRoom(k.room) >= room(k.room).cap) { full.push(k.name.split(' ')[0]); return; }
      doCheckIn(k, f.guardians[0].split(' (')[0]);
      log('Família ' + f.name, 'Check-in de ' + k.name + ' (' + room(k.room).name + ').');
      ok.push(k.id);
    });
    if (full.length) toast('Sala lotada para ' + full.join(', ') + '. Fale com a equipe na entrada.');
    if (ok.length) { p.done = ok; p.sel = []; p.screen = 'done'; }
    return render();
  }
  if (d.ttab) { ts.tab = d.ttab; ts.screen = null; return render(); }
  if (d.troom) { ts.screen = 'room'; ts.room = d.troom; return render(); }
  if (d.tkid) { ts.screen = 'kid'; ts.kid = d.tkid; return render(); }
  if (d.tin) {
    const k = kid(d.tin), f = fam(k.fam);
    if (inRoom(k.room) >= room(k.room).cap) { toast(room(k.room).name + ' está lotada. Chame um apoio antes de continuar.'); return; }
    doCheckIn(k, f.guardians[0].split(' (')[0]); log(tia().name, 'Check-in de ' + k.name + ' (' + room(k.room).name + ').'); render();
    toast('Check-in de ' + k.name.split(' ')[0] + ' feito.'); return;
  }
  if (d.alert) { state.sheet = { type: 'alert', kid: d.alert, key: null, text: '' }; return render(); }
  if (d.out) { state.sheet = { type: 'out', kid: d.out, who: null, blocked: false }; return render(); }
  if (d.quick) {
    const q = QUICK.find(x => x.key === d.quick), s = state.sheet;
    s.key = q.key; s.text = q.text(kid(s.kid).name.split(' ')[0]); render();
    const m = $('#msg'); if (m) { m.focus(); m.setSelectionRange(m.value.length, m.value.length); } return;
  }
  if ('cancel' in d) { state.sheet = null; return render(); }
  if ('close' in d) { if (e.target === t) { state.sheet = null; render(); } return; }
  if ('send' in d) {
    const s = state.sheet, text = $('#msg').value.trim();
    if (!text) { toast('Escreva ou escolha uma mensagem antes de enviar.'); return; }
    const k = kid(s.kid);
    const al = { id: 'a' + uid8(), at: Date.now(), fam: k.fam, kid: k.id, text, time: now(), reply: false, seen: false, by: tia().name };
    state.alerts.push(al); if (cloudOn()) Cloud.pushAlert(al);
    log(tia().name, 'Aviso enviado aos pais de ' + k.name + '.');
    state.sheet = null; render();
    toast('Notificação enviada aos responsáveis de ' + k.name.split(' ')[0]); return;
  }
  if ('confirm' in d) {
    const s = state.sheet, pick = document.querySelector('input[name="who"]:checked');
    if (!pick) { toast('Escolha quem está retirando a criança.'); return; }
    s.who = pick.value;
    if (pick.value === 'x') { s.blocked = true; render(); return; }
    const k = kid(s.kid); k.status = 'left'; k.out = now(); state.sheet = null;
    log(tia().name, 'Check-out de ' + k.name + ' com ' + fam(k.fam).guardians[+pick.value].split(' (')[0] + '.'); render();
    toast(k.name.split(' ')[0] + ' saiu com ' + fam(k.fam).guardians[+pick.value].split(' (')[0]); return;
  }
  if (d.reply) { const a = state.alerts.find(x => x.id === d.reply); a.reply = true; a.seen = true; render(); toast('A equipe foi avisada de que você está indo.'); return; }
});
document.addEventListener('submit', e => {
  const id = e.target.id;
  if (id === 'vf') { e.preventDefault(); return submitVisitor(); }
  if (id.startsWith('lf-')) {
    e.preventDefault();
    const app = e.target.dataset.app, user = $('#l-user').value.trim(), pass = $('#l-pass').value;
    state.lval[app] = user;
    if (cloudOn()) {
      if (!user || !pass) { state.lerr[app] = LOGIN_COPY[app].empty; render(); return; }
      const btn = e.target.querySelector('[type=submit]'); if (btn) { btn.disabled = true; btn.textContent = 'Entrando…'; }
      Cloud.login(app, user, pass).then(r => {
        if (r.err) { state.lerr[app] = r.err; render(); const pf = $('#l-pass'); if (pf) pf.focus(); return; }
        state.lerr[app] = null; state.lval[app] = '';
        log(r.user.name, 'Entrou no app (' + ROLES[r.user.role] + ').'); render(); toast('Bem-vindo, ' + first(r.user.name) + '!');
      });
      return;
    }
    const res = tryLogin(app, user, pass);
    if (res.err) { state.lerr[app] = res.err; render(); const pf = $('#l-pass'); if (pf) pf.focus(); return; }
    const u = res.user;
    state.sess = { pais: null, tias: null, gestao: null };
    state.sess[u.role === 'pais' ? 'pais' : u.role === 'tia' ? 'tias' : 'gestao'] = u.id;
    state.lerr[app] = null; state.lval[app] = '';
    if (u.role === 'pais') { state.fam = u.fam; state.p = newP(); }
    if (u.role === 'tia') { state.tia = u.tia; state.t = newT(); state.mode = 'equipe'; }
    if (app === 'gestao') { state.g = 'painel'; state.gform = false; state.eform = false; state.aform = false; state.gq = ''; state.notice = null; }
    log(u.name, 'Entrou no app (' + ROLES[u.role] + ').');
    render(); toast('Bem-vindo, ' + first(u.name) + '!'); return;
  }
  if (id === 'bs') {
    e.preventDefault();
    const nm = $('#bs-n').value.trim(), em = $('#bs-e').value.trim(), pw = $('#bs-p').value;
    if (!nm || !/^\S+@\S+\.\S+$/.test(em)) { state.lerr.setup = 'Informe o nome e um e-mail válido.'; render(); return; }
    const btn = e.target.querySelector('[type=submit]'); if (btn) { btn.disabled = true; btn.textContent = 'Criando…'; }
    Cloud.bootstrap(nm, em, pw).then(r => {
      if (r.err) { state.lerr.setup = r.err; render(); return; }
      state.lerr.setup = null; log(r.user.name, 'Sistema iniciado. Primeiro administrador criado.'); render(); toast('Tudo pronto, ' + first(r.user.name) + '!');
    });
    return;
  }
  if (id === 'na') {
    e.preventDefault();
    const nm = $('#na-n').value.trim(), em = $('#na-e').value.trim().toLowerCase(), role = $('#na-r').value, rm = $('#na-s').value, fm = role === 'tia' ? ($('#na-f').value || '') : '';
    if (!nm || !/^\S+@\S+\.\S+$/.test(em)) { toast('Informe o nome e um e-mail válido.'); return; }
    if (USERS.some(u => u.login && u.login.toLowerCase() === em)) { toast('Já existe um acesso com este e-mail.'); return; }
    const tid = role === 'tia' ? 't' + uid8() : '';
    if (cloudOn()) {
      const btn = e.target.querySelector('[type=submit]'); if (btn) { btn.disabled = true; btn.textContent = 'Criando…'; }
      Cloud.call('createAccount', { name: nm, role, login: em, tia: tid, fam: fm }).then(r => {
        if (tid) TIAS.push({ id: tid, name: nm, room: rm });
        log(actor(), 'Acesso criado para ' + nm + ' (' + ROLES[role] + ').');
        state.notice = { title: 'Acesso criado para ' + nm, text: 'Entra com ' + em + ' e a senha provisória ' + r.pass + '. Anote agora: ela não aparece de novo. Peça para trocar a senha pelo "Esqueci minha senha".' };
        state.aform = false; render();
      }).catch(err => { toast(err.message); render(); });
      return;
    }
    const pw = newPass(), nu = { id: 'u' + uid8(), role, name: nm, login: em, pass: pw, active: true };
    if (tid) { TIAS.push({ id: tid, name: nm, room: rm }); nu.tia = tid; nu.fam = fm; }
    USERS.push(nu); log(actor(), 'Acesso criado para ' + nm + ' (' + ROLES[role] + ').');
    state.notice = { title: 'Acesso criado para ' + nm, text: 'Entra com ' + em + ' e a senha provisória ' + pw + '. No sistema real, a pessoa recebe um convite por e-mail e cria a própria senha.' };
    state.aform = false; render(); return;
  }
  if (id === 'nf') {
    e.preventDefault();
    const s = $('#nf-s').value.trim(), g = $('#nf-g').value.trim(), ph = $('#nf-p').value.trim(), n = $('#nf-n').value.trim(), a = +$('#nf-a').value, o = $('#nf-o').value.trim();
    if (!s || !g || !ph || !n) { toast('Preencha família, responsável, telefone e nome da criança.'); return; }
    if (digits(ph).length < 8) { toast('Informe um telefone válido, com DDD.'); return; }
    if (USERS.some(u => u.phone && digits(u.phone) === digits(ph))) { toast('Já existe um acesso com este telefone.'); return; }
    const fid = 'f' + uid8(), rid = roomForAge(a);
    const finish = (pw, local) => {
      FAMS.push({ id: fid, name: s, phone: ph, guardians: [g + ' (responsável)'] });
      if (local) USERS.push({ id: 'u' + uid8(), role: 'pais', name: g, login: '', phone: ph, pass: pw, active: true, fam: fid });
      state.notice = { title: 'Acesso criado para a família ' + s, text: 'O responsável entra com o telefone ' + ph + ' e a senha provisória ' + pw + '. ' + (local ? 'No sistema real, ele recebe um convite e cria a própria senha.' : 'Anote agora: ela não aparece de novo. Ele pode trocar a senha em Perfil.') };
      KIDS.push({ id: 'kf' + uid8(), name: n + ' ' + s, age: ageLabel(a), room: rid, fam: fid, note: o, obs: '', status: 'out', time: '', out: '', by: '', code: 'CAD-' + (1000 + Math.floor(Math.random() * 9000)) });
      log(actor(), 'Cadastro da família ' + s + ' (' + n + ', ' + room(rid).name + ').');
      state.gform = false; render();
    };
    if (cloudOn()) {
      const btn = e.target.querySelector('[type=submit]'); if (btn) { btn.disabled = true; btn.textContent = 'Cadastrando…'; }
      Cloud.call('createAccount', { name: g, role: 'pais', phone: ph, fam: fid }).then(r => finish(r.pass, false)).catch(err => { toast(err.message); render(); });
      return;
    }
    finish(newPass(), true); return;
  }
  if (id === 'ne') {
    e.preventDefault();
    const m = $('#ne-d').value.trim().match(/^(\d{1,2})\/(\d{1,2})$/), n = $('#ne-n').value.trim(), tm = $('#ne-t').value.trim();
    if (!m || +m[2] < 1 || +m[2] > 12 || !n || !tm) { toast('Informe a data como dia/mês (ex.: 29/11), o título e o horário.'); return; }
    EVENTS.push({ id: 'e' + uid8(), at: Date.now(), day: m[1].padStart(2, '0'), mon: MONTHS[+m[2] - 1], w: $('#ne-w').value, t: tm, n, note: $('#ne-o').value.trim() });
    log(actor(), 'Evento criado: ' + n + ' em ' + m[1] + '/' + m[2] + '.');
    state.eform = false; render(); toast('Evento publicado na agenda dos pais.');
  }
});
document.addEventListener('change', e => {
  const ds = e.target.dataset || {};
  if (ds.ulink) {
    const u = USERS.find(x => x.id === ds.ulink); if (!u) return;
    u.fam = e.target.value; log(actor(), u.fam ? 'Vinculou ' + u.name + ' à família ' + fam(u.fam).name + '.' : 'Desvinculou ' + u.name + ' de uma família.');
    render(); toast(u.fam ? 'Pronto. ' + first(u.name) + ' agora troca entre Equipe e Minha família.' : 'Vínculo removido.'); return;
  }
  if (ds.pick) {
    const s = state.p.sel, i = s.indexOf(ds.pick);
    if (e.target.checked && i < 0) { s.push(ds.pick); }
    if (!e.target.checked && i >= 0) { s.splice(i, 1); }
    const b = $('#doci');
    if (b) { b.disabled = !s.length; b.textContent = s.length ? 'Fazer check-in (' + s.length + ')' : 'Fazer check-in'; }
  }
  if (ds.pref) state.prefs[ds.pref] = e.target.checked;
  if (ds.cap) {
    const r = room(ds.cap), v = Math.max(1, Math.min(40, parseInt(e.target.value, 10) || r.cap));
    r.cap = v; log(actor(), 'Capacidade do ' + r.name + ' ajustada para ' + v + '.'); render(); toast('Capacidade atualizada.');
  }
  if (ds.tiaroom) {
    const x = TIAS.find(y => y.id === ds.tiaroom); x.room = e.target.value;
    log(actor(), x.name + ' definida para a sala ' + room(x.room).name + '.'); render(); toast('Equipe atualizada.');
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'g-q') { state.gq = e.target.value; $('#flist').innerHTML = famCards(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.sheet) { state.sheet = null; render(); } });

if ($('#logo-h')) $('#logo-h').innerHTML = logoH();
if (cloudOn()) Cloud.boot();
else {
  state.alerts.push({ id: 'a1', kid: 'k1', fam: 'souza', text: 'Davi está chorando e não se acalma. Pode vir até a sala?', time: '09:41', reply: false, seen: false, by: 'Tia Joana' });
  state.audit.push({ id: 'l1', t: '08:30', who: 'Gestão', text: 'Check-in aberto para o culto.' }, { id: 'l2', t: '09:41', who: 'Tia Joana', text: 'Aviso enviado aos pais de Davi Souza.' });
}
render();
