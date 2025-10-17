import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import RatingIcon from '@/components/ui/RatingIcon';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import StreamingProviders from '@/components/films/StreamingProviders';
import SimilarFilms from '@/components/films/SimilarFilms';
import MovieSchema from '@/components/seo/MovieSchema';
import FilmPoster from '@/components/films/FilmPoster';
import FilmContent from '@/components/films/FilmContent';
import BlogArticleLink from '@/components/films/BlogArticleLink';
import FilmTrailer from '@/components/films/FilmTrailer';
import FilmMetadata from '@/components/films/FilmMetadata';
import FilmHeader from '@/components/films/FilmHeader';
import FilmTitle from '@/components/films/FilmTitle';
import { RemarkableStaffTitle } from '@/components/films/FilmSectionTitles';
import NotLikedSection from '@/components/films/NotLikedSection';

// Configuration pour le revalidation (ISR)
export const revalidate = 3600; // Revalider toutes les heures
export const dynamic = 'force-dynamic'; // Forcer le rendu dynamique

// Fonction pour récupérer le film côté serveur
async function getFilm(slug) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  // Rechercher le film par son slug
  const { data, error } = await supabase
    .from('films')
    .select('*')
    .eq('slug', slug)
    .single();
  
  let film = null;
  
  if (error || !data) {
    // Si le slug n'existe pas, essayer de trouver le film par son titre
    const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase();
    
    const { data: filmByTitle, error: titleError } = await supabase
      .from('films')
      .select('*')
      .ilike('title', `%${normalizedSlug}%`)
      .order('date_ajout', { ascending: false })
      .limit(1);
    
    if (titleError || !filmByTitle || filmByTitle.length === 0) {
      return null;
    }
    
    film = filmByTitle[0];
  } else {
    film = data;
  }
  
  return film;
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }) {
  const film = await getFilm(params.slug);
  
  if (!film) {
    return {
      title: 'Film non trouvé | MovieHunt',
    };
  }

  // Détecter la locale depuis les cookies
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = localeCookie?.value || 'fr';
  
  // Récupérer la traduction si locale = EN
  let translation = null;
  if (locale === 'en') {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data } = await supabase
      .from('film_translations')
      .select('*')
      .eq('film_id', film.id)
      .eq('locale', 'en')
      .single();
    
    translation = data;
  }

  // Utiliser la traduction si disponible
  const title = translation?.title || film.title;
  const synopsis = translation?.synopsis || film.synopsis || '';
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
  const yearText = releaseYear ? ` (${releaseYear})` : '';
  const synopsisShort = synopsis ? synopsis.substring(0, 150) + '...' : '';
  
  // Textes selon la locale
  const isEnglish = locale === 'en';
  const ratingLabel = isEnglish ? 'Rating' : 'Note';
  const rating = film.note_sur_10 ? `${ratingLabel}: ${film.note_sur_10}/10. ` : '';
  const metaTitle = isEnglish 
    ? `${title}${yearText} - Review and Rating | MovieHunt`
    : `${title}${yearText} - Critique et avis | MovieHunt`;
  const metaDescription = isEnglish
    ? `${rating}${synopsisShort} Discover our complete review, cast and where to watch ${title} streaming.`
    : `${rating}${synopsisShort} Découvrez notre critique complète, le casting et où regarder ${title} en streaming.`;
  
  const imageUrl = film.poster_path 
    ? (film.poster_path.startsWith('/') 
        ? `https://image.tmdb.org/t/p/w780${film.poster_path}` 
        : film.poster_path)
    : 'https://www.moviehunt.fr/images/og-image.jpg';
  
  const imageAlt = isEnglish ? `${title} poster` : `Affiche du film ${title}`;
  const ogLocale = isEnglish ? 'en_US' : 'fr_FR';
  const canonicalUrl = isEnglish 
    ? `https://www.moviehunt.fr/en/films/${params.slug}`
    : `https://www.moviehunt.fr/films/${params.slug}`;
  
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr': `https://www.moviehunt.fr/films/${params.slug}`,
        'en': `https://www.moviehunt.fr/en/films/${params.slug}`,
        'x-default': `https://www.moviehunt.fr/films/${params.slug}`
      }
    },
    openGraph: {
      title: `${title}${yearText} | MovieHunt`,
      description: `${rating}${synopsisShort}`,
      type: 'video.movie',
      siteName: 'MovieHunt',
      locale: ogLocale,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 780,
          height: 1170,
          alt: imageAlt,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@MovieHunt',
      creator: '@MovieHunt',
      title: `${film.title}${yearText} | MovieHunt`,
      description: `${rating}${synopsis}`,
      images: [imageUrl],
    },
  };
}

