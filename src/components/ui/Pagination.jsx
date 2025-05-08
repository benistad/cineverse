'use client';

import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Générer un tableau de pages à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Toujours afficher la première page
    pageNumbers.push(1);
    
    // Calculer les pages à afficher autour de la page courante
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
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
    <div className="flex justify-center items-center space-x-2 my-6">
      {/* Bouton page précédente */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full flex items-center justify-center ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        aria-label="Page précédente"
      >
        <FiChevronLeft size={20} />
      </button>
      
      {/* Numéros de page */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {/* Bouton page suivante */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full flex items-center justify-center ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        aria-label="Page suivante"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
}
