'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';
import { useSwipeable } from 'react-swipeable';

export default function BasicFilmCarousel({ films, title, visibleCount = 4 }) {
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
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [visibleCount]);
  
  // Vérifier s'il y a des films à afficher
  if (!films || films.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Aucun film disponible pour le moment.</p>
      </div>
    );
  }
  
  // Calculer le nombre maximum d'index
  const maxIndex = Math.max(0, films.length - visibleCards);
  
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
  
  // Déterminer quels films afficher
  const displayedFilms = [];
  for (let i = currentIndex; i < currentIndex + visibleCards && i < films.length; i++) {
    displayedFilms.push(films[i]);
  }

  return (
    <div className="space-y-4">
      {/* Titre et boutons de navigation */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
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
        {displayedFilms.map((film) => (
          <div key={film.id} className="h-full">
            <FilmCard film={film} />
          </div>
        ))}
      </div>
    </div>
  );
}
