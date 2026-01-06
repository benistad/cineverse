import { getFilmBySlug } from '@/lib/supabase/server';

/**
 * Génère les métadonnées pour une page de film en anglais
 * Cette fonction est appelée par Next.js lors du rendu de la page
 * Optimisée pour le SEO avec des métadonnées riches et structurées
 */
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    // Récupérer les données du film depuis Supabase
    const film = await getFilmBySlug(slug);
    
    if (!film) {
      return {
        title: 'Film not found | MovieHunt',
        description: 'The film you are looking for was not found on MovieHunt.',
        robots: {
          index: false,
          follow: true,
        }
      };
    }
    
    // Extraire l'année de sortie si disponible
    const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
    
    // Extraire les genres pour les mots-clés
    const genres = film.genres ? film.genres.split(',').map(g => g.trim()) : [];
    
    // Construire la description SEO optimisée
    let description = `${film.title}`;
    if (releaseYear) description += ` (${releaseYear})`;
    if (film.note_sur_10) description += ` - Rating: ${film.note_sur_10}/10 on MovieHunt`;
    if (film.synopsis) {
      // Limiter la longueur du synopsis pour la description (entre 150-160 caractères idéalement)
      const shortSynopsis = film.synopsis.length > 150 
        ? film.synopsis.substring(0, 147) + '...' 
        : film.synopsis;
      description += `. ${shortSynopsis}`;
    }
    
    // Générer des mots-clés pertinents basés sur les données du film
    const keywords = [
      film.title,
      'movie',
      'film',
      'review',
      'rating',
      'cinema',
      ...genres
    ];
    
    // Ajouter l'année et les acteurs/réalisateurs aux mots-clés si disponibles
    if (releaseYear) keywords.push(releaseYear.toString());
    if (film.remarkable_staff && Array.isArray(film.remarkable_staff)) {
      film.remarkable_staff.forEach(person => {
        if (person.name) keywords.push(person.name);
      });
    }
    
    // URL canonique pour cette page de film
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
    const canonicalUrl = `${baseUrl}/en/films/${slug}`;
    
    // Ajouter des balises robots spécifiques pour améliorer l'indexation
    const robotsConfig = {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      'googlebot-mobile': {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    };
    
    // Construire l'URL de l'image pour Open Graph et Twitter
    const posterUrl = film.poster_url || (film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : null);
    const ogImage = posterUrl
      ? posterUrl
      : `${baseUrl}/images/og-image.jpg`;
    
    // Titre optimisé pour le SEO
    const seoTitle = `${film.title}${releaseYear ? ` (${releaseYear})` : ''} - Review and Rating ${film.note_sur_10}/10 | MovieHunt`;
    
    // Construire les données Open Graph pour les réseaux sociaux
    const openGraphData = {
      title: seoTitle,
      description,
      url: canonicalUrl,
      siteName: 'MovieHunt',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 500,
          height: 750,
          alt: `${film.title} poster`,
        },
      ],
      article: {
        publishedTime: film.date_ajout,
        modifiedTime: film.updated_at || film.date_ajout,
        section: 'Movies',
        tags: keywords,
      },
    };
    
    // Données Twitter Card
    const twitterData = {
      card: 'summary_large_image',
      site: '@MovieHunt',
      creator: '@MovieHunt',
      title: seoTitle,
      description,
      images: [ogImage],
    };
    
    // Retourner toutes les métadonnées
    return {
      title: seoTitle,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: 'MovieHunt' }],
      creator: 'MovieHunt',
      publisher: 'MovieHunt',
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'fr': `${baseUrl}/films/${slug}`,
          'en': canonicalUrl,
          'x-default': `${baseUrl}/films/${slug}`
        }
      },
      openGraph: openGraphData,
      twitter: twitterData,
      robots: robotsConfig,
      // Données structurées JSON-LD pour les moteurs de recherche
      other: {
        'application/ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Movie',
          name: film.title,
          description: film.synopsis,
          datePublished: film.release_date,
          image: posterUrl,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: film.note_sur_10,
            bestRating: 10,
            worstRating: 0,
            ratingCount: 1,
          },
          genre: genres,
        }),
      },
    };
  } catch (error) {
    console.error('Error generating metadata for film:', error);
    return {
      title: 'Film | MovieHunt',
      description: 'Discover movie reviews and ratings on MovieHunt.',
    };
  }
}
