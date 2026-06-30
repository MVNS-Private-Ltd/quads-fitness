const CACHE_NAME = 'quads-fitness-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
  '/member/attendance/mark',
];

// ─── Install: cache static shell ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  // Don't skipWaiting automatically — wait for user to approve update
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// ─── Activate: remove old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ─── Message: handle skipWaiting from app ───────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─── Fetch: network-first for API / auth, cache-first for assets ────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never intercept non-GET requests or API calls
  if (event.request.method !== 'GET') return;
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/')
  ) return;

  // For navigation requests (page loads) — Network first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For static assets — Cache first, then network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
