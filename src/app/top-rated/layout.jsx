export const metadata = {
  title: 'Meilleurs films | MovieHunt',
  description: 'Notre sélection des films les mieux notés sur MovieHunt. Critiques sincères, recommandations et perles rares.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/top-rated',
    languages: {
      fr: 'https://www.moviehunt.fr/top-rated',
      en: 'https://www.moviehunt.fr/en/top-rated',
    },
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
