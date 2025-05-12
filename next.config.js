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
  // Configuration des en-têtes HTTP pour améliorer la mise en cache
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
    ];
  },
};

module.exports = nextConfig;
