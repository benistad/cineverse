'use client';

import React, { useState, useEffect } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiEdit } from 'react-icons/fi';
import { optimizePosterImage } from '@/lib/utils/imageOptimizer';

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

export default function FilmCard({ film, showRating = true, showAdminControls = false, priority = false }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  
  // Utiliser un état pour stocker la largeur de la fenêtre
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Mettre à jour la largeur de la fenêtre lors du redimensionnement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Vérifier si le film existe
  if (!film) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-3 sm:p-4 flex-grow">
          <p className="text-red-500">Données du film non disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl relative h-full flex flex-col">
      {/* Lien vers la page publique ou admin selon le contexte */}
      <Link href={isAdmin && showAdminControls ? `/admin/edit-rated/${film.id}` : `/films/${film.slug || film.id}`} className="flex flex-col h-full">
        <div className="relative h-48 sm:h-56 md:h-64 w-full flex-shrink-0">
          <SafeImage
            src={optimizePosterImage(film.poster_url)}
            alt={film.title || 'Poster du film'}
            fill
            width={300}
            height={450}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={!!priority}
          />
          
          {showRating && film.note_sur_10 !== undefined && (
            <div className="absolute top-2 right-2">
              <RatingIcon rating={film.note_sur_10} size={windowWidth < 640 ? 32 : 40} />
            </div>
          )}
          
          {isAdmin && showAdminControls && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-2 flex items-center justify-center">
              <FiEdit />
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex-grow">
          <h3 className="text-base sm:text-lg font-bold mb-1 line-clamp-1">{film.title || 'Sans titre'}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
            {extractYear(film.release_date) || extractYear(film.date_ajout)}
            {film.genres && <span> • <span className="line-clamp-1">{film.genres}</span></span>}
          </p>
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 sm:line-clamp-3">
            {truncateText(film.synopsis || 'Aucun synopsis disponible.', windowWidth < 640 ? 60 : 100)}
          </p>
        </div>
      </Link>
    </div>
  );
}
