'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllFilms } from '@/lib/supabase/films';
import { FiArrowLeft, FiHome, FiSearch } from 'react-icons/fi';

export default function FilmsIndexPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [activeLetterFilter, setActiveLetterFilter] = useState('');

  useEffect(() => {
    async function fetchAllFilms() {
      try {
        const allFilms = await getAllFilms();
        setFilms(allFilms);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllFilms();
  }, []);

  // Générer l'alphabet pour le filtre
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  // Filtrer les films selon le texte de recherche et la lettre active
  const filteredFilms = films.filter(film => {
    const title = film.title || '';
    const matchesText = !filterText || title.toLowerCase().includes(filterText.toLowerCase());
    const matchesLetter = !activeLetterFilter || title.charAt(0).toUpperCase() === activeLetterFilter;
    return matchesText && matchesLetter;
  });
  
  // Trier les films par ordre alphabétique
  const sortedFilms = [...filteredFilms].sort((a, b) => 
    (a.title || '').localeCompare(b.title || '')
  );

  // Grouper les films par première lettre pour l'affichage
  const filmsByLetter = sortedFilms.reduce((acc, film) => {
    const firstLetter = (film.title || '').charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(film);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Index complet des films</h1>
          <p className="text-gray-600">
            Cette page contient des liens vers toutes les pages de films disponibles sur MovieHunt.
          </p>
        </div>
        <div className="flex space-x-2">
          <Link 
            href="/" 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiHome className="mr-2" /> Accueil
          </Link>
          <Link 
            href="/all-films" 
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Tous les films
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                if (e.target.value) setActiveLetterFilter('');
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                setActiveLetterFilter('');
                setFilterText('');
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                !activeLetterFilter ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Tous
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => {
                  setActiveLetterFilter(letter);
                  setFilterText('');
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  activeLetterFilter === letter ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedFilms.length > 0 ? (
          <div>
            {activeLetterFilter ? (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Films commençant par {activeLetterFilter}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sortedFilms.map(film => (
                    <Link
                      key={film.id}
                      href={`/films/${film.slug || film.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline truncate p-2 hover:bg-gray-50 rounded"
                    >
                      {film.title || `Film #${film.id}`}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              Object.keys(filmsByLetter).sort().map(letter => (
                <div key={letter} className="mt-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md mr-2">
                      {letter}
                    </span>
                    Films commençant par {letter}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filmsByLetter[letter].map(film => (
                      <Link
                        key={film.id}
                        href={`/films/${film.slug || film.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline truncate p-2 hover:bg-gray-50 rounded"
                      >
                        {film.title || `Film #${film.id}`}
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucun film trouvé correspondant à votre recherche.</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Information SEO</h2>
        <p className="text-gray-600 text-sm">
          Cette page est conçue pour améliorer l'indexation des pages de films par les moteurs de recherche. 
          Elle contient des liens vers toutes les pages de films disponibles sur MovieHunt, ce qui permet aux robots 
          d'indexation de découvrir facilement l'ensemble du contenu du site.
        </p>
      </div>
    </div>
  );
}
