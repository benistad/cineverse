'use client';

/**
 * Script pour mettre à jour tous les films existants avec les données manquantes (date de sortie, genres)
 * Ce script doit être exécuté manuellement depuis la console du navigateur
 * sur la page d'administration après s'être connecté.
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration TMDB
// Note: Ce token a été mis à jour le 23/05/2025
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsInN1YiI6IjY4MTliNDZlMDk5YTZlM2ZmOTQ0M2Q3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSMJHsVUQDlz_ZYtgcYSHBOJ2Y-qNQKTgXMt3RjL9Gg';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Récupère les détails d'un film depuis TMDB
 */
async function getMovieDetailsFromTMDB(tmdbId) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?language=fr-FR`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur TMDB: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du film ${tmdbId}:`, error);
    return null;
  }
}

/**
 * Met à jour un film dans la base de données
 */
async function updateFilm(filmId, updateData) {
  try {
    const { error } = await supabase
      .from('films')
      .update(updateData)
      .eq('id', filmId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du film ${filmId}:`, error);
    return false;
  }
}

/**
 * Met à jour tous les films existants avec les données manquantes
 */
export async function updateAllFilms() {
  try {
    // Récupérer tous les films
    const { data: films, error } = await supabase
      .from('films')
      .select('id, tmdb_id');
      
    if (error) throw error;
    
    console.log(`Mise à jour de ${films.length} films...`);
    
    // Mettre à jour chaque film
    let successCount = 0;
    let errorCount = 0;
    
    for (const film of films) {
      try {
        // Récupérer les détails du film depuis TMDB
        const movieDetails = await getMovieDetailsFromTMDB(film.tmdb_id);
        
        if (!movieDetails) {
          console.warn(`Impossible de récupérer les détails pour le film ${film.id} (TMDB ID: ${film.tmdb_id})`);
          errorCount++;
          continue;
        }
        
        // Préparer les données à mettre à jour
        const updateData = {
          release_date: movieDetails.release_date || null,
          genres: movieDetails.genres ? movieDetails.genres.map(genre => genre.name).join(', ') : null,
        };
        
        // Mettre à jour le film
        const success = await updateFilm(film.id, updateData);
        
        if (success) {
          successCount++;
          console.log(`Film ${film.id} mis à jour avec succès`);
        } else {
          errorCount++;
        }
        
        // Pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du film ${film.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Mise à jour terminée: ${successCount} films mis à jour, ${errorCount} erreurs`);
    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des films:', error);
    return { success: 0, errors: -1 };
  }
}

// Fonction à exécuter dans la console du navigateur
window.updateMovieHuntFilms = async () => {
  console.log('Démarrage de la mise à jour des films...');
  const result = await updateAllFilms();
  console.log('Résultat:', result);
};


