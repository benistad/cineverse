/**
 * Script de test pour récupérer les images depuis l'API TMDB
 */

const axios = require('axios');

// Token d'authentification TMDB (le même que celui utilisé dans l'application)
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsIm5iZiI6MS43NDY1MTUwNTQyODE5OTk4ZSs5LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mI9mPVyASt5bsbRwtVN5eUs6uyz28Tvy-FRJTT6vdg8';
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

// Fonction pour récupérer les images d'un film
async function getMovieImages(movieId) {
  try {
    console.log(`Récupération des images pour le film ${movieId}...`);
    
    // Récupérer les détails du film
    const movieResponse = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        language: 'fr-FR',
      },
    });
    
    console.log(`Titre du film: ${movieResponse.data.title}`);
    console.log(`Poster principal: ${movieResponse.data.poster_path}`);
    console.log(`Backdrop principal: ${movieResponse.data.backdrop_path}`);
    
    // Récupérer toutes les images disponibles
    const imagesResponse = await tmdbApi.get(`/movie/${movieId}/images`);
    
    if (imagesResponse.data) {
      const { backdrops, posters } = imagesResponse.data;
      
      console.log(`\nNombre total de backdrops: ${backdrops?.length || 0}`);
      if (backdrops && backdrops.length > 0) {
        console.log('\nExemples de backdrops:');
        backdrops.slice(0, 10).forEach((backdrop, index) => {
          console.log(`${index + 1}. ${backdrop.file_path} (${backdrop.width}x${backdrop.height})`);
        });
      }
      
      console.log(`\nNombre total de posters: ${posters?.length || 0}`);
      if (posters && posters.length > 0) {
        console.log('\nExemples de posters:');
        posters.slice(0, 10).forEach((poster, index) => {
          console.log(`${index + 1}. ${poster.file_path} (${poster.width}x${poster.height})`);
        });
      }
      
      return {
        title: movieResponse.data.title,
        poster_path: movieResponse.data.poster_path,
        backdrop_path: movieResponse.data.backdrop_path,
        backdrops: backdrops || [],
        posters: posters || [],
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des images du film ${movieId}:`, error.message);
    return null;
  }
}

// Fonction principale
async function main() {
  // Liste de films populaires à tester
  const movieIds = [
    550,    // Fight Club
    299534, // Avengers: Endgame
    299536, // Avengers: Infinity War
    24428,  // The Avengers
    157336, // Interstellar
    13,     // Forrest Gump
    27205,  // Inception
    11,     // Star Wars: Episode IV - A New Hope
    1891,   // Star Wars: Episode V - The Empire Strikes Back
    1892,   // Star Wars: Episode VI - Return of the Jedi
  ];
  
  for (const movieId of movieIds) {
    await getMovieImages(movieId);
    console.log('\n' + '-'.repeat(80) + '\n');
  }
}

// Exécuter la fonction principale
main().catch(error => {
  console.error('Erreur inattendue:', error);
});
