import {
  getRecentlyRatedFilmsServer,
  getTopRatedFilmsServer,
  getHiddenGemsServer,
  getFeaturedFilmsServer,
  getFilmCountsServer,
  getPaginatedFilmsServer
} from '@/lib/supabase/serverFilms';
import HomePageClient from '@/components/home/HomePageClient';

// Configuration ISR - page statique régénérée toutes les heures
export const revalidate = 3600;

// Métadonnées statiques pour le SEO
export const metadata = {
  title: 'MovieHunt : Trouvez votre prochain film à regarder',
  description: 'Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus.',
  openGraph: {
    title: 'MovieHunt : Trouvez votre prochain film à regarder',
    description: 'Découvrez des films soigneusement sélectionnés avec nos critiques détaillées et recommandations personnalisées.',
    type: 'website',
    siteName: 'MovieHunt',
    locale: 'fr_FR',
  },
};

export default async function Home() {
  // Pré-charger toutes les données côté serveur en parallèle
  const [
    recentFilms,
    topRatedFilms,
    hiddenGems,
    featuredFilms,
    counts,
    paginatedFilms
  ] = await Promise.all([
    getRecentlyRatedFilmsServer(8),
    getTopRatedFilmsServer(10, 6),
    getHiddenGemsServer(8),
    getFeaturedFilmsServer(5, 6),
    getFilmCountsServer(),
    getPaginatedFilmsServer(1, 8)
  ]);

  return (
    <HomePageClient
      initialRecentFilms={recentFilms}
      initialTopRatedFilms={topRatedFilms}
      initialHiddenGems={hiddenGems}
      initialFeaturedFilms={featuredFilms}
      initialPaginatedFilms={paginatedFilms}
      initialCounts={counts}
    />
  );
}
