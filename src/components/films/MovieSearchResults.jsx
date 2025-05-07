'use client';

import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { getImageUrl } from '@/lib/tmdb/api';

// Fonction utilitaire pour tronquer le texte
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Fonction utilitaire pour extraire l'année d'une date
const extractYear = (dateString) => {
  if (!dateString) return 'Date inconnue';
  try {
    return new Date(dateString).getFullYear().toString();
  } catch (error) {
    return 'Date inconnue';
  }
};

export default function MovieSearchResults({ movies, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun film trouvé. Essayez une autre recherche.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <Link href={`/admin/edit/${movie.id}`}>
            <div className="relative h-64 w-full">
              <SafeImage
                src={movie.poster_path ? getImageUrl(movie.poster_path) : null}
                alt={movie.title || 'Poster du film'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{movie.title || 'Sans titre'}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {extractYear(movie.release_date)}
              </p>
              <p className="text-sm text-gray-700">
                {truncateText(movie.overview || 'Aucune description disponible.', 100)}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
