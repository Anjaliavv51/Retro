const CACHE_NAME = 'retro-vintage-cache-v2026.10.22';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/html/about.html',
  '/html/menu.html',
  '/html/contact.html',
  '/html/services.html',
  '/html/blog.html',
  '/html/reviews.html',
  '/html/cart.html',
  '/html/museums.html',
  '/html/login.html',
  '/html/signup.html',
  '/html/wishlist.html',
  '/html/feedback.html',
  '/html/contributor.html',
  '/html/booknow.html',
  '/html/Electronic.html',
  '/html/Coverpage.html',
  '/html/db-agent.html',
  '/manifest.json',
  '/css/style.css',
  '/js/script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
