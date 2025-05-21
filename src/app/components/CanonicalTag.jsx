'use client';

import { usePathname } from 'next/navigation';

/**
 * Composant pour ajouter une balise canonique à chaque page
 * Cette implémentation côté client est compatible avec le layout client
 */
export default function CanonicalTag() {
  // Récupérer le chemin actuel depuis le hook usePathname
  const pathname = usePathname() || '/';
  
  // Construire l'URL canonique
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  const canonicalUrl = `${baseUrl}${pathname}`;

  // Dans l'App Router, nous devons utiliser des balises meta directement dans le HTML
  return (
    <link rel="canonical" href={canonicalUrl} />
  );
}
