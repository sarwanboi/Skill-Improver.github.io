const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/preloader.css",
  "/img/skill.png",
  "/img/6139.jpg",
  "/files/v1.2.html",
  "/files/v1.2.6.8.html",
  "/files/v1.6.html",
  "/files/v1.8.html",
  "/screenshots/1.png",
  "/screenshots/2.png",
  "/screenshots/3.png",
  "/screenshots/4.png",
  "/screenshots/5.png",
  "/screenshots/6.png",
  "https://mdbcdn.b-cdn.net/img/new/slides/003.webp",
  "/404.html",
  "/offline.html",
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
            return caches.match("/404.html");
          }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match("/offline.html");
        });
    })
  );
});
