import Link from 'next/link';
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

/**
 * Composant réutilisable pour afficher le contenu d'une page film
 * Utilisé par /films/[slug] et /en/films/[slug]
 * @param {Object} film - Objet film (peut contenir une traduction)
 * @param {string} locale - Locale de la page ('fr' ou 'en')
 */
export default function FilmPageContent({ film, locale = 'fr' }) {
  // Si locale='en', le titre est déjà traduit côté serveur
  const isTranslated = locale === 'en';

  return (
    <article className="container mx-auto px-6 py-12 space-y-6">
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
          <div className="md:w-2/3 lg:w-3/4 px-4 md:px-6 pb-4 md:pb-6 pt-4 md:pt-0">
            <FilmTitle title={film.title} filmId={film.id} isTranslated={isTranslated} />
            
            <div className="flex items-center gap-3 mb-2 mt-2">
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
                <span className="flex items-center">
                  <RatingIcon rating={film.note_sur_10} className="mr-2" />
                  <span>{film.note_sur_10}</span><span>/10</span>
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
            
            {/* Contenu traduit du film (synopsis) */}
            <FilmContent film={{
              id: film.id,
              title: film.title,
              synopsis: film.synopsis,
              why_watch_enabled: false, // Déplacé dans la section critique
              why_watch_content: null
            }} />
            
            {/* Section Critique rapide (Pourquoi regarder + Ce que nous n'avons pas aimé) */}
            {(film.why_watch_enabled || film.not_liked_enabled) && (
              <section className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
                  {locale === 'en' ? `Quick Review & Rating of ${film.title}` : `Critique rapide de ${film.title}`}
                </h2>
                
                {/* Pourquoi regarder ce film */}
                {film.why_watch_enabled && film.why_watch_content && (
                  <div className="mb-4 bg-indigo-50 p-3 sm:p-4 rounded-lg border-l-4 border-indigo-600">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-indigo-800">
                      Pourquoi regarder ce film ?
                    </h3>
                    <div
                      className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap [&>p]:mb-2"
                      dangerouslySetInnerHTML={{ __html: film.why_watch_content }}
                      suppressHydrationWarning
                    />
                  </div>
                )}
                
                {/* Ce que nous n'avons pas aimé */}
                {film.not_liked_enabled && (
                  <NotLikedSection content={film.not_liked_content} />
                )}
              </section>
            )}
            
            {/* Bande-annonce */}
            <FilmTrailer film={{
              id: film.id,
              slug: film.slug,
              title: film.title,
              youtube_trailer_key: film.youtube_trailer_key,
              release_date: film.release_date,
              tmdb_id: film.tmdb_id
            }} />
          </div>
        </div>
      </div>

      {/* Équipe technique remarquable */}
      <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <RemarkableStaffTitle filmTitle={film.title} />
        <RemarkableStaffList filmId={film.id} staff={film.remarkable_staff} />
      </section>

      {/* Films similaires */}
      <SimilarFilms currentFilm={film} filmTitle={film.title} />

      {/* Schema.org JSON-LD */}
      <MovieSchema film={film} />
    </article>
  );
}
