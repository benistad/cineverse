'use client';

import { useState, useEffect } from 'react';
import { FiStar, FiX } from 'react-icons/fi';

export default function AddToFavoritesButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Vérifier si le site est déjà dans les favoris (via localStorage)
    const isFavorited = localStorage.getItem('moviehunt-favorited') === 'true';
    setIsAdded(isFavorited);
    
    // Si c'est déjà ajouté, on peut cacher le bouton après un certain temps
    if (isFavorited) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const addToFavorites = () => {
    try {
      // Tentative d'ajout aux favoris du navigateur
      if (window.sidebar && window.sidebar.addPanel) { 
        // Firefox < 23
        window.sidebar.addPanel(document.title, window.location.href, '');
      } else if (window.external && ('AddFavorite' in window.external)) { 
        // IE
        window.external.AddFavorite(window.location.href, document.title);
      } else { 
        // Chrome, Safari, Firefox >= 23
        setIsAdded(true);
        localStorage.setItem('moviehunt-favorited', 'true');
        
        // Animation de succès
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          // Cacher le bouton après un délai
          setTimeout(() => {
            setIsVisible(false);
          }, 2000);
        }, 1000);
        
        // Afficher un message pour les navigateurs modernes
        alert(
          'Appuyez sur ' + 
          (navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Cmd+D' : 'Ctrl+D') + 
          ' pour ajouter cette page à vos favoris.'
        );
      }
    } catch (e) {
      console.log('Erreur lors de l\'ajout aux favoris', e);
    }
  };

  const dismissButton = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    // Mémoriser la décision de l'utilisateur
    localStorage.setItem('moviehunt-favorites-dismissed', 'true');
  };

  // Si le bouton n'est pas visible ou a été fermé précédemment, ne rien afficher
  if (!isVisible || localStorage.getItem('moviehunt-favorites-dismissed') === 'true') {
    return null;
  }

  return (
    <div 
      className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}
    >
      <button
        onClick={addToFavorites}
        className={`group flex items-center space-x-2 px-3 py-2 text-sm rounded-full shadow-lg transition-all duration-300 ${
          isAdded 
            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        <FiStar className={`${isAdded ? 'text-white' : 'text-yellow-300'} group-hover:animate-pulse`} />
        <span>{isAdded ? 'Ajouté aux favoris!' : 'Ajouter aux favoris'}</span>
        
        {/* Bouton de fermeture */}
        <button 
          onClick={dismissButton}
          className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Fermer"
        >
          <FiX size={16} />
        </button>
      </button>
    </div>
  );
}
