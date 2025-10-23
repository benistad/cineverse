/**
 * Métadonnées statiques pour la page d'accueil et configuration globale du site
 * Optimisé pour le référencement mobile
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'),
  title: {
    default: 'MovieHunt',
    template: '%s | MovieHunt'
  },
  description: 'Découvrez quel film regarder : notes, critiques de films et perles rares. Staff remarquable et disponibilité streaming en France.',
  keywords: ['films', 'cinéma', 'critiques', 'notes', 'recommandations', 'acteurs', 'réalisateurs'],
  authors: [{ name: 'MovieHunt' }],
  creator: 'MovieHunt',
  publisher: 'MovieHunt',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Configuration optimisée pour les appareils mobiles
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  // Thème de couleur pour la barre d'adresse mobile
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e293b' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  // Configuration pour les appareils Apple
  appleWebApp: {
    title: 'MovieHunt',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'MovieHunt',
    title: 'MovieHunt',
    description: 'Découvrez quel film regarder : notes, critiques de films et perles rares. Staff remarquable et disponibilité streaming en France.',
    images: [
      {
        url: 'https://www.moviehunt.fr/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MovieHunt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieHunt',
    description: 'Découvrez quel film regarder : notes, critiques de films et perles rares. Staff remarquable et disponibilité streaming en France.',
    images: ['https://www.moviehunt.fr/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    // Optimisations spécifiques pour les robots mobiles
    'googlebot-mobile': {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
    'mobile-friendly': true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'icon', url: '/images/favicon.ico' },
      { rel: 'apple-touch-icon', url: '/favicon.png' },
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
