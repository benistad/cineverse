'use client';

import Head from 'next/head';
import Script from 'next/script';

/**
 * Composant pour gérer les balises meta SEO
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Le titre de la page
 * @param {string} props.description - La description de la page
 * @param {string} props.canonicalUrl - L'URL canonique de la page
 * @param {string} props.ogImage - L'image Open Graph à utiliser
 * @param {string} props.ogType - Le type Open Graph (article, website, etc.)
 * @param {Object} props.jsonLd - Les données JSON-LD pour le balisage structuré
 */
export default function MetaTags({
  title = 'MovieHunt - Votre collection de films notés',
  description = 'Découvrez ma collection de films notés et mes recommandations de casting et d\'équipe technique',
  canonicalUrl,
  ogImage = 'https://www.moviehunt.fr/images/og-image.jpg', // Image par défaut
  ogType = 'website',
  jsonLd,
}) {
  // Construire l'URL canonique complète
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <>
      <Head>
        {/* Balises meta de base */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullCanonicalUrl} />
        
        {/* Balises Open Graph pour les réseaux sociaux */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullCanonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="MovieHunt" />
        
        {/* Balises Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Autres balises meta importantes */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Language" content="fr" />
        <meta name="robots" content="index, follow" />
      </Head>
      
      {/* Balisage structuré JSON-LD */}
      {jsonLd && (
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
