export const metadata = {
  title: 'Advanced Search | MovieHunt',
  description: "Search films by genre, rating, release year and 'Hunted by MovieHunt'.",
  alternates: {
    canonical: 'https://www.moviehunt.fr/en/advanced-search',
    languages: {
      en: 'https://www.moviehunt.fr/en/advanced-search',
      fr: 'https://www.moviehunt.fr/advanced-search',
    },
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
