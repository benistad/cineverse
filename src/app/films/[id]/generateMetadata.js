import { getFilmById } from '@/lib/supabase/films';

/**
 * Génère les métadonnées dynamiques pour une page de film
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({ params }) {
  try {
    // Récupérer les données du film
    const film = await getFilmById(params.id);
    
    if (!film) {
      return {
        title: 'Film non trouvé | MovieHunt',
        description: 'Le film que vous recherchez n\'existe pas ou a été supprimé.',
      };
    }
    
    // Préparer les métadonnées
    const filmTitle = film.title || 'Film';
    const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
    const pageTitle = `${filmTitle}${releaseYear ? ` (${releaseYear})` : ''} - Note: ${film.note_sur_10}/10 | MovieHunt`;
    
    const description = film.synopsis 
      ? `${film.synopsis.substring(0, 150)}${film.synopsis.length > 150 ? '...' : ''}` 
      : `Découvrez le film ${filmTitle} noté ${film.note_sur_10}/10 sur MovieHunt`;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app';
    
    return {
      title: pageTitle,
      description: description,
      openGraph: {
        title: pageTitle,
        description: description,
        url: `${baseUrl}/films/${film.id}`,
        siteName: 'MovieHunt',
        images: [
          {
            url: film.poster_url,
            width: 800,
            height: 1200,
            alt: `Affiche du film ${filmTitle}`,
          },
        ],
        locale: 'fr_FR',
        type: 'video.movie',
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: description,
        images: [film.poster_url],
      },
      alternates: {
        canonical: `${baseUrl}/films/${film.id}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      // Ajouter des métadonnées structurées (Schema.org)
      other: {
        'application-name': 'MovieHunt',
        'og:image:alt': `Affiche du film ${filmTitle}`,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées:', error);
    return {
      title: 'Erreur | MovieHunt',
      description: 'Une erreur est survenue lors du chargement de ce film.',
    };
  }
}
