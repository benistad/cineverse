'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function UpdateFilmsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Vérifier si l'utilisateur est connecté
  React.useEffect(() => {
    if (!user) {
      router.push('/admin');
    }
  }, [user, router]);

  // Configuration Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Configuration TMDB
  const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsIm5iZiI6MS43NDY1MTUwNTQyODE5OTk4ZSs5LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mI9mPVyASt5bsbRwtVN5eUs6uyz28Tvy-FRJTT6vdg8';
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
  async function updateAllFilms() {
    setIsUpdating(true);
    setError(null);
    setResults(null);
    
    try {
      // Récupérer tous les films
      const { data: films, error } = await supabase
        .from('films')
        .select('id, tmdb_id');
        
      if (error) throw error;
      
      setProgress({ current: 0, total: films.length });
      
      // Mettre à jour chaque film
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < films.length; i++) {
        const film = films[i];
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
          } else {
            errorCount++;
          }
          
          // Mettre à jour la progression
          setProgress({ current: i + 1, total: films.length });
          
          // Pause pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Erreur lors de la mise à jour du film ${film.id}:`, error);
          errorCount++;
        }
      }
      
      setResults({ success: successCount, errors: errorCount });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des films:', error);
      setError('Une erreur est survenue lors de la mise à jour des films. Veuillez réessayer.');
    } finally {
      setIsUpdating(false);
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mise à jour des films</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="mb-4">
          Cette page vous permet de mettre à jour tous les films existants avec leurs dates de sortie et genres.
          Cette opération peut prendre plusieurs minutes en fonction du nombre de films dans la base de données.
        </p>
        
        <button
          onClick={updateAllFilms}
          disabled={isUpdating}
          className={`px-4 py-2 rounded-md ${
            isUpdating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isUpdating ? 'Mise à jour en cours...' : 'Mettre à jour tous les films'}
        </button>
        
        {isUpdating && (
          <div className="mt-4">
            <p>Progression: {progress.current} / {progress.total} films</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {results && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            <p>Mise à jour terminée!</p>
            <p>Films mis à jour avec succès: {results.success}</p>
            <p>Erreurs: {results.errors}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}
