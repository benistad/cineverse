'use client';

import React, { useState } from 'react';
import { FiShare2, FiInstagram } from 'react-icons/fi';

// Composant pour le modal de partage Instagram
const InstagramShareModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-xl font-bold mb-4">Partager sur Instagram</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">L'image a été téléchargée et le texte copié dans votre presse-papiers.</p>
          
          <div className="border rounded-lg p-2 mb-4">
            <div className="aspect-w-2 aspect-h-3 w-full max-w-[200px] mx-auto mb-3">
              <img 
                src={data.imageUrl} 
                alt={data.filmTitle} 
                className="object-cover rounded-md w-full h-full"
              />
            </div>
            
            <div className="bg-gray-100 p-3 rounded-md text-xs font-mono whitespace-pre-wrap">
              {data.caption}
            </div>
          </div>
          
          <h4 className="font-bold mb-2">Instructions :</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>L'image du film a été téléchargée sur votre appareil</li>
            <li>Le texte de la légende a été copié dans votre presse-papiers</li>
            <li>Ouvrez Instagram et créez un nouveau post</li>
            <li>Sélectionnez l'image téléchargée</li>
            <li>Collez le texte dans la section "Légende"</li>
            <li>Publiez votre post</li>
          </ol>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
        >
          Fermer
        </button>
      </div>
    </div>
  );
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

export default function InstagramShareButton({ film }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  
  // Ne pas afficher le bouton si le film n'a pas de note
  if (!film || !film.note_sur_10) return null;
  
  const handleShareClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    shareToInstagram(film, setShowShareModal, setShareData);
  };
  
  return (
    <>
      {/* Modal de partage Instagram */}
      <InstagramShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        data={shareData} 
      />
      
      {/* Bouton de partage direct (sans menu déroulant) */}
      <button 
        className="absolute top-2 left-12 z-20 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 flex items-center justify-center cursor-pointer"
        onClick={handleShareClick}
        aria-label="Partager sur Instagram"
      >
        <FiInstagram />
      </button>
    </>
  );
}
