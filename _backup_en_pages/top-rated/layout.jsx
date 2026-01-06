export const metadata = {
  title: 'Top Rated Films | MovieHunt',
  description: 'Our selection of the highest-rated films on MovieHunt. Honest reviews, recommendations, and hidden gems.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/en/top-rated',
    languages: {
      en: 'https://www.moviehunt.fr/en/top-rated',
      fr: 'https://www.moviehunt.fr/top-rated',
    },
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
