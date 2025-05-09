'use client';

import axios from 'axios';

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
 * Types de disponibilité des films sur les plateformes
 */
export const WATCH_TYPES = {
  FLATRATE: 'flatrate', // Abonnement/SVOD
  RENT: 'rent',         // Location
  BUY: 'buy',           // Achat
  ADS: 'ads',           // Gratuit avec publicité
  FREE: 'free'          // Gratuit sans publicité
};

/**
 * Récupère les plateformes de streaming où un film est disponible en France
 * @param {number} movieId - ID TMDB du film
 * @returns {Promise<Object|null>} - Informations sur les plateformes de streaming ou null si aucune
 */
export const getStreamingProviders = async (movieId) => {
  try {
    if (!movieId) return null;
    
    const response = await tmdbApi.get(`/movie/${movieId}/watch/providers`);
    
    // Vérifier si des informations sont disponibles pour la France
    if (response.data && response.data.results && response.data.results.FR) {
      return {
        link: response.data.results.FR.link, // Lien vers JustWatch
        providers: {
          flatrate: response.data.results.FR.flatrate || [], // Abonnement/SVOD
          rent: response.data.results.FR.rent || [],         // Location
          buy: response.data.results.FR.buy || [],           // Achat
          ads: response.data.results.FR.ads || [],           // Gratuit avec publicité
          free: response.data.results.FR.free || []          // Gratuit sans publicité
        }
      };
    }
    
    return null; // Aucune information disponible pour la France
  } catch (error) {
    console.error(`Erreur lors de la récupération des plateformes de streaming pour le film ${movieId}:`, error);
    return null;
  }
};

/**
 * Récupère les plateformes de streaming où un film est disponible en France par son titre et son année
 * @param {string} title - Titre du film
 * @param {number} year - Année de sortie du film
 * @returns {Promise<Object|null>} - Informations sur les plateformes de streaming ou null si aucune
 */
export const getStreamingProvidersByTitleAndYear = async (title, year) => {
  try {
    if (!title) return null;
    
    // Étape 1: Rechercher le film sur TMDB
    const searchResponse = await tmdbApi.get('/search/movie', {
      params: {
        query: title,
        primary_release_year: year,
        language: 'fr-FR',
        include_adult: false,
      },
    });
    
    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      // Prendre le premier résultat (le plus pertinent)
      const movieId = searchResponse.data.results[0].id;
      
      // Étape 2: Récupérer les plateformes de streaming
      return await getStreamingProviders(movieId);
    }
    
    return null;
  } catch (error) {
    console.error(`Erreur lors de la recherche des plateformes de streaming pour ${title} (${year}):`, error);
    return null;
  }
};
