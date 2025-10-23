'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX, FiImage } from 'react-icons/fi';
import YouTube from 'react-youtube';
import { getImageUrl, getTrailerKey, getMoviePosters } from '@/lib/tmdb/api';
import { saveFilm, saveRemarkableStaff, getFilmByTmdbId } from '@/lib/supabase/films';
import { useAuth } from '@/contexts/AuthContext';
import RatingIcon from '@/components/ui/RatingIcon';
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor';
import SafeImage from '@/components/ui/SafeImage';

export default function FilmEditor({ movieDetails }) {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [rating, setRating] = useState(5);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [multiRolePersons, setMultiRolePersons] = useState({});
  const [whyWatchEnabled, setWhyWatchEnabled] = useState(false);
  const [whyWatchContent, setWhyWatchContent] = useState('');
  const [notLikedEnabled, setNotLikedEnabled] = useState(false);
  const [notLikedContent, setNotLikedContent] = useState('');
  const [isHiddenGem, setIsHiddenGem] = useState(false);
  const [isHuntedByMovieHunt, setIsHuntedByMovieHunt] = useState(false);
  const [existingFilmData, setExistingFilmData] = useState(null);
  const [selectedCarouselImage, setSelectedCarouselImage] = useState(null);
  const [hasBlogArticle, setHasBlogArticle] = useState(false);
  const [blogArticleUrl, setBlogArticleUrl] = useState('');
  const [availablePosters, setAvailablePosters] = useState([]);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showPosterSelector, setShowPosterSelector] = useState(false);
  const [loadingPosters, setLoadingPosters] = useState(false);

  useEffect(() => {
    // Récupérer la clé de la bande-annonce
    if (movieDetails?.videos?.results) {
      const key = getTrailerKey(movieDetails.videos);
      setTrailerKey(key);
    }
  }, [movieDetails]);

  // Charger les affiches disponibles depuis TMDB
  useEffect(() => {
    const loadPosters = async () => {
      if (movieDetails?.id) {
        setLoadingPosters(true);
        try {
          const posters = await getMoviePosters(movieDetails.id);
          setAvailablePosters(posters);
          // Sélectionner l'affiche par défaut (la première, qui est l'affiche principale)
          if (posters.length > 0 && !selectedPoster) {
            setSelectedPoster(posters[0].file_path);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des affiches:', error);
        } finally {
          setLoadingPosters(false);
        }
      }
    };
    loadPosters();
  }, [movieDetails?.id]);
  
  // Identifier les personnes qui ont plusieurs rôles
  useEffect(() => {
    if (movieDetails?.credits) {
      const personRoles = {};
      // Parcourir le casting
      if (movieDetails.credits.cast) {
        movieDetails.credits.cast.forEach(person => {
          if (!personRoles[person.id]) {
            personRoles[person.id] = [];
          }
          personRoles[person.id].push('cast');
        });
      }
      // Parcourir l'équipe technique
      if (movieDetails.credits.crew) {
        movieDetails.credits.crew.forEach(person => {
          if (!personRoles[person.id]) {
            personRoles[person.id] = [];
          }
          if (!personRoles[person.id].includes(person.job)) {
            personRoles[person.id].push(person.job);
          }
        });
      }
      // Identifier les personnes qui ont plusieurs rôles
      const multiRoles = {};
      Object.entries(personRoles).forEach(([personId, roles]) => {
        if (roles.length > 1) {
          multiRoles[personId] = true;
        }
      });
      setMultiRolePersons(multiRoles);
    }
  }, [movieDetails]);

  useEffect(() => {
    if (movieDetails?.id) {
      const loadExistingFilm = async () => {
        try {
          const existingFilm = await getFilmByTmdbId(movieDetails.id);
          if (existingFilm) {
            // Stocker le film existant dans l'état
            setExistingFilmData(existingFilm);
            // Précharger la note
            if (existingFilm.note_sur_10) {
              setRating(existingFilm.note_sur_10);
            }
            // Précharger les données "Pourquoi regarder ce film ?"
            if (existingFilm.why_watch_enabled !== undefined) {
              setWhyWatchEnabled(existingFilm.why_watch_enabled);
            }
            if (existingFilm.why_watch_content) {
              setWhyWatchContent(existingFilm.why_watch_content);
            }
            if (existingFilm.not_liked_enabled !== undefined) {
              setNotLikedEnabled(existingFilm.not_liked_enabled);
            }
            if (existingFilm.not_liked_content) {
              setNotLikedContent(existingFilm.not_liked_content);
            }
            // Précharger l'état "Film méconnu à voir"
            if (existingFilm.is_hidden_gem !== undefined) {
              setIsHiddenGem(existingFilm.is_hidden_gem);
            }
            // Précharger l'état "Hunted by MovieHunt"
            console.log('Valeur is_hunted_by_moviehunt dans existingFilm:', existingFilm.is_hunted_by_moviehunt);
            if (existingFilm.is_hunted_by_moviehunt !== undefined) {
              setIsHuntedByMovieHunt(existingFilm.is_hunted_by_moviehunt);
              console.log('is_hunted_by_moviehunt défini, valeur:', existingFilm.is_hunted_by_moviehunt);
            } else {
              console.log('is_hunted_by_moviehunt non défini dans les données du film');
            }
            // Précharger l'article de blog
            if (existingFilm.blog_article_url) {
              setHasBlogArticle(true);
              setBlogArticleUrl(existingFilm.blog_article_url);
            }
            // Précharger les MovieHunt's Picks
            if (existingFilm.remarkable_staff && existingFilm.remarkable_staff.length > 0) {
              const preselectedRoles = {};
              existingFilm.remarkable_staff.forEach(staffMember => {
                // Trouver la personne correspondante dans les crédits du film
                let matchingPerson = null;
                // Chercher dans le casting
                if (movieDetails.credits?.cast) {
                  matchingPerson = movieDetails.credits.cast.find(p => 
                    p.name === staffMember.nom && 
                    (staffMember.role.includes('Acteur') || staffMember.role.includes('acteur'))
                  );
                }
                // Si non trouvé dans le casting, chercher dans l'équipe technique
                if (!matchingPerson && movieDetails.credits?.crew) {
                  matchingPerson = movieDetails.credits.crew.find(p => 
                    p.name === staffMember.nom && 
                    (staffMember.role === p.job || staffMember.role.includes(p.job))
                  );
                }
                if (matchingPerson) {
                  if (!preselectedRoles[matchingPerson.id]) {
                    preselectedRoles[matchingPerson.id] = [];
                  }
                  preselectedRoles[matchingPerson.id].push({
                    role: staffMember.role,
                    name: staffMember.nom,
                    profile_path: matchingPerson.profile_path
                  });
                }
              });
              setSelectedRoles(preselectedRoles);
            }
          }
        } catch (error) {
          console.error('Erreur lors du chargement du film existant:', error);
        }
      }
      
      loadExistingFilm();
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

  const toggleRoleSelection = (person, role) => {
    setSelectedRoles(prev => {
      const newRoles = { ...prev };
      
      // Si cette personne n'a pas encore de rôles sélectionnés, créer un tableau vide
      if (!newRoles[person.id]) {
        newRoles[person.id] = [];
      }
      
      // Vérifier si ce rôle est déjà sélectionné
      const roleIndex = newRoles[person.id].findIndex(r => r.role === role);
      
      if (roleIndex >= 0) {
        // Si le rôle est déjà sélectionné, le supprimer
        newRoles[person.id].splice(roleIndex, 1);
        
        // Si plus aucun rôle n'est sélectionné pour cette personne, supprimer l'entrée
        if (newRoles[person.id].length === 0) {
          delete newRoles[person.id];
        }
      } else {
        // Sinon, ajouter ce rôle
        newRoles[person.id].push({
          role,
          name: person.name || 'Inconnu',
          profile_path: person.profile_path
        });
      }
      
      return newRoles;
    });
  };

  const isRoleSelected = (personId, role) => {
    if (!selectedRoles[personId]) return false;
    return selectedRoles[personId].some(r => r.role === role);
  };
  
  const getSelectedRolesCount = (personId) => {
    if (!selectedRoles[personId]) return 0;
    return selectedRoles[personId].length;
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
        tmdb_id: parseInt(movieDetails.id, 10), // S'assurer que tmdb_id est un nombre
        title: movieDetails.title || 'Sans titre',
        slug: movieDetails.title 
          ? movieDetails.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-') 
          : 'film-sans-titre',
        synopsis: movieDetails.overview || '',
        // Enregistrer uniquement les URLs complètes pour assurer la compatibilité
        // Utiliser l'affiche sélectionnée si disponible, sinon l'affiche par défaut
        poster_url: selectedPoster ? getImageUrl(selectedPoster) : (movieDetails.poster_path ? getImageUrl(movieDetails.poster_path) : null),
        backdrop_url: movieDetails.backdrop_path ? getImageUrl(movieDetails.backdrop_path, 'original') : null,
        // S'assurer que carousel_image_url est inclus, utiliser backdrop_url par défaut si non défini
        carousel_image_url: selectedCarouselImage || (movieDetails.backdrop_path ? getImageUrl(movieDetails.backdrop_path, 'original') : null),
        note_sur_10: rating,
        youtube_trailer_key: trailerKey,
        // Ne mettre à jour date_ajout que pour les nouveaux films
        date_ajout: existingFilmData ? existingFilmData.date_ajout : new Date().toISOString(),
        // Ajouter la date de sortie du film
        release_date: movieDetails.release_date || null,
        why_watch_enabled: whyWatchEnabled,
        why_watch_content: whyWatchEnabled ? whyWatchContent : null,
        not_liked_enabled: notLikedEnabled,
        not_liked_content: notLikedEnabled ? notLikedContent : null,
        is_hidden_gem: isHiddenGem,
        is_hunted_by_moviehunt: isHuntedByMovieHunt,
        blog_article_url: hasBlogArticle ? blogArticleUrl : null,
        // Ajouter les genres du film
        genres: movieDetails.genres ? movieDetails.genres.map(genre => genre.name).join(', ') : null,
      };
      
      console.log('Valeur is_hunted_by_moviehunt avant sauvegarde:', isHuntedByMovieHunt);
      console.log('Données du film à sauvegarder:', filmData);

      // Sauvegarder le film
      const savedFilm = await saveFilm(filmData);

      if (!savedFilm) {
        throw new Error('Erreur lors de la sauvegarde du film');
      }

      // Sauvegarder le staff remarquable avec leurs rôles individuels
      const staffPromises = [];
      
      // Parcourir toutes les personnes qui ont au moins un rôle sélectionné
      Object.keys(selectedRoles).forEach(personId => {
        // Pour chaque personne, parcourir tous ses rôles sélectionnés
        selectedRoles[personId].forEach(roleInfo => {
          // Créer une entrée dans la base de données pour chaque rôle
          staffPromises.push(
            saveRemarkableStaff({
              film_id: savedFilm.id,
              nom: roleInfo.name,
              role: roleInfo.role,
              photo_url: roleInfo.profile_path ? getImageUrl(roleInfo.profile_path, 'w185') : null,
            })
          );
        });
      });
      
      if (staffPromises.length > 0) {
        await Promise.all(staffPromises);
      }

      setSuccess(true);
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      // Afficher un message d'erreur plus détaillé si disponible
      if (err.response && err.response.data) {
        setError(`Erreur: ${err.response.data.message || err.message}. Veuillez réessayer.`);
      } else if (err.message && err.message.includes('406')) {
        setError('Erreur 406: Le format de la requête n\'est pas acceptable. Vérifiez les données du film, en particulier les URLs d\'images.');
      } else {
        setError(`Une erreur est survenue lors de la sauvegarde: ${err.message || 'Erreur inconnue'}. Veuillez réessayer.`);
      }
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

      
        
        {/* Onglets pour séparer les backdrops et les posters */}
        
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-md mb-4">
            <SafeImage
              src={selectedPoster ? getImageUrl(selectedPoster) : (movieDetails.poster_path ? getImageUrl(movieDetails.poster_path) : null)}
              alt={movieDetails.title || 'Poster du film'}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
          
          {/* Bouton pour choisir une autre affiche */}
          <button
            type="button"
            onClick={() => setShowPosterSelector(!showPosterSelector)}
            className="w-full mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <FiImage className="mr-2" />
            {showPosterSelector ? 'Masquer les affiches' : 'Choisir une autre affiche'}
          </button>
          
          {/* Sélecteur d'affiches */}
          {showPosterSelector && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
              <h4 className="font-semibold mb-3">Affiches disponibles ({availablePosters.length})</h4>
              {loadingPosters ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Chargement...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availablePosters.map((poster, index) => (
                    <button
                      key={poster.file_path}
                      type="button"
                      onClick={() => setSelectedPoster(poster.file_path)}
                      className={`relative aspect-[2/3] rounded overflow-hidden border-2 transition-all ${
                        selectedPoster === poster.file_path
                          ? 'border-indigo-600 ring-2 ring-indigo-300'
                          : 'border-gray-300 hover:border-indigo-400'
                      }`}
                      title={`Affiche ${index + 1} - ${poster.iso_639_1 || 'Langue inconnue'}`}
                    >
                      <SafeImage
                        src={getImageUrl(poster.file_path, 'w185')}
                        alt={`Affiche ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                      {selectedPoster === poster.file_path && (
                        <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white rounded-full p-1">
                            <FiImage className="text-indigo-600" size={20} />
                          </div>
                        </div>
                      )}
                      {poster.iso_639_1 && (
                        <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {poster.iso_639_1.toUpperCase()}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Notation */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Votre note</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  className="w-full mr-2"
                />
                <span className="font-bold text-xl ml-2">{rating}/10</span>
              </div>
              <div className="flex justify-center">
                <RatingIcon rating={rating} size={60} />
              </div>
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
          
          {/* Section "Pourquoi regarder ce film ?" */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Pourquoi regarder ce film ?</h3>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={whyWatchEnabled}
                  onChange={(e) => setWhyWatchEnabled(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Activer la section "Pourquoi regarder ce film ?"</span>
              </label>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHiddenGem}
                  onChange={(e) => setIsHiddenGem(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Marquer comme "Film inconnu à voir"</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-7">Ce film apparaîtra dans la section "Films inconnus à voir" sur la page d'accueil.</p>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHuntedByMovieHunt}
                  onChange={(e) => setIsHuntedByMovieHunt(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Hunted by MovieHunt</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-7">Un badge "Hunted" sera affiché sur l'affiche du film.</p>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBlogArticle}
                  onChange={(e) => setHasBlogArticle(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2">Article sur le blog</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-7">Un bouton "Lire la critique sur le blog" sera affiché sur la page du film.</p>
              {hasBlogArticle && (
                <div className="mt-3 ml-7">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'article
                  </label>
                  <input
                    type="url"
                    value={blogArticleUrl}
                    onChange={(e) => setBlogArticleUrl(e.target.value)}
                    placeholder="https://votre-blog.com/article-du-film"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            </div>
            
            {whyWatchEnabled && (
              <div className="mt-2">
                <SimpleRichTextEditor
                  value={whyWatchContent}
                  onChange={setWhyWatchContent}
                  placeholder="Expliquez pourquoi ce film mérite d'être vu..."
                />
              </div>
            )}
          </div>

          {/* Section "Ce que nous n'avons pas aimé" */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Ce que nous n'avons pas aimé</h3>
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notLikedEnabled}
                  onChange={(e) => setNotLikedEnabled(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-red-600"
                />
                <span className="ml-2">Activer la section "Ce que nous n'avons pas aimé"</span>
              </label>
            </div>
            {notLikedEnabled && (
              <div className="mt-2">
                <SimpleRichTextEditor
                  value={notLikedContent}
                  onChange={setNotLikedContent}
                  placeholder="Indiquez ce qui vous a déplu ou les points faibles du film..."
                />
              </div>
            )}
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
                  className={`relative rounded-lg p-2 transition-all ${
                    getSelectedRolesCount(person.id) > 0
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="relative h-40 w-full mb-2 rounded overflow-hidden">
                    <SafeImage
                      src={person.profile_path ? getImageUrl(person.profile_path, 'w185') : null}
                      alt={person.name || 'Photo de l\'acteur'}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-center">{person.name || 'Inconnu'}</h4>
                  {person.character && (
                    <p className="text-sm text-gray-600 text-center">{person.character}</p>
                  )}
                  
                  {/* Case à cocher pour le rôle d'acteur (seulement si la personne a plusieurs rôles) */}
                  {multiRolePersons[person.id] ? (
                    <div className="mt-2 flex items-center justify-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isRoleSelected(person.id, `Acteur${person.character ? ` (${person.character})` : ''}`)} 
                          onChange={() => toggleRoleSelection(person, `Acteur${person.character ? ` (${person.character})` : ''}`)} 
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm">Sélectionner comme acteur</span>
                      </label>
                    </div>
                  ) : (
                    // Si la personne n'a qu'un seul rôle, la sélectionner automatiquement
                    <div className="mt-2 text-center">
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${isRoleSelected(person.id, `Acteur${person.character ? ` (${person.character})` : ''}`) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => toggleRoleSelection(person, `Acteur${person.character ? ` (${person.character})` : ''}`)}
                      >
                        {isRoleSelected(person.id, `Acteur${person.character ? ` (${person.character})` : ''}`) ? 'Sélectionné' : 'Sélectionner'}
                      </button>
                    </div>
                  )}
                  
                  {getSelectedRolesCount(person.id) > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                      {getSelectedRolesCount(person.id)}
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
                .filter((person) => [
                  'Director',            // Réalisateur
                  'Writer',              // Scénariste
                  'Screenplay',          // Scénariste
                  'Original Music Composer', // Compositeur de musique
                  'Music',               // Musique
                  'Director of Photography', // Directeur de la photographie
                  'Cinematography',      // Cinématographie
                  'Production Design',   // Directeur artistique
                  'Costume Design',      // Costumes
                  'Editor',              // Monteur
                  'Sound',               // Son
                  'Visual Effects',      // Effets visuels
                  'Producer',            // Producteur
                  'Executive Producer'   // Producteur exécutif
                ].includes(person.job || ''))
                .sort((a, b) => {
                  // Définir l'ordre de priorité des rôles
                  const roleOrder = {
                    'Director': 1,
                    'Writer': 2,
                    'Screenplay': 3,
                    'Original Music Composer': 4,
                    'Music': 5,
                    'Director of Photography': 6,
                    'Cinematography': 7,
                    'Production Design': 8,
                    'Costume Design': 9,
                    'Editor': 10,
                    'Sound': 11,
                    'Visual Effects': 12,
                    'Producer': 13,
                    'Executive Producer': 14
                  };
                  
                  // Trier par ordre de priorité, puis par nom si même rôle
                  const orderA = roleOrder[a.job] || 999;
                  const orderB = roleOrder[b.job] || 999;
                  
                  if (orderA === orderB) {
                    return a.name.localeCompare(b.name);
                  }
                  
                  return orderA - orderB;
                })
                .slice(0, 20) // Augmenter le nombre maximum de membres d'équipe affichés
                .map((person) => (
                  <div 
                    key={`${person.id}-${person.job}`} 
                    className={`relative rounded-lg p-2 transition-all ${
                      getSelectedRolesCount(person.id) > 0
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="relative h-40 w-full mb-2 rounded overflow-hidden">
                      <SafeImage
                        src={person.profile_path ? getImageUrl(person.profile_path, 'w185') : null}
                        alt={person.name || 'Photo du technicien'}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-medium text-center">{person.name || 'Inconnu'}</h4>
                    {person.job && (
                      <p className="text-sm text-gray-600 text-center">{person.job}</p>
                    )}
                    
                    {/* Case à cocher pour le rôle spécifique (seulement si la personne a plusieurs rôles) */}
                    {multiRolePersons[person.id] ? (
                      <div className="mt-2 flex items-center justify-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isRoleSelected(person.id, person.job)} 
                            onChange={() => toggleRoleSelection(person, person.job)} 
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm">Sélectionner comme {person.job}</span>
                        </label>
                      </div>
                    ) : (
                      // Si la personne n'a qu'un seul rôle, la sélectionner automatiquement
                      <div className="mt-2 text-center">
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${isRoleSelected(person.id, person.job) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          onClick={() => toggleRoleSelection(person, person.job)}
                        >
                          {isRoleSelected(person.id, person.job) ? 'Sélectionné' : 'Sélectionner'}
                        </button>
                      </div>
                    )}
                    
                    {getSelectedRolesCount(person.id) > 0 && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                        {getSelectedRolesCount(person.id)}
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
