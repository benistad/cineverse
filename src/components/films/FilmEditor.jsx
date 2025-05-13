'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheck, FiSave, FiX } from 'react-icons/fi';
import YouTube from 'react-youtube';
import { getImageUrl, getTrailerKey } from '@/lib/tmdb/api';
import { saveFilm, saveRemarkableStaff, getFilmByTmdbId } from '@/lib/supabase/films';
import { useAuth } from '@/contexts/AuthContext';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor';

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
  const [isHiddenGem, setIsHiddenGem] = useState(false);
  const [selectedCarouselImage, setSelectedCarouselImage] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);

  useEffect(() => {
    // Récupérer la clé de la bande-annonce
    if (movieDetails?.videos?.results) {
      const key = getTrailerKey(movieDetails.videos);
      setTrailerKey(key);
    }
  }, [movieDetails]);
  
  // Effet séparé pour récupérer les images
  useEffect(() => {
    // Vérifier que nous avons bien un ID de film
    if (!movieDetails || !movieDetails.id) {
      console.log('Pas de détails de film disponibles pour récupérer les images');
      return;
    }
    
    console.log('Début de la récupération des images pour le film ID:', movieDetails.id);
    
    // Fonction pour récupérer les images
    const fetchAllImages = async () => {
      try {
        console.log('Appel API direct pour récupérer les images du film', movieDetails.id);
        
        // Initialiser le tableau d'images avec les images principales
        const images = [];
        
        // Ajouter l'image principale du poster si disponible
        if (movieDetails?.poster_path) {
          console.log('Ajout du poster principal:', movieDetails.poster_path);
          images.push({
            path: movieDetails.poster_path,
            type: 'poster',
            url: getImageUrl(movieDetails.poster_path, 'w500')
          });
        }
        
        // Ajouter l'image principale du backdrop si disponible
        if (movieDetails?.backdrop_path) {
          console.log('Ajout du backdrop principal:', movieDetails.backdrop_path);
          images.push({
            path: movieDetails.backdrop_path,
            type: 'backdrop',
            url: getImageUrl(movieDetails.backdrop_path, 'w1280')
          });
        }
        
        // Appel direct à l'API TMDB pour récupérer toutes les images
        const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsIm5iZiI6MS43NDY1MTUwNTQyODE5OTk4ZSs5LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mI9mPVyASt5bsbRwtVN5eUs6uyz28Tvy-FRJTT6vdg8';
        const apiUrl = `https://api.themoviedb.org/3/movie/${movieDetails.id}/images`;
        
        console.log('URL de l\'API:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tmdbToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const imagesData = await response.json();
        console.log('Réponse de l\'API TMDB:', imagesData);
        
        // Traiter tous les backdrops récupérés directement
        if (imagesData?.backdrops && imagesData.backdrops.length > 0) {
          console.log('Nombre total de backdrops récupérés:', imagesData.backdrops.length);
          
          imagesData.backdrops.forEach(backdrop => {
            // Éviter les doublons avec l'image principale du backdrop
            if (backdrop.file_path && backdrop.file_path !== movieDetails.backdrop_path) {
              console.log('Ajout d\'un backdrop:', backdrop.file_path);
              images.push({
                path: backdrop.file_path,
                type: 'backdrop',
                url: getImageUrl(backdrop.file_path, 'w1280'),
                width: backdrop.width,
                height: backdrop.height,
                aspect_ratio: backdrop.aspect_ratio
              });
            }
          });
        } else {
          console.log('Aucun backdrop trouvé dans la réponse de l\'API');
        }
        
        // Traiter tous les posters récupérés directement
        if (imagesData?.posters && imagesData.posters.length > 0) {
          console.log('Nombre total de posters récupérés:', imagesData.posters.length);
          
          imagesData.posters.forEach(poster => {
            // Éviter les doublons avec l'image principale du poster
            if (poster.file_path && poster.file_path !== movieDetails.poster_path) {
              console.log('Ajout d\'un poster:', poster.file_path);
              images.push({
                path: poster.file_path,
                type: 'poster',
                url: getImageUrl(poster.file_path, 'w500'),
                width: poster.width,
                height: poster.height,
                aspect_ratio: poster.aspect_ratio
              });
            }
          });
        } else {
          console.log('Aucun poster trouvé dans la réponse de l\'API');
        }
        
        console.log('Nombre total d\'images disponibles après récupération directe:', images.length);
        setAvailableImages(images);
      } catch (error) {
        console.error('Erreur lors de la récupération directe des images:', error);
      }
    };
    
    // Exécuter la fonction de récupération des images
    fetchAllImages();
    
    // Par défaut, sélectionner l'image principale du backdrop si disponible
    if (movieDetails?.backdrop_path) {
      setSelectedCarouselImage(movieDetails.backdrop_path);
    }
    
    // Identifier les personnes qui ont plusieurs rôles
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
    
    // Vérifier si le film existe déjà et récupérer ses MovieHunt's Picks
    async function loadExistingFilm() {
      if (movieDetails?.id) {
        try {
          const existingFilm = await getFilmByTmdbId(movieDetails.id);
          
          if (existingFilm) {
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
            
            // Précharger l'état "Film méconnu à voir"
            if (existingFilm.is_hidden_gem !== undefined) {
              setIsHiddenGem(existingFilm.is_hidden_gem);
            }
            
            // Précharger l'image sélectionnée pour le carrousel principal
            if (existingFilm.carousel_image_url) {
              // Extraire le chemin de l'image à partir de l'URL complète
              const urlParts = existingFilm.carousel_image_url.split('/');
              const imagePath = '/' + urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];
              setSelectedCarouselImage(imagePath);
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
    }
    
    loadExistingFilm();
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
      
      // Logs de débogage pour l'image du carrousel
      console.log('Image du carrousel sélectionnée:', selectedCarouselImage);
      
      // Déterminer l'URL de l'image du carrousel
      let carouselImageUrl = null;
      if (selectedCarouselImage) {
        carouselImageUrl = getImageUrl(selectedCarouselImage, 'original');
        console.log('URL générée pour l\'image du carrousel:', carouselImageUrl);
      } else if (movieDetails.backdrop_path) {
        carouselImageUrl = getImageUrl(movieDetails.backdrop_path, 'original');
        console.log('URL de l\'image de backdrop utilisée par défaut:', carouselImageUrl);
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
        carousel_image_url: carouselImageUrl,
        note_sur_10: rating,
        youtube_trailer_key: trailerKey,
        date_ajout: new Date().toISOString(),
        // Ajouter la date de sortie du film
        release_date: movieDetails.release_date || null,
        why_watch_enabled: whyWatchEnabled,
        why_watch_content: whyWatchEnabled ? whyWatchContent : null,
        is_hidden_gem: isHiddenGem,
        // Ajouter les genres du film
        genres: movieDetails.genres ? movieDetails.genres.map(genre => genre.name).join(', ') : null,
      };
      
      // Log des données complètes du film avant sauvegarde
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

      {/* Sélection d'image pour le carrousel principal */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Image pour le carrousel principal</h2>
        <p className="text-gray-600 mb-4">Sélectionnez l'image qui sera utilisée pour le carrousel principal sur la page d'accueil.</p>
        
        {/* Onglets pour séparer les backdrops et les posters */}
        <div className="flex border-b mb-4">
          <button 
            className={`px-4 py-2 font-medium ${availableImages.filter(img => img.type === 'backdrop').length > 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => document.getElementById('backdrops-section').scrollIntoView({ behavior: 'smooth' })}
          >
            Backdrops ({availableImages.filter(img => img.type === 'backdrop').length})
          </button>
          <button 
            className={`px-4 py-2 font-medium ${availableImages.filter(img => img.type === 'poster').length > 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => document.getElementById('posters-section').scrollIntoView({ behavior: 'smooth' })}
          >
            Affiches ({availableImages.filter(img => img.type === 'poster').length})
          </button>
        </div>
        
        {/* Section des backdrops */}
        <div id="backdrops-section" className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Backdrops</h3>
          {availableImages.filter(img => img.type === 'backdrop').length === 0 ? (
            <p className="text-gray-500 italic">Aucun backdrop disponible</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {availableImages
                .filter(image => image.type === 'backdrop')
                .map((image, index) => (
                <div 
                  key={`backdrop-${index}`} 
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${selectedCarouselImage === image.path ? 'border-blue-500' : 'border-gray-200'}`}
                  onClick={() => setSelectedCarouselImage(image.path)}
                >
                  <div className="relative h-40 w-full">
                    <SafeImage
                      src={image.url}
                      alt={`Backdrop ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  {selectedCarouselImage === image.path && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-blue-500 text-white rounded-full p-2">
                        <FiCheck size={24} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Section des posters */}
        <div id="posters-section" className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Affiches</h3>
          {availableImages.filter(img => img.type === 'poster').length === 0 ? (
            <p className="text-gray-500 italic">Aucune affiche disponible</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {availableImages
                .filter(image => image.type === 'poster')
                .map((image, index) => (
                <div 
                  key={`poster-${index}`} 
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${selectedCarouselImage === image.path ? 'border-blue-500' : 'border-gray-200'}`}
                  onClick={() => setSelectedCarouselImage(image.path)}
                >
                  <div className="relative h-60 w-full">
                    <SafeImage
                      src={image.url}
                      alt={`Affiche ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  {selectedCarouselImage === image.path && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-blue-500 text-white rounded-full p-2">
                        <FiCheck size={24} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-md mb-4">
            <SafeImage
              src={movieDetails.poster_path ? getImageUrl(movieDetails.poster_path) : null}
              alt={movieDetails.title || 'Poster du film'}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
          
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
                <span className="ml-2">Marquer comme "Film méconnu à voir"</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-7">Ce film apparaîtra dans la section "Films méconnus à voir" sur la page d'accueil.</p>
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
