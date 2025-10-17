'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLocale = 'fr' }) {
  const [locale, setLocale] = useState(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Récupérer la langue depuis le cookie
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1];
    
    if (cookieLocale && cookieLocale !== locale) {
      setLocale(cookieLocale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    // Définir le cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLocale(newLocale);
    
    // Recharger la page pour appliquer la nouvelle langue
    router.refresh();
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
