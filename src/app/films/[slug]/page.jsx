import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import RatingIcon from '@/components/ui/RatingIcon';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import StreamingProviders from '@/components/films/StreamingProviders';
import SimilarFilms from '@/components/films/SimilarFilms';
import MovieSchema from '@/components/seo/MovieSchema';
import FilmTrailer from '@/components/films/FilmTrailer';
import FilmPoster from '@/components/films/FilmPoster';
import BlogArticleLink from '@/components/films/BlogArticleLink';

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
    
    return filmByTitle[0];
  }
  
  return data;
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }) {
  const film = await getFilm(params.slug);
  
  if (!film) {
    return {
      title: 'Film non trouvé | MovieHunt',
    };
  }
  
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
  const yearText = releaseYear ? ` (${releaseYear})` : '';
  const synopsis = film.synopsis ? film.synopsis.substring(0, 150) + '...' : '';
  const rating = film.note_sur_10 ? `Note : ${film.note_sur_10}/10. ` : '';
  
  const imageUrl = film.poster_path 
    ? (film.poster_path.startsWith('/') 
        ? `https://image.tmdb.org/t/p/w780${film.poster_path}` 
        : film.poster_path)
    : 'https://www.moviehunt.fr/images/og-image.jpg';
  
  return {
    title: `${film.title}${yearText} - Critique et avis | MovieHunt`,
    description: `${rating}${synopsis} Découvrez notre critique complète, le casting et où regarder ${film.title} en streaming.`,
    openGraph: {
      title: `${film.title}${yearText} | MovieHunt`,
      description: `${rating}${synopsis}`,
      type: 'video.movie',
      siteName: 'MovieHunt',
      locale: 'fr_FR',
      url: `https://www.moviehunt.fr/films/${params.slug}`,
      images: [
        {
          url: imageUrl,
          width: 780,
          height: 1170,
          alt: `Affiche du film ${film.title}`,
        }
      ],
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
    <article className="container mx-auto px-4 py-8 space-y-6" itemScope itemType="https://schema.org/Movie">
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
              <h1 className="text-2xl sm:text-3xl font-bold" itemProp="name">{film.title}</h1>
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
            
            <div className="flex flex-wrap items-center mb-4 text-gray-700">
              {film.release_date && (
                <span className="mr-3" itemProp="datePublished">
                  {new Date(film.release_date).getFullYear()}
                </span>
              )}
              {film.genres && (
                <span itemProp="genre">
                  {film.genres}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Date d'ajout:</span> {new Date(film.date_ajout).toLocaleDateString('fr-FR')}
            </p>
            
            {film.genres && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Genre:</span> {film.genres}
              </p>
            )}
            
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
            
            <section className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Synopsis</h2>
              <p className="text-sm sm:text-base text-gray-700" itemProp="description">{film.synopsis || 'Aucun synopsis disponible.'}</p>
            </section>
            
            {film.why_watch_enabled && film.why_watch_content && (
              <section className="mb-4 bg-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-500">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-blue-800">Pourquoi regarder ce film ?</h2>
                <div
                  className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap [&>p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: film.why_watch_content }}
                />
              </section>
            )}

            {/* Section "Ce que nous n'avons pas aimé" */}
            {film.not_liked_enabled && film.not_liked_content && (
              <section className="mb-4 bg-red-50 p-3 sm:p-4 rounded-lg border-l-4 border-red-400">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-red-700">Ce que nous n'avons pas aimé</h2>
                <div
                  className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap [&>p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: film.not_liked_content }}
                />
              </section>
            )}
            
            {/* Bande-annonce (composant client) */}
            <FilmTrailer film={film} initialTrailerKey={film.youtube_trailer_key} />
          </div>
        </div>
      </div>
      
      <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Équipe technique remarquable</h2>
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
