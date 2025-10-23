'use client';

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';
import { useSwipeable } from 'react-swipeable';

// Composant FilmCard optimisé avec memo pour éviter les re-rendus inutiles
const MemoizedFilmCard = memo(FilmCard);

export default function OptimizedFilmCarousel({ 
  films, 
  title, 
  visibleCount = 4, 
  showAllLink, 
  showAllText, 
  totalCount, 
  showCount = true 
}) {
  // État pour suivre l'index actuel
  const [currentIndex, setCurrentIndex] = useState(0);
  // État pour stocker le nombre de cartes visibles
  const [visibleCards, setVisibleCards] = useState(1);
  // Référence au conteneur pour le swipe
  const containerRef = useRef(null);
  
  // Détecter la taille de l'écran et ajuster le nombre de cartes visibles
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1); // Mobile
      } else if (width < 1024) {
        setVisibleCards(2); // Tablet
      } else {
        setVisibleCards(visibleCount); // Desktop
      }
    }
    
    // Initialiser et ajouter l'écouteur d'événement
    handleResize();
    
    // Utiliser un ResizeObserver au lieu d'un écouteur d'événement window.resize
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(document.body);
      return () => resizeObserver.disconnect();
    } else {
      // Fallback pour les navigateurs qui ne supportent pas ResizeObserver
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [visibleCount]);
  
  // Calculer le nombre maximum d'index (mémorisé pour éviter les calculs inutiles)
  // IMPORTANT: Les hooks doivent être appelés AVANT tout return conditionnel
  const maxIndex = useMemo(() => Math.max(0, (films?.length || 0) - visibleCards), [films?.length, visibleCards]);
  
  // Déterminer quels films afficher (mémorisé pour éviter les calculs inutiles)
  const displayedFilms = useMemo(() => {
    if (!films || films.length === 0) return [];
    const result = [];
    for (let i = currentIndex; i < currentIndex + visibleCards && i < films.length; i++) {
      result.push(films[i]);
    }
    return result;
  }, [films, currentIndex, visibleCards]);
  
  // Fonction pour passer à la carte précédente
  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fonction pour passer à la carte suivante
  const nextCard = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  // Configuration des gestionnaires de swipe
  // IMPORTANT: useSwipeable doit être appelé AVANT tout return conditionnel
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextCard,  // Swipe vers la gauche -> carte suivante
    onSwipedRight: prevCard, // Swipe vers la droite -> carte précédente
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    delta: 10,
  });
  
  // Vérifier si les boutons de navigation doivent être affichés
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < maxIndex;
  
  // Vérifier s'il y a des films à afficher
  if (!films || films.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Aucun film disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Titre, compteur et boutons de navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-3">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-800">
              {title}
            </h2>
            {/* Compteur de films - n'affiche que si showCount est true */}
            {showCount && (
              <span className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                {totalCount !== undefined ? totalCount : films.length}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          {/* Bouton "Voir tous les films" - maintenant visible sur mobile */}
          {showAllLink && showAllText && (
            <a 
              href={showAllLink} 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group text-sm sm:text-base"
            >
              {showAllText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          
          {/* Boutons de navigation */}
          <div className="flex space-x-2">
          <button 
            onClick={prevCard}
            className={`p-1 sm:p-2 rounded-full ${canGoLeft 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!canGoLeft}
            aria-label="Carte précédente"
          >
            <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={nextCard}
            className={`p-1 sm:p-2 rounded-full ${canGoRight 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!canGoRight}
            aria-label="Carte suivante"
          >
            <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
          </div>
        </div>
      </div>

      {/* Grille simple de cartes avec gestion du swipe */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 touch-pan-y"
        ref={containerRef}
        {...swipeHandlers}
      >
        {displayedFilms.map((film, idx) => (
          <div key={film.id} className="h-full">
            <MemoizedFilmCard 
              film={film} 
              priority={idx === 0} // Seulement la première carte est prioritaire
            />
          </div>
        ))}
      </div>
    </div>
  );
}
