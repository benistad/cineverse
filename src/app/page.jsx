'use client';

import { useState, useEffect } from 'react';
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
import FeaturedFilmsCarousel from '@/components/home/FeaturedFilmsCarousel';
import PreloadCriticalImages from '@/components/ui/PreloadCriticalImages';

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
        
        // Charger toutes les données en parallèle pour améliorer les performances
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
        
        // Mettre à jour l'état avec les résultats
        setRecentFilms(recent);
        setTopRatedFilms(topRated);
        setTopRatedFilmsCount(topRatedCount);
        setHiddenGems(gems);
        setHiddenGemsCount(hiddenGemsCount);
        
        // Mettre à jour les films paginés
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

  // Préparer les chemins d'images critiques pour le préchargement
  const criticalImagePaths = [];
  
  // Ajouter les images des films à la une s'ils sont disponibles
  if (topRatedFilms.length > 0) {
    // Ajouter les 2 premières images des films les mieux notés
    topRatedFilms.slice(0, 2).forEach(film => {
      if (film.poster_url) {
        criticalImagePaths.push(film.poster_url);
      }
    });
  }

  return (
    <div className="space-y-12">
      <section className="py-10 text-center">
  <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
    <span className="text-blue-600 font-black">Idée de film</span> : <span className="text-blue-600 font-black">quel film regarder</span> ?<br />
    <span className="text-gray-800 font-semibold">Trouvez l’inspiration sur <span className="text-blue-600 font-black">Movie Hunt</span></span>
  </h1>
  <div className="flex justify-center my-4">
    <span className="inline-block w-24 h-1 rounded bg-blue-200"></span>
  </div>

</section>
      {/* Préchargement des images critiques */}
      <PreloadCriticalImages imagePaths={criticalImagePaths} />
      
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
          <OptimizedFilmCarousel 
            films={recentFilms} 
            title="Films récemment notés" 
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
