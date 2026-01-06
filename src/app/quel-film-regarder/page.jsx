import QuelFilmRegarderContent from '@/components/pages/QuelFilmRegarderContent';

// Metadata SSR pour le SEO
export const metadata = {
  title: 'Quel film regarder ce soir ? Idées et recommandations 2025',
  description: 'Découvrez quel film regarder ce soir avec notre sélection de pépites inconnues, films à voir absolument et recommandations personnalisées. Guide mis à jour chaque semaine.',
  keywords: ['quel film regarder', 'idée film', 'film à voir', 'recommandation film', 'pépite cinéma', 'film ce soir'],
  alternates: {
    canonical: 'https://www.moviehunt.fr/quel-film-regarder',
  },
  openGraph: {
    title: 'Quel film regarder ce soir ? Idées et recommandations 2025',
    description: 'Découvrez quel film regarder ce soir avec notre sélection de pépites inconnues et recommandations personnalisées.',
    type: 'article',
    url: 'https://www.moviehunt.fr/quel-film-regarder',
    siteName: 'MovieHunt',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://www.moviehunt.fr/images/og-quel-film-regarder.jpg',
        width: 1200,
        height: 630,
        alt: 'Quel film regarder ce soir ? Guide MovieHunt 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quel film regarder ce soir ? Idées et recommandations',
    description: 'Découvrez notre sélection de films à voir absolument et pépites inconnues.',
  },
};

export default function QuelFilmRegarder() {
  return <QuelFilmRegarderContent />;
}
