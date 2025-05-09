'use client';

import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function SearchBar({ className = '', mobile = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (mobile) {
        setIsExpanded(false);
      }
    }
  };

  // Gérer le clic sur l'icône de recherche en mode mobile
  const handleSearchIconClick = () => {
    if (mobile) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        // Focus sur l'input après l'expansion
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  };

  // Gérer le clic à l'extérieur pour fermer la barre de recherche en mode mobile
  useEffect(() => {
    if (mobile) {
      const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target) && !event.target.closest('.search-icon')) {
          setIsExpanded(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mobile]);

  // Effacer le champ de recherche
  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {mobile ? (
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleSearchIconClick}
            className="search-icon p-2 text-white hover:text-blue-300 transition-colors"
            aria-label="Rechercher"
          >
            <FiSearch size={20} />
          </button>
          
          <div 
            className={`absolute right-0 top-full mt-2 transition-all duration-200 ease-in-out ${
              isExpanded 
                ? 'opacity-100 translate-y-0 visible' 
                : 'opacity-0 -translate-y-2 invisible'
            }`}
          >
            <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un film..."
                className="py-2 px-4 bg-gray-800 text-white w-64 focus:outline-none"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              )}
              <button 
                type="submit" 
                className="p-2 text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiSearch size={18} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative flex items-center w-full">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un film..."
              className="py-2 pl-10 pr-10 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 text-gray-400">
              <FiSearch size={18} />
            </div>
            {searchTerm && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-white"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
