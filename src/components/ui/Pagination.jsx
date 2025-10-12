'use client';

import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Générer un tableau de pages à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    
    // Toujours afficher la première page
    pageNumbers.push(1);
    
    // Calculer les pages à afficher autour de la page courante
    // Sur mobile, afficher moins de pages
    let startPage = Math.max(2, currentPage - (isMobile ? 0 : 1));
    let endPage = Math.min(totalPages - 1, currentPage + (isMobile ? 0 : 1));
    
    // Ajouter des points de suspension si nécessaire avant la plage
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Ajouter les pages de la plage
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Ajouter des points de suspension si nécessaire après la plage
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Toujours afficher la dernière page si elle existe
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Si une seule page, ne pas afficher la pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2 my-4 sm:my-6">
      {/* Bouton page précédente */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPageChange(currentPage - 1);
          return false;
        }}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'
        }`}
        aria-label="Page précédente"
      >
        <FiChevronLeft size={18} />
      </button>
      
      {/* Numéros de page */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 text-sm sm:text-base">...</span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPageChange(page);
                return false;
              }}
              className={`min-w-[40px] h-10 px-3 rounded-lg flex items-center justify-center text-base font-medium transition-colors ${
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {/* Bouton page suivante */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPageChange(currentPage + 1);
          return false;
        }}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'
        }`}
        aria-label="Page suivante"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}
