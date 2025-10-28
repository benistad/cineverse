'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiLogOut, FiHome, FiSearch, FiFilm, FiFilter, FiChevronDown, FiCompass, FiAward, FiHelpCircle, FiInfo, FiMoon, FiBookOpen, FiUsers, FiStar } from 'react-icons/fi';
import SearchBar from '@/components/search/SearchBar';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const discoverMenuRef = useRef(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { user, loading, signOut } = useAuth();
  const { t } = useTranslations();
  const { locale } = useLanguage();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleDiscoverMenu = () => {
    setIsDiscoverOpen(!isDiscoverOpen);
  };
  
  // Fermer le menu déroulant quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (discoverMenuRef.current && !discoverMenuRef.current.contains(event.target)) {
        setIsDiscoverOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 py-4">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2 group">
              <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                <Image 
                  src="/images/logo-mh.png" 
                  alt="MovieHunt Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain group-hover:rotate-6 transition-transform duration-300"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-indigo-700">MovieHunt</span>
            </Link>
            {/* Blog */}
            <a 
              href="https://www.moviehunt-blog.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 hidden md:flex items-center group text-base font-medium px-4 py-2.5 rounded-full shadow-md hover:shadow-lg"
            >
              <FiBookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">{t('nav.blog')}</span>
            </a>
            <div className="w-72 hidden md:block">
              <SearchBar />
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Recherche Avancée */}
            <Link 
              href={locale === 'en' ? '/en/advanced-search' : '/advanced-search'} 
              className={`text-gray-600 hover:text-indigo-700 transition-colors duration-200 flex items-center group text-base font-medium ${pathname === '/advanced-search' || pathname === '/en/advanced-search' ? 'text-indigo-700' : ''}`}
            >
              <FiFilter className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">{t('nav.advancedSearch')}</span>
            </Link>
            {/* Tous les films */}
            <Link 
              href={locale === 'en' ? '/en/all-films' : '/all-films'} 
              className={`text-gray-600 hover:text-indigo-700 transition-colors duration-200 flex items-center group text-base font-medium ${pathname === '/all-films' || pathname === '/en/all-films' ? 'text-indigo-700' : ''}`}
            >
              <FiFilm className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">{t('nav.allFilms')}</span>
            </Link>
            {/* Découvrir dropdown */}
            <div className="relative" ref={discoverMenuRef}>
              <button
                onClick={toggleDiscoverMenu}
                className={`flex items-center text-gray-600 hover:text-indigo-700 transition-colors duration-200 text-base font-medium group ${
                  pathname === '/quel-film-regarder' || pathname === '/en/quel-film-regarder' || pathname === '/huntedbymoviehunt' || pathname === '/en/huntedbymoviehunt' || pathname === '/comment-nous-travaillons' || pathname === '/en/comment-nous-travaillons' || pathname === '/films-horreur-halloween-2025' || pathname === '/en/films-horreur-halloween-2025' || pathname === '/idees-films-pour-ados' || pathname === '/en/teen-movie-ideas' || pathname === '/films-inconnus' || pathname === '/en/hidden-gems' ? 'text-indigo-700' : ''
                }`}
              >
                <FiCompass className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="whitespace-nowrap">{t('nav.discover')}</span>
                <FiChevronDown className="w-4 h-4 ml-1.5 transition-transform" style={{ transform: isDiscoverOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {isDiscoverOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-gray-200 z-50">
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    <Link 
                      href={locale === 'en' ? '/en/quel-film-regarder' : '/quel-film-regarder'} 
                      className={`block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors ${(pathname === '/quel-film-regarder' || pathname === '/en/quel-film-regarder') ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiHelpCircle className="w-4 h-4 mr-3" /> {t('nav.whatToWatch')}
                    </Link>
                    <Link 
                      href={locale === 'en' ? '/en/hidden-gems' : '/films-inconnus'} 
                      className={`block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors ${(pathname === '/films-inconnus' || pathname === '/en/hidden-gems') ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiStar className="w-4 h-4 mr-3" /> {t('nav.hiddenGems')}
                    </Link>
                    <Link 
                      href={locale === 'en' ? '/en/teen-movie-ideas' : '/idees-films-pour-ados'} 
                      className={`block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors ${(pathname === '/idees-films-pour-ados' || pathname === '/en/teen-movie-ideas') ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiUsers className="w-4 h-4 mr-3" /> {t('nav.teenMovies')}
                    </Link>
                    <Link 
                      href={locale === 'en' ? '/en/halloween-horror-movies-2025' : '/films-horreur-halloween-2025'} 
                      className={`block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors ${(pathname === '/films-horreur-halloween-2025' || pathname === '/en/halloween-horror-movies-2025') ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiMoon className="w-4 h-4 mr-3" /> {t('nav.halloween')}
                    </Link>
                    <Link 
                      href={locale === 'en' ? '/en/huntedbymoviehunt' : '/huntedbymoviehunt'} 
                      className={`block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors ${(pathname === '/huntedbymoviehunt' || pathname === '/en/huntedbymoviehunt') ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiAward className="w-4 h-4 mr-3" /> {t('nav.hunted')}
                    </Link>
                    <Link 
                      href={locale === 'en' ? '/en/comment-nous-travaillons' : '/comment-nous-travaillons'} 
                      className={`block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors ${(pathname === '/comment-nous-travaillons' || pathname === '/en/comment-nous-travaillons') ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiInfo className="w-4 h-4 mr-3" /> {t('nav.howWeWork')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* Sélecteur de langue */}
            <LanguageSelector />
            {/* Admin/Dashboard/Déconnexion */}
            {!loading && user && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className={`text-gray-600 hover:text-indigo-700 transition-colors flex items-center text-base font-medium ${pathname === '/admin/dashboard' ? 'text-indigo-700' : ''}`}
                >
                  <FiFilm className="w-5 h-5 mr-2" />
                  <span className="whitespace-nowrap">{t('nav.dashboard')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-indigo-700 transition-colors flex items-center text-base font-medium"
                >
                  <FiLogOut className="w-5 h-5 mr-2" />
                  <span className="whitespace-nowrap">{t('nav.logout')}</span>
                </button>
              </>
            )}
            {!loading && !user && isAdmin && (
              <Link 
                href="/admin" 
                className="px-4 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              >
                {t('nav.login')}
              </Link>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <SearchBar mobile={true} />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-indigo-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {isOpen ? <FiX className="h-5 w-5 sm:h-6 sm:w-6" /> : <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <Link href="/" className="flex items-center px-3 py-2 mb-2" onClick={() => setIsOpen(false)}>
              <div className="relative w-6 h-6 mr-2">
                <Image 
                  src="/images/logo-mh.png" 
                  alt="MovieHunt Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg font-bold text-indigo-700">MovieHunt</span>
            </Link>
            <a 
              href="https://www.moviehunt-blog.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 rounded-full text-base font-medium bg-red-600 text-white hover:bg-red-700 mx-3 shadow-md"
              onClick={() => setIsOpen(false)}
            >
              <FiBookOpen className="w-5 h-5 mr-3" /> {t('nav.blog')}
            </a>
            <Link 
              href={locale === 'en' ? '/en/advanced-search' : '/advanced-search'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                pathname === '/search' || pathname === '/advanced-search' || pathname === '/en/advanced-search' ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiFilter className="w-5 h-5 mr-3" /> {t('nav.advancedSearch')}
            </Link>
            
            {/* Découvrir section dans le menu mobile */}
            <div className="px-3 py-2 font-medium text-gray-500 text-sm uppercase tracking-wider mt-2 mb-1">{t('nav.discover')}</div>
            
            <Link 
              href={locale === 'en' ? '/en/quel-film-regarder' : '/quel-film-regarder'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                (pathname === '/quel-film-regarder' || pathname === '/en/quel-film-regarder') ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiHelpCircle className="w-5 h-5 mr-3" /> {t('nav.whatToWatch')}
            </Link>
            
            <Link 
              href={locale === 'en' ? '/en/hidden-gems' : '/films-inconnus'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                (pathname === '/films-inconnus' || pathname === '/en/hidden-gems') ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiStar className="w-5 h-5 mr-3" /> {t('nav.hiddenGems')}
            </Link>
            
            <Link 
              href={locale === 'en' ? '/en/teen-movie-ideas' : '/idees-films-pour-ados'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                (pathname === '/idees-films-pour-ados' || pathname === '/en/teen-movie-ideas') ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiUsers className="w-5 h-5 mr-3" /> {t('nav.teenMovies')}
            </Link>
            
            <Link 
              href={locale === 'en' ? '/en/halloween-horror-movies-2025' : '/films-horreur-halloween-2025'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                (pathname === '/films-horreur-halloween-2025' || pathname === '/en/halloween-horror-movies-2025') ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiMoon className="w-5 h-5 mr-3" /> {t('nav.halloween')}
            </Link>
            
            <Link 
              href={locale === 'en' ? '/en/huntedbymoviehunt' : '/huntedbymoviehunt'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                (pathname === '/huntedbymoviehunt' || pathname === '/en/huntedbymoviehunt') ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiAward className="w-5 h-5 mr-3" /> {t('nav.hunted')}
            </Link>
            
            <Link 
              href={locale === 'en' ? '/en/comment-nous-travaillons' : '/comment-nous-travaillons'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                (pathname === '/comment-nous-travaillons' || pathname === '/en/comment-nous-travaillons') ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiInfo className="w-5 h-5 mr-3" /> {t('nav.howWeWork')}
            </Link>
            
            <Link 
              href={locale === 'en' ? '/en/all-films' : '/all-films'} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                (pathname === '/all-films' || pathname === '/en/all-films') ? 'bg-indigo-50 text-indigo-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiFilm className="w-5 h-5 mr-3" /> {t('nav.allFilms')}
            </Link>
            
            {/* Sélecteur de langue mobile */}
            <div className="px-3 py-2 mt-2 border-t border-gray-200">
              <LanguageSelector />
            </div>
            
            {!loading && user && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 ${
                    pathname === '/admin/dashboard' ? 'bg-indigo-50 text-indigo-700' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiFilm className="w-5 h-5 mr-3" /> {t('nav.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <FiLogOut className="w-5 h-5 mr-3" /> {t('nav.logout')}
                </button>
              </>
            )}
            
            {!loading && !user && isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
