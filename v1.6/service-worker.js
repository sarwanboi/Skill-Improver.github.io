const CACHE_PREFIX = "my-app-cache-";
const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

const urlsToCache = {
  html: [
    "/",
    "/index.html",
    "/files/v1.2.html",
    "/files/v1.6.html",
    "/files/v1.8.html",
    "/files/v2.0.0.6.html",
    "/files/v2.0.0.8.html",
    "/files/404.html",
    "/files/offline.html",
  ],
  css: [
    "/files/preloader.css",
    "/files/common.css",
  ],
  images: [
    "/files/img/skill.png",
    "/files/img/skill-128.png",
    "/files/img/skill-192.png",
    "/files/img/skill-512.png",
    "/img/skill.ico",
    "/files/screenshots/1.png",
    "/files/screenshots/2.png",
    "/files/screenshots/3.png",
    "/files/screenshots/4.png",
    "/files/screenshots/5.png",
    "/files/screenshots/6.png",
    "/files/screenshots/7.png",
    "/files/screenshots/8.png",
    "https://mdbcdn.b-cdn.net/img/new/slides/003.webp",
  ],
};

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        const cachePromises = Object.keys(urlsToCache).map(key => {
          const urls = urlsToCache[key];
          return cache.addAll(urls);
        });
        return Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error("Failed to add URLs to cache:", error);
      })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then(response => {
          if (response.status === 404) {
            return caches.match("/files/404.html");
          }
          if (response.type === "basic" && response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match("/files/offline.html");
        });
    })
  );
});
