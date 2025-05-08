'use client';

import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiEdit } from 'react-icons/fi';

// Fonction utilitaire pour tronquer le texte
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Fonction utilitaire pour extraire l'année d'une date
const extractYear = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).getFullYear();
  } catch (error) {
    return '';
  }
};

export default function FilmCard({ film, showRating = true, showAdminControls = false }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  
  // Vérifier si le film existe
  if (!film) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <p className="text-red-500">Données du film non disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl relative">
      {/* Lien vers la page publique ou admin selon le contexte */}
      <Link href={isAdmin && showAdminControls ? `/admin/edit-rated/${film.id}` : `/films/${film.id}`}>
        <div className="relative h-64 w-full">
          <SafeImage
            src={film.poster_url}
            alt={film.title || 'Poster du film'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
          
          {showRating && film.note_sur_10 !== undefined && (
            <div className="absolute top-2 right-2">
              <RatingIcon rating={film.note_sur_10} size={40} />
            </div>
          )}
          
          {isAdmin && showAdminControls && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-2 flex items-center justify-center">
              <FiEdit />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold mb-1">{film.title || 'Sans titre'}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {extractYear(film.release_date) || extractYear(film.date_ajout)}
            {film.genres && <span> • {film.genres}</span>}
          </p>
          <p className="text-sm text-gray-700">
            {truncateText(film.synopsis || 'Aucun synopsis disponible.', 100)}
          </p>
        </div>
      </Link>
    </div>
  );
}
