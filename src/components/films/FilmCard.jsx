'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiStar, FiEdit, FiImage } from 'react-icons/fi';

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
          {film.poster_url ? (
            <Image
              src={film.poster_url}
              alt={film.title || 'Poster du film'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <FiImage className="text-gray-400" size={48} />
            </div>
          )}
          
          {showRating && film.note_sur_10 !== undefined && (
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
          <h3 className="text-lg font-bold mb-1">{film.title || 'Sans titre'}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {extractYear(film.date_ajout)}
          </p>
          <p className="text-sm text-gray-700">
            {truncateText(film.synopsis || 'Aucun synopsis disponible.', 100)}
          </p>
        </div>
      </Link>
    </div>
  );
}
