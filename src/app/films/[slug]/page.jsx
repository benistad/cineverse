'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Affiche du film */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative h-[400px] md:h-full">
              <SafeImage
                src={optimizePosterImage(film.poster_url)}
                alt={`Affiche du film ${film.title}`}
                fill
                className="object-contain object-top"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>
          
          {/* Informations du film */}
          <div className="md:w-2/3 lg:w-3/4 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{film.title}</h1>
              {film.is_hunted_by_moviehunt && (
                <div className="flex-shrink-0">
                  <img 
                    src="/images/badges/hunted-badge.png" 
                    alt="Hunted by MovieHunt" 
                    width={50} 
                    height={50}
                    className="drop-shadow-md"
                  />
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center mb-4 text-gray-700">
              {film.release_date && (
                <span className="mr-3">
                  {new Date(film.release_date).getFullYear()}
                </span>
              )}
              {film.genres && (
                <span>
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
            
            <div className="flex items-center mb-4">
              <span className="font-semibold mr-2">Note:</span>
              <span className="flex items-center">
                <RatingIcon rating={film.note_sur_10} className="mr-2" />
                {film.note_sur_10}/10
              </span>
            </div>
            
            {/* Plateformes de streaming */}
            {film.tmdb_id && (
              <StreamingProviders 
                tmdbId={film.tmdb_id} 
                title={film.title} 
                year={film.release_date ? new Date(film.release_date).getFullYear() : null} 
              />
            )}
            
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Synopsis</h2>
              <p className="text-sm sm:text-base text-gray-700">{film.synopsis || 'Aucun synopsis disponible.'}</p>
            </div>
            
            {film.why_watch_enabled && film.why_watch_content && (
              <div className="mb-4 bg-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-500">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-blue-800">Pourquoi regarder ce film ?</h2>
                <style jsx>{`
                  .why-watch-content {
                    white-space: pre-wrap;
                  }
                  .why-watch-content p {
                    margin-bottom: 0.5rem;
                  }
                `}</style>
                <div className="text-sm sm:text-base text-gray-700 why-watch-content">
                  {film.why_watch_content.split('\n').map((line, index) => {
                    if (line.trim() === '') {
                      return <br key={index} />;
                    }
                    if (line.trim().startsWith('• ')) {
                      return (
                        <p key={index} className="flex">
                          <span className="mr-2">•</span>
                          <span>{line.substring(2)}</span>
                        </p>
                      );
                    }
                    return <p key={index}>{line}</p>;
                  })}
                </div>
              </div>
            )}
            
            {(film.youtube_trailer_key || trailerKey) && (
              <div className="mb-4 sm:mb-6">
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
              </div>
            )}
            
            {searchingTrailer && (
              <div className="mb-6">
                <p className="text-gray-500 italic">Recherche d'une bande-annonce...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">MovieHunt's Picks</h2>
        <RemarkableStaffList filmId={film.id} />
      </div>
      
      {/* Films similaires pour la navigation interne et le SEO */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <SimilarFilms currentFilm={film} />
      </div>
      
      {/* Schéma structuré pour les moteurs de recherche */}
      <MovieSchema film={film} />
    </div>
  );
}
