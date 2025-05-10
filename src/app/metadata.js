/**
 * Métadonnées statiques pour la page d'accueil et configuration globale du site
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'),
  title: {
    default: 'MovieHunt - Trouvez votre prochain film coup de cœur.',
    template: '%s | MovieHunt'
  },
  description: 'Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus.',
  keywords: ['films', 'cinéma', 'critiques', 'notes', 'recommandations', 'acteurs', 'réalisateurs'],
  authors: [{ name: 'MovieHunt' }],
  creator: 'MovieHunt',
  publisher: 'MovieHunt',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'MovieHunt',
    title: 'MovieHunt - Trouvez votre prochain film coup de cœur.',
    description: 'Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MovieHunt - Trouvez votre prochain film coup de cœur.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieHunt - Trouvez votre prochain film coup de cœur.',
    description: 'Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: [
      { rel: 'icon', url: '/images/favicon.ico' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
    },
  },
  category: 'entertainment',
};
