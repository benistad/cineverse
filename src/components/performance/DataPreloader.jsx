'use client';

import { useEffect } from 'react';
import { fetchWithClientCache } from '@/lib/utils/clientCache';

/**
 * Composant qui précharge les données critiques pour améliorer les performances
 * Ce composant ne rend rien visuellement mais effectue des requêtes en arrière-plan
 */
export default function DataPreloader() {
  useEffect(() => {
    // Fonction pour précharger les données en arrière-plan
    const preloadData = async () => {
      try {
        // Précharger les genres (données qui changent rarement)
        fetchWithClientCache('/api/genres', {}, {
          ttl: 7 * 24 * 60 * 60 * 1000, // 7 jours
          cacheKey: 'genres_list'
        });
        
        // Précharger les films tendance pour la page d'accueil
        fetchWithClientCache('/api/films?limit=10', {}, {
          ttl: 30 * 60 * 1000, // 30 minutes
          cacheKey: 'trending_films'
        });
        
        // Précharger les fournisseurs de streaming (données qui changent rarement)
        fetchWithClientCache('/api/providers', {}, {
          ttl: 7 * 24 * 60 * 60 * 1000, // 7 jours
          cacheKey: 'providers_list'
        });
        
        
      } catch (error) {
        // Ignorer les erreurs de préchargement pour ne pas bloquer l'expérience utilisateur
        console.error('Erreur lors du préchargement des données:', error);
      }
    };
    
    // Utiliser requestIdleCallback pour précharger les données pendant les périodes d'inactivité
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        preloadData();
      }, { timeout: 2000 }); // Timeout de 2 secondes
    } else {
      // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
      setTimeout(preloadData, 1000);
    }
  }, []);
  
  // Ce composant ne rend rien
  return null;
}
