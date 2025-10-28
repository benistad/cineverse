export const metadata = {
  title: 'What Movie to Watch? | MovieHunt',
  description: 'Film ideas to watch tonight, hidden gems, recommendations and honest reviews. Find what to watch now.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/en/what-movie-to-watch',
    languages: {
      en: 'https://www.moviehunt.fr/en/what-movie-to-watch',
      fr: 'https://www.moviehunt.fr/quel-film-regarder',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }) {
  return children;
}
