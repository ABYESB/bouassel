const cacheName = 'bouassel-v1.3'; // ارفع النسخة لـ 1.3 لضمان التغيير
const assets = [
  '/bouassel/',
  '/bouassel/index.html',
  '/bouassel/style.css',
  '/bouassel/script.js',
  '/bouassel/logo-512.png'
];

// 1. التثبيت وتحميل الملفات الجديدة
self.addEventListener('install', e => {
  self.skipWaiting(); // إجبار السيرفس وركر الجديد على التفعيل فوراً
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. تفعيل النسخة الجديدة وحذف القديمة تماماً
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // السيطرة على الصفحة فوراً بدون انتظار إعادة التشغيل
});

// 3. استراتيجية "الشبكة أولاً" للملفات الأساسية لضمان التحديث
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
