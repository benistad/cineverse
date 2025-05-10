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
};

module.exports = nextConfig;
