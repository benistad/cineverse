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
        
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR&append_to_response=credits,videos`
        );
        
        setMovie(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        setError(error);
        router.push('/not-found');
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
