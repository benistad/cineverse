'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';
import { useSwipeable } from 'react-swipeable';

export default function FilmCarousel({ films, title, visibleCount = 4 }) {
  // État pour suivre si l'utilisateur est en train de faire glisser
  const [isDragging, setIsDragging] = useState(false);
  // État pour suivre si on est sur mobile
  const [isMobile, setIsMobile] = useState(false);
  // État pour suivre le nombre de films visibles actuellement
  const [currentVisibleCount, setCurrentVisibleCount] = useState(visibleCount);
  // Ref pour stocker la largeur de l'écran précédente
  const prevWidthRef = useRef(0);
  
  // Mettre à jour le nombre de films visibles en fonction de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const wasMobile = isMobile;
      
      // Déterminer si c'est un mobile et combien de films sont visibles
      if (width < 640) { // Mobile
        setCurrentVisibleCount(1);
        setIsMobile(true);
      } else if (width < 1024) { // Tablet
        setCurrentVisibleCount(2);
        setIsMobile(false);
      } else { // Desktop
        setCurrentVisibleCount(visibleCount);
        setIsMobile(false);
      }
      
      // Si la taille de l'écran change de façon significative, ajuster l'index de départ
      // pour éviter les espaces vides
      if (prevWidthRef.current !== 0 && Math.abs(width - prevWidthRef.current) > 50) {
        adjustStartIndex();
      }
      
      prevWidthRef.current = width;
    };
    
    // Fonction pour ajuster l'index de départ lors des changements de taille d'écran
    const adjustStartIndex = () => {
      if (films && films.length > 0) {
        // S'assurer que l'index ne dépasse pas la limite maximale
        const maxIndex = Math.max(0, films.length - currentVisibleCount);
        setStartIndex(prev => Math.min(prev, maxIndex));
      }
    };
    
    // Initialiser
    if (typeof window !== 'undefined') {
      handleResize();
      // Ajouter l'écouteur d'événement
      window.addEventListener('resize', handleResize);
    }
    
    // Nettoyer l'écouteur d'événement
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [films, visibleCount]);
  
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);

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

  // Fonction pour faire défiler vers la gauche
  const scrollLeft = () => {
    if (startIndex > 0) {
      // Défiler d'une seule carte à la fois sur mobile, sinon selon le nombre visible
      const step = isMobile ? 1 : currentVisibleCount;
      const newIndex = Math.max(0, startIndex - step);
      setStartIndex(newIndex);
    }
  };

  // Fonction pour faire défiler vers la droite
  const scrollRight = () => {
    const maxIndex = totalFilms - currentVisibleCount;
    if (startIndex < maxIndex) {
      // Défiler d'une seule carte à la fois sur mobile, sinon selon le nombre visible
      const step = isMobile ? 1 : currentVisibleCount;
      const newIndex = Math.min(maxIndex, startIndex + step);
      setStartIndex(newIndex);
    }
  };
  
  // Configuration des gestionnaires de swipe
  const swipeHandlers = useSwipeable({
    onSwiping: () => setIsDragging(true),
    onSwiped: () => setTimeout(() => setIsDragging(false), 50),
    onSwipedLeft: () => {
      if (startIndex + responsiveVisibleCount < totalFilms) {
        // Assurer que le défilement se fait une carte à la fois sur mobile
        scrollRight();
      }
    },
    onSwipedRight: () => {
      if (startIndex > 0) {
        // Assurer que le défilement se fait une carte à la fois sur mobile
        scrollLeft();
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
    trackTouch: true,
    delta: 10, // Déplacement minimal pour détecter un swipe
    swipeDuration: 500, // Durée maximale d'un swipe
  });

  // Vérifier si les boutons de navigation doivent être affichés
  const showLeftButton = startIndex > 0;
  const showRightButton = startIndex < (totalFilms - currentVisibleCount);

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
        className={`relative overflow-hidden touch-pan-y ${isMobile ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'cursor-grabbing' : ''}`} 
        ref={containerRef} 
        {...swipeHandlers}
      >
        {isMobile && (
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/20 to-transparent z-10 pointer-events-none" />
        )}
        {isMobile && (
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/20 to-transparent z-10 pointer-events-none" />
        )}
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${startIndex * (100 / currentVisibleCount)}%)`,
            width: `${(totalFilms / currentVisibleCount) * 100}%`,
            gap: '0.5rem'
          }}
        >
          {films.map((film) => (
            <div 
              key={film.id} 
              className="px-2 pb-4"
              style={{ width: `${100 / currentVisibleCount}%` }}
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
