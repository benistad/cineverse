'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiLogOut, FiHome, FiSearch, FiFilm } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image 
                  src="/images/logo-mh.png" 
                  alt="MovieHunt Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold">MovieHunt</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Accueil
            </Link>
            
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
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
