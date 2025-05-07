'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb/api';
import { truncateText, extractYear } from '@/lib/utils/string';
import { Film } from '@/types/supabase';
import { FiStar, FiEdit } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

interface FilmCardProps {
  film: Film;
  showRating?: boolean;
  showAdminControls?: boolean;
}

export default function FilmCard({ film, showRating = true, showAdminControls = false }: FilmCardProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl relative">
      {/* Lien vers la page publique ou admin selon le contexte */}
      <Link href={isAdmin && showAdminControls ? `/admin/edit-rated/${film.id}` : `/films/${film.id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={film.poster_url || getImageUrl(null)}
            alt={film.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
          
          {showRating && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-2 flex items-center justify-center">
              <FiStar className="mr-1" />
              <span className="font-bold">{film.note_sur_10}</span>
            </div>
          )}
          
          {isAdmin && showAdminControls && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-2 flex items-center justify-center">
              <FiEdit />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold mb-1">{film.title}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {extractYear(film.date_ajout)}
          </p>
          <p className="text-sm text-gray-700">
            {truncateText(film.synopsis, 100)}
          </p>
        </div>
      </Link>
    </div>
  );
}
