// sw.js

// Name of the cache
const CACHE_NAME = 'my-cache-v1';

// List of assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/images/logo.png',
];

// Install event - caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('Assets cached successfully');
      })
      .catch((error) => {
        console.error('Error caching assets:', error);
      })
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Old caches deleted');
      })
      .catch((error) => {
        console.error('Error during cache cleanup:', error);
      })
  );
});

// Fetch event - serving cached assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return the cached response if found, otherwise fetch from network
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error('Error fetching resource:', error);
      })
  );
});
