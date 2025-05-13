'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { getFeaturedFilms } from '@/lib/supabase/films';

// Assurez-vous d'importer les styles CSS nécessaires pour react-slick
// Ces imports doivent être faits dans un fichier layout.js ou similaire
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

export default function SimplifiedFeaturedCarousel() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFilms() {
      try {
        console.log('Chargement des films pour le carrousel simplifié...');
        setLoading(true);
        const topFilms = await getFeaturedFilms(5, 6);
        console.log('Films chargés:', topFilms);
        setFilms(topFilms);
      } catch (err) {
        console.error('Erreur lors du chargement des films:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFilms();
  }, []);

  if (loading) {
    return <div className="bg-gray-100 p-6 rounded-lg">Chargement des films...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-6 rounded-lg">Erreur: {error}</div>;
  }

  if (films.length === 0) {
    return <div className="bg-yellow-100 p-6 rounded-lg">Aucun film trouvé</div>;
  }

  // Configuration simple du carrousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Films en vedette (Simplifié)</h2>
      
      <div className="carousel-container">
        <Slider {...settings}>
          {films.map(film => (
            <div key={film.id} className="p-2">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-bold">{film.title}</h3>
                <p>Note: {film.note_sur_10}/10</p>
                <p>ID: {film.id}</p>
                <p>Image du carrousel: {film.carousel_image_url ? 'Oui' : 'Non'}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold">Données brutes:</h3>
        <pre className="text-xs mt-2 overflow-auto max-h-40">
          {JSON.stringify(films, null, 2)}
        </pre>
      </div>
    </div>
  );
}
