/**
 * Génère un fichier robots.txt dynamique optimisé pour le référencement mobile
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/api/server-sitemap.xml'], // Autoriser le sitemap dynamique
        disallow: ['/admin/', '/api/', '/debug-dates/', '/test-carousel'],
      },
      {
        // Règles spécifiques pour Googlebot-Mobile pour optimiser le référencement mobile
        userAgent: 'Googlebot-Mobile',
        allow: '/',
        crawlDelay: 1, // Temps d'attente entre les requêtes pour ne pas surcharger le serveur
      },
      {
        // Règles pour les autres robots mobiles
        userAgent: ['Googlebot-Image', 'Googlebot-Video'],
        allow: '/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/api/server-sitemap.xml`, // Sitemap dynamique avec tous les films
    ],
    host: baseUrl,
  };
}
