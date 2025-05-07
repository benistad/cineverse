'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TMDBMovieDetails, TMDBPerson } from '@/types/tmdb';
import { getImageUrl, getTrailerKey } from '@/lib/tmdb/api';
import { saveFilm, saveRemarkableStaff } from '@/lib/supabase/films';
import { Film } from '@/types/supabase';
import { FiStar, FiCheck, FiX, FiSave } from 'react-icons/fi';
import YouTube from 'react-youtube';

interface FilmEditorProps {
  movieDetails: TMDBMovieDetails;
}

export default function FilmEditor({ movieDetails }: FilmEditorProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(5);
  const [selectedStaff, setSelectedStaff] = useState<TMDBPerson[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer la clé de la bande-annonce
    if (movieDetails.videos && movieDetails.videos.results) {
      const key = getTrailerKey(movieDetails.videos);
      setTrailerKey(key);
    }
  }, [movieDetails]);

  const toggleStaffSelection = (person: TMDBPerson) => {
    setSelectedStaff((prev) => {
      const isSelected = prev.some((p) => p.id === person.id);
      
      if (isSelected) {
        return prev.filter((p) => p.id !== person.id);
      } else {
        return [...prev, person];
      }
    });
  };

  const isStaffSelected = (personId: number) => {
    return selectedStaff.some((p) => p.id === personId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Préparer les données du film
      const filmData: Omit<Film, 'id' | 'created_at'> = {
        tmdb_id: movieDetails.id,
        title: movieDetails.title,
        slug: movieDetails.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
        synopsis: movieDetails.overview,
        poster_url: movieDetails.poster_path ? getImageUrl(movieDetails.poster_path) : null,
        backdrop_url: movieDetails.backdrop_path ? getImageUrl(movieDetails.backdrop_path, 'original') : null,
        note_sur_10: rating,
        youtube_trailer_key: trailerKey,
        date_ajout: new Date().toISOString(),
      };

      // Sauvegarder le film
      const savedFilm = await saveFilm(filmData);

      if (!savedFilm) {
        throw new Error('Erreur lors de la sauvegarde du film');
      }

      // Sauvegarder le staff remarquable
      const staffPromises = selectedStaff.map((person) => {
        const isCast = movieDetails.credits?.cast.some((p) => p.id === person.id);
        const role = isCast 
          ? `Acteur${person.character ? ` (${person.character})` : ''}`
          : person.job || 'Équipe technique';

        return saveRemarkableStaff({
          film_id: savedFilm.id,
          nom: person.name,
          role,
          photo_url: person.profile_path ? getImageUrl(person.profile_path, 'w185') : null,
        });
      });

      await Promise.all(staffPromises);

      setSuccess(true);
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Film sauvegardé avec succès ! Redirection en cours...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-md">
            <Image
              src={getImageUrl(movieDetails.poster_path)}
              alt={movieDetails.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Informations du film */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{movieDetails.title}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-gray-600 mr-2">Date de sortie:</span>
            <span>{movieDetails.release_date || 'Inconnue'}</span>
          </div>

          <div className="mb-4">
            <span className="text-gray-600 mr-2">Genres:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {movieDetails.genres?.map((genre) => (
                <span key={genre.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
            <p className="text-gray-700">
              {movieDetails.overview || 'Aucun synopsis disponible.'}
            </p>
          </div>

          {/* Note */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Votre note</h3>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full mr-1 ${
                    value <= rating ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Bande-annonce */}
          {trailerKey && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Bande-annonce</h3>
              <div className="aspect-w-16 aspect-h-9">
                <YouTube
                  videoId={trailerKey}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Remarquable */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Sélectionner le Staff Remarquable</h2>
        
        {/* Cast */}
        {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Acteurs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movieDetails.credits.cast.slice(0, 10).map((person) => (
                <div 
                  key={person.id} 
                  className={`relative cursor-pointer rounded-lg p-2 transition-all ${
                    isStaffSelected(person.id) 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleStaffSelection(person)}
                >
                  <div className="relative h-40 w-full mb-2 rounded overflow-hidden">
                    <Image
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-center">{person.name}</h4>
                  {person.character && (
                    <p className="text-sm text-gray-600 text-center">{person.character}</p>
                  )}
                  
                  {isStaffSelected(person.id) && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <FiCheck size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Crew */}
        {movieDetails.credits?.crew && movieDetails.credits.crew.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Équipe technique</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movieDetails.credits.crew
                .filter((person) => ['Director', 'Writer', 'Producer', 'Screenplay'].includes(person.job || ''))
                .slice(0, 10)
                .map((person) => (
                  <div 
                    key={`${person.id}-${person.job}`} 
                    className={`relative cursor-pointer rounded-lg p-2 transition-all ${
                      isStaffSelected(person.id) 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => toggleStaffSelection(person)}
                  >
                    <div className="relative h-40 w-full mb-2 rounded overflow-hidden">
                      <Image
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-medium text-center">{person.name}</h4>
                    {person.job && (
                      <p className="text-sm text-gray-600 text-center">{person.job}</p>
                    )}
                    
                    {isStaffSelected(person.id) && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <FiCheck size={16} />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/admin/search')}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg mr-4 hover:bg-gray-600 flex items-center"
          disabled={isSaving}
        >
          <FiX className="mr-2" /> Annuler
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sauvegarde...
            </>
          ) : (
            <>
              <FiSave className="mr-2" /> Sauvegarder
            </>
          )}
        </button>
      </div>
    </div>
  );
}
