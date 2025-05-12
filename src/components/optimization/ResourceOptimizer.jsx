'use client';

import { useEffect } from 'react';

/**
 * Composant qui optimise le chargement des ressources (polices, scripts, etc.)
 * pour améliorer le Speed Index et les Core Web Vitals
 */
export default function ResourceOptimizer() {
  useEffect(() => {
    // Optimiser le chargement des polices
    const optimizeFontLoading = () => {
      // Définir les polices comme non bloquantes
      document.documentElement.classList.add('font-loading');
      
      // Vérifier si les polices sont chargées
      if ('fonts' in document) {
        Promise.all([
          document.fonts.load('1em Geist'),
          document.fonts.load('1em Geist Mono')
        ]).then(() => {
          document.documentElement.classList.remove('font-loading');
          document.documentElement.classList.add('fonts-loaded');
        }).catch(err => {
          console.error('Erreur lors du chargement des polices:', err);
          // Supprimer la classe même en cas d'erreur pour éviter de bloquer l'affichage
          document.documentElement.classList.remove('font-loading');
        });
      }
    };

    // Optimiser le chargement des scripts
    const optimizeScriptLoading = () => {
      // Ajouter l'attribut async aux scripts non critiques
      document.querySelectorAll('script').forEach(script => {
        if (!script.hasAttribute('src')) return;
        
        const src = script.getAttribute('src');
        if (src.includes('gtag') || 
            src.includes('analytics') || 
            src.includes('tracking') || 
            src.includes('ads')) {
          script.setAttribute('async', '');
          script.setAttribute('defer', '');
        }
      });
    };

    // Optimiser le chargement des CSS
    const optimizeCssLoading = () => {
      // Précharger les feuilles de style critiques
      const criticalStyles = [
        '/globals.css'
      ];
      
      criticalStyles.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Ajouter des indicateurs de performance pour mesurer le Speed Index
    const addPerformanceMarkers = () => {
      if (window.performance && window.performance.mark) {
        window.performance.mark('app-rendered');
        
        // Mesurer le temps jusqu'au premier rendu significatif
        setTimeout(() => {
          window.performance.mark('first-meaningful-paint');
          window.performance.measure('fmp', 'navigationStart', 'first-meaningful-paint');
          
          const fmpEntry = window.performance.getEntriesByName('fmp')[0];
          if (fmpEntry) {
            console.log(`First Meaningful Paint: ${fmpEntry.duration.toFixed(2)}ms`);
          }
        }, 0);
      }
    };

    // Exécuter les optimisations
    if (typeof window !== 'undefined') {
      // Exécuter immédiatement les optimisations critiques
      optimizeFontLoading();
      optimizeCssLoading();
      
      // Utiliser requestIdleCallback pour les optimisations non critiques
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          optimizeScriptLoading();
          addPerformanceMarkers();
        }, { timeout: 2000 });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
        setTimeout(() => {
          optimizeScriptLoading();
          addPerformanceMarkers();
        }, 200);
      }
    }
  }, []);

  return null;
}
