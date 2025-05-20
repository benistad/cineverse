'use client';

import { useState, useEffect } from 'react';
import { getAllFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import Link from 'next/link';
import SeoHeading from '@/components/ui/SeoHeading';

export default function AllFilmsPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchAllFilms() {
      try {
        setLoading(true);
        const films = await getAllFilms();
        setFilms(films);
        setTotalCount(films.length);
      } catch (error) {
        console.error('Erreur lors de la récupération de tous les films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllFilms();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SeoHeading level={1} className="text-3xl font-bold m-0">Tous les films</SeoHeading>
          <span className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
            {totalCount}
          </span>
        </div>
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : films.length > 0 ? (
        <FilmGrid films={films} />
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun film disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}
