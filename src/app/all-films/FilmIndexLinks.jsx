'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllFilms } from '@/lib/supabase/films';

export default function FilmIndexLinks() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Trier les films par ordre alphabétique
  const sortedFilms = [...films].sort((a, b) => 
    (a.title || '').localeCompare(b.title || '')
  );

  if (loading) {
    return <div className="text-center py-4">Chargement de l'index des films...</div>;
  }

  return (
    <div className="mt-12 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Index des films</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? 'Réduire l\'index' : 'Voir l\'index complet'}
        </button>
      </div>
      
      {isExpanded ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {sortedFilms.map((film) => (
            <Link 
              key={film.id} 
              href={`/films/${film.slug || film.id}`}
              className="text-sm text-gray-700 hover:text-blue-600 truncate p-1 hover:bg-gray-50 rounded"
            >
              {film.title || `Film #${film.id}`}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">
          Cliquez sur "Voir l'index complet" pour afficher tous les liens vers les pages de films.
        </p>
      )}
    </div>
  );
}
