/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ne pas utiliser 'output: export' pour permettre le rendu côté serveur
  images: {
    domains: ['image.tmdb.org', 'via.placeholder.com'],
    // Définir un cache plus long pour réduire les transformations et les écritures en cache
    minimumCacheTTL: 2678400, // 31 jours en secondes
    // Limiter les formats d'image pour réduire les transformations
    formats: ['image/webp'],
    // Configurer les tailles d'écran et d'image pour correspondre à l'audience
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Définir la qualité des images pour un bon équilibre entre performance et qualité
    quality: 80,
  },
  // Ajouter des règles de transpilation pour les modules qui utilisent ESM
  transpilePackages: ['react-youtube'],
  // Optimisations pour la performance mobile
  swcMinify: true, // Utiliser SWC pour la minification (plus rapide que Terser)
  reactStrictMode: true, // Activer le mode strict de React pour de meilleures performances
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Optimisations expérimentales pour améliorer les performances
    optimizeCss: true, // Optimiser le CSS
    scrollRestoration: true, // Restaurer la position de défilement lors de la navigation
  },
  // Configuration des en-têtes HTTP pour améliorer la mise en cache et les performances mobiles
  async headers() {
    return [
      {
        // Appliquer ces en-têtes à tous les fichiers statiques
        source: '/:path*.(jpg|jpeg|png|webp|svg|gif|ico|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // En-têtes pour améliorer la sécurité et les performances
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
