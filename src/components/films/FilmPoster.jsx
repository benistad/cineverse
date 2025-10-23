'use client';

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
      alt={`Affiche du film ${film.title}`}
      className="absolute inset-0 w-full h-full object-contain object-top"
      loading="eager"
      onError={handleImageError}
    />
  );
}
