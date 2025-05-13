'use client';

import SwiperCarousel from '@/components/home/SwiperCarousel';

export default function TestCarouselPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test du nouveau carrousel</h1>
      
      <div className="mb-8">
        <SwiperCarousel />
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">À propos de ce test</h2>
        <p className="mb-4">
          Cette page permet de tester le nouveau composant de carrousel basé sur Swiper.js, 
          conçu pour éliminer les problèmes de clignotement lors des transitions d'images.
        </p>
        <h3 className="text-lg font-semibold mb-2">Améliorations</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Utilisation de Swiper.js pour des transitions fluides</li>
          <li>Préchargement des images avant affichage</li>
          <li>Effet de fondu entre les images (crossfade)</li>
          <li>Recharge moins fréquente des données (toutes les 5 minutes)</li>
          <li>Meilleure gestion des états de chargement</li>
        </ul>
      </div>
    </div>
  );
}
