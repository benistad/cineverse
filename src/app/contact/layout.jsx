export const metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe MovieHunt. Une question, une suggestion ou envie de partager votre avis ? Écrivez-nous via notre formulaire de contact.',
  openGraph: {
    title: 'Contact - MovieHunt',
    description: 'Contactez l\'équipe MovieHunt. Une question, une suggestion ou envie de partager votre avis ? Écrivez-nous !',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact - MovieHunt',
    description: 'Contactez l\'équipe MovieHunt. Une question, une suggestion ou envie de partager votre avis ?',
  },
  alternates: {
    canonical: 'https://www.moviehunt.fr/contact',
    languages: {
      fr: 'https://www.moviehunt.fr/contact',
      en: 'https://www.moviehunt.fr/en/contact',
    },
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }) {
  return children;
}
