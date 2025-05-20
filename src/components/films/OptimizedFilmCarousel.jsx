'use client';

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';
import { useSwipeable } from 'react-swipeable';
import SeoHeading from '@/components/ui/SeoHeading';

// Composant FilmCard optimisé avec memo pour éviter les re-rendus inutiles
const MemoizedFilmCard = memo(FilmCard);

export default function OptimizedFilmCarousel({ 
  films, 
  title, 
  visibleCount = 4, 
  showAllLink, 
  showAllText, 
  totalCount, 
  showCount = true,
  hideTitle = false
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
  
  // Vérifier s'il y a des films à afficher
  if (!films || films.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Aucun film disponible pour le moment.</p>
      </div>
    );
  }
  
  // Calculer le nombre maximum d'index (mémorisé pour éviter les calculs inutiles)
  const maxIndex = useMemo(() => Math.max(0, films.length - visibleCards), [films.length, visibleCards]);
  
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
  
  // Vérifier si les boutons de navigation doivent être affichés
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < maxIndex;
  
  // Configuration des gestionnaires de swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextCard,  // Swipe vers la gauche -> carte suivante
    onSwipedRight: prevCard, // Swipe vers la droite -> carte précédente
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    delta: 10,
  });
  
  // Déterminer quels films afficher (mémorisé pour éviter les calculs inutiles)
  const displayedFilms = useMemo(() => {
    const result = [];
    for (let i = currentIndex; i < currentIndex + visibleCards && i < films.length; i++) {
      result.push(films[i]);
    }
    return result;
  }, [films, currentIndex, visibleCards]);

  return (
    <div className="space-y-4">
      {/* Titre, compteur et boutons de navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            {!hideTitle && (
              <SeoHeading level={2} className="text-2xl md:text-3xl font-bold m-0">{title}</SeoHeading>
            )}
            {/* Compteur de films - n'affiche que si showCount est true */}
            {showCount && (
              <span className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                {totalCount !== undefined ? totalCount : films.length}
              </span>
            )}
          </div>
          
          {/* Bouton "Voir tous les films" */}
          {showAllLink && showAllText && (
            <a 
              href={showAllLink} 
              className="ml-4 px-4 py-2 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: '#4A68D9' }}
            >
              {showAllText}
            </a>
          )}
        </div>
        
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
