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
import OptimizedFeaturedCarousel from '@/components/home/OptimizedFeaturedCarousel';
import { clientCache } from '@/lib/cache/clientCache';

export default function Home() {
  // Définir les métadonnées SEO
  useEffect(() => {
    document.title = 'MovieHunt : idées de films - Quel film regarder ?';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus.';
  }, []);
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

  // Charger les données initiales avec lazy load progressif et cache pour améliorer le TTI
  useEffect(() => {
    async function fetchFilms() {
      try {
        // PHASE 1: Vérifier le cache puis charger les films récents
        setLoading(true);
        
        // Essayer de récupérer depuis le cache
        const cachedRecent = clientCache.get('recent_films');
        if (cachedRecent) {
          setRecentFilms(cachedRecent);
          setLoading(false); // ✅ Page interactive immédiatement avec le cache
        } else {
          const recent = await getRecentlyRatedFilms(8);
          setRecentFilms(recent);
          clientCache.set('recent_films', recent, 300000); // Cache 5 minutes
          setLoading(false); // ✅ Page interactive maintenant
        }
        
        // PHASE 2: Charger les autres sections en arrière-plan (non bloquant)
        // Vérifier le cache pour chaque section
        const cachedTopRated = clientCache.get('top_rated_films');
        const cachedTopRatedCount = clientCache.get('top_rated_count');
        const cachedGems = clientCache.get('hidden_gems');
        const cachedGemsCount = clientCache.get('hidden_gems_count');
        const cachedPaginated = clientCache.get('paginated_films_1');
        
        if (cachedTopRated && cachedTopRatedCount && cachedGems && cachedGemsCount && cachedPaginated) {
          // Tout est en cache, utiliser les données
          setTopRatedFilms(cachedTopRated);
          setTopRatedFilmsCount(cachedTopRatedCount);
          setHiddenGems(cachedGems);
          setHiddenGemsCount(cachedGemsCount);
          setAllFilms(cachedPaginated.films || []);
          setTotalFilmsCount(cachedPaginated.totalCount || 0);
        } else {
          // Charger depuis l'API et mettre en cache
          Promise.all([
            getTopRatedFilms(10),
            getTopRatedFilmsCount(),
            getHiddenGems(8),
            getHiddenGemsCount(),
            getPaginatedFilms(1, filmsPerPage)
          ]).then(([topRated, topRatedCount, gems, hiddenGemsCount, paginatedResult]) => {
            setTopRatedFilms(topRated);
            setTopRatedFilmsCount(topRatedCount);
            setHiddenGems(gems);
            setHiddenGemsCount(hiddenGemsCount);
            
            // Mettre en cache
            clientCache.set('top_rated_films', topRated, 300000);
            clientCache.set('top_rated_count', topRatedCount, 300000);
            clientCache.set('hidden_gems', gems, 300000);
            clientCache.set('hidden_gems_count', hiddenGemsCount, 300000);
            
            if (paginatedResult) {
              setAllFilms(paginatedResult.films || []);
              setTotalFilmsCount(paginatedResult.totalCount || 0);
              clientCache.set('paginated_films_1', paginatedResult, 300000);
            }
          }).catch(error => {
            console.error('Erreur lors de la récupération des sections secondaires:', error);
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des films récents:', error);
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

  return (
    <div className="space-y-8">
      {/* Hero Section - Style maquette */}
      <section 
        className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 py-16 px-4 rounded-2xl overflow-hidden mt-4" 
        itemScope 
        itemType="https://schema.org/WebPage"
        aria-labelledby="moviehunt-hero-title"
      >
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" 
            id="moviehunt-hero-title" 
            itemProp="headline"
          >
            <span className="text-indigo-800">MovieHunt: </span>
            <span style={{ color: '#FEBE29' }}>idées de films</span>
          </h1>
          
          <h2 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
            itemProp="description"
          >
            Quel film regarder ?
          </h2>
          
          <p 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Votre compagnon ultime pour des idées de films, des perles rares et des recommandations sur mesure.
          </p>

          <div className="flex justify-center">
            <Link 
              href="/quel-film-regarder" 
              className="inline-flex items-center px-8 py-4 rounded-full bg-indigo-600 text-white text-lg font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Trouver mon film
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Carrousel des films à la une - Optimisé pour le LCP */}
      <section>
        <div className="mb-6 px-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800">À la une</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-transparent"></div>
          </div>
        </div>
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
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-800">Tous les films</h2>
              <span className="ml-4 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
                {totalFilmsCount}
              </span>
            </div>
            <Link 
              href="/all-films" 
              className="hidden sm:inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group"
            >
              Voir tous les films
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
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
