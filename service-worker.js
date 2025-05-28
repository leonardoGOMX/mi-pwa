const CACHE_NAME = 'facturagi-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './bootstrap/bootstrap-5.3.6-dist/css/bootstrap.min.css',
  './bootstrap/bootstrap-5.3.6-dist/js/bootstrap.bundle.min.js',
  './css/globaleStyle.css',
  './images/Facturagi.png',
  './icons/25231.png',
  './icons/Facturagi.png',
  './manifest.json'
];



self.addEventListener('install', function (event) {
  console.log('[Service Worker] Instalando y cacheando archivos...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});


self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activado');
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});


self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        return response || fetch(event.request);
      }).catch(() => {
        return caches.match('./index.html');
      })
  );
});
