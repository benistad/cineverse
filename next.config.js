/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ne pas utiliser 'output: export' pour permettre le rendu côté serveur
  images: {
    domains: ['image.tmdb.org', 'via.placeholder.com'],
  },
  // Ajouter des règles de transpilation pour les modules qui utilisent ESM
  transpilePackages: ['react-youtube'],
};

module.exports = nextConfig;
