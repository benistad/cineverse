'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { applyTranslationsToFilms } from '@/lib/translation/client';
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

export default function EnglishHome() {
  const { t } = useTranslations();
  const { locale } = useLanguage();
  
  // Définir les métadonnées SEO
  useEffect(() => {
    document.title = t('home.metaTitle');
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = t('home.metaDescription');
  }, [t]);
  
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

  // Appliquer les traductions quand la langue change
  useEffect(() => {
    async function applyTranslations() {
      // Appliquer les traductions uniquement si on a des films et qu'on est en anglais
      if (locale === 'en' && (recentFilms.length > 0 || topRatedFilms.length > 0 || hiddenGems.length > 0 || allFilms.length > 0)) {
        console.log('🌍 Applying translations to films...');
        
        const [translatedRecent, translatedTopRated, translatedGems, translatedAll] = await Promise.all([
          recentFilms.length > 0 ? applyTranslationsToFilms(recentFilms, locale) : [],
          topRatedFilms.length > 0 ? applyTranslationsToFilms(topRatedFilms, locale) : [],
          hiddenGems.length > 0 ? applyTranslationsToFilms(hiddenGems, locale) : [],
          allFilms.length > 0 ? applyTranslationsToFilms(allFilms, locale) : []
        ]);
        
        if (translatedRecent.length > 0) setRecentFilms(translatedRecent);
        if (translatedTopRated.length > 0) setTopRatedFilms(translatedTopRated);
        if (translatedGems.length > 0) setHiddenGems(translatedGems);
        if (translatedAll.length > 0) setAllFilms(translatedAll);
        
        console.log('✅ Translations applied');
      }
    }
    
    applyTranslations();
  }, [locale, recentFilms.length, topRatedFilms.length, hiddenGems.length, allFilms.length]);

  // Fonction pour charger les films paginés
  const loadPaginatedFilms = async (page) => {
    setCurrentPage(page);
    
    const loadingTimeout = setTimeout(() => {
      setLoadingPagination(true);
    }, 100);
    
    try {
      const { films, totalCount } = await getPaginatedFilms(page, filmsPerPage, locale);
      setAllFilms(films);
      setTotalFilmsCount(totalCount);
    } catch (error) {
      console.error('Error fetching paginated films:', error);
    } finally {
      clearTimeout(loadingTimeout);
      setLoadingPagination(false);
    }
  };

  // Charger les données initiales avec lazy load progressif et cache
  useEffect(() => {
    async function fetchFilms() {
      try {
        setLoading(true);
        
        // Essayer de récupérer depuis le cache
        const cachedRecent = clientCache.get(`recent_films_${locale}`);
        if (cachedRecent) {
          setRecentFilms(cachedRecent);
          setLoading(false);
        } else {
          const recent = await getRecentlyRatedFilms(8, locale);
          setRecentFilms(recent);
          clientCache.set(`recent_films_${locale}`, recent, 300000);
          setLoading(false);
        }
        
        // Charger les autres sections en arrière-plan
        const cachedTopRated = clientCache.get(`top_rated_films_${locale}`);
        const cachedTopRatedCount = clientCache.get(`top_rated_count_${locale}`);
        const cachedGems = clientCache.get(`hidden_gems_${locale}`);
        const cachedGemsCount = clientCache.get(`hidden_gems_count_${locale}`);
        const cachedPaginated = clientCache.get(`paginated_films_1_${locale}`);
        
        if (cachedTopRated && cachedTopRatedCount && cachedGems && cachedGemsCount && cachedPaginated) {
          setTopRatedFilms(cachedTopRated);
          setTopRatedFilmsCount(cachedTopRatedCount);
          setHiddenGems(cachedGems);
          setHiddenGemsCount(cachedGemsCount);
          setAllFilms(cachedPaginated.films || []);
          setTotalFilmsCount(cachedPaginated.totalCount || 0);
        } else {
          Promise.all([
            getTopRatedFilms(10, 7.5, locale),
            getTopRatedFilmsCount(),
            getHiddenGems(8, locale),
            getHiddenGemsCount(),
            getPaginatedFilms(1, filmsPerPage, locale)
          ]).then(([topRated, topRatedCount, gems, hiddenGemsCount, paginatedResult]) => {
            setTopRatedFilms(topRated);
            setTopRatedFilmsCount(topRatedCount);
            setHiddenGems(gems);
            setHiddenGemsCount(hiddenGemsCount);
            
            clientCache.set(`top_rated_films_${locale}`, topRated, 300000);
            clientCache.set(`top_rated_count_${locale}`, topRatedCount, 300000);
            clientCache.set(`hidden_gems_${locale}`, gems, 300000);
            clientCache.set(`hidden_gems_count_${locale}`, hiddenGemsCount, 300000);
            
            if (paginatedResult) {
              setAllFilms(paginatedResult.films || []);
              setTotalFilmsCount(paginatedResult.totalCount || 0);
              clientCache.set(`paginated_films_1_${locale}`, paginatedResult, 300000);
            }
          }).catch(error => {
            console.error('Error fetching secondary sections:', error);
          });
        }
      } catch (error) {
        console.error('Error fetching recent films:', error);
        setLoading(false);
      }
    }

    fetchFilms();
  }, [filmsPerPage, locale]);
  
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
          
          <p 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {t('home.heroDescription')}
          </p>

          <div className="flex justify-center">
            <Link 
              href="/en/what-movie-to-watch" 
              className="inline-flex items-center px-8 py-4 rounded-full bg-indigo-600 text-white text-lg font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              {t('home.findMyFilm')}
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
      
      {/* Featured Films Carousel */}
      <section>
        <div className="mb-6 px-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800">{t('home.featured')}</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-transparent"></div>
          </div>
        </div>
        <OptimizedFeaturedCarousel />
      </section>

      {/* Recently Rated Films */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <OptimizedFilmCarousel 
            films={recentFilms} 
            title={t('home.recentlyRated')} 
            visibleCount={4}
            showCount={false}
          />
        )}
      </section>

      {/* Top Rated Films */}
      <section className="py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <OptimizedFilmCarousel 
            films={topRatedFilms} 
            title={t('home.topRated')} 
            visibleCount={4} 
            showAllLink="/en/top-rated"
            showAllText={t('home.viewAll')}
            totalCount={topRatedFilmsCount}
          />
        )}
      </section>

      {/* Hidden Gems */}
      <section className="py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hiddenGems.length > 0 ? (
          <OptimizedFilmCarousel 
            films={hiddenGems} 
            title={t('home.hiddenGems')} 
            visibleCount={4} 
            showAllLink="/en/hidden-gems"
            showAllText={t('home.viewAll')}
            totalCount={hiddenGemsCount}
          />
        ) : null}
      </section>

      {/* All Films with Pagination */}
      <section id="all-films-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-3">
          <div className="flex items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-800">{t('home.allFilms')}</h2>
            <span className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
              {totalFilmsCount}
            </span>
          </div>
          <Link 
            href="/en/all-films" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group text-sm sm:text-base"
          >
            {t('home.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
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
                <p className="text-gray-500">{t('home.noFilms')}</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* About MovieHunt Section */}
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
                  .replace(/<link1>/g, '<a href="/en/advanced-search?hunted=true" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link1>/g, '</a>')
              }} />
              
              <p dangerouslySetInnerHTML={{
                __html: t('home.about.mission')
                  .replace(/<link2>/g, '<a href="/en/what-movie-to-watch" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link2>/g, '</a>')
                  .replace(/<link3>/g, '<a href="/en/hidden-gems" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link3>/g, '</a>')
              }} />
              
              <p dangerouslySetInnerHTML={{
                __html: t('home.about.criteria')
              }} />
              
              <p dangerouslySetInnerHTML={{
                __html: t('home.about.values')
              }} />
              
              <p dangerouslySetInnerHTML={{
                __html: t('home.about.method')
                  .replace(/<link4>/g, '<a href="/en/how-we-work" class="font-semibold text-indigo-700 hover:text-indigo-900 underline decoration-2 underline-offset-2">')
                  .replace(/<\/link4>/g, '</a>')
              }} />
              
              <p className="text-lg font-medium text-indigo-900 pt-4">
                {t('home.about.conclusion')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
