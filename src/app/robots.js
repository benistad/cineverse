/**
 * Génère un fichier robots.txt dynamique
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
