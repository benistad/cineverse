'use client';

import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Afficher le bouton après avoir scrollé de 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 sm:p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Retour en haut"
          style={{ minWidth: '44px', minHeight: '44px' }} // Taille tactile minimum
        >
          <FiArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </>
  );
}
