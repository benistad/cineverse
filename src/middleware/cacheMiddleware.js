import { NextResponse } from 'next/server';

// Liste des routes à mettre en cache avec leur durée de validité en secondes
const CACHEABLE_ROUTES = {
  // Routes dynamiques avec cache de courte durée
  '/api/films': 300, // 5 minutes
  '/api/genres': 3600, // 1 heure
  '/api/providers': 3600, // 1 heure
  
  // Routes statiques avec cache de longue durée
  '/': 1800, // 30 minutes
  '/films': 1800, // 30 minutes
};

// Liste des extensions de fichiers statiques à mettre en cache
const STATIC_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif',
  'css', 'js',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
];

// Fonction pour déterminer si une requête est mise en cache par défaut par le CDN
function isCacheableByDefault(request) {
  const url = new URL(request.url);
  const extension = url.pathname.split('.').pop().toLowerCase();
  
  return STATIC_EXTENSIONS.includes(extension);
}

// Fonction pour déterminer si une route est cacheable et sa durée de validité
function getCacheConfig(pathname) {
  // Vérifier les correspondances exactes
  if (CACHEABLE_ROUTES[pathname]) {
    return { cacheable: true, maxAge: CACHEABLE_ROUTES[pathname] };
  }
  
  // Vérifier les routes dynamiques avec paramètres
  if (pathname.startsWith('/films/')) {
    return { cacheable: true, maxAge: 3600 }; // 1 heure pour les pages de détail de films
  }
  
  if (pathname.startsWith('/api/')) {
    return { cacheable: true, maxAge: 60 }; // 1 minute par défaut pour les API
  }
  
  return { cacheable: false };
}

// Middleware principal de cache
export async function cacheMiddleware(request) {
  // Ne pas mettre en cache les requêtes non GET
  if (request.method !== 'GET') {
    return NextResponse.next();
  }
  
  const url = new URL(request.url);
  
  // Ne pas mettre en cache les routes d'administration
  if (url.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Vérifier si la requête est pour un fichier statique déjà mis en cache par défaut
  if (isCacheableByDefault(request)) {
    // Laisser le CDN gérer le cache pour les fichiers statiques
    return NextResponse.next();
  }
  
  // Déterminer si la route est cacheable et sa durée de validité
  const { cacheable, maxAge } = getCacheConfig(url.pathname);
  
  if (!cacheable) {
    return NextResponse.next();
  }
  
  // Créer une réponse avec les en-têtes de cache appropriés
  const response = NextResponse.next();
  
  // Ajouter les en-têtes de cache
  response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge * 2}, stale-while-revalidate=${maxAge * 10}`);
  response.headers.set('Vary', 'Accept-Encoding, Accept, X-User-Agent');
  
  // Ajouter un en-tête personnalisé pour le débogage
  response.headers.set('X-Cache-Status', 'MISS');
  
  return response;
}
