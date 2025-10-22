'use client';

import axios from 'axios';

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
 * Récupère les plateformes de streaming où un film est disponible
 * @param {number} movieId - ID TMDB du film
 * @param {string} country - Code pays (FR, US, GB, etc.) - par défaut FR
 * @returns {Promise<Object|null>} - Informations sur les plateformes de streaming ou null si aucune
 */
export const getStreamingProviders = async (movieId, country = 'FR') => {
  try {
    if (!movieId) {
      console.log('getStreamingProviders: Aucun ID TMDB fourni');
      return null;
    }
    
    const countryCode = country.toUpperCase();
    console.log(`getStreamingProviders: Récupération des données pour le film ${movieId} (${countryCode})`);
    const response = await tmdbApi.get(`/movie/${movieId}/watch/providers`);
    
    console.log(`getStreamingProviders: Réponse reçue:`, response.data);
    
    // Vérifier si des informations sont disponibles pour le pays
    if (response.data && response.data.results && response.data.results[countryCode]) {
      console.log(`getStreamingProviders: Données pour ${countryCode} trouvées:`, response.data.results[countryCode]);
      
      // Vérifier si au moins un type de disponibilité est présent
      const countryData = response.data.results[countryCode];
      const hasProviders = [
        countryData.flatrate, countryData.rent, countryData.buy, countryData.ads, countryData.free
      ].some(arr => arr && arr.length > 0);
      
      if (!hasProviders) {
        console.log(`getStreamingProviders: Aucune plateforme disponible pour ${countryCode}`);
        return null;
      }
      
      return {
        link: countryData.link, // Lien vers JustWatch
        providers: {
          flatrate: countryData.flatrate || [], // Abonnement/SVOD
          rent: countryData.rent || [],         // Location
          buy: countryData.buy || [],           // Achat
          ads: countryData.ads || [],           // Gratuit avec publicité
          free: countryData.free || []          // Gratuit sans publicité
        }
      };
    } else {
      console.log(`getStreamingProviders: Aucune donnée pour ${countryCode}`);
    }
    
    return null; // Aucune information disponible pour le pays
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
