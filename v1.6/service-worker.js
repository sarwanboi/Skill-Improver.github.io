const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/preloader.css',
  '/img/skill.png',
  '/img/6139.jpg',
  '/files/v1.2.html',
  '/files/v1.2.6.8.html',
  '/files/v1.6.html',
  '/files/v1.8.html',
  '/screenshots/1',
  '/screenshots/2',
  '/screenshots/3',
  '/screenshots/4',
  '/screenshots/5',
  '/screenshots/6',
  'https://mdbcdn.b-cdn.net/img/new/slides/003.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
