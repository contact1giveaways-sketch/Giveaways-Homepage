// ============================================================
//  Giveaways Community — Service Worker
// ============================================================
const CACHE = 'giveaways-v1';
const STATIC = [
  '/',
  '/index.html',
  '/bg.png',
  '/og-image.png',
  '/icon-192.png',
  '/icon-512.png',
];

// Install — cache static assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', e => {
  // Skip Google Apps Script requests — always need network
  if (e.request.url.includes('script.google.com')) return;
  if (e.request.url.includes('googletagmanager')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful GET responses
        if (e.request.method === 'GET' && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
