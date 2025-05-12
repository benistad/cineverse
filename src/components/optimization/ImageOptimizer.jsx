'use client';

import { useEffect } from 'react';

/**
 * Composant qui optimise le chargement des images pour améliorer les Core Web Vitals
 * en implémentant le lazy loading, la préconnexion aux domaines d'images,
 * et des techniques avancées pour améliorer le Speed Index
 */
export default function ImageOptimizer() {
  useEffect(() => {
    // Préconnexion aux domaines d'images pour accélérer le chargement
    const imageDomains = [
      'image.tmdb.org',
      'via.placeholder.com',
      'images.unsplash.com',
      'res.cloudinary.com'
    ];
    
    imageDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      // DNS-prefetch comme fallback pour les navigateurs qui ne supportent pas preconnect
      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = `https://${domain}`;
      document.head.appendChild(dnsLink);
    });
    
    // Précharger les images critiques du premier écran
    const preloadCriticalImages = () => {
      // Trouver les images visibles dans la fenêtre
      const viewportImages = Array.from(document.querySelectorAll('img'))
        .filter(img => {
          const rect = img.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        });
      
      // Précharger les 3 premières images visibles
      viewportImages.slice(0, 3).forEach(img => {
        const src = img.dataset.src || img.src;
        if (src) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = src;
          preloadLink.fetchPriority = 'high';
          document.head.appendChild(preloadLink);
          
          // Charger immédiatement l'image si elle a un data-src
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      });
    };
    
    // Observer pour le lazy loading des images hors écran avec priorité
    if ('IntersectionObserver' in window) {
      // Options pour l'observer avec marge pour précharger avant que l'image soit visible
      const options = {
        rootMargin: '200px 0px',
        threshold: 0.01
      };
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Ajouter fetchpriority pour les images importantes
            if (img.classList.contains('critical-image')) {
              img.fetchPriority = 'high';
            }
            
            // Charger l'image
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
            
            // Appliquer un effet de fade-in pour améliorer la perception de vitesse
            img.style.opacity = '0';
            img.onload = () => {
              img.style.transition = 'opacity 0.3s ease-in';
              img.style.opacity = '1';
            };
          }
        });
      }, options);
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
    
    // Exécuter le préchargement des images critiques
    if (typeof window !== 'undefined') {
      // Utiliser requestIdleCallback pour ne pas bloquer le thread principal
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preloadCriticalImages, { timeout: 1000 });
      } else {
        setTimeout(preloadCriticalImages, 100);
      }
    }
  }, []);
  
  return null;
}
