'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Composant qui précharge intelligemment les images critiques
 * Utilise l'API Intersection Observer pour précharger les images lorsque l'utilisateur approche
 */
export default function SmartImagePreloader() {
  const pathname = usePathname();
  const [preloadedImages, setPreloadedImages] = useState([]);
  
  useEffect(() => {
    // Réinitialiser les images préchargées lors du changement de page
    setPreloadedImages([]);
    
    // Fonction pour précharger une image
    const preloadImage = (src) => {
      // Éviter de précharger la même image plusieurs fois
      if (preloadedImages.includes(src)) {
        return;
      }
      
      const img = new Image();
      img.src = src;
      
      // Ajouter l'image à la liste des images préchargées
      setPreloadedImages((prev) => [...prev, src]);
    };
    
    // Fonction pour précharger les images visibles dans la fenêtre
    const setupImagePreloading = () => {
      // Sélectionner toutes les images visibles
      const images = document.querySelectorAll('img[data-src], img[src]');
      
      // Créer un observateur d'intersection
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Si l'image est visible ou proche de l'être
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              const img = entry.target;
              const src = img.dataset.src || img.src;
              
              if (src) {
                // Précharger l'image
                preloadImage(src);
                
                // Arrêter d'observer cette image
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '200px', // Précharger les images 200px avant qu'elles ne soient visibles
          threshold: 0.01,
        }
      );
      
      // Observer chaque image
      images.forEach((img) => {
        observer.observe(img);
      });
      
      // Nettoyer l'observateur lors du démontage du composant
      return () => {
        images.forEach((img) => {
          observer.unobserve(img);
        });
      };
    };
    
    // Précharger les images après le chargement de la page
    if (typeof window !== 'undefined') {
      // Attendre que le DOM soit complètement chargé
      if (document.readyState === 'complete') {
        setupImagePreloading();
      } else {
        window.addEventListener('load', setupImagePreloading);
        return () => {
          window.removeEventListener('load', setupImagePreloading);
        };
      }
    }
  }, [pathname, preloadedImages]);
  
  // Ce composant ne rend rien
  return null;
}
