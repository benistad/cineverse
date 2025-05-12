'use client';

import { useEffect } from 'react';

/**
 * Composant qui optimise le chargement des polices pour améliorer les Core Web Vitals
 * en préchargeant les polices nécessaires et en appliquant font-display: swap
 */
export default function FontOptimizer() {
  useEffect(() => {
    // Précharger les polices principales
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap'
    ];
    
    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.href = url;
      link.rel = 'preload';
      link.as = 'style';
      link.onload = "this.onload=null;this.rel='stylesheet'";
      document.head.appendChild(link);
    });
    
    // Ajouter une règle CSS pour appliquer font-display: swap à toutes les polices
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }, []);
  
  return null;
}
