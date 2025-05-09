'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';
import { useSwipeable } from 'react-swipeable';

export default function FilmCarousel({ films, title, visibleCount = 4 }) {
  // État pour suivre l'index actuel
  const [activeIndex, setActiveIndex] = useState(0);
  // État pour stocker le nombre de cartes visibles
  const [visibleCards, setVisibleCards] = useState(1);
  // Référence au conteneur
  const carouselRef = useRef(null);

  // Gérer le redimensionnement de la fenêtre
  useEffect(() => {
    function updateVisibleCards() {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1); // Mobile
      } else if (width < 1024) {
        setVisibleCards(2); // Tablette
      } else {
        setVisibleCards(visibleCount); // Desktop
      }
    }
    
    // Initialiser et ajouter l'écouteur d'événement
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    
    return () => window.removeEventListener('resize', updateVisibleCards);
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
    setActiveIndex(prev => Math.max(0, prev - 1));
  };

  // Fonction pour passer à la carte suivante
  const nextCard = () => {
    setActiveIndex(prev => Math.min(maxIndex, prev + 1));
  };

  // Configuration du gestionnaire de swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextCard,
    onSwipedRight: prevCard,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
  });
  
  // Vérifier si les boutons de navigation doivent être affichés
  const canGoLeft = activeIndex > 0;
  const canGoRight = activeIndex < maxIndex;

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

      {/* Conteneur du carrousel avec gestion du swipe */}
      <div 
        ref={carouselRef}
        {...swipeHandlers}
        className="relative overflow-hidden touch-pan-y"
      >
        {/* Effets de dégradé sur les côtés */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/20 to-transparent z-10 pointer-events-none" />
        
        {/* Conteneur des cartes avec défilement */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * (100 / visibleCards)}%)`,
              width: `${(films.length * 100) / visibleCards}%`
            }}
          >
            {films.map((film) => (
              <div 
                key={film.id}
                className="px-2 pb-4"
                style={{ width: `${100 / visibleCards}%` }}
              >
                <div className="h-full">
                  <FilmCard film={film} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
