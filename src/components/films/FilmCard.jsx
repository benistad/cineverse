'use client';

import React, { useState, useEffect, useRef } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiEdit, FiShare2, FiInstagram } from 'react-icons/fi';
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

// Fonction pour préparer le texte à partager sur Instagram
const prepareInstagramCaption = (film) => {
  const year = film.release_date ? new Date(film.release_date).getFullYear() : '';
  const genres = film.genres ? film.genres.split(',')[0] : '';
  const synopsis = film.synopsis ? film.synopsis.substring(0, 150) + (film.synopsis.length > 150 ? '...' : '') : '';
  
  return `🎥 ${film.title} ${year ? `(${year})` : ''}
⭐ Note: ${film.note_sur_10}/10
${genres ? `🎬 Genre: ${genres}` : ''}
🔍 ${synopsis}

👉 Voir plus sur MovieHunt: https://moviehunt.fr/films/${film.slug || film.id}

#moviehunt #cinema #film #critique`;
};

// Fonction pour partager sur Instagram
const shareToInstagram = async (film) => {
  try {
    // Préparer le texte de la légende
    const caption = prepareInstagramCaption(film);
    
    // Vérifier si nous sommes sur mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Sur mobile, essayer d'ouvrir Instagram directement
      const instagramUrl = `instagram://library?AssetPath=${encodeURIComponent(film.poster_url)}`;
      window.open(instagramUrl, '_blank');
      
      // Copier le texte dans le presse-papiers pour que l'utilisateur puisse le coller
      await navigator.clipboard.writeText(caption);
      alert('Texte copié dans le presse-papiers. Collez-le dans votre publication Instagram.');
    } else {
      // Sur desktop, proposer de télécharger l'image et copier le texte
      // Créer un élément temporaire pour télécharger l'image
      const link = document.createElement('a');
      link.href = film.poster_url;
      link.download = `${film.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_moviehunt.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Copier le texte dans le presse-papiers
      await navigator.clipboard.writeText(caption);
      alert('Image téléchargée et texte copié dans le presse-papiers. Vous pouvez maintenant les partager sur Instagram.');
    }
  } catch (error) {
    console.error('Erreur lors du partage sur Instagram:', error);
    alert('Une erreur est survenue lors du partage. Veuillez réessayer.');
  }
};

export default function FilmCard({ film, showRating = true, showAdminControls = false, priority = false }) {
  // État pour contrôler l'affichage du menu de partage
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Référence pour le menu de partage
  const shareMenuRef = useRef(null);
  
  // Fermer le menu de partage lorsque l'utilisateur clique ailleurs sur la page
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    
    // Ajouter l'écouteur d'événement lorsque le menu est ouvert
    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Nettoyer l'écouteur d'événement
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);
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
            <>
              <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-2 flex items-center justify-center">
                <FiEdit />
              </div>
              
              {/* Bouton de partage (uniquement pour les films notés) */}
              {film.note_sur_10 && (
                <div className="absolute top-2 left-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 flex items-center justify-center cursor-pointer"
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       setShowShareMenu(!showShareMenu);
                     }}
                     ref={shareMenuRef}>
                  <FiShare2 />
                  
                  {/* Menu de partage */}
                  {showShareMenu && (
                    <div className="absolute left-0 top-10 bg-white shadow-lg rounded-md p-2 z-20 w-48 border border-gray-200">
                      <button 
                        className="flex items-center space-x-2 text-gray-800 hover:bg-gray-100 w-full p-2 rounded-md text-left"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          shareToInstagram(film);
                        }}
                      >
                        <FiInstagram className="text-pink-600" />
                        <span>Partager sur Instagram</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
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
