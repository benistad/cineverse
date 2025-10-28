export const metadata = {
  title: 'Films inconnus | MovieHunt',
  description: 'Découvrez des pépites méconnues et des films sous-côtés à voir absolument. Recommandations et critiques honnêtes.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/films-inconnus',
    languages: {
      fr: 'https://www.moviehunt.fr/films-inconnus',
      en: 'https://www.moviehunt.fr/en/hidden-gems',
    },
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
