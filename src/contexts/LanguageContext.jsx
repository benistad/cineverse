'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLocale = 'fr' }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Initialiser avec l'URL en priorité, puis le cookie - une seule fois
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      // Détecter depuis l'URL en premier
      const isEnglishPath = pathname?.startsWith('/en');
      if (isEnglishPath) return 'en';
      
      // Sinon vérifier le cookie
      const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      return cookieLocale || initialLocale;
    }
    return initialLocale;
  });

  // Synchroniser le cookie avec le locale actuel au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  }, []);

  const changeLocale = (newLocale) => {
    // Définir le cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLocale(newLocale);
    
    // Liste des pages statiques à gérer avec i18n
    const staticPages = [
      '/contact',
      '/huntedbymoviehunt',
      '/films-inconnus',
      '/hidden-gems',
      '/top-rated',
      '/all-films',
      '/comment-nous-travaillons',
      '/how-we-work',
      '/quel-film-regarder',
      '/what-movie-to-watch',
      '/films-horreur-halloween-2025',
      '/halloween-horror-movies-2025',
      '/idees-films-pour-ados',
      '/teen-movie-ideas'
    ];
    
    // Mapping des URLs FR vers EN pour les pages avec URLs différentes
    const urlMapping = {
      '/idees-films-pour-ados': '/teen-movie-ideas',
      '/films-inconnus': '/hidden-gems',
      '/films-horreur-halloween-2025': '/halloween-horror-movies-2025',
      '/quel-film-regarder': '/what-movie-to-watch',
      '/comment-nous-travaillons': '/how-we-work'
    };
    
    // Vérifier si on est sur une page statique
    const currentPath = pathname.replace(/^\/en/, ''); // Enlever /en si présent
    const isStaticPage = staticPages.some(page => currentPath === page || currentPath.startsWith(page + '/'));
    
    if (isStaticPage) {
      // Rediriger vers l'URL appropriée
      if (newLocale === 'en') {
        // Passer en anglais
        if (!pathname.startsWith('/en/')) {
          // On est sur une page FR, on passe en EN
          const mappedPath = urlMapping[currentPath] || currentPath;
          console.log('🇬🇧 FR→EN:', { currentPath, mappedPath, target: `/en${mappedPath}` });
          window.location.href = `/en${mappedPath}`;
        } else {
          // Déjà en anglais, recharger
          window.location.reload();
        }
      } else {
        // Passer en français
        if (pathname.startsWith('/en/')) {
          // On est sur une page EN, on passe en FR
          // Trouver le mapping inverse si nécessaire
          const reverseMappedPath = Object.keys(urlMapping).find(
            key => urlMapping[key] === currentPath
          ) || currentPath;
          console.log('🇫🇷 EN→FR:', { currentPath, reverseMappedPath, target: reverseMappedPath });
          window.location.href = reverseMappedPath;
        } else {
          // Déjà en français, recharger
          window.location.reload();
        }
      }
    } else {
      // Pour les autres pages, recharger simplement
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
