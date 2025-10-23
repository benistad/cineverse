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
 */
export default function FilmPageContent({ film }) {
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
              release_date: film.release_date,
              tmdb_id: film.tmdb_id
            }} />
          </div>
        </div>
      </div>

      {/* Équipe technique remarquable */}
      <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <RemarkableStaffTitle />
        <RemarkableStaffList filmId={film.id} />
      </section>

      {/* Films similaires */}
      <SimilarFilms currentFilm={film} />

      {/* Schema.org JSON-LD */}
      <MovieSchema film={film} />
    </article>
  );
}
