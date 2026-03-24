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

// Extraire l'URL de l'image hero pour le preload LCP
function getHeroImageUrl(film) {
  if (!film) return null;
  const fields = ['carousel_image_url', 'backdrop_url', 'backdrop_path', 'poster_url', 'poster_path'];
  for (const field of fields) {
    const val = film[field];
    if (val && val.startsWith('/')) {
      return `https://image.tmdb.org/t/p/w780${val}`;
    }
    if (val && val.startsWith('http')) return val;
  }
  return null;
}

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

  // Preload de l'image hero (LCP) pour accélérer le rendu
  const heroImageUrl = featuredFilms?.[0] ? getHeroImageUrl(featuredFilms[0]) : null;

  return (
    <>
      {heroImageUrl && (
        <link
          rel="preload"
          as="image"
          href={heroImageUrl}
          imageSrcSet={`${heroImageUrl} 780w, ${heroImageUrl.replace('/w780/', '/w1280/')} 1280w`}
          imageSizes="(max-width: 768px) 780px, 1280px"
          fetchPriority="high"
        />
      )}
      <HomePageClient
        initialRecentFilms={recentFilms}
        initialTopRatedFilms={topRatedFilms}
        initialHiddenGems={hiddenGems}
        initialFeaturedFilms={featuredFilms}
        initialPaginatedFilms={paginatedFilms}
        initialCounts={counts}
      />
    </>
  );
}
