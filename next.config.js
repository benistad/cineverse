/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ne pas utiliser 'output: export' pour permettre le rendu côté serveur
  
  // Activer la compression (gzip/brotli)
  compress: true,
  
  images: {
    domains: ['image.tmdb.org', 'via.placeholder.com'],
    // Définir un cache plus long pour réduire les transformations et les écritures en cache
    minimumCacheTTL: 2678400, // 31 jours en secondes
    // Limiter les formats d'image pour réduire les transformations
    formats: ['image/webp'],
    // Configurer les tailles d'écran et d'image pour correspondre à l'audience
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Désactiver la génération de placeholder pour améliorer le LCP
    dangerouslyAllowSVG: false,
    // Qualité optimisée pour le LCP (85% au lieu de 80% pour les images priority)
    // La qualité par défaut reste à 80% pour les autres images
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
        // En-têtes pour les fichiers JavaScript et CSS Next.js
        source: '/_next/static/:path*',
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
  
  // Redirections permanentes pour améliorer l'indexation et résoudre les problèmes de redirection
  async redirects() {
    return [
      // Rediriger les anciennes URLs de film vers le nouveau format
      {
        source: '/film/:id',
        destination: '/films/:id',
        permanent: true, // Redirection 301 pour préserver le SEO
      },
      // Rediriger les anciennes URLs de recherche
      {
        source: '/recherche',
        destination: '/search',
        permanent: true,
      },
      // Rediriger les anciennes URLs de catégories
      {
        source: '/categorie/:category',
        destination: '/search?category=:category',
        permanent: true,
      },
      // Redirections des anciens slugs avec accents mal gérés (correction 2025)
      { source: '/films/-contresens-londres', destination: '/films/a-contre-sens-londres', permanent: true },
      { source: '/films/-couteaux-tirs', destination: '/films/a-couteaux-tires', permanent: true },
      { source: '/films/-louest-rien-de-nouveau', destination: '/films/a-louest-rien-de-nouveau', permanent: true },
      { source: '/films/avalonia-ltrange-voyage', destination: '/films/avalonia-letrange-voyage', permanent: true },
      { source: '/films/downton-abbey-ii-une-nouvelle-re', destination: '/films/downton-abbey-ii-une-nouvelle-ere', permanent: true },
      { source: '/films/glass-onion-une-histoire-couteaux-tirs', destination: '/films/glass-onion-une-histoire-a-couteaux-tires', permanent: true },
      { source: '/films/indiana-jones-et-le-cadran-de-la-destine', destination: '/films/indiana-jones-et-le-cadran-de-la-destinee', permanent: true },
      { source: '/films/jur-n2', destination: '/films/jure-n2', permanent: true },
      { source: '/films/jusquau-bout-du-rve', destination: '/films/jusquau-bout-du-reve', permanent: true },
      { source: '/films/le-got-de-la-haine', destination: '/films/le-gout-de-la-haine', permanent: true },
      { source: '/films/le-manoir-hant', destination: '/films/le-manoir-hante', permanent: true },
      { source: '/films/le-monde-aprs-nous', destination: '/films/le-monde-apres-nous', permanent: true },
      { source: '/films/le-secret-de-khops', destination: '/films/le-secret-de-kheops', permanent: true },
      { source: '/films/le-secret-de-la-cit-perdue', destination: '/films/le-secret-de-la-cite-perdue', permanent: true },
      { source: '/films/ltau-de-munich', destination: '/films/letau-de-munich', permanent: true },
      { source: '/films/lun-des-ntres', destination: '/films/lun-des-notres', permanent: true },
      { source: '/films/mad-max-2-le-dfi', destination: '/films/mad-max-2-le-defi', permanent: true },
      { source: '/films/mad-max-au-del-du-dme-du-tonnerre', destination: '/films/mad-max-au-dela-du-dome-du-tonnerre', permanent: true },
      { source: '/films/mystre-venise', destination: '/films/mystere-a-venise', permanent: true },
      { source: '/films/pre-stu-un-hros-pas-comme-les-autres', destination: '/films/pere-stu-un-heros-pas-comme-les-autres', permanent: true },
      { source: '/films/wish-asha-et-la-bonne-toile', destination: '/films/wish-asha-et-la-bonne-etoile', permanent: true },
    ];
  },
};

module.exports = nextConfig;
