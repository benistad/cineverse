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
 * @param {number} movieId - ID TMDB du film
 * @returns {Promise<string|null>} - Clé YouTube de la bande-annonce ou null si non trouvée
 */
export const getMovieTrailers = async (movieId) => {
  try {
    // Stratégie de recherche par ordre de préférence linguistique
    const languagePreferences = [
      'fr-FR',  // Français (prioritaire)
      'en-US',  // Anglais
      null      // Toutes les langues (paramètre null pour obtenir toutes les vidéos sans filtre de langue)
    ];
    
    let trailerKey = null;
    
    // Essayer chaque langue dans l'ordre de préférence
    for (const language of languagePreferences) {
      if (trailerKey) break; // Arrêter si une bande-annonce a été trouvée
      
      const params = language ? { language } : {};
      
      const response = await tmdbApi.get(`/movie/${movieId}/videos`, { params });
      
      // Utiliser la fonction améliorée pour trouver la meilleure bande-annonce
      trailerKey = getTrailerKey(response.data);
      
      if (trailerKey) {
        console.log(`Bande-annonce trouvée pour le film ${movieId} en ${language || 'toutes langues'}`);
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
    console.log(`Recherche d'une bande-annonce pour: ${title} (${year})`);
    
    // Étape 1: Trouver l'ID TMDB du film
    const movieId = await findMovieByTitleAndYear(title, year);
    
    if (!movieId) {
      console.log(`Aucun film trouvé sur TMDB pour: ${title} (${year})`);
      return null;
    }
    
    // Étape 2: Récupérer les bandes-annonces du film
    const trailerKey = await getMovieTrailers(movieId);
    
    if (trailerKey) {
      console.log(`Bande-annonce trouvée pour: ${title} (${year}) - Clé YouTube: ${trailerKey}`);
    } else {
      console.log(`Aucune bande-annonce trouvée pour: ${title} (${year})`);
    }
    
    return trailerKey;
  } catch (error) {
    console.error('Erreur lors de la recherche de bande-annonce:', error);
    return null;
  }
};
