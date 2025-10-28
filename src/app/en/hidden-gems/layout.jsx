export const metadata = {
  title: 'Hidden Gems | MovieHunt',
  description: 'Discover underrated and overlooked films worth watching. Honest recommendations and reviews.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/en/hidden-gems',
    languages: {
      en: 'https://www.moviehunt.fr/en/hidden-gems',
      fr: 'https://www.moviehunt.fr/films-inconnus',
    },
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
