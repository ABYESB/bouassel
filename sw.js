const cacheName = 'bouassel-v1';
const assets = [
  '/bouassel/',
  '/bouassel/index.html',
  '/bouassel/style.css',
  '/bouassel/script.js',
  '/bouassel/logo-300.png',
  '/bouassel/logo-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      // استخدام cache.addAll لتحميل كافة الملفات الأساسية
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      // إرجاع الملف من الذاكرة التخزينية أو جلبه من الشبكة
      return res || fetch(e.request);
    })
  );
});
