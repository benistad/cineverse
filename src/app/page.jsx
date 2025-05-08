'use client';

import { useState, useEffect } from 'react';
import { getRecentlyRatedFilms, getTopRatedFilms } from '@/lib/supabase/films';
import FilmCarousel from '@/components/films/FilmCarousel';
import FeaturedFilmsCarousel from '@/components/home/FeaturedFilmsCarousel';

export default function Home() {
  const [recentFilms, setRecentFilms] = useState([]);
  const [topRatedFilms, setTopRatedFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      try {
        // Récupérer les films récemment notés
        const recentFilmsData = await getRecentlyRatedFilms(8);
        setRecentFilms(recentFilmsData);
        
        // Récupérer les films les mieux notés
        const topRatedFilmsData = await getTopRatedFilms(8);
        setTopRatedFilms(topRatedFilmsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  return (
    <div className="space-y-12">
      {/* Carrousel des films à la une */}
      <section>
        <FeaturedFilmsCarousel />
      </section>

      {/* Films récemment notés */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <FilmCarousel 
            films={recentFilms} 
            title="Films récemment notés" 
            visibleCount={4} 
          />
        )}
      </section>

      {/* Films les mieux notés */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <FilmCarousel 
            films={topRatedFilms} 
            title="Films les mieux notés" 
            visibleCount={4} 
          />
        )}
      </section>
    </div>
  );
}
