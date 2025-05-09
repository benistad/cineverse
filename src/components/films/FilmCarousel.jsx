'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';
import { useSwipeable } from 'react-swipeable';

export default function FilmCarousel({ films, title, visibleCount = 4 }) {
  // État pour suivre si l'utilisateur est en train de faire glisser
  const [isDragging, setIsDragging] = useState(false);
  // Index de la carte actuellement affichée en premier
  const [startIndex, setStartIndex] = useState(0);
  // Référence au conteneur pour les interactions
  const containerRef = useRef(null);
  // État pour stocker le nombre de cartes visibles selon la taille de l'écran
  const [visibleItems, setVisibleItems] = useState(visibleCount);
  
  // Mettre à jour le nombre de cartes visibles en fonction de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setVisibleItems(1);
      } else if (width < 1024) { // Tablet
        setVisibleItems(2);
      } else { // Desktop
        setVisibleItems(visibleCount);
      }
    };
    
    // Initialiser
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    // Nettoyer
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [visibleCount]);

  // Calculer le nombre total de films
  const totalFilms = films?.length || 0;
  
  // Vérifier s'il y a des films à afficher
  if (!films || films.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Aucun film disponible pour le moment.</p>
      </div>
    );
  }

  // Fonction pour faire défiler vers la gauche (toujours une carte à la fois)
  const scrollLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Fonction pour faire défiler vers la droite (toujours une carte à la fois)
  const scrollRight = () => {
    const maxIndex = totalFilms - visibleItems;
    if (startIndex < maxIndex) {
      setStartIndex(startIndex + 1);
    }
  };
  
  // Configuration des gestionnaires de swipe (simplifiée et robuste)
  const swipeHandlers = useSwipeable({
    onSwiping: () => setIsDragging(true),
    onSwiped: () => setTimeout(() => setIsDragging(false), 50),
    onSwipedLeft: () => {
      // Défilement vers la droite lors d'un swipe vers la gauche
      scrollRight();
    },
    onSwipedRight: () => {
      // Défilement vers la gauche lors d'un swipe vers la droite
      scrollLeft();
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
    trackTouch: true,
    delta: 10, // Déplacement minimal pour détecter un swipe
    swipeDuration: 500, // Durée maximale d'un swipe
  });

  // Vérifier si les boutons de navigation doivent être affichés
  const showLeftButton = startIndex > 0;
  const showRightButton = startIndex < (totalFilms - visibleItems);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className={`p-1 sm:p-2 rounded-full ${showLeftButton 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!showLeftButton}
            aria-label="Défiler vers la gauche"
          >
            <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={scrollRight}
            className={`p-1 sm:p-2 rounded-full ${showRightButton 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!showRightButton}
            aria-label="Défiler vers la droite"
          >
            <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div 
        className="relative overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" 
        ref={containerRef} 
        {...swipeHandlers}
      >
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/20 to-transparent z-10 pointer-events-none" />
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${startIndex * (100 / visibleItems)}%)`,
            width: `${(totalFilms / visibleItems) * 100}%`,
            gap: '0.5rem'
          }}
        >
          {films.map((film) => (
            <div 
              key={film.id} 
              className="px-2 pb-4"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <div className="h-full">
                <FilmCard film={film} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
