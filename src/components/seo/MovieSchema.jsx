'use client';

import Script from 'next/script';

/**
 * Composant pour générer le balisage structuré JSON-LD pour un film
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.film - Les données du film
 */
export default function MovieSchema({ film }) {
  if (!film) return null;

  // Créer l'objet JSON-LD pour le film
  const movieSchema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.synopsis || `Film noté ${film.note_sur_10}/10 sur MovieHunt`,
    image: film.poster_url,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'}/films/${film.slug || film.id}`,
    datePublished: film.release_date,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: film.note_sur_10,
      bestRating: '10',
      worstRating: '0',
      ratingCount: '1'
    },
    genre: film.genres ? film.genres.split(',').map(genre => genre.trim()) : [],
  };

  // Ajouter les membres du staff remarquable s'ils existent
  if (film.remarkable_staff && film.remarkable_staff.length > 0) {
    movieSchema.director = film.remarkable_staff
      .filter(staff => staff.role === 'Réalisateur')
      .map(director => ({
        '@type': 'Person',
        name: director.name
      }));

    movieSchema.actor = film.remarkable_staff
      .filter(staff => staff.role === 'Acteur' || staff.role === 'Actrice')
      .map(actor => ({
        '@type': 'Person',
        name: actor.name
      }));
  }

  // Ajouter la bande-annonce si disponible
  if (film.youtube_trailer_key) {
    movieSchema.trailer = {
      '@type': 'VideoObject',
      name: `Bande-annonce de ${film.title}`,
      description: `Regardez la bande-annonce de ${film.title}`,
      thumbnailUrl: film.poster_url,
      uploadDate: film.date_ajout,
      embedUrl: `https://www.youtube.com/embed/${film.youtube_trailer_key}`,
      contentUrl: `https://www.youtube.com/watch?v=${film.youtube_trailer_key}`
    };
  }

  return (
    <Script
      id="movie-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      strategy="afterInteractive"
    />
  );
}
