export const metadata = {
  title: 'Quel film regarder ?',
  description: 'Idées de films à voir ce soir, pépites inconnues, recommandations et critiques honnêtes. Trouvez quoi regarder maintenant.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/quel-film-regarder',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }) {
  return children;
}
