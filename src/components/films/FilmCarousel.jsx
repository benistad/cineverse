'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilmCard from './FilmCard';

export default function FilmCarousel({ films, title, visibleCount = 4 }) {
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
      setStartIndex(startIndex - 1);
    }
  };

  // Fonction pour faire défiler vers la droite
  const scrollRight = () => {
    if (startIndex + visibleCount < totalFilms) {
      setStartIndex(startIndex + 1);
    }
  };

  // Vérifier si les boutons de navigation doivent être affichés
  const showLeftButton = startIndex > 0;
  const showRightButton = startIndex + visibleCount < totalFilms;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className={`p-2 rounded-full ${showLeftButton 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!showLeftButton}
            aria-label="Défiler vers la gauche"
          >
            <FiChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollRight}
            className={`p-2 rounded-full ${showRightButton 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!showRightButton}
            aria-label="Défiler vers la droite"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden" ref={containerRef}>
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${startIndex * (100 / visibleCount)}%)`,
            width: `${(totalFilms / visibleCount) * 100}%`,
            gap: '1rem'
          }}
        >
          {films.map((film) => (
            <div 
              key={film.id} 
              className="px-2"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <FilmCard film={film} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
