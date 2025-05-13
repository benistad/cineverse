// Suppression de 'use client' pour permettre le rendu côté serveur
import Script from 'next/script';

/**
 * Composant pour ajouter le balisage structuré JSON-LD à la page
 * Cela aide Google à comprendre le site et à afficher le logo dans les résultats de recherche
 */
// Données structurées pour le site web et l'organisation (Schema.org)
const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.moviehunt.fr/#website',
      'url': 'https://www.moviehunt.fr',
      'name': 'MovieHunt',
      'description': 'Trouvez votre prochain film coup de cœur',
      'potentialAction': [
        {
          '@type': 'SearchAction',
          'target': 'https://www.moviehunt.fr/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      ],
      'inLanguage': 'fr-FR'
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.moviehunt.fr/#organization',
      'name': 'MovieHunt',
      'url': 'https://www.moviehunt.fr',
      'logo': {
        '@type': 'ImageObject',
        '@id': 'https://www.moviehunt.fr/#logo',
        'inLanguage': 'fr-FR',
        'url': 'https://www.moviehunt.fr/favicon.png',
        'contentUrl': 'https://www.moviehunt.fr/favicon.png',
        'width': 192,
        'height': 192,
        'caption': 'MovieHunt'
      },
      'image': {
        '@id': 'https://www.moviehunt.fr/#logo'
      }
    }
  ]
};

export default function JsonLdSchema() {
  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
