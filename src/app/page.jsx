'use client';

import { useState, useEffect } from 'react';
import { getRecentlyRatedFilms, getTopRatedFilms, getPaginatedFilms } from '@/lib/supabase/films';
import FilmCarousel from '@/components/films/FilmCarousel';
import FilmGrid from '@/components/films/FilmGrid';
import Pagination from '@/components/ui/Pagination';
import FeaturedFilmsCarousel from '@/components/home/FeaturedFilmsCarousel';

export default function Home() {
  const [recentFilms, setRecentFilms] = useState([]);
  const [topRatedFilms, setTopRatedFilms] = useState([]);
  const [allFilms, setAllFilms] = useState([]);
  const [totalFilmsCount, setTotalFilmsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);
  
  const filmsPerPage = 8;

  // Fonction pour charger les films paginés
  const loadPaginatedFilms = async (page) => {
    setLoadingPagination(true);
    try {
      const { films, totalCount } = await getPaginatedFilms(page, filmsPerPage);
      setAllFilms(films);
      setTotalFilmsCount(totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erreur lors de la récupération des films paginés:', error);
    } finally {
      setLoadingPagination(false);
    }
  };

  // Charger les données initiales
  useEffect(() => {
    async function fetchFilms() {
      try {
        // Récupérer les films récemment notés
        const recentFilmsData = await getRecentlyRatedFilms(8);
        setRecentFilms(recentFilmsData);
        
        // Récupérer les films les mieux notés
        const topRatedFilmsData = await getTopRatedFilms(8);
        setTopRatedFilms(topRatedFilmsData);
        
        // Récupérer tous les films (première page)
        await loadPaginatedFilms(1);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalFilmsCount / filmsPerPage);
  
  // Gérer le changement de page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Ne plus faire défiler la page automatiquement
      loadPaginatedFilms(newPage);
    }
  };

  return (
    <div className="space-y-12">
      {/* Carrousel des films à la une */}
      <section>
        <FeaturedFilmsCarousel />
      </section>

      {/* Films récemment notés */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <FilmCarousel 
            films={recentFilms} 
            title="Films récemment notés" 
            visibleCount={4} 
          />
        )}
      </section>

      {/* Films les mieux notés */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <FilmCarousel 
            films={topRatedFilms} 
            title="Films les mieux notés" 
            visibleCount={4} 
          />
        )}
      </section>
      
      {/* Tous les films avec pagination */}
      <section id="all-films-section">
        <h2 className="text-3xl font-bold mb-6">Tous les films</h2>
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
