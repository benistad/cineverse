'use client';

import { usePathname } from 'next/navigation';
import Head from 'next/head';

/**
 * Composant qui ajoute une balise canonique à chaque page
 * À utiliser dans le layout principal pour s'assurer que chaque page a une balise canonique
 */
export default function CanonicalTag() {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  const canonicalUrl = `${baseUrl}${pathname}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
