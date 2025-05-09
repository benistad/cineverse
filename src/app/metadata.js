/**
 * Métadonnées statiques pour la page d'accueil et configuration globale du site
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app'),
  title: {
    default: 'MovieHunt - Votre collection de films notés',
    template: '%s | MovieHunt'
  },
  description: 'Découvrez ma collection de films notés et mes recommandations de casting et d\'équipe technique',
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
    title: 'MovieHunt - Votre collection de films notés',
    description: 'Découvrez ma collection de films notés et mes recommandations de casting et d\'équipe technique',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MovieHunt - Votre collection de films notés',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieHunt - Votre collection de films notés',
    description: 'Découvrez ma collection de films notés et mes recommandations de casting et d\'équipe technique',
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/apple-touch-icon.png',
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
