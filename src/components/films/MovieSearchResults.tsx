'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TMDBMovie } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb/api';
import { truncateText, extractYear } from '@/lib/utils/string';

interface MovieSearchResultsProps {
  movies: TMDBMovie[];
  isLoading: boolean;
}

export default function MovieSearchResults({ movies, isLoading }: MovieSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (movies.length === 0) {
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
              <Image
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{movie.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {movie.release_date ? extractYear(movie.release_date) : 'Date inconnue'}
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
