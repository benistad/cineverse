'use server';

import { getFilmBySlug } from '@/lib/supabase/server';

/**
 * Génère les métadonnées pour une page de film spécifique
 * Cette fonction est appelée par Next.js lors du rendu de la page
 */
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    // Récupérer les données du film depuis Supabase
    const film = await getFilmBySlug(slug);
    
    if (!film) {
      return {
        title: 'Film non trouvé | MovieHunt',
        description: 'Le film que vous recherchez n\'a pas été trouvé sur MovieHunt.',
      };
    }
    
    // Extraire l'année de sortie si disponible
    const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
    
    // Construire la description en fonction des données disponibles
    let description = `${film.title}`;
    if (releaseYear) description += ` (${releaseYear})`;
    if (film.note_sur_10) description += ` - Note: ${film.note_sur_10}/10`;
    if (film.synopsis) {
      // Limiter la longueur du synopsis pour la description
      const shortSynopsis = film.synopsis.length > 150 
        ? film.synopsis.substring(0, 147) + '...' 
        : film.synopsis;
      description += `. ${shortSynopsis}`;
    }
    
    // URL canonique pour cette page de film
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
    const canonicalUrl = `${baseUrl}/films/${slug}`;
    
    // Construire l'URL de l'image pour Open Graph
    const ogImage = film.poster_path 
      ? `${baseUrl}/api/og?title=${encodeURIComponent(film.title)}&image=${encodeURIComponent(film.poster_path)}`
      : `${baseUrl}/images/og-image.jpg`;
    
    return {
      title: `${film.title}${releaseYear ? ` (${releaseYear})` : ''} | MovieHunt`,
      description,
      openGraph: {
        title: `${film.title}${releaseYear ? ` (${releaseYear})` : ''} | MovieHunt`,
        description,
        url: canonicalUrl,
        siteName: 'MovieHunt',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: film.title,
          },
        ],
        locale: 'fr_FR',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${film.title}${releaseYear ? ` (${releaseYear})` : ''} | MovieHunt`,
        description,
        images: [ogImage],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées:', error);
    
    // Métadonnées par défaut en cas d'erreur
    return {
      title: 'MovieHunt | Découvrez des films exceptionnels',
      description: 'MovieHunt est le site pour savoir quel film regarder et découvrir des perles rares.',
    };
  }
}
