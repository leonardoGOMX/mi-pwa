const CACHE_NAME = 'facturagi-cache-v1';
const URLS_TO_CACHE = [
  '/mi-pwa/',
  '/mi-pwa/index.html',
  '/mi-pwa/bootstrap/bootstrap-5.3.6-dist/css/bootstrap.min.css',
  '/mi-pwa/bootstrap/bootstrap-5.3.6-dist/js/bootstrap.bundle.min.js',
  '/mi-pwa/css/globaleStyle.css',
  '/mi-pwa/images/Facturagi.png',
  '/mi-pwa/icons/25231.png',
  '/mi-pwa/icons/Facturagi.png',
  '/mi-pwa/manifest.json'
];


// Instala el service worker y guarda archivos en caché
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

// Activa el service worker y limpia cachés viejas si existen
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

// Intercepta peticiones y sirve desde caché si no hay internet
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
