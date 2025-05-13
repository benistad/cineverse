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
    if (!imagePaths || imagePaths.length === 0) return;
    
    // Ne précharger que les 3 premières images pour ne pas surcharger
    const criticalImages = imagePaths.slice(0, 3);
    const addedLinks = [];
    
    criticalImages.forEach(path => {
      if (!path) return;
      
      // Détecter le type MIME en fonction de l'extension du fichier
      const getImageType = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        switch (extension) {
          case 'webp': return 'image/webp';
          case 'jpg': case 'jpeg': return 'image/jpeg';
          case 'png': return 'image/png';
          case 'gif': return 'image/gif';
          case 'svg': return 'image/svg+xml';
          default: return ''; // Ne pas spécifier de type si inconnu
        }
      };
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      
      // Définir le type MIME uniquement si on peut le déterminer
      const mimeType = getImageType(path);
      if (mimeType) {
        link.type = mimeType;
      }
      
      document.head.appendChild(link);
      addedLinks.push(link);
    });
    
    // Nettoyage lors du démontage du composant
    return () => {
      addedLinks.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [imagePaths]);

  return null;
}
