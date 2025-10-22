export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'),
  title: {
    default: 'MovieHunt: Movie Ideas - What Film to Watch?',
    template: '%s | MovieHunt'
  },
  description: 'Movie Hunt is the site to know what film to watch and discover hidden gems. Film ratings, recommendations, remarkable cast, availability on French streaming platforms and more.',
  keywords: ['movies', 'cinema', 'reviews', 'ratings', 'recommendations', 'hidden gems', 'streaming', 'French platforms', 'remarkable cast', 'favorites'],
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
    canonical: '/en',
    languages: {
      'fr': '/',
      'en': '/en',
      'x-default': '/'
    }
  },
};

export default function EnLayout({ children }) {
  return children;
}
