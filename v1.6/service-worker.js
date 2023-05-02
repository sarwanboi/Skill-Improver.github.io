const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "files/preloader.css",
  "files/common.css",
  "files/img/skill.png",
  "files/img/6139.jpg",
  "files/img/skill-128.png",
  "files/img/skill-192.png",
  "files/img/skill-512.png",
  "/files/v1.2.html",
  "/files/v1.2.6.8.html",
  "/files/v1.6.html",
  "/files/v1.8.html",
  "/files/v2.0.html",
  "/files/v2.2.html",
  "/files/v2.0.0.4.html",
  "files/screenshots/1.png",
  "files/screenshots/2.png",
  "files/screenshots/3.png",
  "files/screenshots/4.png",
  "files/screenshots/5.png",
  "files/screenshots/6.png",
  "files/screenshots/7.png",
  "files/screenshots/8.png",
  "https://mdbcdn.b-cdn.net/img/new/slides/003.webp",
  "files/404.html",
  "files/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("Failed to add URLs to cache:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((response) => {
          if (response.status === 404) {
            return caches.match("/files/404.html");
          }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match("/files/offline.html");
        });
    })
  );
});
