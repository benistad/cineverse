'use client';

import React from 'react';
import FontOptimizer from './FontOptimizer';
import ImageOptimizer from './ImageOptimizer';
import MobileOptimizer from './MobileOptimizer';

/**
 * Composant qui regroupe toutes les optimisations de performance mobile
 * pour faciliter l'intégration dans l'application
 */
export default function MobilePerformanceOptimizer() {
  return (
    <>
      <FontOptimizer />
      <ImageOptimizer />
      <MobileOptimizer />
    </>
  );
}
