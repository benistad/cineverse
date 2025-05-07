'use client';

import axios from 'axios';

// Configuration de l'API TMDB
// Utilisation du token d'authentification pour les requêtes
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsIm5iZiI6MS43NDY1MTUwNTQyODE5OTk4ZSs5LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mI9mPVyASt5bsbRwtVN5eUs6uyz28Tvy-FRJTT6vdg8';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Client Axios pour TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Recherche de films par titre
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        language: 'fr-FR',
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de films:', error);
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
};

/**
 * Récupération des détails d'un film par son ID
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        language: 'fr-FR',
        append_to_response: 'credits,videos',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du film ${movieId}:`, error);
    return null;
  }
};

/**
 * Récupération des films populaires
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: {
        language: 'fr-FR',
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films populaires:', error);
    return [];
  }
};

/**
 * Construction de l'URL d'une image
 * Retourne null si le chemin est null, ce qui permettra à SafeImage de gérer le fallback
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) {
    // Retourne null au lieu d'une URL de placeholder
    // SafeImage se chargera d'afficher un fallback
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Récupération de la bande-annonce d'un film
 */
export const getTrailerKey = (videos) => {
  if (!videos || !videos.results || videos.results.length === 0) {
    return null;
  }

  // Recherche d'abord une bande-annonce officielle en français
  let trailer = videos.results.find(
    (video) => 
      video.site === 'YouTube' && 
      video.type === 'Trailer' && 
      video.official === true
  );

  // Si pas de trailer, cherche une autre vidéo officielle
  if (!trailer) {
    trailer = videos.results.find(
      (video) => 
        video.site === 'YouTube' && 
        video.official === true
    );
  }

  // Si toujours rien, prend n'importe quelle vidéo YouTube
  if (!trailer) {
    trailer = videos.results.find((video) => video.site === 'YouTube');
  }

  return trailer ? trailer.key : null;
};
