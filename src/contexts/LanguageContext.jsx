'use client';

// MULTILINGUAL DISABLED - Force French locale for all components
import { createContext, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLocale = 'fr' }) {
  // MULTILINGUAL DISABLED - Always use French
  const locale = 'fr';

  // Synchroniser le cookie avec le locale français au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.cookie = `NEXT_LOCALE=fr; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  }, []);

  // MULTILINGUAL DISABLED - changeLocale disabled
  const changeLocale = (newLocale) => {
    console.warn('Language switching is disabled. Site is French only.');
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
