const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'MovieHunt: Movie Ideas - What Film to Watch?',
    template: '%s | MovieHunt'
  },
  description: 'Discover what film to watch: ratings, movie reviews and hidden gems. Remarkable staff and streaming availability in France.',
  keywords: ['movies', 'cinema', 'reviews', 'ratings', 'recommendations', 'hidden gems', 'streaming', 'French platforms', 'remarkable staff', 'favorites'],
  authors: [{ name: 'MovieHunt' }],
  creator: 'MovieHunt',
  publisher: 'MovieHunt',
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
  alternates: {
    canonical: `${baseUrl}/en`,
    languages: {
      'fr': `${baseUrl}`,
      'en': `${baseUrl}/en`,
      'x-default': `${baseUrl}`
    }
  },
  openGraph: {
    title: 'MovieHunt: Movie Ideas - What Film to Watch?',
    description: 'Discover what film to watch: ratings, movie reviews and hidden gems. Remarkable staff and streaming availability in France.',
    url: `${baseUrl}/en`,
    siteName: 'MovieHunt',
    locale: 'en_US',
    type: 'website',
  }
};

export default function EnLayout({ children }) {
  return children;
}
