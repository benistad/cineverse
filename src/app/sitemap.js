import { getAllFilmsForSitemap } from '@/lib/supabase/server';

/**
 * Génère un sitemap dynamique pour le site
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  // URL de base du site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  
  // Pages statiques
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/huntedbymoviehunt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
  
  try {
    // Récupérer tous les films pour générer leurs URLs
    const films = await getAllFilmsForSitemap();
    
    // Générer les URLs pour chaque film en utilisant prioritairement les slugs
    const filmPages = films.map((film) => {
      // S'assurer que chaque film a un slug valide
      const slug = film.slug || (film.title ? film.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-') : film.id);
      
      return {
        url: `${baseUrl}/films/${slug}`,
        lastModified: new Date(film.date_ajout),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });
    
    // Combiner les pages statiques et les pages de films
    return [...staticPages, ...filmPages];
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    return staticPages;
  }
}
