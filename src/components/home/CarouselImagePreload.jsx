'use client';

import { useEffect } from 'react';

/**
 * Précharge la première image du carrousel pour améliorer le LCP
 * Ce composant doit être rendu avant le carrousel principal
 */
export default function CarouselImagePreload({ imageUrl }) {
  useEffect(() => {
    if (!imageUrl) return;
    
    // Créer un lien de préchargement pour l'image critique
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    link.fetchPriority = 'high';
    
    // Ajouter des attributs pour les images responsive
    link.imageSrcset = `
      ${imageUrl.replace('w1280', 'w640')} 640w,
      ${imageUrl.replace('w1280', 'w750')} 750w,
      ${imageUrl.replace('w1280', 'w828')} 828w,
      ${imageUrl.replace('w1280', 'w1080')} 1080w,
      ${imageUrl} 1280w
    `;
    link.imageSizes = '100vw';
    
    document.head.appendChild(link);
    
    // Nettoyage
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [imageUrl]);

  return null;
}
