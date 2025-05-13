'use client';

import { useState, useEffect, useRef } from 'react';
import { getFeaturedFilms } from '@/lib/supabase/films';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

// Importer les styles Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function SwiperCarousel() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);

  // Fonction pour obtenir l'URL d'image optimale pour un film
  const getOptimalImageUrl = (film) => {
    if (!film) return null;
    
    // Priorité: carousel_image_url > backdrop_url > poster_url
    if (film.carousel_image_url) {
      return film.carousel_image_url;
    } else if (film.backdrop_url) {
      return film.backdrop_url;
    } else if (film.poster_url) {
      return film.poster_url;
    }
    
    return null;
  };

  // Précharger les images pour éviter le clignotement
  const preloadImages = (filmsToPreload) => {
    if (!filmsToPreload || filmsToPreload.length === 0) return;
    
    filmsToPreload.forEach(film => {
      const imageUrl = getOptimalImageUrl(film);
      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
      }
    });
  };

  // Charger les films
  useEffect(() => {
    const loadFilms = async () => {
      try {
        console.log('Chargement des films pour le carrousel...');
        setLoading(true);
        
        const topFilms = await getFeaturedFilms(5, 6);
        console.log('Films chargés:', topFilms);
        
        if (topFilms && topFilms.length > 0) {
          // Précharger les images avant de mettre à jour l'état
          preloadImages(topFilms);
          
          // Mettre à jour l'état après un court délai pour laisser le temps aux images de se précharger
          setTimeout(() => {
            setFilms(topFilms);
            setLoading(false);
          }, 300);
        } else {
          console.warn('Aucun film n\'a été récupéré pour le carrousel');
          setFilms([]);
          setLoading(false);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des films:', err);
        setError(err.message || 'Erreur lors du chargement des films');
        setLoading(false);
      }
    };

    loadFilms();
    
    // Recharger les films toutes les 5 minutes (moins fréquent pour éviter les problèmes)
    const interval = setInterval(() => {
      loadFilms();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Fonction pour forcer le rechargement des données
  const forceReload = async () => {
    try {
      console.log('Rechargement forcé des films...');
      
      const timestamp = new Date().getTime();
      const topFilms = await getFeaturedFilms(5, 6, timestamp);
      
      if (topFilms && topFilms.length > 0) {
        // Précharger les images avant de mettre à jour l'état
        preloadImages(topFilms);
        
        // Mettre à jour l'état
        setFilms(topFilms);
      } else {
        console.warn('Aucun film n\'a été récupéré lors du rechargement');
      }
    } catch (err) {
      console.error('Erreur lors du rechargement des films:', err);
      setError(err.message || 'Erreur lors du rechargement des films');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center h-[250px] sm:h-[300px] md:h-[500px] flex items-center justify-center">
        <div className="text-white">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Chargement des films en vedette...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-6 rounded-lg">
        <p className="text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  if (films.length === 0) {
    return (
      <div className="bg-gray-800 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Bienvenue sur MovieHunt</h2>
        <p>
          Découvrez notre sélection de films et partagez vos impressions.
        </p>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <button 
        onClick={forceReload}
        className="mb-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
      >
        Actualiser
      </button>
      
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade" // Utiliser un effet de fondu pour éviter le clignotement
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg overflow-hidden"
      >
        {films.map((film) => (
          <SwiperSlide key={film.id}>
            <div className="relative h-[250px] sm:h-[300px] md:h-[500px] bg-gray-800">
              {/* Image d'arrière-plan */}
              <div 
                className="absolute inset-0 bg-center bg-cover"
                style={{
                  backgroundImage: `url(${getOptimalImageUrl(film)})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
              
              {/* Overlay pour améliorer la lisibilité du texte */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Informations de débogage */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 text-white text-xs p-1 overflow-hidden">
                <div>Film ID: {film.id}</div>
                <div className="truncate">Image: {getOptimalImageUrl(film) || 'non définie'}</div>
              </div>
              
              {/* Contenu du film */}
              <Link href={`/films/${film.slug || film.id}`}>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{film.title}</h2>
                  <div className="flex items-center flex-wrap">
                    <span className="text-base sm:text-lg md:text-xl font-semibold">{film.note_sur_10}/10</span>
                    {film.genres && <span className="ml-3 text-sm sm:text-base opacity-90">• {film.genres.split(',')[0]}</span>}
                    {film.release_date && <span className="ml-2 text-sm sm:text-base opacity-90">• {new Date(film.release_date).getFullYear()}</span>}
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Informations de débogage */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold">Films chargés:</h3>
        <ul className="mt-2 text-sm">
          {films.map((film, index) => (
            <li key={film.id} className="mb-1">
              {index + 1}. {film.title} (ID: {film.id})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
