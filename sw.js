'use strict';
const VERSION = 'gsa-v2';
const ASSETS = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const tag = r => r && (r.headers.get('etag') || r.headers.get('last-modified'));

async function notify() {
  const all = await self.clients.matchAll({ type: 'window' });
  all.forEach(c => c.postMessage({ type: 'updated' }));
}

// Network-first: selalu ambil versi terbaru dari GitHub Pages saat online, cache hanya untuk offline.
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // Hanya file milik sendiri. Permintaan ke pihak lain (cek kebocoran sandi) tidak pernah disentuh atau disimpan.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req);
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res.ok) {
        const changed = hit && tag(hit) && tag(res) && tag(hit) !== tag(res);
        await cache.put(req, res.clone());
        if (changed) notify();
      }
      return res;
    } catch (_) {
      if (hit) return hit;
      if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
      return Response.error();
    }
  })());
});
