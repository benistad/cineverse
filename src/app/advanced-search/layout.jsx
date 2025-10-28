export const metadata = {
  title: 'Recherche avancée | MovieHunt',
  description: "Recherchez des films par genre, note, année de sortie et 'Hunted by MovieHunt'.",
  alternates: {
    canonical: 'https://www.moviehunt.fr/advanced-search',
    languages: {
      fr: 'https://www.moviehunt.fr/advanced-search',
      en: 'https://www.moviehunt.fr/en/advanced-search',
    },
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
