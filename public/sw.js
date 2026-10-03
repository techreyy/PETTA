/* PETTA Architecture Studio - Service Worker */
const CACHE_NAME = 'petta-static-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_RESOURCES = [
  OFFLINE_URL,
  '/petta-icon-only.png?v=3',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Precache failed:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 2. EXCLUSION GUARD: Never intercept or cache Payload CMS, Admin, API, or auth requests
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/health') ||
    url.pathname.startsWith('/_payload')
  ) {
    return;
  }

  // 3. Page navigations (HTML documents): Network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          const cachedPage = await cache.match(request);
          if (cachedPage) {
            return cachedPage;
          }
          const offlineFallback = await cache.match(OFFLINE_URL);
          if (offlineFallback) {
            return offlineFallback;
          }
        } catch {
          // ignore cache open error
        }
        return new Response(
          '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Koneksi Terputus | PETTA</title></head><body style="background:#14191E;color:#F9F8F6;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><div style="text-align:center;"><h2>Koneksi terputus</h2><p style="color:#6A9D94;">Menunggu jaringan kembali…</p></div></body></html>',
          {
            status: 503,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          }
        );
      })
    );
    return;
  }

  // 4. Same-origin static assets: Cache-first / Stale-while-revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/static/') ||
      url.pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|svg|webp|ico)$/))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === 'basic'
            ) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
