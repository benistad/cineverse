'use client';

import dynamic from 'next/dynamic';

// Importer les composants côté client
const CanonicalTag = dynamic(() => import('@/app/components/CanonicalTag'), { ssr: false });
const TitleTag = dynamic(() => import('@/app/components/TitleTag'), { ssr: false });

/**
 * Composant qui regroupe tous les composants côté client
 * Cela permet de les charger uniquement côté client et d'éviter les erreurs de rendu
 */
export default function ClientComponents() {
  return (
    <>
      <CanonicalTag />
      <TitleTag />
    </>
  );
}
