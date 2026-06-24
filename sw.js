/* Arithmetic Trainer service worker — offline support.
   Strategy: stale-while-revalidate. Serves the cached page instantly,
   refreshes it from the network in the background when online.
   Bump CACHE (v1 -> v2 ...) whenever you want clients to force-refresh. */

const CACHE = 'trainer-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });

    const network = fetch(req).then(res => {
      if (res && res.ok && (res.type === 'basic' || res.type === 'default')) {
        cache.put(req, res.clone());
      }
      return res;
    }).catch(() => null);

    // Cached first (instant + offline), otherwise wait for network.
    return cached || (await network) || cached;
  })());
});
