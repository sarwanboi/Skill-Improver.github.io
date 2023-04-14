const cacheName = 'my-app-cache';
const filesToCache = [
  '/',
  '/index.html',
  '/preloader.css',
  'service-worker.js',
  'img/skill.png',
  'img/6139.jpg',
  'files/v1.2.html',
  'files/v1.2.6.8.html',
  'files/v1.6.html',
  'files/v1.8.html',
  'screenshots/1',
  'screenshots/2',
  'screenshots/3',
  'screenshots/4',
  'screenshots/5',
  'screenshots/6'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});
