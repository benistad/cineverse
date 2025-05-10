'use client';

import { useState, useEffect } from 'react';
import { 
  getRecentlyRatedFilms, 
  getTopRatedFilms, 
  getPaginatedFilms, 
  getHiddenGems,
  getTopRatedFilmsCount,
  getHiddenGemsCount
} from '@/lib/supabase/films';
import BasicFilmCarousel from '@/components/films/BasicFilmCarousel';
import FilmGrid from '@/components/films/FilmGrid';
import Pagination from '@/components/ui/Pagination';
import FeaturedFilmsCarousel from '@/components/home/FeaturedFilmsCarousel';

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
    // Mettre à jour la page courante immédiatement pour éviter les sauts
    setCurrentPage(page);
    
    // Utiliser un délai court pour éviter le flash de l'état de chargement
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
        
        // Récupérer les films récemment notés
        const recent = await getRecentlyRatedFilms(8);
        setRecentFilms(recent);
        
        // Récupérer les films les mieux notés (Top 10)
        const topRated = await getTopRatedFilms(10);
        setTopRatedFilms(topRated);
        
        // Récupérer le nombre total de films les mieux notés
        const topRatedCount = await getTopRatedFilmsCount();
        setTopRatedFilmsCount(topRatedCount);
        
        // Récupérer les films méconnus à voir
        const gems = await getHiddenGems(8);
        setHiddenGems(gems);
        
        // Récupérer le nombre total de films méconnus à voir
        const hiddenGemsCount = await getHiddenGemsCount();
        setHiddenGemsCount(hiddenGemsCount);
        
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
      // Empêcher le comportement par défaut du navigateur qui pourrait causer un défilement
      // Spécifiquement important pour Safari
      loadPaginatedFilms(newPage);
      
      // Assurer que la page reste à la même position
      setTimeout(() => {
        // Annuler tout défilement qui pourrait se produire
        window.scrollTo(window.scrollX, window.scrollY);
      }, 0);
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
          <BasicFilmCarousel 
            films={recentFilms} 
            title="Films récemment notés" 
            visibleCount={4} 
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
          <BasicFilmCarousel 
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
          <BasicFilmCarousel 
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
