'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FilmEditor from '@/components/films/FilmEditor';
import axios from 'axios';
// Import direct des fonctions TMDB pour éviter les problèmes d'authentification
import { getMovieDetails } from '@/lib/tmdb/api';

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
        
        console.log(`Tentative de récupération des détails du film ${movieId}...`);
        
        // Utiliser notre fonction getMovieDetails au lieu d'un appel direct à l'API TMDB
        // Cette fonction gère déjà l'authentification et les erreurs
        const movieData = await getMovieDetails(movieId);
        
        if (movieData) {
          console.log(`Détails du film ${movieId} récupérés avec succès`);
          setMovie(movieData);
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
