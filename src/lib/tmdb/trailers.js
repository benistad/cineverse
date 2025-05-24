'use client';

import axios from 'axios';
import { getTrailerKey } from './api';

// Configuration de l'API YouTube Data
// Note: Nous utilisons une recherche simplifiée sans API key pour éviter les problèmes d'authentification
// La recherche se fait via une URL YouTube standard

// Configuration de l'API TMDB (reprise du fichier api.js)
// Note: Ce token a été mis à jour le 24/05/2025
// Clé API: 0e1fc1d893511f80a0c6b4c4de161c51
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTFmYzFkODkzNTExZjgwYTBjNmI0YzRkZTE2MWM1MSIsIm5iZiI6MTc0NjUxNTA1NC4yODE5OTk4LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hj-9KXl-h5-7CtFhFSC6V4NJE__c1ozx5OnrETtCS9c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Client Axios pour TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Recherche un film sur TMDB par son titre et son année de sortie
 * @param {string} title - Titre du film
 * @param {number} year - Année de sortie du film
 * @returns {Promise<number|null>} - ID TMDB du film ou null si non trouvé
 */
export const findMovieByTitleAndYear = async (title, year) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: title,
        primary_release_year: year,
        language: 'fr-FR',
        include_adult: false,
      },
    });
    
    if (response.data.results && response.data.results.length > 0) {
      // Trier les résultats par popularité pour prendre le plus pertinent
      const sortedResults = response.data.results.sort((a, b) => b.popularity - a.popularity);
      return sortedResults[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche du film sur TMDB:', error);
    return null;
  }
};

/**
 * Récupère les bandes-annonces d'un film par son ID TMDB
 * Recherche exhaustive dans toutes les langues disponibles
 * Gère les cas où les vidéos sont privées ou indisponibles
 * @param {number} movieId - ID TMDB du film
 * @returns {Promise<string|null>} - Clé YouTube de la bande-annonce ou null si non trouvée
 */
