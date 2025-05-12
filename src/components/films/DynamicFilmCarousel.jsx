'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Placeholder pendant le chargement du carrousel
const CarouselPlaceholder = ({ title }) => (
  <div className="space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-64 w-full"></div>
      ))}
    </div>
  </div>
);

// Chargement dynamique du carrousel avec SSR désactivé pour optimiser le chargement initial
const FilmCarousel = dynamic(() => import('./FilmCarousel'), {
  ssr: false,
  loading: ({ title }) => <CarouselPlaceholder title={title} />
});

export default function DynamicFilmCarousel(props) {
  return <FilmCarousel {...props} />;
}
