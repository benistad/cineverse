import QuelFilmRegarderContent from '@/components/pages/QuelFilmRegarderContent';

// Metadata SSR pour le SEO
export const metadata = {
  title: 'Quel Film Regarder Ce Soir ? 100+ Idées de Films (2026)',
  description: 'Vous cherchez quel film regarder ce soir ? Découvrez nos idées de films à voir absolument : thrillers, drames, comédies. Recommandations personnalisées mises à jour chaque mois.',
  keywords: ['quel film regarder', 'quel film regarder ce soir', 'idée de film', 'idées de films', 'film à regarder ce soir', 'film à voir', 'recommandation film', 'quoi regarder ce soir'],
  alternates: {
    canonical: 'https://www.moviehunt.fr/quel-film-regarder',
  },
  openGraph: {
    title: 'Quel Film Regarder Ce Soir ? 100+ Idées de Films (2026)',
    description: 'Vous cherchez quel film regarder ce soir ? Découvrez nos idées de films à voir : thrillers, drames, comédies. Recommandations personnalisées.',
    type: 'article',
    url: 'https://www.moviehunt.fr/quel-film-regarder',
    siteName: 'MovieHunt',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://www.moviehunt.fr/images/og-quel-film-regarder.jpg',
        width: 1200,
        height: 630,
        alt: 'Quel film regarder ce soir ? Guide MovieHunt 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quel Film Regarder Ce Soir ? Idées de Films',
    description: 'Idées de films à regarder ce soir : thrillers, drames, comédies. Recommandations personnalisées.',
  },
};

export default function QuelFilmRegarder() {
  return <QuelFilmRegarderContent />;
}