export default async function FilmPage({ params }) {
  const film = await getFilm(params.slug);
  
  if (!film) {
    notFound();
  }
  
  return (
    <article className="container mx-auto px-6 py-12 space-y-6" itemScope itemType="https://schema.org/Movie">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Affiche du film */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative h-[400px] md:h-full">
              <div className="relative w-full h-full">
                <FilmPoster film={film} />
              </div>
            </div>
          </div>
          
          {/* Informations du film */}
          <div className="md:w-2/3 lg:w-3/4 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <FilmTitle title={film.title} filmId={film.id} />
              {film.is_hunted_by_moviehunt && (
                <div className="flex-shrink-0">
                  <Link 
                    href="/huntedbymoviehunt" 
                    className="block transition-transform hover:scale-110"
                    title="En savoir plus sur Hunted by MovieHunt"
                  >
                    <img 
                      src="/images/badges/hunted-badge.png" 
                      alt="Hunted by MovieHunt" 
                      width={115} 
                      height={115}
                      className="drop-shadow-md cursor-pointer"
                    />
                  </Link>
                </div>
              )}
            </div>
            
            <FilmHeader 
              releaseDate={film.release_date}
              genres={film.genres}
              filmId={film.id}
            />
            
            <FilmMetadata 
              dateAjout={film.date_ajout}
              genres={film.genres}
              filmId={film.id}
            />
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Note:</span>
                <span className="flex items-center" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                  <RatingIcon rating={film.note_sur_10} className="mr-2" />
                  <span itemProp="ratingValue">{film.note_sur_10}</span><span itemProp="bestRating" content="10">/10</span>
                </span>
              </div>
              {film.blog_article_url && (
                <BlogArticleLink url={film.blog_article_url} />
              )}
            </div>
            
            {/* Plateformes de streaming */}
            {film.tmdb_id && (
              <StreamingProviders 
                tmdbId={film.tmdb_id} 
                title={film.title} 
                year={film.release_date ? new Date(film.release_date).getFullYear() : null} 
              />
            )}
            
            {/* Contenu traduit du film (synopsis, pourquoi regarder) */}
            <FilmContent film={{
              id: film.id,
              synopsis: film.synopsis,
              why_watch_enabled: film.why_watch_enabled,
              why_watch_content: film.why_watch_content
            }} />
            
            {/* Section "Ce que nous n'avons pas aimé" */}
            {film.not_liked_enabled && (
              <NotLikedSection content={film.not_liked_content} />
            )}
            
            {/* Bande-annonce */}
            <FilmTrailer film={{
              id: film.id,
              slug: film.slug,
              title: film.title,
              youtube_trailer_key: film.youtube_trailer_key,
              tmdb_id: film.tmdb_id,
              release_date: film.release_date
            }} initialTrailerKey={film.youtube_trailer_key} />
          </div>
        </div>
      </div>
      
      <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <RemarkableStaffTitle />
        <RemarkableStaffList filmId={film.id} />
      </section>
      
      {/* Films similaires pour la navigation interne et le SEO */}
      <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <SimilarFilms currentFilm={film} />
      </section>
      
      {/* Schéma structuré pour les moteurs de recherche */}
      <MovieSchema film={film} />
    </article>
  );
}