export const getMovieTrailers = async (movieId) => {
  try {
    // IMPORTANT: D'abord récupérer TOUTES les bandes-annonces disponibles sans filtre de langue
    // Cela nous assure de ne manquer aucune bande-annonce, même si elle n'est disponible qu'en VO
    const allVideosResponse = await tmdbApi.get(`/movie/${movieId}/videos`);
    const allVideos = allVideosResponse.data;
    
    // Vérifier si nous avons des vidéos, quelle que soit la langue
    if (allVideos && allVideos.results && allVideos.results.length > 0) {
      console.log(`${allVideos.results.length} vidéos trouvées pour le film ${movieId} toutes langues confondues`);      
      
      // Organiser les vidéos par langue pour pouvoir les prioriser
      const videosByLanguage = {
        'fr': allVideos.results.filter(v => v.iso_639_1 === 'fr'),
        'en': allVideos.results.filter(v => v.iso_639_1 === 'en'),
        'other': allVideos.results.filter(v => v.iso_639_1 !== 'fr' && v.iso_639_1 !== 'en')
      };
      
      // Stratégie de recherche par ordre de préférence linguistique
      // PRIORITÉ 1: Bandes-annonces VF via TMDB
      // PRIORITÉ 2: Bandes-annonces VO via TMDB
      // PRIORITÉ 3: YouTube (seulement si rien n'est trouvé via TMDB)
      const languagePreferences = ['fr', 'en', 'other'];
      
      let trailerKey = null;
      let trailerLanguage = null;
      
      // Essayer chaque langue dans l'ordre de préférence
      for (const lang of languagePreferences) {
        if (videosByLanguage[lang].length > 0) {
          // Créer un objet au format attendu par getTrailerKey
          const videosData = {
            results: videosByLanguage[lang]
          };
          
          // Utiliser la fonction améliorée pour trouver la meilleure bande-annonce
          const key = getTrailerKey(videosData);
          
          if (key) {
            console.log(`Bande-annonce trouvée pour le film ${movieId} en ${lang}`);
            
            // Si c'est une bande-annonce française, on la prend immédiatement
            if (lang === 'fr') {
              trailerKey = key;
              trailerLanguage = lang;
              break; // On arrête la recherche si on a trouvé une bande-annonce en français
            }
            // Pour les autres langues, on garde la première trouvée
            // mais on continue à chercher au cas où on trouverait une bande-annonce en français
            else if (!trailerKey) {
              trailerKey = key;
              trailerLanguage = lang;
            }
          }
        }
      }
      
      if (trailerKey) {
        console.log(`Utilisation de la bande-annonce en ${trailerLanguage} pour le film ${movieId}`);
      }
      
      // Si aucune bande-annonce n'a été trouvée par langue, essayer avec toutes les vidéos
      if (!trailerKey) {
        trailerKey = getTrailerKey(allVideos);
        if (trailerKey) {
          console.log(`Bande-annonce trouvée pour le film ${movieId} en utilisant toutes les vidéos disponibles`);
        }
      }
      
      // Cas spéciaux pour certains films qui nécessitent une bande-annonce VF spécifique
      // Destination Finale : Bloodlines
      if (movieId === 574475) {
        console.log(`Film spécial détecté: Destination Finale : Bloodlines (ID: ${movieId})`);
        console.log(`Utilisation de la bande-annonce VF officielle au lieu de la version VO`);
        return '2Dk_tQvEe3o'; // Bande-annonce VF officielle de Warner Bros. France
      }
      
      // Vérifier si la bande-annonce est connue pour être privée ou indisponible
      // Cas spécifique pour le film 1BR et autres films avec des bandes-annonces privées
      if (trailerKey === 'dZw7LR0vNww' || (movieId === 627290 && trailerKey)) { // 627290 est l'ID TMDB de 1BR
        console.log(`La bande-annonce pour le film ${movieId} (${trailerKey}) est potentiellement indisponible, recherche d'une alternative...`);
        
        // Chercher une bande-annonce alternative en excluant celle qui est privée
        const alternativeVideos = {
          results: allVideos.results.filter(video => video.key !== trailerKey)
        };
        
        if (alternativeVideos.results.length > 0) {
          const alternativeKey = getTrailerKey(alternativeVideos);
          if (alternativeKey) {
            console.log(`Bande-annonce alternative trouvée pour le film ${movieId}: ${alternativeKey}`);
            return alternativeKey;
          }
        }
      }
      
      return trailerKey;
    }
    
    // Si aucune bande-annonce n'a été trouvée sur TMDB, essayons de récupérer le titre et l'année du film
    // pour faire une recherche sur YouTube
    try {
      // Récupérer les détails du film pour avoir son titre et son année
      const movieDetails = await tmdbApi.get(`/movie/${movieId}`, {
        params: { language: 'fr-FR' }
      });
      
      if (movieDetails.data && movieDetails.data.title) {
        const title = movieDetails.data.title;
        const year = movieDetails.data.release_date ? new Date(movieDetails.data.release_date).getFullYear() : null;
        
        console.log(`Aucune bande-annonce TMDB pour le film ${movieId} (${title}), recherche sur YouTube...`);
        const youtubeKey = await searchYouTubeTrailer(title, year);
        
        if (youtubeKey) {
          console.log(`Bande-annonce YouTube trouvée pour le film ${movieId} (${title}): ${youtubeKey}`);
          return youtubeKey;
        }
      }
    } catch (youtubeError) {
      console.error(`Erreur lors de la recherche YouTube pour le film ${movieId}:`, youtubeError);
    }
    
    // Si toutes les approches ont échoué, retourner null
    console.log(`Aucune bande-annonce trouvée pour le film ${movieId}, ni sur TMDB ni sur YouTube`);
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des bandes-annonces pour le film ${movieId}:`, error);
    return null;
  }
};

/**
 * Recherche une bande-annonce pour un film en utilisant son titre et son année
 * @param {string} title - Titre du film
 * @param {number} year - Année de sortie du film
 * @returns {Promise<string|null>} - Clé YouTube de la bande-annonce ou null si non trouvée
 */
/**
 * Recherche une bande-annonce sur YouTube pour un film donné
 * @param {string} movieTitle - Titre du film
 * @param {number} year - Année de sortie du film (optionnelle)
 * @returns {Promise<string|null>} - Clé YouTube de la bande-annonce ou null si non trouvée
 */
export const searchYouTubeTrailer = async (movieTitle, year = null) => {
  try {
    // Construire les requêtes de recherche (d'abord en VF, puis en VO si nécessaire)
    const yearString = year ? ` ${year}` : '';
    
    // PRIORITÉ 1: Recherche en VF sur YouTube
    const searchQueryVF = `${movieTitle}${yearString} bande annonce officielle VF`;
    // PRIORITÉ 2: Recherche en VO sur YouTube (si VF non trouvée)
    const searchQueryVO = `${movieTitle}${yearString} trailer official`;
    
    // URL de recherche YouTube pour référence (VF par défaut)
    const searchUrlVF = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQueryVF)}`;
    const searchUrlVO = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQueryVO)}`;
    
    console.log(`URLs de recherche YouTube générées pour "${movieTitle}":`);
    console.log(`- VF: ${searchUrlVF}`);
    console.log(`- VO: ${searchUrlVO}`);
    
    // Utiliser des bandes-annonces prédéfinies pour certains films populaires
    // Cette approche est plus fiable que l'API YouTube qui peut être limitée
    // Organisées par langue (VF puis VO)
    const predefinedTrailers = {
      // Films récents - VF prioritaire
      'destination finale : bloodlines': '2Dk_tQvEe3o', // VF officielle de Warner Bros. France
      'destination finale bloodlines': '2Dk_tQvEe3o', // VF officielle de Warner Bros. France
      'funny games u.s.': 'Ec-70W_K77U', // VF
      'funny games us': 'Ec-70W_K77U', // VF
      'last breath': 'mGcCBMDHYBs', // VF
      'old henry': 'NresUMU-Qlc', // VF
      'le procès du siècle': 'Aw-Fr6BwgWA', // VF
      'ad astra': 'nxi6rtBtRxY', // VF
      'split': 'ROle23EfYJk', // VF
      'fall': 'aa5MXOMN1lM', // VF
      '1917': 'gZjQROMAh_s', // VF
      'les banshees dinisherin': 'uRu3zLOJN2c', // VF
      'les banshees d\'inisherin': 'uRu3zLOJN2c', // VF
      'game night': 'qmxMAdV6s4U', // VF
      'triangle': 'NOwvAYWxfgo', // VF
      
      // Classiques - VF si disponible, sinon VO
      'pulp fiction': 'tGpTpVyI_OQ',
      'the godfather': 'sY1S34973zA',
      'the dark knight': 'EXeTwQWrcwY',
      'inception': 'YoHD9XEInc0',
      'interstellar': 'zSWdZVtXT7E',
      'shawshank redemption': 'NmzuHjWmXOc',
      'fight club': 'qtRKdVHc-cE',
      'the matrix': 'm8e-FF8MsqU'
    };
    
    // Rechercher dans les bandes-annonces prédéfinies
    // Normalisation plus agressive pour augmenter les chances de correspondance
    const normalizedTitle = movieTitle.toLowerCase()
      .trim()
      .replace(/[\s:'-]/g, '') // Supprimer les espaces, deux-points, apostrophes et tirets
      .replace(/\./g, '')       // Supprimer les points
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Supprimer les accents
    
    console.log(`Titre normalisé pour la recherche: "${normalizedTitle}"`);
    
    // Cas spécial pour "Destination Finale : Bloodlines"
    if (
      normalizedTitle.includes('destinationfinale') || 
      normalizedTitle.includes('finaledestination') ||
      normalizedTitle.includes('destinationfinalebloodlines') ||
      normalizedTitle.includes('finaledestinationbloodlines')
    ) {
      console.log(`Correspondance spéciale trouvée pour Destination Finale: Bloodlines`);
      return '2Dk_tQvEe3o'; // Bande-annonce VF officielle de Warner Bros. France
    }
    
    // Recherche normale dans les bandes-annonces prédéfinies
    for (const [title, videoId] of Object.entries(predefinedTrailers)) {
      const normalizedPredefinedTitle = title.toLowerCase()
        .trim()
        .replace(/[\s:'-]/g, '')
        .replace(/\./g, '')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (normalizedTitle.includes(normalizedPredefinedTitle) || normalizedPredefinedTitle.includes(normalizedTitle)) {
        console.log(`Bande-annonce prédéfinie trouvée pour "${movieTitle}": ${videoId}`);
        return videoId;
      }
    }
    
    // Si aucune bande-annonce prédéfinie n'est trouvée, générer des URLs de recherche YouTube
    // Ces URLs permettront à l'utilisateur de trouver manuellement la bande-annonce
    console.log(`Aucune bande-annonce prédéfinie pour "${movieTitle}".`);
    console.log(`- Essayez de chercher en VF: ${searchUrlVF}`);
    console.log(`- Ou en VO si nécessaire: ${searchUrlVO}`);
    
    // Pour le moment, nous retournons null pour indiquer qu'aucune bande-annonce n'a été trouvée
    // Dans une version future, nous pourrions implémenter une vraie recherche YouTube API
    // qui respecterait l'ordre de priorité VF puis VO
    return null;
  } catch (error) {
    console.error(`Erreur lors de la recherche YouTube pour "${movieTitle}":`, error);
    return null; // Retourner null en cas d'erreur
  }
};

/**
 * Recherche une bande-annonce pour un film en utilisant son titre et son année
 * @param {string} title - Titre du film
 * @param {number} year - Année de sortie du film
 * @returns {Promise<string|null>} - Clé YouTube de la bande-annonce ou null si non trouvée
 */
export const findTrailerByTitleAndYear = async (title, year) => {
  try {
    console.log(`Recherche de bande-annonce pour: ${title} (${year})`);
    
    // PRIORITÉ 1 et 2: Bandes-annonces via TMDB (VF puis VO)
    // Étape 1: Trouver l'ID TMDB du film
    const movieId = await findMovieByTitleAndYear(title, year);
    
    if (movieId) {
      // Étape 2: Récupérer les bandes-annonces du film depuis TMDB
      const trailerKey = await getMovieTrailers(movieId);
      
      if (trailerKey) {
        console.log(`Bande-annonce TMDB trouvée pour: ${title} (${year})`);
        return trailerKey;
      }
      console.log(`Aucune bande-annonce TMDB pour: ${title} (${year}), recherche sur YouTube...`);
    } else {
      console.log(`Film non trouvé sur TMDB: ${title} (${year})`);
    }
    
    // PRIORITÉ 3: Bandes-annonces via YouTube (seulement si rien n'est trouvé via TMDB)
    // Si le film n'est pas trouvé sur TMDB ou si aucune bande-annonce n'est trouvée, essayer YouTube
    return await searchYouTubeTrailer(title, year);
  } catch (error) {
    console.error('Erreur lors de la recherche de bande-annonce:', error);
    // En cas d'erreur, essayer quand même YouTube comme dernier recours
    try {
      return await searchYouTubeTrailer(title, year);
    } catch (youtubeError) {
      console.error('Erreur lors de la recherche YouTube:', youtubeError);
      return null;
    }
  }
};
