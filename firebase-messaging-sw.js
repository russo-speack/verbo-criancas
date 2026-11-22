/* Recebe as notificações com o app fechado. Precisa ficar na raiz do site. */
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js', 'firebase-config.js');
if (self.VERBO_FIREBASE && self.VERBO_FIREBASE.apiKey) {
  firebase.initializeApp(self.VERBO_FIREBASE);
  firebase.messaging().onBackgroundMessage(p => {
    const d = p.data || {};
    self.registration.showNotification(d.title || 'Verbo Crianças', { body: d.body || '', icon: 'favicon.svg', tag: 'verbo-aviso', data: { url: d.url || './#pais' } });
  });
}
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './#pais';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => l.length ? l[0].focus() : self.clients.openWindow(url)));
});
