'use client';

import Script from 'next/script';

/**
 * Composant pour générer le balisage structuré JSON-LD pour un film
 * Version améliorée avec des données structurées plus complètes pour un meilleur SEO
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.film - Les données du film
 */
export default function MovieSchema({ film }) {
  if (!film) return null;

  // Extraire l'année de sortie si disponible
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : null;
  
  // URL du site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  
  // URL canonique de la page du film
  const filmUrl = `${baseUrl}/films/${film.slug || film.id}`;
  
  // URL de l'image du poster (utiliser l'URL complète)
  const posterUrl = film.poster_url || 
    (film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : null);
  
  // Créer l'objet JSON-LD pour le film avec des données enrichies
  const movieSchema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    '@id': filmUrl,
    name: film.title,
    alternateName: film.original_title && film.original_title !== film.title ? film.original_title : undefined,
    description: film.synopsis || `Film noté ${film.note_sur_10}/10 sur MovieHunt`,
    image: posterUrl,
    url: filmUrl,
    sameAs: film.tmdb_id ? `https://www.themoviedb.org/movie/${film.tmdb_id}` : undefined,
    datePublished: film.release_date,
    dateCreated: film.release_date,
    dateModified: film.date_modification || film.date_ajout,
    contentRating: film.content_rating || 'Tout public',
    countryOfOrigin: film.country_of_origin || 'FR',
    inLanguage: film.original_language || 'fr',
    duration: film.runtime ? `PT${film.runtime}M` : undefined, // Format ISO 8601 pour la durée
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: film.note_sur_10,
        bestRating: '10',
        worstRating: '0'
      },
      author: {
        '@type': 'Organization',
        name: 'MovieHunt',
        url: baseUrl
      },
      datePublished: film.date_ajout,
      reviewBody: film.why_watch_content || film.synopsis || `Film noté ${film.note_sur_10}/10 par MovieHunt.`
    }
  };

  // Ajouter les genres
  if (film.genres) {
    movieSchema.genre = film.genres.split(',').map(genre => genre.trim());
  }
  
  // Ajouter les mots-clés
  if (film.keywords) {
    movieSchema.keywords = film.keywords;
  }
  
  // Ajouter l'organisation qui a publié le contenu
  movieSchema.publisher = {
    '@type': 'Organization',
    name: 'MovieHunt',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/logo.png`,
      width: '112',
      height: '112'
    }
  };

  // Ajouter les membres du staff remarquable s'ils existent
  if (film.remarkable_staff && film.remarkable_staff.length > 0) {
    // Réalisateurs
    const directors = film.remarkable_staff
      .filter(staff => staff.role === 'Réalisateur');
      
    if (directors.length > 0) {
      movieSchema.director = directors.map(director => ({
        '@type': 'Person',
        name: director.name,
        url: director.tmdb_id ? `https://www.themoviedb.org/person/${director.tmdb_id}` : undefined
      }));
    }

    // Acteurs
    const actors = film.remarkable_staff
      .filter(staff => staff.role === 'Acteur' || staff.role === 'Actrice');
      
    if (actors.length > 0) {
      movieSchema.actor = actors.map(actor => ({
        '@type': 'Person',
        name: actor.name,
        url: actor.tmdb_id ? `https://www.themoviedb.org/person/${actor.tmdb_id}` : undefined
      }));
    }
    
    // Scénaristes
    const writers = film.remarkable_staff
      .filter(staff => staff.role === 'Scénariste');
      
    if (writers.length > 0) {
      movieSchema.author = writers.map(writer => ({
        '@type': 'Person',
        name: writer.name,
        url: writer.tmdb_id ? `https://www.themoviedb.org/person/${writer.tmdb_id}` : undefined
      }));
    }
  }

  // Ajouter la bande-annonce si disponible
  const trailerKey = film.youtube_trailer_key || film.trailer_key;
  if (trailerKey) {
    movieSchema.trailer = {
      '@type': 'VideoObject',
      name: `Bande-annonce de ${film.title}${releaseYear ? ` (${releaseYear})` : ''}`,
      description: `Regardez la bande-annonce officielle de ${film.title}${releaseYear ? ` (${releaseYear})` : ''}`,
      thumbnailUrl: posterUrl,
      uploadDate: film.date_ajout || new Date().toISOString().split('T')[0],
      embedUrl: `https://www.youtube.com/embed/${trailerKey}`,
      contentUrl: `https://www.youtube.com/watch?v=${trailerKey}`,
      potentialAction: {
        '@type': 'WatchAction',
        target: [
          `https://www.youtube.com/watch?v=${trailerKey}`,
          `${baseUrl}/films/${film.slug || film.id}`
        ]
      }
    };
  }
  
  // Ajouter les plateformes de streaming si disponibles
  if (film.streaming_providers && film.streaming_providers.length > 0) {
    movieSchema.offers = film.streaming_providers.map(provider => ({
      '@type': 'Offer',
      name: provider.name,
      url: provider.url,
      seller: {
        '@type': 'Organization',
        name: provider.name,
        logo: provider.logo_url ? {
          '@type': 'ImageObject',
          url: provider.logo_url
        } : undefined
      }
    }));
  }

  // Ajouter les films similaires si disponibles
  if (film.similar_films && film.similar_films.length > 0) {
    movieSchema.isRelatedTo = film.similar_films.map(similar => ({
      '@type': 'Movie',
      name: similar.title,
      url: `${baseUrl}/films/${similar.slug || similar.id}`
    }));
  }
  
  // Nettoyer l'objet en supprimant les propriétés undefined
  const cleanSchema = JSON.parse(JSON.stringify(movieSchema));

  return (
    <Script
      id="movie-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
      strategy="afterInteractive"
    />
  );
}
