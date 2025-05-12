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
  },
  // Ajouter des règles de transpilation pour les modules qui utilisent ESM
  transpilePackages: ['react-youtube'],
  // Optimisations pour la performance mobile
  reactStrictMode: true, // Activer le mode strict de React pour de meilleures performances
  // Configuration simplifiée des en-têtes HTTP pour améliorer les performances
  async headers() {
    return [
      {
        // En-têtes de cache pour les ressources statiques
        source: '/:path*.(jpg|jpeg|png|webp|svg|gif|ico|css|js|woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // En-têtes de sécurité de base pour toutes les routes
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
        ],
      },
    ];
  },
};

module.exports = nextConfig;
