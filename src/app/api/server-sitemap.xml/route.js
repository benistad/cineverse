import { getServerSideSitemap } from 'next-sitemap';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Initialiser le client Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Utiliser la clé de service pour l'accès serveur
    );

    // Récupérer tous les films
    const { data: films, error } = await supabase
      .from('films')
      .select('id, title, date_ajout, release_date')
      .order('date_ajout', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des films pour le sitemap:', error);
      return getServerSideSitemap([]);
    }

    // URL de base du site
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';

    // Créer les entrées du sitemap pour chaque film
    const filmEntries = films.map((film) => {
      // Créer une URL conviviale pour les moteurs de recherche
      const slug = film.title
        ? encodeURIComponent(
            film.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
              .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
              .replace(/--+/g, '-') // Éviter les tirets multiples
          )
        : '';

      // Année de sortie pour l'URL
      const releaseYear = film.release_date 
        ? new Date(film.release_date).getFullYear() 
        : '';

      return {
        loc: `${baseUrl}/films/${film.id}/${slug}${releaseYear ? `-${releaseYear}` : ''}`,
        lastmod: new Date(film.date_ajout).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      };
    });

    // Ajouter les pages principales
    const mainPages = [
      {
        loc: `${baseUrl}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: `${baseUrl}/top-rated`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${baseUrl}/hidden-gems`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${baseUrl}/advanced-search`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      },
    ];

    // Combiner toutes les entrées
    const allEntries = [...mainPages, ...filmEntries];

    // Générer le sitemap
    return getServerSideSitemap(allEntries);
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    return getServerSideSitemap([]);
  }
}
