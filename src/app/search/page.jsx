'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import FilmGrid from '@/components/films/FilmGrid';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function searchFilms() {
      if (!query.trim()) {
        setFilms([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Recherche dans le titre et le synopsis
        const { data, error, count } = await supabase
          .from('films')
          .select('*', { count: 'exact' })
          .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
          .order('date_ajout', { ascending: false });

        if (error) {
          console.error('Erreur lors de la recherche:', error);
          setFilms([]);
          setTotalCount(0);
        } else {
          setFilms(data || []);
          setTotalCount(count || 0);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setFilms([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    searchFilms();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FiSearch className="text-3xl text-gray-600 mr-3" />
          <h1 className="text-3xl font-bold">Résultats de recherche</h1>
        </div>
        
        {query && (
          <div className="flex items-center gap-3">
            <p className="text-gray-600">
              Recherche pour : <span className="font-semibold text-gray-900">"{query}"</span>
            </p>
            {!loading && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {totalCount} résultat{totalCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
        
        <Link 
          href="/" 
          className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      {!query ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <FiSearch className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">Veuillez entrer un terme de recherche.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : films.length > 0 ? (
        <FilmGrid films={films} />
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <FiSearch className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">Aucun film trouvé pour "{query}"</p>
          <p className="text-sm text-gray-400">Essayez avec d'autres mots-clés ou parcourez tous nos films.</p>
          <Link 
            href="/all-films"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir tous les films
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
