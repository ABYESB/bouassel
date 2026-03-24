const cacheName = 'bouassel-v1';
const assets = [
  '/bouassel/',
  '/bouassel/index.html',
  '/bouassel/style.css',
  '/bouassel/script.js',
  '/bouassel/logo-512.png' // تم الإبقاء فقط على الملف الموجود فعلياً
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
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
