'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FilmEditor from '@/components/films/FilmEditor';
import axios from 'axios';

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
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
        
        // Utiliser directement le token TMDB pour éviter les problèmes avec les variables d'environnement
        const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsInN1YiI6IjY4MTliNDZlMDk5YTZlM2ZmOTQ0M2Q3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSMJHsVUQDlz_ZYtgcYSHBOJ2Y-qNQKTgXMt3RjL9Gg';
        
        console.log(`Tentative de récupération des détails du film ${movieId}...`);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=fr-FR&append_to_response=credits,videos`,
          {
            headers: {
              Authorization: `Bearer ${tmdbToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`Détails du film ${movieId} récupérés avec succès`);
        setMovie(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        setError(error);
        // Rediriger vers la page de recherche au lieu de not-found
        router.push('/admin/search');
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
        <p>Erreur lors du chargement du film</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FilmEditor movieDetails={movie} />
    </div>
  );
}
