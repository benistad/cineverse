'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';

/**
 * Composant qui optimise le Speed Index en préchargeant les ressources critiques
 * et en appliquant des optimisations pour le rendu initial
 */
export default function SpeedIndexOptimizer() {
  useEffect(() => {
    // Fonction pour précharger les images critiques
    const preloadCriticalImages = () => {
      const criticalImages = [
        '/images/logo.png',
        // Ajoutez ici d'autres images critiques pour le premier affichage
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Précharger les domaines externes pour les images
    const preconnectToDomains = () => {
      const domains = [
        'https://image.tmdb.org',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ];
      
      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Optimiser le chargement des polices
    const optimizeFontLoading = () => {
      // Ajouter un préchargement pour les polices Geist
      const fontFiles = [
        'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap',
      ];
      
      fontFiles.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = fontUrl;
        document.head.appendChild(link);
        
        // Charger la police immédiatement après
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = fontUrl;
        document.head.appendChild(fontLink);
      });
    };

    // Optimiser le chargement des scripts
    const optimizeScriptLoading = () => {
      // Ajouter l'attribut async aux scripts non critiques
      document.querySelectorAll('script:not([type="application/ld+json"])').forEach(script => {
        if (!script.hasAttribute('src')) return;
        if (script.getAttribute('src').includes('gtag') || script.getAttribute('src').includes('analytics')) {
          script.setAttribute('async', '');
          script.setAttribute('defer', '');
        }
      });
    };

    // Exécuter les optimisations
    if (typeof window !== 'undefined') {
      // Utiliser requestIdleCallback pour exécuter les optimisations pendant les périodes d'inactivité
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          preloadCriticalImages();
          preconnectToDomains();
          optimizeFontLoading();
          optimizeScriptLoading();
        }, { timeout: 2000 });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
        setTimeout(() => {
          preloadCriticalImages();
          preconnectToDomains();
          optimizeFontLoading();
          optimizeScriptLoading();
        }, 200);
      }
    }
  }, []);

  return (
    <>
      <Head>
        {/* Préchargement DNS pour les domaines externes */}
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Préchargement des polices */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" 
          as="style" 
        />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap" 
          as="style" 
        />
      </Head>
    </>
  );
}
