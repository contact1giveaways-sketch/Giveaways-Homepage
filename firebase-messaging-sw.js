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

  // Get click URL from data payload or notification
  const clickUrl = (payload.data && payload.data.url)
    || (payload.notification && payload.notification.click_action)
    || 'https://giveaways-homepage.vercel.app';

  self.registration.showNotification(title || 'Giveaways Community', {
    body: body || '',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: clickUrl },
    actions: [
      { action: 'open', title: '🎟️ Open' },
      { action: 'close', title: 'Dismiss' }
    ]
  });
});

// Notification click handler — opens the URL from the notification
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;

  // Get the URL to open — priority: notification data > default homepage
  const urlToOpen = (e.notification.data && e.notification.data.url)
    ? e.notification.data.url
    : 'https://giveaways-homepage.vercel.app';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // If app is already open on that URL, focus it
      for (const client of list) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window with the correct URL
      return clients.openWindow(urlToOpen);
    })
  );
});
