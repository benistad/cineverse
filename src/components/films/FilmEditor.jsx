'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getImageUrl, getTrailerKey } from '@/lib/tmdb/api';
import { saveFilm, saveRemarkableStaff } from '@/lib/supabase/films';
import { useAuth } from '@/contexts/AuthContext';
import { FiCheck, FiX, FiSave } from 'react-icons/fi';
import YouTube from 'react-youtube';

export default function FilmEditor({ movieDetails }) {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [rating, setRating] = useState(5);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    // Récupérer la clé de la bande-annonce
    if (movieDetails?.videos?.results) {
      const key = getTrailerKey(movieDetails.videos);
      setTrailerKey(key);
    }
  }, [movieDetails]);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!user) {
      setError("Vous devez être connecté pour noter un film. Redirection vers la page de connexion...");
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    }
  }, [user, router]);

  const toggleStaffSelection = (person) => {
    setSelectedStaff((prev) => {
      const isSelected = prev.some((p) => p.id === person.id);
      
      if (isSelected) {
        return prev.filter((p) => p.id !== person.id);
      } else {
        return [...prev, person];
      }
    });
  };

  const isStaffSelected = (personId) => {
    return selectedStaff.some((p) => p.id === personId);
  };

  const handleSave = async () => {
    if (!user) {
      setError("Vous devez être connecté pour noter un film.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // S'assurer que movieDetails existe et a les propriétés nécessaires
      if (!movieDetails) {
        throw new Error('Détails du film non disponibles');
      }

      // Préparer les données du film avec vérification des valeurs nulles
      const filmData = {
        tmdb_id: movieDetails.id,
        title: movieDetails.title || 'Sans titre',
        slug: movieDetails.title 
          ? movieDetails.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-') 
          : 'film-sans-titre',
        synopsis: movieDetails.overview || '',
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
      if (selectedStaff.length > 0) {
        const staffPromises = selectedStaff.map((person) => {
          const isCast = movieDetails.credits?.cast?.some((p) => p.id === person.id);
          const role = isCast 
            ? `Acteur${person.character ? ` (${person.character})` : ''}`
            : person.job || 'Équipe technique';

          return saveRemarkableStaff({
            film_id: savedFilm.id,
            nom: person.name || 'Inconnu',
            role,
            photo_url: person.profile_path ? getImageUrl(person.profile_path, 'w185') : null,
          });
        });

        await Promise.all(staffPromises);
      }

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

  // Si les détails du film ne sont pas disponibles, afficher un message de chargement
  if (!movieDetails) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

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
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-md mb-4">
            {movieDetails.poster_path ? (
              <Image
                src={getImageUrl(movieDetails.poster_path)}
                alt={movieDetails.title || 'Poster du film'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">Aucune image disponible</span>
              </div>
            )}
          </div>
          
          {/* Notation */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Votre note</h3>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full mr-2"
              />
              <span className="font-bold text-xl">{rating}/10</span>
            </div>
          </div>
        </div>
        
        {/* Informations */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-2">{movieDetails.title || 'Sans titre'}</h2>
          
          {movieDetails.release_date && (
            <p className="text-gray-600 mb-4">
              Sortie le {new Date(movieDetails.release_date).toLocaleDateString('fr-FR')}
            </p>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
            <p className="text-gray-700">{movieDetails.overview || 'Aucun synopsis disponible.'}</p>
          </div>
          
          {/* Bande-annonce */}
          {trailerKey && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Bande-annonce</h3>
              <div className="relative pt-[56.25%]">
                <YouTube
                  videoId={trailerKey}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Staff remarquable */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Sélectionnez le staff remarquable</h3>
        <p className="text-gray-600 mb-4">
          Cliquez sur les personnes que vous souhaitez mettre en avant pour ce film.
        </p>
        
        {/* Cast */}
        {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Casting</h3>
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
                    {person.profile_path ? (
                      <Image
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name || 'Photo de l\'acteur'}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 text-sm">Aucune photo</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-center">{person.name || 'Inconnu'}</h4>
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
                      {person.profile_path ? (
                        <Image
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name || 'Photo du technicien'}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500 text-sm">Aucune photo</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-center">{person.name || 'Inconnu'}</h4>
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
          disabled={isSaving || !user}
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
