import { getServerSideSitemap } from 'next-sitemap';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Initialiser le client Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Utiliser la clé de service pour l'accès serveur
    );

    // Récupérer tous les films avec leur slug
    const { data: films, error } = await supabase
      .from('films')
      .select('id, slug, title, date_ajout, release_date')
      .order('date_ajout', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des films pour le sitemap:', error);
      return getServerSideSitemap([]);
    }

    // URL de base du site
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';

    // MULTILINGUAL DISABLED - French only
    const filmEntries = films.map((film) => {
      // Utiliser le slug existant ou en créer un nouveau
      let slug = film.slug;
      
      // Si le film n'a pas de slug, en créer un à partir du titre
      if (!slug && film.title) {
        slug = film.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
          .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
          .replace(/--+/g, '-'); // Éviter les tirets multiples
      }
      
      // Utiliser l'ID comme fallback si pas de slug ni de titre
      if (!slug) {
        slug = film.id;
      }

      // Version française uniquement
      return {
        loc: `${baseUrl}/films/${encodeURIComponent(slug)}`,
        lastmod: new Date(film.date_ajout).toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      };
    });

    // MULTILINGUAL DISABLED - French pages only
    const mainPages = [
      {
        loc: `${baseUrl}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: `${baseUrl}/quel-film-regarder`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.9,
      },
      {
        loc: `${baseUrl}/top-rated`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${baseUrl}/films-inconnus`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${baseUrl}/all-films`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8,
      },
      {
        loc: `${baseUrl}/films-index`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${baseUrl}/huntedbymoviehunt`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${baseUrl}/idees-films-pour-ados`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.9,
      },
      {
        loc: `${baseUrl}/films-horreur-halloween-2025`,
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.8,
      },
      {
        loc: `${baseUrl}/comment-nous-travaillons`,
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.6,
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.5,
      },
      {
        loc: `${baseUrl}/advanced-search`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: `${baseUrl}/search`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
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
