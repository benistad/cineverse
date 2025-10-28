'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Composant pour gérer dynamiquement la balise canonical
 * Chaque version linguistique a sa propre canonical
 */
export default function CanonicalTag() {
  const pathname = usePathname();

  useEffect(() => {
    // Supprimer l'ancienne balise canonical si elle existe
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Créer la nouvelle balise canonical avec l'URL actuelle
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${window.location.origin}${pathname}`;
    document.head.appendChild(canonical);
  }, [pathname]);

  return null;
}
