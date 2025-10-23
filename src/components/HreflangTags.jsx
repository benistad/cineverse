'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Liste des pages statiques qui supportent i18n
const staticPages = [
  '/contact',
  '/huntedbymoviehunt',
  '/films-inconnus',
  '/top-rated',
  '/all-films',
  '/comment-nous-travaillons',
  '/quel-film-regarder',
  '/films-horreur-halloween-2025'
];

export default function HreflangTags() {
  const pathname = usePathname();

  useEffect(() => {
    // Enlever /en si présent pour obtenir le chemin de base
    const basePath = pathname.replace(/^\/en/, '') || '/';
    
    // Vérifier si c'est une page statique
    const isStaticPage = staticPages.some(page => basePath === page || basePath.startsWith(page + '/'));
    
    if (isStaticPage) {
      // Supprimer les anciennes balises hreflang
      const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
      existingTags.forEach(tag => tag.remove());
      
      // Créer les nouvelles balises hreflang
      const baseUrl = window.location.origin;
      
      // Français (par défaut)
      const frLink = document.createElement('link');
      frLink.rel = 'alternate';
      frLink.hreflang = 'fr';
      frLink.href = `${baseUrl}${basePath}`;
      document.head.appendChild(frLink);
      
      // Anglais
      const enLink = document.createElement('link');
      enLink.rel = 'alternate';
      enLink.hreflang = 'en';
      enLink.href = `${baseUrl}/en${basePath}`;
      document.head.appendChild(enLink);
      
      // x-default (français par défaut)
      const defaultLink = document.createElement('link');
      defaultLink.rel = 'alternate';
      defaultLink.hreflang = 'x-default';
      defaultLink.href = `${baseUrl}${basePath}`;
      document.head.appendChild(defaultLink);
    }
  }, [pathname]);

  return null; // Ce composant ne rend rien visuellement
}
