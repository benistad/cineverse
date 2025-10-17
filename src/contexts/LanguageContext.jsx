'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLocale = 'fr' }) {
  // Initialiser avec le cookie si disponible
  const getInitialLocale = () => {
    if (typeof window !== 'undefined') {
      const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      console.log('Cookie locale trouvé:', cookieLocale);
      return cookieLocale || initialLocale;
    }
    return initialLocale;
  };

  const [locale, setLocale] = useState(getInitialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier à nouveau le cookie au montage
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1];
    
    console.log('useEffect - Cookie locale:', cookieLocale, 'Locale actuelle:', locale);
    
    if (cookieLocale && cookieLocale !== locale) {
      console.log('Mise à jour de la locale vers:', cookieLocale);
      setLocale(cookieLocale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    // Définir le cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLocale(newLocale);
    
    // Recharger complètement la page pour appliquer la nouvelle langue
    window.location.reload();
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
