'use client';

import FilmCard from './FilmCard';

export default function FilmGrid({ films, showRating = true, showAdminControls = false }) {
  // Vérifier si films est défini et est un tableau
  if (!films || !Array.isArray(films) || films.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucun film trouvé.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {films.map((film) => (
        <FilmCard 
          key={film.id || Math.random().toString(36).substring(7)} 
          film={film} 
          showRating={showRating} 
          showAdminControls={showAdminControls} 
        />
      ))}
    </div>
  );
}
