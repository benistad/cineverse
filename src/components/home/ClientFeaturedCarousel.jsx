'use client';

import dynamic from 'next/dynamic';

// Importer dynamiquement le composant FeaturedFilmsCarousel avec l'option ssr: false
// Cela garantit que le composant ne sera rendu que côté client
const FeaturedFilmsCarousel = dynamic(
  () => import('@/components/home/FeaturedFilmsCarousel'),
  { ssr: false }
);

export default function ClientFeaturedCarousel() {
  return <FeaturedFilmsCarousel />;
}
