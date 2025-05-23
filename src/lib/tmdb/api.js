'use client';

import axios from 'axios';

// Configuration de l'API TMDB
// Utilisation du token d'authentification pour les requêtes
// Note: Ce token a été mis à jour le 23/05/2025
// Utiliser directement le token de secours pour éviter les problèmes avec les variables d'environnement
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsInN1YiI6IjY4MTliNDZlMDk5YTZlM2ZmOTQ0M2Q3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSMJHsVUQDlz_ZYtgcYSHBOJ2Y-qNQKTgXMt3RjL9Gg';
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
    // Utiliser notre proxy API TMDB côté serveur pour éviter les problèmes d'authentification
    const response = await axios.get('/api/tmdb/search/movie', {
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
  console.log(`Début de getMovieDetails pour le film ${movieId}`);
  try {
    // Récupérer les détails du film
    console.log(`Appel au proxy API TMDB pour le film ${movieId}`);
    // Utiliser notre proxy API TMDB côté serveur pour éviter les problèmes d'authentification
    const response = await axios.get(`/api/tmdb/movie/${movieId}`, {
      params: {
        language: 'fr-FR',
        append_to_response: 'credits,videos',
      },
    });
    
    console.log(`Réponse reçue pour le film ${movieId}`);
    
    // Récupérer toutes les images disponibles sans aucun filtre de langue
    console.log(`Récupération de toutes les images disponibles pour le film ${movieId}`);
    try {
      // Utiliser notre proxy API TMDB côté serveur pour éviter les problèmes d'authentification
      const imagesResponse = await axios.get(`/api/tmdb/movie/${movieId}/images`);
      
      if (imagesResponse.data) {
        console.log(`Nombre total de backdrops: ${imagesResponse.data.backdrops?.length || 0}`);
        console.log(`Nombre total de posters: ${imagesResponse.data.posters?.length || 0}`);
        
        // Afficher les 5 premiers backdrops pour débogage
        if (imagesResponse.data.backdrops && imagesResponse.data.backdrops.length > 0) {
          console.log('Exemples de backdrops:');
          imagesResponse.data.backdrops.slice(0, 5).forEach((backdrop, index) => {
            console.log(`Backdrop ${index + 1}:`, backdrop.file_path);
          });
        }
        
        // Afficher les 5 premiers posters pour débogage
        if (imagesResponse.data.posters && imagesResponse.data.posters.length > 0) {
          console.log('Exemples de posters:');
          imagesResponse.data.posters.slice(0, 5).forEach((poster, index) => {
            console.log(`Poster ${index + 1}:`, poster.file_path);
          });
        }
        
        response.data.images = imagesResponse.data;
      }
    } catch (imageError) {
      console.error(`Erreur lors de la récupération des images du film ${movieId}:`, imageError);
      // Créer un objet images vide si l'appel échoue
      response.data.images = { backdrops: [], posters: [] };
    }
    
    // Ajouter manuellement les images principales si elles ne sont pas dans la collection d'images
    if (response.data.images) {
      if (response.data.poster_path && response.data.images.posters) {
        const posterExists = response.data.images.posters.some(p => p.file_path === response.data.poster_path);
        if (!posterExists) {
          console.log(`Ajout manuel du poster principal aux images`);
          response.data.images.posters.unshift({
            file_path: response.data.poster_path,
            width: 500,
            height: 750
          });
        }
      }
      
      if (response.data.backdrop_path && response.data.images.backdrops) {
        const backdropExists = response.data.images.backdrops.some(b => b.file_path === response.data.backdrop_path);
        if (!backdropExists) {
          console.log(`Ajout manuel du backdrop principal aux images`);
          response.data.images.backdrops.unshift({
            file_path: response.data.backdrop_path,
            width: 1280,
            height: 720
          });
        }
      }
    } else {
      // Créer un objet images si aucun n'existe
      response.data.images = {
        backdrops: [],
        posters: []
      };
      
      if (response.data.poster_path) {
        console.log(`Création d'un objet images avec le poster principal`);
        response.data.images.posters.push({
          file_path: response.data.poster_path,
          width: 500,
          height: 750
        });
      }
      
      if (response.data.backdrop_path) {
        console.log(`Ajout du backdrop principal à l'objet images créé`);
        response.data.images.backdrops.push({
          file_path: response.data.backdrop_path,
          width: 1280,
          height: 720
        });
      }
    }
    
    console.log(`Fin de getMovieDetails pour le film ${movieId}, retour des données`);
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
 * Utilise les images TMDB quand c'est possible, avec des placeholders en cas d'erreur
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) {
    // Retourner une image placeholder locale si aucun chemin n'est fourni
    return '/images/placeholder.jpg';
  }
  
  // Pour toutes les parties du site, essayer d'utiliser l'API TMDB
  try {
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  } catch (error) {
    console.error('Erreur lors de la construction de l\'URL d\'image:', error);
    return '/images/placeholder.jpg';
  }
};

/**
 * Récupération de la bande-annonce d'un film
 * Recherche exhaustive pour garantir qu'une bande-annonce soit trouvée si elle existe
 * Gère également les cas où les vidéos sont privées ou indisponibles
 */
export const getTrailerKey = (videos) => {
  if (!videos || !videos.results || videos.results.length === 0) {
    return null;
  }
  
  // Filtrer pour ne garder que les vidéos YouTube (les plus fiables)
  const youtubeVideos = videos.results.filter(video => video.site === 'YouTube');
  
  if (youtubeVideos.length === 0) {
    return null;
  }
  
  // Liste des clés YouTube connues pour être privées ou indisponibles
  // Cette liste peut être mise à jour au fur et à mesure
  const knownUnavailableKeys = [
    'dZw7LR0vNww', // Clé privée pour 1BR
  ];
  
  // Filtrer les vidéos connues pour être indisponibles
  const availableVideos = youtubeVideos.filter(video => !knownUnavailableKeys.includes(video.key));
  
  // Si toutes les vidéos sont connues pour être indisponibles, on utilise quand même les originales
  // pour ne pas bloquer complètement la fonction
  const videosToCheck = availableVideos.length > 0 ? availableVideos : youtubeVideos;
  
  // Stratégie de recherche par priorité
  
  // 1. Bande-annonce officielle
  let trailer = videosToCheck.find(
    video => video.type === 'Trailer' && video.official === true
  );
  
  // 2. N'importe quelle bande-annonce
  if (!trailer) {
    trailer = videosToCheck.find(video => video.type === 'Trailer');
  }
  
  // 3. Teaser officiel
  if (!trailer) {
    trailer = videosToCheck.find(
      video => video.type === 'Teaser' && video.official === true
    );
  }
  
  // 4. N'importe quel teaser
  if (!trailer) {
    trailer = videosToCheck.find(video => video.type === 'Teaser');
  }
  
  // 5. Clip officiel
  if (!trailer) {
    trailer = videosToCheck.find(
      video => video.type === 'Clip' && video.official === true
    );
  }
  
  // 6. N'importe quelle vidéo officielle
  if (!trailer) {
    trailer = videosToCheck.find(video => video.official === true);
  }
  
  // 7. N'importe quelle vidéo YouTube
  if (!trailer) {
    trailer = videosToCheck[0]; // Prendre la première vidéo disponible
  }
  
  // Si on n'a toujours pas trouvé de bande-annonce disponible, on essaie avec les vidéos originales
  // (uniquement si on a filtré des vidéos indisponibles)
  if (!trailer && availableVideos.length < youtubeVideos.length) {
    console.log('Aucune bande-annonce disponible trouvée, essai avec les vidéos potentiellement indisponibles');
    return getTrailerKey({ results: youtubeVideos });
  }
  
  return trailer ? trailer.key : null;
};
