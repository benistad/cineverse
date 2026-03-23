import TrouverUnFilmContent from '@/components/pages/TrouverUnFilmContent';

export const metadata = {
  title: 'Trouver un Film en 30 Secondes | Recommandation Instantanée - MovieHunt',
  description: 'Trouvez le film parfait en 30 secondes. Choisissez votre humeur et votre temps disponible, et recevez 3 recommandations personnalisées parmi les films notés par MovieHunt.',
  keywords: 'trouver un film, quel film regarder ce soir, recommandation film rapide, idée film, film selon humeur, choisir un film',
  openGraph: {
    title: 'Trouver un Film en 30 Secondes - MovieHunt',
    description: 'Choisis ton humeur, on s\'occupe du reste. 3 films recommandés instantanément.',
    type: 'website',
    url: 'https://www.moviehunt.fr/trouver-un-film',
  },
  alternates: {
    canonical: 'https://www.moviehunt.fr/trouver-un-film',
  },
};

export default function TrouverUnFilm() {
  return <TrouverUnFilmContent />;
}
