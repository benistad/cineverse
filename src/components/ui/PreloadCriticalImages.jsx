'use client';

import { useEffect } from 'react';
import Head from 'next/head';

/**
 * Précharge les images critiques pour améliorer le LCP (Largest Contentful Paint)
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.imagePaths - Chemins des images à précharger
 */
export default function PreloadCriticalImages({ imagePaths = [] }) {
  // Ajouter dynamiquement les liens de préchargement
  useEffect(() => {
    // Ne précharger que les 3 premières images pour ne pas surcharger
    const criticalImages = imagePaths.slice(0, 3);
    
    criticalImages.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      link.type = 'image/webp'; // Supposant que toutes les images sont en WebP
      document.head.appendChild(link);
      
      // Nettoyage lors du démontage du composant
      return () => {
        document.head.removeChild(link);
      };
    });
  }, [imagePaths]);

  return null;
}
