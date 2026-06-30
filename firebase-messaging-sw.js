// ============================================================
//  Giveaways Community — Firebase Messaging Service Worker
//  Place this file at the ROOT of your Vercel project
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

const messaging = firebase.messaging();

// ── IMPORTANT: Nu apelăm onBackgroundMessage ──────────────
// FCM afișează automat notificarea din câmpul webpush.notification
// din payload. Dacă adăugam și onBackgroundMessage care apelează
// showNotification(), apărea notificarea de 2 ori.

// ── Notification click → deschide URL-ul din payload ──────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const targetUrl = (e.notification.data && e.notification.data.url)
    || 'https://giveaways-homepage.vercel.app';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
