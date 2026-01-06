/**
 * Génère un fichier robots.txt dynamique optimisé pour l'indexation Google
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/debug-dates/', '/test-carousel/'],
      },
      {
        // Optimisation pour Googlebot
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/debug-dates/', '/test-carousel/'],
      },
      {
        // Optimisation pour Googlebot Mobile
        userAgent: 'Googlebot-Mobile',
        allow: '/',
        disallow: ['/admin/', '/api/', '/debug-dates/', '/test-carousel/'],
      },
      {
        // Autoriser les images et vidéos pour les rich snippets
        userAgent: ['Googlebot-Image', 'Googlebot-Video'],
        allow: '/',
      },
    ],
    // Un seul sitemap - le principal généré par Next.js
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
