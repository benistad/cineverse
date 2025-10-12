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
      {/* Hero Section Moderne */}
      <section 
        className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4 rounded-2xl overflow-hidden mt-4" 
        itemScope 
        itemType="https://schema.org/WebPage"
        aria-labelledby="moviehunt-hero-title"
      >
        {/* Effet de fond animé */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight" 
            id="moviehunt-hero-title" 
            itemProp="headline"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              MovieHunt
            </span>
            <br />
            <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
              Découvrez votre prochain film
            </span>
          </h1>
          
          <p 
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            itemProp="description"
          >
            Votre compagnon ultime pour des idées de films, des perles rares et des recommandations sur mesure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/quel-film-regarder" 
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span className="relative z-10">Trouver mon film</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <Link 
              href="/all-films" 
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              Parcourir tous les films
            </Link>
          </div>
        </div>
      </section>
      
      {/* Carrousel des films à la une - Optimisé pour le LCP */}
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
