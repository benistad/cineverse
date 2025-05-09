'use client';

import React, { useEffect, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { useParams, useRouter } from 'next/navigation';
import RemarkableStaffList from '@/components/films/RemarkableStaffList';
import RatingIcon from '@/components/ui/RatingIcon';
import YouTube from 'react-youtube';
import { createBrowserClient } from '@supabase/ssr';
import { findTrailerByTitleAndYear } from '@/lib/tmdb/trailers';
import StreamingProviders from '@/components/films/StreamingProviders';
import Script from 'next/script';

export default function FilmPage() {
  const params = useParams();
  const router = useRouter();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [searchingTrailer, setSearchingTrailer] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function fetchFilm() {
      try {
        const { data, error } = await supabase
          .from('films')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du film:', error);
          router.push('/not-found');
          return;
        }

        setFilm(data);
        
        // Si le film n'a pas de bande-annonce, essayer d'en trouver une automatiquement
        // Toujours rechercher une bande-annonce, même si nous en avons déjà une
        // Cela permet de mettre à jour les bandes-annonces manquantes ou obsolètes
        const shouldSearchTrailer = !data.youtube_trailer_key || data.tmdb_id; // Rechercher si pas de bande-annonce OU si nous avons un ID TMDB
        
        if (shouldSearchTrailer) {
          setSearchingTrailer(true);
          
          try {
            // Extraire l'année de sortie
            const releaseYear = data.release_date ? new Date(data.release_date).getFullYear() : null;
            
            // Si nous avons un ID TMDB, l'utiliser directement (plus précis)
            let foundTrailerKey = null;
            
            if (data.tmdb_id) {
              // Utiliser directement l'ID TMDB pour récupérer la bande-annonce
              const { getMovieTrailers } = await import('@/lib/tmdb/trailers');
              foundTrailerKey = await getMovieTrailers(data.tmdb_id);
              console.log(`Recherche de bande-annonce pour ${data.title} avec ID TMDB ${data.tmdb_id}: ${foundTrailerKey ? 'Trouvée' : 'Non trouvée'}`);
            } 
            
            // Si pas d'ID TMDB ou pas de bande-annonce trouvée, essayer par titre et année
            if (!foundTrailerKey) {
              foundTrailerKey = await findTrailerByTitleAndYear(data.title, releaseYear);
              console.log(`Recherche de bande-annonce pour ${data.title} (${releaseYear}) par titre: ${foundTrailerKey ? 'Trouvée' : 'Non trouvée'}`);
            }
            
            if (foundTrailerKey) {
              setTrailerKey(foundTrailerKey);
              
              // Mettre à jour le film avec la clé de la bande-annonce seulement si elle est différente
              if (foundTrailerKey !== data.youtube_trailer_key) {
                console.log(`Mise à jour de la bande-annonce pour ${data.title}: ${foundTrailerKey}`);
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
          // Utiliser la bande-annonce existante
          setTrailerKey(data.youtube_trailer_key);
        }
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
    }

    fetchFilm();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <p>Film non trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Balisage structuré JSON-LD pour les moteurs de recherche */}
      {film && (
        <Script
          id="movie-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Movie',
              name: film.title,
              description: film.synopsis || `Film noté ${film.note_sur_10}/10 sur MovieHunt`,
              image: film.poster_url,
              datePublished: film.release_date,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: film.note_sur_10,
                bestRating: '10',
                worstRating: '0',
                ratingCount: '1'
              },
              genre: film.genres ? film.genres.split(',').map(genre => genre.trim()) : [],
              ...(film.youtube_trailer_key && {
                trailer: {
                  '@type': 'VideoObject',
                  name: `Bande-annonce de ${film.title}`,
                  thumbnailUrl: film.poster_url,
                  uploadDate: film.date_ajout,
                  embedUrl: `https://www.youtube.com/embed/${film.youtube_trailer_key}`
                }
              })
            })
          }}
          strategy="afterInteractive"
        />
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
            <div className="w-full rounded-lg shadow-md overflow-hidden">
              <SafeImage
                src={film.poster_url}
                alt={film.title || 'Poster du film'}
                width={500}
                height={750}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{film.title}</h1>
            
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
              <span className="text-3xl font-bold mr-2">{film.note_sur_10}</span>
              <span className="text-gray-600">/10</span>
            </div>
            
            <StreamingProviders 
              tmdbId={film.tmdb_id} 
              title={film.title} 
              year={film.release_date ? new Date(film.release_date).getFullYear() : null} 
            />
            
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
                <div className="aspect-w-16 aspect-h-9">
                  <YouTube videoId={film.youtube_trailer_key || trailerKey} className="w-full" />
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
    </div>
  );
}
