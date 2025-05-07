'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchMovies } from '@/lib/tmdb/api';
import { TMDBMovie } from '@/types/tmdb';
import SearchForm from '@/components/films/SearchForm';
import MovieSearchResults from '@/components/films/MovieSearchResults';
import Pagination from '@/components/ui/Pagination';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (query: string, page: number = 1) => {
    setIsSearching(true);
    setCurrentQuery(query);
    setCurrentPage(page);
    
    try {
      const response = await searchMovies(query, page);
      setSearchResults(response.results);
      setTotalPages(response.total_pages > 100 ? 100 : response.total_pages); // Limiter à 100 pages max
      setHasSearched(true);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (currentQuery) {
      handleSearch(currentQuery, page);
      // Remonter en haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Rechercher un film</h1>
        <p className="text-gray-600">
          Recherchez un film par titre pour l'ajouter à votre collection
        </p>
      </div>

      <SearchForm onSearch={handleSearch} isLoading={isSearching} />

      {hasSearched && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Résultats de recherche</h2>
          <MovieSearchResults movies={searchResults} isLoading={isSearching} />
          
          {/* Pagination */}
          {totalPages > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </div>
      )}
    </div>
  );
}
