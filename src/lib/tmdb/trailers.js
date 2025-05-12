'use client';

import axios from 'axios';
import { getTrailerKey } from './api';

// Configuration de l'API TMDB (reprise du fichier api.js)
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsIm5iZiI6MS43NDY1MTUwNTQyODE5OTk4ZSs5LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mI9mPVyASt5bsbRwtVN5eUs6uyz28Tvy-FRJTT6vdg8';
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
      const languagePreferences = ['fr', 'en', 'other'];
      
      let trailerKey = null;
      
      // Essayer chaque langue dans l'ordre de préférence
      for (const lang of languagePreferences) {
        if (trailerKey) break; // Arrêter si une bande-annonce a été trouvée
        
        if (videosByLanguage[lang].length > 0) {
          // Créer un objet au format attendu par getTrailerKey
          const videosData = {
            results: videosByLanguage[lang]
          };
          
          // Utiliser la fonction améliorée pour trouver la meilleure bande-annonce
          trailerKey = getTrailerKey(videosData);
          
          if (trailerKey) {
            console.log(`Bande-annonce trouvée pour le film ${movieId} en ${lang}`);
          }
        }
      }
      
      // Si aucune bande-annonce n'a été trouvée par langue, essayer avec toutes les vidéos
      if (!trailerKey) {
        trailerKey = getTrailerKey(allVideos);
        if (trailerKey) {
          console.log(`Bande-annonce trouvée pour le film ${movieId} en utilisant toutes les vidéos disponibles`);
        }
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
    
    // Si l'approche ci-dessus ne fonctionne pas, essayons l'ancienne méthode avec les requêtes par langue
    // Cette partie est conservée pour la compatibilité, mais ne devrait plus être nécessaire
    const languagePreferences = ['fr-FR', 'en-US'];
    let trailerKey = null;
    
    for (const language of languagePreferences) {
      if (trailerKey) break;
      
      const response = await tmdbApi.get(`/movie/${movieId}/videos`, { 
        params: { language }
      });
      
      trailerKey = getTrailerKey(response.data);
      
      if (trailerKey) {
        
      }
    }
    
    return trailerKey;
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
export const findTrailerByTitleAndYear = async (title, year) => {
  try {
    
    
    // Étape 1: Trouver l'ID TMDB du film
    const movieId = await findMovieByTitleAndYear(title, year);
    
    if (!movieId) {
      
      return null;
    }
    
    // Étape 2: Récupérer les bandes-annonces du film
    const trailerKey = await getMovieTrailers(movieId);
    
    if (trailerKey) {
      
    } else {
      
    }
    
    return trailerKey;
  } catch (error) {
    console.error('Erreur lors de la recherche de bande-annonce:', error);
    return null;
  }
};
