export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'),
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
  // Pas d'alternates ici pour éviter les conflits avec les pages enfants
  // Chaque page définit ses propres liens hreflang
};

export default function EnLayout({ children }) {
  return children;
}
