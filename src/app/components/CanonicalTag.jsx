import { headers } from 'next/headers';

/**
 * Composant pour ajouter une balise canonique à chaque page
 * Cette implémentation côté serveur est compatible avec les crawlers
 */
export default function CanonicalTag() {
  // Récupérer le chemin actuel depuis les en-têtes de la requête
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/';
  
  // Construire l'URL canonique
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  const canonicalUrl = `${baseUrl}${pathname}`;

  // Dans l'App Router, nous devons utiliser des balises meta directement dans le HTML
  return (
    <link rel="canonical" href={canonicalUrl} />
  );
}
