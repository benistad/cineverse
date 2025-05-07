'use client';

import { Film } from '@/types/supabase';
import FilmCard from './FilmCard';

interface FilmGridProps {
  films: Film[];
  showRating?: boolean;
  showAdminControls?: boolean;
}

export default function FilmGrid({ films, showRating = true, showAdminControls = false }: FilmGridProps) {
  if (films.length === 0) {
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
          key={film.id} 
          film={film} 
          showRating={showRating} 
          showAdminControls={showAdminControls} 
        />
      ))}
    </div>
  );
}
