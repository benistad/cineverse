'use client';

import { useState, useEffect } from 'react';
import { getAllFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import FeaturedFilmsCarousel from '@/components/home/FeaturedFilmsCarousel';

export default function Home() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      try {
        const filmsData = await getAllFilms();
        setFilms(filmsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  return (
    <div className="space-y-8">
      <section className="mb-8">
        <FeaturedFilmsCarousel />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Films récemment notés</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : films.length > 0 ? (
          <FilmGrid films={films} />
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">Aucun film noté pour le moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
