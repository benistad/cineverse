'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';
import { getPaginatedFilms } from '@/lib/supabase/films';
import OptimizedFilmCarousel from '@/components/films/OptimizedFilmCarousel';
import FilmGrid from '@/components/films/FilmGrid';
import Pagination from '@/components/ui/Pagination';
import FeaturedCarouselClient from './FeaturedCarouselClient';

/**
 * Composant client de la homepage qui reçoit les données pré-chargées du serveur
 */
export default function HomePageClient({ 
  initialRecentFilms,
  initialTopRatedFilms,
  initialHiddenGems,
  initialFeaturedFilms,
  initialPaginatedFilms,
  initialCounts
}) {
  const { t } = useTranslations();
  
  // États pour la pagination (seule partie dynamique côté client)
  const [allFilms, setAllFilms] = useState(initialPaginatedFilms.films);
  const [totalFilmsCount, setTotalFilmsCount] = useState(initialPaginatedFilms.totalCount);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPagination, setLoadingPagination] = useState(false);
  
  const filmsPerPage = 8;
  const totalPages = Math.ceil(totalFilmsCount / filmsPerPage);

  // Fonction pour charger les films paginés (seul appel API côté client)
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadPaginatedFilms(newPage);
      setTimeout(() => {
        window.scrollTo(window.scrollX, window.scrollY);
      }, 0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
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
            <span style={{ color: '#FEBE29' }}>{t('home.heroTitle').split(': ')[1]}</span>
          </h1>
          
          <h2 
            className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 max-w-2xl mx-auto"
            itemProp="description"
          >
            {t('home.heroSubtitle')}
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.heroDescription')}
          </p>

          <div className="flex justify-center">
            <Link 
              href="/quel-film-regarder" 
              className="inline-flex items-center px-8 py-4 rounded-full bg-indigo-600 text-white text-lg font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              {t('home.findMyFilm')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Carrousel des films à la une */}
      <section>
        <div className="mb-6 px-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800">{t('home.featured')}</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-transparent"></div>
          </div>
        </div>
        <FeaturedCarouselClient initialFilms={initialFeaturedFilms} />
      </section>

      {/* Derniers films notés */}
      <section>
        <OptimizedFilmCarousel 
          films={initialRecentFilms} 
          title={t('home.recentlyRated')} 
          visibleCount={4}
          showCount={false}
        />
      </section>

      {/* Films les mieux notés */}
      <section className="py-8">
        <OptimizedFilmCarousel 
          films={initialTopRatedFilms} 
          title={t('home.topRated')} 
          visibleCount={4} 
          showAllLink="/top-rated"
          showAllText={t('home.viewAll')}
          totalCount={initialCounts.topRated}
        />
      </section>

      {/* Films Méconnus à voir */}
      {initialHiddenGems.length > 0 && (
        <section className="py-8">
          <OptimizedFilmCarousel 
            films={initialHiddenGems} 
            title={t('home.hiddenGems')} 
            visibleCount={4} 
            showAllLink="/films-inconnus"
            showAllText={t('home.viewAll')}
            totalCount={initialCounts.hiddenGems}
          />
        </section>
      )}

      {/* Tous les films avec pagination */}
      <section id="all-films-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-3">
          <div className="flex items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-800">{t('home.allFilms')}</h2>
            <span className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
              {totalFilmsCount}
            </span>
          </div>
          <Link 
            href="/all-films" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group text-sm sm:text-base"
          >
            {t('home.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
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
            <p className="text-gray-500">{t('home.noFilms')}</p>
          </div>
        )}
      </section>

      {/* Section À propos de MovieHunt */}
      <section className="py-16 mt-12">
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">🎬</span>
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
                {t('home.about.title')}
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg" dangerouslySetInnerHTML={{
                __html: t('home.about.intro')
                  .replace(/<strong>/g, '<strong class="text-indigo-800">')
                  .replace(/<link1>/g, '<a href="/advanced-search?hunted=true" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link1>/g, '</a>')
              }} />
              
              <p dangerouslySetInnerHTML={{
                __html: t('home.about.mission')
                  .replace(/<link2>/g, '<a href="/quel-film-regarder" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link2>/g, '</a>')
                  .replace(/<link3>/g, '<a href="/films-inconnus" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link3>/g, '</a>')
              }} />
              
              <p dangerouslySetInnerHTML={{ __html: t('home.about.criteria') }} />
              <p dangerouslySetInnerHTML={{ __html: t('home.about.values') }} />
              
              <p dangerouslySetInnerHTML={{
                __html: t('home.about.method')
                  .replace(/<link4>/g, '<a href="/comment-nous-travaillons" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link4>/g, '</a>')
              }} />
              
              <p className="text-lg font-medium text-indigo-900 pt-4">
                {t('home.about.conclusion')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Explorer - Liens PSEO */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-8 text-center">
            Explorez notre catalogue
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <a href="/genres" className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-3xl mb-2 block">🎬</span>
              <h3 className="font-semibold text-gray-800">Par genre</h3>
              <p className="text-xs text-gray-500">Action, Comédie, Drame...</p>
            </a>
            <a href="/annees" className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-3xl mb-2 block">📅</span>
              <h3 className="font-semibold text-gray-800">Par année</h3>
              <p className="text-xs text-gray-500">2025, 2024, 2023...</p>
            </a>
            <a href="/ambiances" className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-3xl mb-2 block">💕</span>
              <h3 className="font-semibold text-gray-800">Par ambiance</h3>
              <p className="text-xs text-gray-500">Soirée couple, Feel-good...</p>
            </a>
            <a href="/classements" className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-3xl mb-2 block">🏆</span>
              <h3 className="font-semibold text-gray-800">Classements</h3>
              <p className="text-xs text-gray-500">Top 10, Top 20...</p>
            </a>
          </div>

          {/* Liens rapides genres populaires */}
          <div className="flex flex-wrap justify-center gap-2">
            <a href="/genre/action" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Action</a>
            <a href="/genre/comedie" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Comédie</a>
            <a href="/genre/drame" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Drame</a>
            <a href="/genre/horreur" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Horreur</a>
            <a href="/genre/thriller" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Thriller</a>
            <a href="/genre/science-fiction" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Sci-Fi</a>
            <a href="/annee/2025" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Films 2025</a>
            <a href="/annee/2024" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Films 2024</a>
            <a href="/top/20-meilleurs-films" className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm">Top 20</a>
          </div>
        </div>
      </section>
    </div>
  );
}
