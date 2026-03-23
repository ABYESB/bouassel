const cacheName = 'bouassel-v1';
const assets = [
  '/bouassel/',
  '/bouassel/index.html',
  '/bouassel/style.css',
  '/bouassel/script.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
