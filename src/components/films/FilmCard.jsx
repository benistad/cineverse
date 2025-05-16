'use client';

import React, { useState, useEffect } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiEdit, FiInstagram } from 'react-icons/fi';
import Image from 'next/image';
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
const shareToInstagram = async (film, setShareModalOpen, setShareData) => {
  try {
    // Préparer le texte de la légende
    const caption = prepareInstagramCaption(film);
    
    // Vérifier si nous sommes sur mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Optimiser l'URL de l'image pour s'assurer qu'elle est accessible
    const imageUrl = film.poster_url.startsWith('http') 
      ? film.poster_url 
      : `https://www.moviehunt.fr${film.poster_url}`;
    
    if (isMobile) {
      try {
        // Essayer d'ouvrir Instagram directement avec l'image
        // Note: Ceci fonctionne mieux sur iOS que sur Android
        const instagramUrl = `instagram://library`;
        window.open(instagramUrl, '_blank');
        
        // Copier le texte dans le presse-papiers pour que l'utilisateur puisse le coller
        await navigator.clipboard.writeText(caption);
        
        // Afficher un message plus convivial
        setShareData({
          imageUrl,
          caption,
          filmTitle: film.title
        });
        setShareModalOpen(true);
      } catch (err) {
        // Fallback si l'ouverture d'Instagram échoue
        alert(`Texte copié dans le presse-papiers. Veuillez ouvrir Instagram manuellement et créer un nouveau post avec l'image du film.`);
      }
    } else {
      // Sur desktop, proposer une expérience plus guidée
      // Télécharger l'image
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${film.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_moviehunt.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Copier le texte dans le presse-papiers
      await navigator.clipboard.writeText(caption);
      
      // Afficher des instructions plus détaillées
      setShareData({
        imageUrl,
        caption,
        filmTitle: film.title
      });
      setShareModalOpen(true);
    }
  } catch (error) {
    console.error('Erreur lors du partage sur Instagram:', error);
    alert('Une erreur est survenue lors du partage. Veuillez réessayer.');
  }
};

// Composant pour le modal de partage Instagram
const InstagramShareModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        
        <h3 className="text-xl font-bold mb-4">Partager "{data.filmTitle}" sur Instagram</h3>
        
        <div className="mb-4 border rounded-lg overflow-hidden">
          <img 
            src={data.imageUrl} 
            alt={data.filmTitle} 
            className="w-full h-auto"
          />
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Légende (copiée dans le presse-papiers) :</p>
          <div className="bg-gray-100 p-3 rounded-md text-sm font-mono overflow-auto max-h-32">
            {data.caption.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Instructions :</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>L'image a été téléchargée sur votre appareil</li>
            <li>La légende a été copiée dans votre presse-papiers</li>
            <li>Ouvrez Instagram et créez un nouveau post</li>
            <li>Sélectionnez l'image téléchargée</li>
            <li>Collez la légende (Ctrl+V ou Cmd+V)</li>
            <li>Publiez votre post !</li>
          </ol>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FilmCard({ film, showRating = true, showAdminControls = false, priority = false }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin');
  
  useEffect(() => {
    // Ajouter l'écouteur pour le redimensionnement de la fenêtre
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Nettoyer les écouteurs d'événements
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
      {/* Boutons d'action (en dehors du lien principal) */}
      {isAdmin && showAdminControls && (
        <>
          <Link href={`/admin/edit-rated/${film.id}`} className="absolute top-2 left-2 z-10 bg-blue-600 text-white rounded-full p-2 flex items-center justify-center hover:bg-blue-700">
            <FiEdit />
          </Link>
          
          {/* Bouton de partage Instagram qui redirige vers la page dédiée */}
          {film.note_sur_10 && (
            <Link 
              href={`/admin/share-instagram/${film.id}`} 
              className="absolute top-2 left-12 z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <FiInstagram />
            </Link>
          )}
        </>
      )}
        
      {/* Affichage de la note */}
      {showRating && film.note_sur_10 !== undefined && (
        <div className="absolute top-2 right-2 z-10">
          <RatingIcon rating={film.note_sur_10} size={windowWidth < 640 ? 32 : 40} />
        </div>
      )}
      
      {/* Badge Hunted by MovieHunt */}
      {film.is_hunted_by_moviehunt && (
        <div className="absolute bottom-2 left-2 z-10">
          <Image 
            src="/images/badges/hunted-badge.png" 
            alt="Hunted by MovieHunt" 
            width={windowWidth < 640 ? 60 : 80} 
            height={windowWidth < 640 ? 60 : 80}
            className="drop-shadow-md"
          />
        </div>
      )}
      
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
