'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getPaginatedFilms
} from '@/lib/supabase/films';
import {
  getRecentlyRatedFilms,
  getTopRatedFilms,
  getHiddenGems,
  getTopRatedFilmsCount,
  getHiddenGemsCount
} from '@/lib/supabase/optimizedFilms';
import OptimizedFilmCarousel from '@/components/films/OptimizedFilmCarousel';
import FilmGrid from '@/components/films/FilmGrid';
import Pagination from '@/components/ui/Pagination';
// CHANGEMENT: Utiliser le carrousel optimisé pour le LCP
import OptimizedFeaturedCarousel from '@/components/home/OptimizedFeaturedCarousel';

export default function Home() {
  const [recentFilms, setRecentFilms] = useState([]);
  const [topRatedFilms, setTopRatedFilms] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [allFilms, setAllFilms] = useState([]);
  const [totalFilmsCount, setTotalFilmsCount] = useState(0);
  const [topRatedFilmsCount, setTopRatedFilmsCount] = useState(0);
  const [hiddenGemsCount, setHiddenGemsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);
  
  const filmsPerPage = 8;

  // Fonction pour charger les films paginés
  const loadPaginatedFilms = async (page) => {
    setCurrentPage(page);
    
    const loadingTimeout = setTimeout(() => {
      setLoadingPagination(true);
    }, 100);
    
    try {
      const { films, totalCount } = await getPaginatedFilms(page, filmsPerPage);
      setAllFilms(films);
      setTotalFilmsCount(totalCount);
    } catch (error) {
      console.error('Erreur lors de la récupération des films paginés:', error);
    } finally {
      clearTimeout(loadingTimeout);
      setLoadingPagination(false);
    }
  };

  // Charger les données initiales
  useEffect(() => {
    async function fetchFilms() {
      try {
        setLoading(true);
        
        // OPTIMISATION: Charger uniquement les données critiques en premier
        // Le carrousel se charge de manière autonome
        const [
          recent,
          topRated,
          topRatedCount,
          gems,
          hiddenGemsCount,
          paginatedResult
        ] = await Promise.all([
          getRecentlyRatedFilms(8),
          getTopRatedFilms(10),
          getTopRatedFilmsCount(),
          getHiddenGems(8),
          getHiddenGemsCount(),
          getPaginatedFilms(1, filmsPerPage)
        ]);
        
        setRecentFilms(recent);
        setTopRatedFilms(topRated);
        setTopRatedFilmsCount(topRatedCount);
        setHiddenGems(gems);
        setHiddenGemsCount(hiddenGemsCount);
        
        if (paginatedResult) {
          setAllFilms(paginatedResult.films || []);
          setTotalFilmsCount(paginatedResult.totalCount || 0);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, [filmsPerPage]);
  
  const totalPages = Math.ceil(totalFilmsCount / filmsPerPage);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadPaginatedFilms(newPage);
      
      setTimeout(() => {
        window.scrollTo(window.scrollX, window.scrollY);
      }, 0);
    }
  };

  return (
    <div className="space-y-2">
      <section 
        className="py-0 text-center mt-[-20px]" 
        itemScope 
        itemType="https://schema.org/WebPage"
        aria-labelledby="idee-de-film-quel-film-regarder"
      >
        <h1 
          className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 text-gray-900" 
          id="idee-de-film-quel-film-regarder" 
          aria-label="Idée de film : quel film regarder ? Trouvez l'inspiration sur Movie Hunt"
          itemScope itemProp="headline"
        >
          <span className="text-blue-600 font-black">Idée de film</span> : <span className="text-blue-600 font-black">quel film regarder</span> ?<br />
          <span className="text-gray-800 font-semibold text-lg sm:text-xl md:text-2xl">Trouvez l'inspiration sur <span className="text-blue-600 font-black">Movie Hunt</span></span>
        </h1>
        <div className="flex justify-center my-1">
          <span className="inline-block w-24 h-1 rounded bg-blue-200"></span>
        </div>
        <div className="mt-3 mb-2">
          <Link 
            href="/quel-film-regarder" 
            className="inline-flex items-center px-5 py-2 rounded-md text-white text-sm font-medium transition-all hover:bg-blue-700"
            style={{ backgroundColor: '#4A68D9' }}
          >
            Découvrir nos suggestions de films
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* OPTIMISATION: Carrousel optimisé pour le LCP */}
      <section>
        <OptimizedFeaturedCarousel />
      </section>

      {/* Derniers films notés */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <OptimizedFilmCarousel 
            films={recentFilms} 
            title="Derniers films notés" 
            visibleCount={4}
            showCount={false}
          />
        )}
      </section>

      {/* Films les mieux notés */}
      <section className="py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <OptimizedFilmCarousel 
            films={topRatedFilms} 
            title="Films les mieux notés" 
            visibleCount={4} 
            showAllLink="/top-rated"
            showAllText="Voir tous les films"
            totalCount={topRatedFilmsCount}
          />
        )}
      </section>

      {/* Films Méconnus à voir */}
      <section className="py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hiddenGems.length > 0 ? (
          <OptimizedFilmCarousel 
            films={hiddenGems} 
            title="Films méconnus à voir" 
            visibleCount={4} 
            showAllLink="/hidden-gems"
            showAllText="Voir tous les films"
            totalCount={hiddenGemsCount}
          />
        ) : null}
      </section>

      {/* Tous les films avec pagination */}
      <section id="all-films-section">
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold">Tous les films</h2>
          <span className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
            {totalFilmsCount}
          </span>
          <Link 
            href="/all-films" 
            className="ml-4 px-4 py-2 rounded-md text-white text-sm font-medium"
            style={{ backgroundColor: '#4A68D9' }}
          >
            Voir tous les films
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {loadingPagination ? (
              <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : allFilms.length > 0 ? (
              <>
                <FilmGrid films={allFilms} />
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">Aucun film disponible pour le moment.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
