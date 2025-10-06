'use client';

import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { findTrailerByTitleAndYear } from '@/lib/tmdb/trailers';

export default function FilmTrailer({ film, initialTrailerKey }) {
  // Utiliser la clé du film en priorité (données fraîches), puis initialTrailerKey (SSR)
  const [trailerKey, setTrailerKey] = useState(film.youtube_trailer_key || initialTrailerKey);
  const [searchingTrailer, setSearchingTrailer] = useState(false);

  useEffect(() => {
    // Mettre à jour si la clé du film change
    if (film.youtube_trailer_key && film.youtube_trailer_key !== trailerKey) {
      setTrailerKey(film.youtube_trailer_key);
      return;
    }
    
    // Si on a déjà une clé de trailer, pas besoin de chercher
    if (trailerKey) return;

    // Chercher une bande-annonce si nécessaire
    const shouldSearchTrailer = !film.youtube_trailer_key && film.tmdb_id;
    
    if (shouldSearchTrailer) {
      setSearchingTrailer(true);
      
      const searchTrailer = async () => {
        try {
          const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : null;
          let foundTrailerKey = null;
          
          if (film.tmdb_id) {
            const { getMovieTrailers } = await import('@/lib/tmdb/trailers');
            foundTrailerKey = await getMovieTrailers(film.tmdb_id);
          }
          
          if (!foundTrailerKey) {
            foundTrailerKey = await findTrailerByTitleAndYear(film.title, releaseYear);
          }
          
          if (foundTrailerKey) {
            setTrailerKey(foundTrailerKey);
            
            // Sauvegarder la clé de trailer
            if (foundTrailerKey !== film.youtube_trailer_key) {
              await fetch(`/api/films/${film.id}/trailer`, {
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
      };
      
      searchTrailer();
    }
  }, [film, trailerKey]);

  if (searchingTrailer) {
    return (
      <section className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Bande-annonce</h2>
        <p className="text-gray-500 italic">Recherche d'une bande-annonce...</p>
      </section>
    );
  }

  if (!trailerKey) {
    return null;
  }

  return (
    <section className="mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Bande-annonce</h2>
      <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full rounded-lg shadow-md">
        <YouTube 
          videoId={trailerKey} 
          className="absolute top-0 left-0 w-full h-full" 
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              playsinline: 1,
            },
          }}
        />
      </div>
    </section>
  );
}
