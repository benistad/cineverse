// Service Worker pour MovieHunt
// Améliore les performances et permet l'expérience hors ligne

const CACHE_NAME = 'moviehunt-cache-v1';

// Ressources à mettre en cache immédiatement lors de l'installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/images/og-image.jpg',
  '/images/logo.png',
];

// Ressources à mettre en cache lors de leur première utilisation
const RUNTIME_CACHE_PATTERNS = [
  /\.(js|css)$/,  // Fichiers JavaScript et CSS
  /\.(png|jpg|jpeg|svg|gif|webp)$/,  // Images
  /\.(woff|woff2|ttf|otf|eot)$/,  // Polices
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des ressources statiques');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  // Nettoyer les anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activé et contrôle la page');
      return self.clients.claim();
    })
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes API ou d'authentification
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/auth/') ||
      event.request.url.includes('/admin/')) {
    return;
  }
  
  // Stratégie Cache First pour les ressources statiques
  const isStaticAsset = RUNTIME_CACHE_PATTERNS.some(pattern => 
    pattern.test(event.request.url)
  );
  
  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Retourner la réponse du cache
            return cachedResponse;
          }
          
          // Si pas en cache, récupérer depuis le réseau et mettre en cache
          return fetch(event.request)
            .then((response) => {
              // Vérifier que la réponse est valide
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Mettre en cache une copie de la réponse
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            });
        })
    );
  } else {
    // Stratégie Network First pour les autres ressources
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Vérifier que la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Mettre en cache une copie de la réponse
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // En cas d'échec, essayer de récupérer depuis le cache
          return caches.match(event.request);
        })
    );
  }
});

// Gestion des messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
