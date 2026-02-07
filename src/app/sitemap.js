import { getAllFilmsForSitemap } from '@/lib/supabase/server';
import { generateFilmSlug } from '@/lib/utils/slugify';

/**
 * Génère un sitemap dynamique pour le site
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  // URL de base du site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  
  // Genres pour le SEO programmatique
  const genres = [
    'action', 'aventure', 'animation', 'comedie', 'crime', 'documentaire',
    'drame', 'famille', 'fantastique', 'histoire', 'horreur', 'musique',
    'mystere', 'romance', 'science-fiction', 'thriller', 'guerre', 'western'
  ];
  
  // Années récentes pour le SEO programmatique
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Pages par note
  const ratings = ['notes-9-10', 'notes-8-10', 'notes-7-10', 'coups-de-coeur'];

  // Pages genre + année (combinées)
  const genreYearCombos = [];
  const mainGenres = ['action', 'comedie', 'drame', 'horreur', 'thriller', 'science-fiction'];
  const recentYears = [2025, 2024, 2023, 2022, 2021, 2020];
  mainGenres.forEach(g => recentYears.forEach(y => genreYearCombos.push(`${g}-${y}`)));

  // Pages ambiances/moods
  const moods = ['soiree-couple', 'feel-good', 'frissons', 'action-intense', 'reflexion', 'rire', 'famille', 'suspense'];

  // Pages Top X
  const tops = ['10-films-action', '10-films-comedie', '10-films-horreur', '10-films-thriller', 
    '10-films-drame', '10-films-science-fiction', '20-meilleurs-films', '50-meilleurs-films',
    '10-films-animation', '10-films-romance'];

  // Pages statiques - MULTILINGUAL DISABLED (English pages commented out)
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Pages de genres
    {
      url: `${baseUrl}/genres`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...genres.map(genre => ({
      url: `${baseUrl}/genre/${genre}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    // Pages par année
    {
      url: `${baseUrl}/annees`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...years.map(year => ({
      url: `${baseUrl}/annee/${year}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    // Pages par note
    {
      url: `${baseUrl}/meilleurs-films/notes-9-10`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...ratings.map(rating => ({
      url: `${baseUrl}/meilleurs-films/${rating}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    // Pages genre + année combinées
    ...genreYearCombos.map(combo => ({
      url: `${baseUrl}/films-genre-annee/${combo}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
    // Pages ambiances
    {
      url: `${baseUrl}/ambiances`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...moods.map(mood => ({
      url: `${baseUrl}/ambiance/${mood}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
    // Pages classements/Top
    {
      url: `${baseUrl}/classements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...tops.map(top => ({
      url: `${baseUrl}/top/${top}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    // Pages réalisateurs et acteurs
    {
      url: `${baseUrl}/realisateurs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/acteurs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // {
    //   url: `${baseUrl}/en`,
    //   lastModified: new Date(),
    //   changeFrequency: 'daily',
    //   priority: 1.0,
    // },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/advanced-search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // {
    //   url: `${baseUrl}/en/advanced-search`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.7,
    // },
    {
      url: `${baseUrl}/all-films`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/huntedbymoviehunt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/films-index`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quel-film-regarder`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    // {
    //   url: `${baseUrl}/en/what-movie-to-watch`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.9,
    // },
    {
      url: `${baseUrl}/films-horreur-halloween-2025`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    // {
    //   url: `${baseUrl}/en/halloween-horror-movies-2025`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.9,
    // },
    {
      url: `${baseUrl}/idees-films-pour-ados`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // {
    //   url: `${baseUrl}/en/teen-movie-ideas`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.9,
    // },
    // {
    //   url: `${baseUrl}/en/hidden-gems`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/en/contact`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.6,
    // },
    // {
    //   url: `${baseUrl}/en/top-rated`,
    //   lastModified: new Date(),
    //   changeFrequency: 'daily',
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/en/all-films`,
    //   lastModified: new Date(),
    //   changeFrequency: 'daily',
    //   priority: 0.9,
    // },
    // {
    //   url: `${baseUrl}/en/huntedbymoviehunt`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/en/how-we-work`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/en/what-movie-to-watch`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.9,
    // },
    {
      url: `${baseUrl}/top-rated`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/films-inconnus`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/comment-nous-travaillons`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-de-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
  
  try {
    // Récupérer tous les films pour générer leurs URLs
    const films = await getAllFilmsForSitemap();
    
    // Générer les URLs pour chaque film - MULTILINGUAL DISABLED (French only)
    const filmPages = films.map((film) => {
      // Générer un slug normalisé (sans accents)
      const slug = generateFilmSlug(film);
      
      // Version française uniquement
      return {
        url: `${baseUrl}/films/${slug}`,
        lastModified: new Date(film.date_ajout),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
      
      // Version anglaise désactivée
      // {
      //   url: `${baseUrl}/en/films/${slug}`,
      //   lastModified: new Date(film.date_ajout),
      //   changeFrequency: 'weekly',
      //   priority: 0.7,
      // }
    });
    
    // Combiner les pages statiques et les pages de films
    return [...staticPages, ...filmPages];
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    return staticPages;
  }
}
