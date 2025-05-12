'use client';

import { useEffect } from 'react';

/**
 * Composant qui optimise le chargement des images pour améliorer les Core Web Vitals
 * en implémentant le lazy loading et la préconnexion aux domaines d'images
 */
export default function ImageOptimizer() {
  useEffect(() => {
    // Préconnexion aux domaines d'images pour accélérer le chargement
    const imageDomains = [
      'image.tmdb.org',
      'via.placeholder.com'
    ];
    
    imageDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      document.head.appendChild(link);
      
      // DNS-prefetch comme fallback pour les navigateurs qui ne supportent pas preconnect
      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = `https://${domain}`;
      document.head.appendChild(dnsLink);
    });
    
    // Observer pour le lazy loading des images hors écran
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }, []);
  
  return null;
}
