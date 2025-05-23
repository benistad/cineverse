'use client';

import axios from 'axios';

// Configuration de l'API TMDB (reprise du fichier api.js)
// Note: Ce token a été mis à jour le 23/05/2025
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsInN1YiI6IjY4MTliNDZlMDk5YTZlM2ZmOTQ0M2Q3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSMJHsVUQDlz_ZYtgcYSHBOJ2Y-qNQKTgXMt3RjL9Gg';
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
    if (!movieId) {
      console.log('getStreamingProviders: Aucun ID TMDB fourni');
      return null;
    }
    
    console.log(`getStreamingProviders: Récupération des données pour le film ${movieId}`);
    const response = await tmdbApi.get(`/movie/${movieId}/watch/providers`);
    
    console.log(`getStreamingProviders: Réponse reçue:`, response.data);
    
    // Vérifier si des informations sont disponibles pour la France
    if (response.data && response.data.results && response.data.results.FR) {
      console.log(`getStreamingProviders: Données pour la France trouvées:`, response.data.results.FR);
      
      // Vérifier si au moins un type de disponibilité est présent
      const frData = response.data.results.FR;
      const hasProviders = [
        frData.flatrate, frData.rent, frData.buy, frData.ads, frData.free
      ].some(arr => arr && arr.length > 0);
      
      if (!hasProviders) {
        console.log(`getStreamingProviders: Aucune plateforme disponible pour la France`);
        return null;
      }
      
      return {
        link: frData.link, // Lien vers JustWatch
        providers: {
          flatrate: frData.flatrate || [], // Abonnement/SVOD
          rent: frData.rent || [],         // Location
          buy: frData.buy || [],           // Achat
          ads: frData.ads || [],           // Gratuit avec publicité
          free: frData.free || []          // Gratuit sans publicité
        }
      };
    } else {
      console.log(`getStreamingProviders: Aucune donnée pour la France`);
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
