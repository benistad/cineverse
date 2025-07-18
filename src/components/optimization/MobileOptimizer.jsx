'use client';

import { useEffect } from 'react';

/**
 * Composant qui optimise l'expérience mobile en implémentant des techniques
 * pour améliorer les Core Web Vitals et la performance sur les appareils mobiles
 */
export default function MobileOptimizer() {
  useEffect(() => {
    // Ajouter les méta-tags pour l'optimisation mobile
    const metaTags = [
      // Viewport pour le responsive design
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
      // Thème de couleur pour la barre d'adresse mobile
      { name: 'theme-color', content: '#1a56db' },
      // Pour les appareils Apple
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ];
    
    metaTags.forEach(tag => {
      let meta = document.querySelector(`meta[name="${tag.name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = tag.name;
        meta.content = tag.content;
        document.head.appendChild(meta);
      } else {
        meta.content = tag.content;
      }
    });
    
    // Optimiser le touch delay sur mobile
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
      * {
        touch-action: manipulation;
      }
      
      a, button, .clickable {
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    `;
    document.head.appendChild(touchStyle);
    
    // Précharger les ressources critiques
    const preloadResources = [
      // Précharger le script principal
      { rel: 'preload', href: '/main.js', as: 'script' },
      // Précharger le CSS principal
      { rel: 'preload', href: '/main.css', as: 'style' }
    ];
    
    preloadResources.forEach(resource => {
      if (!document.querySelector(`link[rel="${resource.rel}"][href="${resource.href}"]`)) {
        const link = document.createElement('link');
        link.rel = resource.rel;
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
      }
    });
    
    // Optimiser la navigation pour les mobiles (prefetch)
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('touchstart', () => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      }, { passive: true });
    });
    
  }, []);
  
  return null;
}
