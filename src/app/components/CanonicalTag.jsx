'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * Composant pour ajouter une balise canonique à chaque page
 * Ce composant utilise un script côté client pour injecter la balise canonique
 * dans le head du document après le chargement de la page
 */
export default function CanonicalTag() {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  const canonicalUrl = `${baseUrl}${pathname}`;
  
  // Script qui injecte la balise canonique dans le head
  const injectCanonicalScript = `
    (function() {
      // Supprimer toute balise canonique existante
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }
      
      // Créer et ajouter la nouvelle balise canonique
      const canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = '${canonicalUrl}';
      document.head.appendChild(canonicalLink);
    })();
  `;

  return (
    <Script
      id="canonical-tag"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: injectCanonicalScript }}
    />
  );
}
