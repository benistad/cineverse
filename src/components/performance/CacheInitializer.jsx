'use client';

import { useEffect } from 'react';
import { initCacheCleanup } from '@/lib/utils/clientCache';

/**
 * Composant qui initialise le cache client et le nettoyage automatique
 * Ce composant ne rend rien visuellement mais configure le cache côté client
 */
export default function CacheInitializer() {
  useEffect(() => {
    // Initialiser le nettoyage automatique du cache
    // Nettoyer le cache une fois par jour et supprimer les entrées de plus de 7 jours
    const cleanup = initCacheCleanup(
      24 * 60 * 60 * 1000, // Intervalle de nettoyage: 24 heures
      7 * 24 * 60 * 60 * 1000 // Âge maximum: 7 jours
    );
    
    // Nettoyer lors du démontage du composant
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);
  
  // Ce composant ne rend rien
  return null;
}
