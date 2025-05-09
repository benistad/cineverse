'use client';

import { useState, useEffect } from 'react';
import { searchFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import { FiSearch } from 'react-icons/fi';

export default function SearchResults({ searchTerm }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      if (!searchTerm || searchTerm.trim() === '') {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFilms(searchTerm);
        setResults(searchResults);
      } catch (err) {
        console.error('Erreur lors de la recherche :', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <FiSearch className="text-gray-400" size={48} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun résultat trouvé</h3>
        <p className="text-gray-500">
          Aucun film ne correspond à votre recherche "{searchTerm}".
        </p>
        <p className="text-gray-500 mt-2">
          Essayez avec d'autres termes ou vérifiez l'orthographe.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">
        {results.length} {results.length > 1 ? 'résultats' : 'résultat'} pour "{searchTerm}"
      </p>
      <FilmGrid films={results} />
    </div>
  );
}
