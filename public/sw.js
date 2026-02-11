/// <reference lib="webworker" />

const CACHE_VERSION = `timeprojects-v${Date.now()}`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css'
];

const sw = self;

// Install event - cache static assets
sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Some assets might not be available during install
        return Promise.resolve();
      });
    })
  );
  // Skip waiting to activate immediately
  sw.skipWaiting();
});

// Activate event - clean up old caches
sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith(CACHE_VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of clients immediately
  sw.clients.claim();
});

// Fetch event - network first with cache fallback
sw.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle http/https requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network first for API requests
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    // Cache first for static assets
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          if (response.ok && request.method === 'GET') {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        }).catch(() => {
          // Return offline page if both cache and network fail
          return caches.match('/index.html');
        });
      })
    );
  }
});

