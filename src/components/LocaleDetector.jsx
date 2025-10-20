'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Composant qui détecte automatiquement la locale depuis l'URL
 * et définit le cookie NEXT_LOCALE en conséquence
 */
export default function LocaleDetector() {
  const pathname = usePathname();

  useEffect(() => {
    // Si l'URL commence par /en/, définir le cookie en anglais
    if (pathname?.startsWith('/en/')) {
      document.cookie = `NEXT_LOCALE=en; path=/; max-age=${365 * 24 * 60 * 60}`;
    }
    // Sinon, vérifier si le cookie existe, sinon définir en français
    else if (!document.cookie.includes('NEXT_LOCALE=')) {
      document.cookie = `NEXT_LOCALE=fr; path=/; max-age=${365 * 24 * 60 * 60}`;
    }
  }, [pathname]);

  return null; // Ce composant ne rend rien
}
