/**
 * API TMDB avec mise en cache côté serveur
 * Optimise les performances en réduisant les appels API redondants
 */

import { fetchWithCache } from '../utils/serverCache';

// Configuration de base de l'API TMDB
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
// Note: Ce token a été mis à jour le 23/05/2025
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsInN1YiI6IjY4MTliNDZlMDk5YTZlM2ZmOTQ0M2Q3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSMJHsVUQDlz_ZYtgcYSHBOJ2Y-qNQKTgXMt3RjL9Gg';

// Durées de cache par type de requête (en millisecondes)
const CACHE_TTL = {
  MOVIE_DETAILS: 24 * 60 * 60 * 1000, // 24 heures pour les détails de films
  MOVIE_CREDITS: 24 * 60 * 60 * 1000, // 24 heures pour les crédits
  MOVIE_IMAGES: 7 * 24 * 60 * 60 * 1000, // 7 jours pour les images
  MOVIE_VIDEOS: 7 * 24 * 60 * 60 * 1000, // 7 jours pour les vidéos
  MOVIE_RECOMMENDATIONS: 12 * 60 * 60 * 1000, // 12 heures pour les recommandations
  MOVIE_SIMILAR: 12 * 60 * 60 * 1000, // 12 heures pour les films similaires
  MOVIE_WATCH_PROVIDERS: 12 * 60 * 60 * 1000, // 12 heures pour les fournisseurs de streaming
  SEARCH: 6 * 60 * 60 * 1000, // 6 heures pour les résultats de recherche
  TRENDING: 3 * 60 * 60 * 1000, // 3 heures pour les tendances
  GENRE_LIST: 30 * 24 * 60 * 60 * 1000, // 30 jours pour la liste des genres
  DEFAULT: 6 * 60 * 60 * 1000, // 6 heures par défaut
};

/**
 * Options par défaut pour les requêtes fetch
 */
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TMDB_API_TOKEN}`,
  },
};

/**
 * Effectue une requête à l'API TMDB avec mise en cache
 * @param {string} endpoint - Point de terminaison de l'API
 * @param {Object} params - Paramètres de requête
 * @param {number} cacheTTL - Durée de vie du cache en millisecondes
 * @param {boolean} bypassCache - Ignorer le cache et forcer une nouvelle requête
 * @returns {Promise<Object>} - Données de réponse
 */
export async function fetchTmdbWithCache(endpoint, params = {}, cacheTTL = CACHE_TTL.DEFAULT, bypassCache = false) {
  // Construire l'URL complète
  const queryParams = new URLSearchParams({
    ...params,
    language: params.language || 'fr-FR',
  }).toString();
  
  const url = `${TMDB_API_BASE_URL}${endpoint}?${queryParams}`;
  
  // Options de cache
  const cacheOptions = {
    ttl: cacheTTL,
    staleWhileRevalidate: cacheTTL * 2, // Double de la durée de vie pour stale-while-revalidate
    bypassCache,
    params, // Inclure les paramètres dans la clé de cache
  };
  
  // Effectuer la requête avec mise en cache
  return fetchWithCache(url, defaultOptions, cacheOptions);
}

/**
 * Récupère les détails d'un film par son ID TMDB
 * @param {number} movieId - ID TMDB du film
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Détails du film
 */
export async function getMovieDetails(movieId, params = {}) {
  return fetchTmdbWithCache(`/movie/${movieId}`, params, CACHE_TTL.MOVIE_DETAILS);
}

/**
 * Récupère les crédits d'un film (acteurs, équipe)
 * @param {number} movieId - ID TMDB du film
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Crédits du film
 */
export async function getMovieCredits(movieId, params = {}) {
  return fetchTmdbWithCache(`/movie/${movieId}/credits`, params, CACHE_TTL.MOVIE_CREDITS);
}

/**
 * Récupère les images d'un film
 * @param {number} movieId - ID TMDB du film
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Images du film
 */
export async function getMovieImages(movieId, params = {}) {
  return fetchTmdbWithCache(`/movie/${movieId}/images`, params, CACHE_TTL.MOVIE_IMAGES);
}

/**
 * Récupère les vidéos d'un film (bandes-annonces, etc.)
 * @param {number} movieId - ID TMDB du film
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Vidéos du film
 */
export async function getMovieVideos(movieId, params = {}) {
  return fetchTmdbWithCache(`/movie/${movieId}/videos`, params, CACHE_TTL.MOVIE_VIDEOS);
}

/**
 * Récupère les recommandations de films similaires
 * @param {number} movieId - ID TMDB du film
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Films recommandés
 */
export async function getMovieRecommendations(movieId, params = {}) {
  return fetchTmdbWithCache(`/movie/${movieId}/recommendations`, params, CACHE_TTL.MOVIE_RECOMMENDATIONS);
}

/**
 * Récupère les films similaires
 * @param {number} movieId - ID TMDB du film
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Films similaires
 */
export async function getSimilarMovies(movieId, params = {}) {
  return fetchTmdbWithCache(`/movie/${movieId}/similar`, params, CACHE_TTL.MOVIE_SIMILAR);
}

/**
 * Récupère les fournisseurs de streaming pour un film
 * @param {number} movieId - ID TMDB du film
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Fournisseurs de streaming
 */
export async function getMovieWatchProviders(movieId, params = {}) {
  return fetchTmdbWithCache(`/movie/${movieId}/watch/providers`, params, CACHE_TTL.MOVIE_WATCH_PROVIDERS);
}

/**
 * Recherche des films par titre
 * @param {string} query - Terme de recherche
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Résultats de recherche
 */
export async function searchMovies(query, params = {}) {
  return fetchTmdbWithCache('/search/movie', { ...params, query }, CACHE_TTL.SEARCH);
}

/**
 * Récupère les films tendance
 * @param {string} timeWindow - Fenêtre temporelle ('day' ou 'week')
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Films tendance
 */
export async function getTrendingMovies(timeWindow = 'week', params = {}) {
  return fetchTmdbWithCache(`/trending/movie/${timeWindow}`, params, CACHE_TTL.TRENDING);
}

/**
 * Récupère la liste des genres de films
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise<Object>} - Liste des genres
 */
export async function getGenres(params = {}) {
  return fetchTmdbWithCache('/genre/movie/list', params, CACHE_TTL.GENRE_LIST);
}

/**
 * Découvre des films selon des critères
 * @param {Object} params - Paramètres de découverte
 * @returns {Promise<Object>} - Films découverts
 */
export async function discoverMovies(params = {}) {
  return fetchTmdbWithCache('/discover/movie', params, CACHE_TTL.DEFAULT);
}
