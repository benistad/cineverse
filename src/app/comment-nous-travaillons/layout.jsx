export const metadata = {
  title: 'Comment nous travaillons | MovieHunt',
  description: 'Notre méthode : critères d\'évaluation, indépendance, et recommandations honnêtes pour vous aider à trouver des films exceptionnels.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/comment-nous-travaillons',
    languages: {
      fr: 'https://www.moviehunt.fr/comment-nous-travaillons',
      en: 'https://www.moviehunt.fr/en/how-we-work',
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
