export const metadata = {
  title: 'How We Work | MovieHunt',
  description: 'Our method: review criteria, independence, and honest recommendations to help you find exceptional films.',
  alternates: {
    canonical: 'https://www.moviehunt.fr/en/how-we-work',
    languages: {
      en: 'https://www.moviehunt.fr/en/how-we-work',
      fr: 'https://www.moviehunt.fr/comment-nous-travaillons',
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
