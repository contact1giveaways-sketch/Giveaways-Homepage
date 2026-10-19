// ============================================================
//  Giveaways Community — Firebase Messaging Service Worker
//  Notificările vin ca „data” (titlu, text, link) și le afișăm aici.
// ============================================================
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDGv3TtfD2XgA-PWjImMgyY_5CLOFawMSI",
  authDomain: "giveaways-community.firebaseapp.com",
  projectId: "giveaways-community",
  storageBucket: "giveaways-community.firebasestorage.app",
  messagingSenderId: "335882371621",
  appId: "1:335882371621:web:2ab7ceb418b1524b1e75cc"
});

const DEFAULT_URL = 'https://giveawayscommunity.com/';
const messaging = firebase.messaging();

// noua versiune intră imediat în funcțiune
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

messaging.onBackgroundMessage(payload => {
  const d = payload.data || {};
  const n = payload.notification || {};
  // Formatul vechi („notification”) e afișat deja de Firebase — nu-l dublăm
  if (n.title && !d.title) return;

  // „return” e important: Chrome așteaptă afișarea. Fără el apare
  // „This site has been updated in the background”.
  return self.registration.showNotification(d.title || 'Giveaways Community', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'gw-' + (d.title || '').slice(0, 30),
    data: { url: d.url || DEFAULT_URL }
  });
});

// iPhone/iPad: aplicația instalată nu poate deschide direct alt site
// (ex. Raffall) din notificare — te ducea pe pagina noastră.
// Deschidem /go.html, care te trimite mai departe.
const IS_APPLE = /iPhone|iPad|iPod|Macintosh/.test(self.navigator.userAgent);

self.addEventListener('notificationclick', e => {
  e.notification.close();
  let url = (e.notification.data && e.notification.data.url)
    || (e.notification.data && e.notification.data.FCM_MSG && e.notification.data.FCM_MSG.data && e.notification.data.FCM_MSG.data.url)
    || DEFAULT_URL;

  let external = false;
  try { external = new URL(url, self.location.origin).origin !== self.location.origin; } catch (_) {}
  if (external && IS_APPLE) url = '/go.html?to=' + encodeURIComponent(url);

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
