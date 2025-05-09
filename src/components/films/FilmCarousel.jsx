'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';
import { useSwipeable } from 'react-swipeable';

export default function FilmCarousel({ films, title, visibleCount = 4 }) {
  // Index de la première carte affichée
  const [currentIndex, setCurrentIndex] = useState(0);
  // Nombre de cartes visibles selon la taille d'écran
  const [cardsPerView, setCardsPerView] = useState(1);
  // Largeur d'une carte individuelle en pourcentage
  const [cardWidth, setCardWidth] = useState(100);
  // Référence au conteneur pour les interactions de swipe
  const containerRef = useRef(null);
  
  // Détecter la taille de l'écran et ajuster le nombre de cartes visibles
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setCardsPerView(1);
      } else if (width < 1024) { // Tablet
        setCardsPerView(2);
      } else { // Desktop
        setCardsPerView(visibleCount);
      }
    }
    
    // Exécuter au chargement et lors des redimensionnements
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [visibleCount]);
  
  // Calculer la largeur d'une carte individuelle
  useEffect(() => {
    // Chaque carte occupe un pourcentage égal de l'espace visible
    setCardWidth(100 / cardsPerView);
  }, [cardsPerView]);

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

  // Fonction pour faire défiler vers la gauche (une carte à la fois)
  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fonction pour faire défiler vers la droite (une carte à la fois)
  const scrollRight = () => {
    // S'assurer de ne pas dépasser la dernière carte
    const maxIndex = Math.max(0, films.length - cardsPerView);
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  // Configuration des gestionnaires de swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: scrollRight, // Swipe vers la gauche -> défilement vers la droite
    onSwipedRight: scrollLeft, // Swipe vers la droite -> défilement vers la gauche
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    delta: 10,
  });

  // Vérifier si les boutons de navigation doivent être affichés
  const showLeftButton = currentIndex > 0;
  const showRightButton = currentIndex < films.length - cardsPerView;

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
        
        {/* Conteneur des cartes avec défilement fluide */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * cardWidth}%)`,
              width: `${films.length * cardWidth}%`
            }}
          >
            {films.map((film) => (
              <div 
                key={film.id} 
                className="px-2 pb-4"
                style={{ width: `${cardWidth}%` }}
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
