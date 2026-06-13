// ============================================================
//  Giveaways Community — Firebase Messaging Service Worker
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

// Background message handler
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Giveaways Community', {
    body: body || '',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: [
      { action: 'open', title: '🎟️ Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  });
});

// Notification click handler
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('giveaways-homepage') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('https://giveaways-homepage.vercel.app');
    })
  );
});
