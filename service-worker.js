// Define the cache name and URLs to cache
const CACHE_PREFIX = "my-app-cache-";
const CACHE_VERSION = "v1";
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
  css: ["/files/preloader.css", "/files/common.css"],
  images: [
    "/files/img/skill.png",
    "/files/img/skill-128.png",
    "/files/img/skill-192.png",
    "/files/img/skill-512.png",
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

// Install the service worker and cache the URLs
self.addEventListener("install", async (event) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachePromises = Object.values(urlsToCache)
      .flatMap((urls) => urls.map((url) => cache.add(url)));
    await Promise.all(cachePromises);
    await self.skipWaiting();
  } catch (error) {
    console.error("Failed to add URLs to cache:", error);
  }
});

// Activate the service worker and delete old caches
self.addEventListener("activate", async (event) => {
  try {
    const cacheNames = await caches.keys();
    const deletionPromises = cacheNames.map((cacheName) => {
      if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
        return caches.delete(cacheName);
      } else {
        return undefined;
      }
    });
    await Promise.all(deletionPromises.filter(Boolean));
  } catch (error) {
    console.error("Failed to delete old caches:", error);
  }
});

// Intercept network requests and respond with cached responses
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(async (response) => {
      if (response) {
        return response;
      }

      try {
        const response = await fetch(event.request);

        if (response.status === 404) {
          return caches.match("/files/404.html");
        }

        if (response.type === "basic" && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        console.error("Failed to fetch:", error);
        return caches.match("/files/offline.html");
      }
    })
  );
});
