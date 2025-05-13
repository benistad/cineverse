'use client';

import { useEffect } from 'react';

/**
 * Composant pour ajouter le balisage structuré JSON-LD à la page
 * Cela aide Google à comprendre le site et à afficher le logo dans les résultats de recherche
 */
export default function JsonLdSchema() {
  useEffect(() => {
    // Le script est ajouté côté client pour éviter les problèmes avec SSR
  }, []);

  // Données structurées pour le site web (Schema.org)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'MovieHunt',
    'url': 'https://www.moviehunt.fr',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://www.moviehunt.fr/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  // Données structurées pour l'organisation (Schema.org)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'MovieHunt',
    'url': 'https://www.moviehunt.fr',
    'logo': 'https://www.moviehunt.fr/favicon.png',
    'sameAs': [
      // Ajoutez ici vos liens sociaux si vous en avez
      // 'https://twitter.com/moviehunt',
      // 'https://facebook.com/moviehunt',
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
