'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiLogOut, FiHome, FiSearch, FiFilm, FiFilter, FiChevronDown, FiCompass, FiAward, FiHelpCircle } from 'react-icons/fi';
import SearchBar from '@/components/search/SearchBar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const discoverMenuRef = useRef(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { user, loading, signOut } = useAuth();

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
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                <Image 
                  src="/images/logo-mh.png" 
                  alt="MovieHunt Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl font-bold">MovieHunt</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="mr-4 w-64">
              <SearchBar />
            </div>
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Accueil
            </Link>
            <Link 
              href="/search" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/search' || pathname === '/advanced-search' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center">
                <FiFilter className="mr-1" />
                Recherche
              </span>
            </Link>
            
            {/* Menu déroulant Découvrir */}
            <div className="relative" ref={discoverMenuRef}>
              <button
                onClick={toggleDiscoverMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  pathname === '/quel-film-regarder' || pathname === '/huntedbymoviehunt' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <FiCompass className="mr-1" />
                Découvrir
                <FiChevronDown className={`ml-1 transition-transform ${isDiscoverOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDiscoverOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link 
                      href="/quel-film-regarder" 
                      className={`block px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center ${
                        pathname === '/quel-film-regarder' ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiHelpCircle className="mr-2" />
                      Quel film regarder ?
                    </Link>
                    <Link 
                      href="/huntedbymoviehunt" 
                      className={`block px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center ${
                        pathname === '/huntedbymoviehunt' ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => setIsDiscoverOpen(false)}
                    >
                      <FiAward className="mr-2" />
                      Hunted by MovieHunt
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {!loading && user && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/search" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin/search' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  Rechercher
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Déconnexion
                </button>
              </>
            )}
            
            {!loading && !user && isAdmin && (
              <Link 
                href="/admin" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <SearchBar mobile={true} />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            >
              {isOpen ? <FiX className="h-5 w-5 sm:h-6 sm:w-6" /> : <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg">
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
              <span className="text-lg font-bold">MovieHunt</span>
            </Link>
            <Link 
              href="/" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiHome className="mr-2" /> Accueil
            </Link>
            <Link 
              href="/search" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/search' || pathname === '/advanced-search' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiFilter className="mr-2" /> Recherche
            </Link>
            
            {/* Découvrir section dans le menu mobile */}
            <div className="px-3 py-2 font-medium text-gray-300 text-sm uppercase tracking-wider mt-2 mb-1">Découvrir</div>
            
            <Link 
              href="/quel-film-regarder" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/quel-film-regarder' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiHelpCircle className="mr-2" /> Quel film regarder ?
            </Link>
            
            <Link 
              href="/huntedbymoviehunt" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/huntedbymoviehunt' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FiAward className="mr-2" /> Hunted by MovieHunt
            </Link>
            
            {!loading && user && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === '/admin/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiFilm className="mr-2" /> Dashboard
                </Link>
                <Link 
                  href="/admin/search" 
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === '/admin/search' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiSearch className="mr-2" /> Rechercher
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  <FiLogOut className="mr-2" /> Déconnexion
                </button>
              </>
            )}
            
            {!loading && !user && isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
