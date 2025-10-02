'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import YouTube from 'react-youtube';
import { findTrailerByTitleAndYear } from '@/lib/tmdb/trailers';
import StreamingProviders from '@/components/films/StreamingProviders';
import SimilarFilms from '@/components/films/SimilarFilms';
import MovieSchema from '@/components/seo/MovieSchema';
import { optimizePosterImage } from '@/lib/utils/imageOptimizer';
import { getImageUrl } from '@/lib/tmdb/api';

export default function FilmPageBySlug() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [searchingTrailer, setSearchingTrailer] = useState(false);
  
  useEffect(() => {
    async function fetchFilmBySlug() {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        const supabase = createBrowserClient(
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
          console.error('Erreur lors de la récupération du film par slug:', error);
          
          // Si le slug n'existe pas, essayons de trouver le film par son titre
          // et créer le slug à la volée
          const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase();
          
          const { data: filmByTitle, error: titleError } = await supabase
            .from('films')
            .select('*')
            .ilike('title', `%${normalizedSlug}%`)
            .order('date_ajout', { ascending: false })
            .limit(1);
          
          if (titleError || !filmByTitle || filmByTitle.length === 0) {
            console.error('Film non trouvé:', titleError);
            router.push('/not-found');
            return;
          }
          
          // Utiliser le premier film trouvé
          const foundFilm = filmByTitle[0];
          
          // Créer un slug pour ce film et le mettre à jour dans la base de données
          const newSlug = foundFilm.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-');
          
          // Mettre à jour le film avec le nouveau slug
          const { error: updateError } = await supabase
            .from('films')
            .update({ slug: newSlug })
            .eq('id', foundFilm.id);
          
          if (updateError) {
            console.error('Erreur lors de la mise à jour du slug:', updateError);
          }
          
          // Rediriger vers l'URL avec le slug correct
          router.push(`/films/${newSlug}`);
          return;
        }
        
        setFilm(data);
        
        // Gestion de la bande-annonce
        const shouldSearchTrailer = !data.youtube_trailer_key || data.tmdb_id;
        
        if (shouldSearchTrailer) {
          setSearchingTrailer(true);
          
          try {
            const releaseYear = data.release_date ? new Date(data.release_date).getFullYear() : null;
            let foundTrailerKey = null;
            
            if (data.tmdb_id) {
              const { getMovieTrailers } = await import('@/lib/tmdb/trailers');
              foundTrailerKey = await getMovieTrailers(data.tmdb_id);
            }
            
            if (!foundTrailerKey) {
              foundTrailerKey = await findTrailerByTitleAndYear(data.title, releaseYear);
            }
            
            if (foundTrailerKey) {
              setTrailerKey(foundTrailerKey);
              
              if (foundTrailerKey !== data.youtube_trailer_key) {
                await fetch(`/api/films/${data.id}/trailer`, {
                  method: 'PUT',
                  body: JSON.stringify({ trailerKey: foundTrailerKey }),
                });
              }
            }
          } catch (error) {
            console.error('Erreur lors de la recherche de la bande-annonce:', error);
          } finally {
            setSearchingTrailer(false);
          }
        } else {
          setTrailerKey(data.youtube_trailer_key);
        }
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
    }
    
    fetchFilmBySlug();
  }, [slug, router]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (!film) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">Film non trouvé.</p>
        </div>
      </div>
    );
  }
  
  return (
    <article className="container mx-auto px-4 py-8 space-y-6" itemScope itemType="https://schema.org/Movie">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Affiche du film */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative h-[400px] md:h-full">
              {/* Utiliser une balise img standard au lieu de Next/Image pour éviter les problèmes de quota */}
              <div className="relative w-full h-full">
                <img
                  src={
                    // Priorité 1: poster_path (chemin TMDB)
                    film.poster_path ? 
                      (film.poster_path.startsWith('/') ? 
                        `https://image.tmdb.org/t/p/w500${film.poster_path}` : 
                        film.poster_path) :
                    // Priorité 2: poster_url (URL complète)
                    film.poster_url ? 
                      film.poster_url : 
                      // Fallback: placeholder
                      '/images/placeholder.jpg'
                  }
                  alt={`Affiche du film ${film.title}`}
                  className="absolute inset-0 w-full h-full object-contain object-top"
                  loading="eager"
                  itemProp="image"
                  onError={(e) => {
                    // En cas d'erreur, essayer une taille plus petite
                    if (e.target.src.includes('/w500/')) {
                      e.target.src = e.target.src.replace('/w500/', '/w342/');
                    } else if (e.target.src.includes('/w342/')) {
                      e.target.src = e.target.src.replace('/w342/', '/w185/');
                    } else {
                      // Si toutes les tentatives échouent, utiliser un placeholder
                      e.target.src = '/images/placeholder.jpg';
                    }
                  }}
                />  
              </div>
            </div>
          </div>
          
          {/* Informations du film */}
          <div className="md:w-2/3 lg:w-3/4 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold" itemProp="name">{film.title}</h1>
              {film.is_hunted_by_moviehunt && (
                <div className="flex-shrink-0">
                  {typeof Link !== 'undefined' ? (
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
                  ) : (
                    <img 
                      src="/images/badges/hunted-badge.png" 
                      alt="Hunted by MovieHunt" 
                      width={115} 
                      height={115}
                      className="drop-shadow-md"
                    />
                  )}
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
                <a
                  href={film.blog_article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                  Lire la critique sur le blog
                </a>
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
                <style jsx>{`
                  .why-watch-content {
                    white-space: pre-wrap;
                  }
                  .why-watch-content p {
                    margin-bottom: 0.5rem;
                  }
                `}</style>
                <div
                  className="text-sm sm:text-base text-gray-700 why-watch-content"
                  dangerouslySetInnerHTML={{ __html: film.why_watch_content }}
                />
              </section>
            )}

            {/* Section "Ce que nous n'avons pas aimé" */}
            {film.not_liked_enabled && film.not_liked_content && (
              <section className="mb-4 bg-red-50 p-3 sm:p-4 rounded-lg border-l-4 border-red-400">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-red-700">Ce que nous n'avons pas aimé</h2>
                <style jsx>{`
                  .not-liked-content {
                    white-space: pre-wrap;
                  }
                  .not-liked-content p {
                    margin-bottom: 0.5rem;
                  }
                `}</style>
                <div
                  className="text-sm sm:text-base text-gray-700 not-liked-content"
                  dangerouslySetInnerHTML={{ __html: film.not_liked_content }}
                />
              </section>
            )}
            
            {(film.youtube_trailer_key || trailerKey) && (
              <section className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Bande-annonce</h2>
                <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full rounded-lg shadow-md">
                  <YouTube 
                    videoId={film.youtube_trailer_key || trailerKey} 
                    className="absolute top-0 left-0 w-full h-full" 
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        // https://developers.google.com/youtube/player_parameters
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        playsinline: 1, // Important pour iOS
                      },
                    }}
                    onReady={(event) => {
                      // Événement déclenché lorsque le lecteur est prêt
                      // Vous pouvez ajouter des actions personnalisées ici si nécessaire
                    }}
                  />
                </div>
              </section>
            )}
            
            {searchingTrailer && (
              <div className="mb-6">
                <p className="text-gray-500 italic">Recherche d'une bande-annonce...</p>
              </div>
            )}
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
