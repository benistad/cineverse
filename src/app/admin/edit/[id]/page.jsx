'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FilmEditor from '@/components/films/FilmEditor';
import axios from 'axios';
// Import direct des fonctions TMDB et de la configuration pour éviter les problèmes d'authentification
import { getMovieDetails } from '@/lib/tmdb/api';
import { useAuth } from '@/contexts/AuthContext';

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const { supabase } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const movieId = parseInt(params.id, 10);
        
        if (isNaN(movieId)) {
          router.push('/not-found');
          return;
        }
        
        console.log(`Tentative de récupération des détails du film ${movieId}...`);
        
        // Appel direct à l'API TMDB avec le token d'authentification
        // Utiliser directement le token d'accès TMDB pour éviter les problèmes avec les variables d'environnement
        const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsInN1YiI6IjY4MTliNDZlMDk5YTZlM2ZmOTQ0M2Q3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSMJHsVUQDlz_ZYtgcYSHBOJ2Y-qNQKTgXMt3RjL9Gg';
        console.log('Token TMDB utilisé:', TMDB_API_TOKEN ? 'Token valide' : 'Token manquant');
        
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: {
            language: 'fr-FR',
            append_to_response: 'credits,videos,images',
          },
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.data) {
          console.log(`Détails du film ${movieId} récupérés avec succès`);
          setMovie(response.data);
        } else {
          throw new Error(`Impossible de récupérer les détails du film ${movieId}`);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        setError(error);
        // Afficher l'erreur mais ne pas rediriger
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur lors du chargement du film</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error?.message || 'Impossible de récupérer les détails du film. Veuillez réessayer.'}</p>
                <p className="mt-2">Code d'erreur: {error?.response?.status || 'Inconnu'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={() => router.push('/admin/search')} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour à la recherche
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FilmEditor movieDetails={movie} />
    </div>
  );
}
