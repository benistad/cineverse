'use client';

/**
 * Génère un alt text SEO-optimisé pour l'affiche du film
 * @param {Object} film - Données du film
 * @returns {string} Alt text descriptif (100-150 caractères)
 */
function generateAltText(film) {
  const title = film.title || 'Film';
  const year = film.release_date ? new Date(film.release_date).getFullYear() : null;
  const genre = film.genres ? film.genres.split(',')[0].trim() : null;
  const rating = film.note_sur_10 ? `noté ${film.note_sur_10}/10` : null;
  
  // Construire un alt text riche et descriptif
  let altParts = [`Affiche du film ${title}`];
  
  if (year) altParts.push(`(${year})`);
  if (genre) altParts.push(`- ${genre}`);
  if (rating) altParts.push(`- ${rating} sur MovieHunt`);
  
  return altParts.join(' ');
}

export default function FilmPoster({ film }) {
  const handleImageError = (e) => {
    if (e.target.src.includes('/w500/')) {
      e.target.src = e.target.src.replace('/w500/', '/w342/');
    } else if (e.target.src.includes('/w342/')) {
      e.target.src = e.target.src.replace('/w342/', '/w185/');
    } else {
      e.target.src = '/images/placeholder.jpg';
    }
  };

  const posterSrc = film.poster_url ? 
    film.poster_url :
    (film.poster_path ? 
      (film.poster_path.startsWith('/') ? 
        `https://image.tmdb.org/t/p/w500${film.poster_path}` : 
        film.poster_path) :
      '/images/placeholder.jpg');

  return (
    <img
      src={posterSrc}
      alt={generateAltText(film)}
      className="absolute inset-0 w-full h-full object-contain object-top"
      loading="eager"
      onError={handleImageError}
    />
  );
}
