'use client';

import { useState, useEffect } from 'react';
import { getHiddenGems } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function HiddenGemsFilms() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHiddenGems() {
      try {
        setLoading(true);
        // Récupérer tous les films méconnus (sans limite)
        const hiddenGems = await getHiddenGems(50); // Limite plus élevée pour avoir tous les films méconnus
        setFilms(hiddenGems);
      } catch (err) {
        console.error('Erreur lors de la récupération des films méconnus:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHiddenGems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <FiArrowLeft className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
      
      <div className="flex items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Films méconnus à voir</h1>
        {!loading && !error && films.length > 0 && (
          <span className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
            {films.length}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">Une erreur est survenue lors du chargement des films.</p>
        </div>
      ) : films.length > 0 ? (
        <FilmGrid films={films} />
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun film méconnu disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}
