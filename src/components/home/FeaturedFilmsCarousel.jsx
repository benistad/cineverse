'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getFeaturedFilms } from '@/lib/supabase/films';
import RatingIcon from '@/components/ui/RatingIcon';
import { optimizeBackdropImage, optimizePosterImage } from '@/lib/utils/imageOptimizer';

// Import Swiper et ses modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Import des styles Swiper (seulement ceux nécessaires)
import 'swiper/css';
import 'swiper/css/effect-fade';


export default function FeaturedFilmsCarousel() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);
  const imagesPreloaded = useRef(false);

  // Fonction pour obtenir l'URL d'image optimale pour un film
  const getOptimalImageUrl = (film) => {
    if (!film) return null;
    
    // Priorité: carousel_image_url > backdrop_url > poster_url > backdrop_path > poster_path
    if (film.carousel_image_url) {
      // Vérifier si c'est déjà une URL complète
      if (film.carousel_image_url.startsWith('http')) {
        return film.carousel_image_url;
      } else if (film.carousel_image_url.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w1280${film.carousel_image_url}`;
      }
    }
    
    if (film.backdrop_url) {
      // Vérifier si c'est déjà une URL complète
      if (film.backdrop_url.startsWith('http')) {
        return film.backdrop_url;
      } else if (film.backdrop_url.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w1280${film.backdrop_url}`;
      }
    }
    
    if (film.backdrop_path) {
      // Vérifier si c'est déjà une URL complète
      if (film.backdrop_path.startsWith('http')) {
        return film.backdrop_path;
      } else if (film.backdrop_path.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w1280${film.backdrop_path}`;
      }
    }
    
    if (film.poster_url) {
      // Vérifier si c'est déjà une URL complète
      if (film.poster_url.startsWith('http')) {
        return film.poster_url;
      } else if (film.poster_url.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w500${film.poster_url}`;
      }
    }
    
    if (film.poster_path) {
      // Vérifier si c'est déjà une URL complète
      if (film.poster_path.startsWith('http')) {
        return film.poster_path;
      } else if (film.poster_path.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w500${film.poster_path}`;
      }
    }
    
    return '/images/placeholder.jpg';
  };

  // Précharger les images pour éviter le clignotement
  const preloadImages = (filmsToPreload) => {
    if (!filmsToPreload || filmsToPreload.length === 0 || imagesPreloaded.current) return;
    
    console.log('Préchargement des images du carrousel...');
    const preloadPromises = filmsToPreload.map(film => {
      return new Promise((resolve) => {
        const imageUrl = getOptimalImageUrl(film);
        if (imageUrl) {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Résoudre même en cas d'erreur
          img.src = imageUrl;
        } else {
          resolve(); // Résoudre si pas d'URL
        }
      });
    });
    
    Promise.all(preloadPromises).then(() => {
      console.log('Préchargement des images terminé');
      imagesPreloaded.current = true;
    });
  };

  // Fonction pour charger les films en vedette
  const loadTopRatedFilms = async () => {
    try {
      // Ajouter un timestamp pour éviter la mise en cache
      const timestamp = new Date().getTime();
      console.log(`Chargement des films en vedette (timestamp: ${timestamp})...`);
      
      const topFilms = await getFeaturedFilms(5, 6);
      console.log('Films en vedette chargés:', topFilms);
      
      if (topFilms && topFilms.length > 0) {
        // Précharger les images avant de mettre à jour l'état
        preloadImages(topFilms);
        setFilms(topFilms);
      } else {
        console.warn('Aucun film n\'a été récupéré pour le carrousel');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des films en vedette:', error);
      setError(error.message || 'Erreur lors du chargement des films');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les films au chargement du composant
  useEffect(() => {
    loadTopRatedFilms();
    
    // Rafraîchir les données toutes les 5 minutes (moins fréquent pour éviter les problèmes)
    const refreshInterval = setInterval(() => {
      loadTopRatedFilms();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Afficher un message de chargement pendant la récupération des films
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

  // Si une erreur s'est produite
  if (error) {
    return (
      <div className="bg-red-100 p-6 rounded-lg">
        <p className="text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  // Si aucun film n'est disponible
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

  // Fonction de navigation personnalisée
  const goToNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToPrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className="carousel-container">
      <div className="relative">
        {/* Boutons de navigation personnalisés */}
        <button 
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Image précédente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Image suivante"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, EffectFade]}
          effect="fade" // Utiliser un effet de fondu pour éviter le clignotement
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={false}
          pagination={false}
          className="rounded-lg overflow-hidden"
        >
        {films.map((film) => (
          <SwiperSlide key={film.id}>
            <div className="relative h-[250px] sm:h-[300px] md:h-[500px] bg-gray-800">
              {/* Lien vers le film qui couvre toute l'image */}
              <Link href={`/films/${film.slug || film.id}`} className="block absolute inset-0 z-5">
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
                
                {/* Contenu du film (maintenant à l'intérieur du lien principal) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-shadow-lg group-hover:text-blue-300 transition-colors duration-300">{film.title}</h2>
                  <div className="flex items-center flex-wrap text-shadow-md">
                    <span className="text-base sm:text-lg md:text-xl font-semibold">{film.note_sur_10}/10</span>
                    {film.genres && <span className="ml-3 text-sm sm:text-base opacity-90">• {film.genres.split(',')[0]}</span>}
                    {film.release_date && <span className="ml-2 text-sm sm:text-base opacity-90">• {new Date(film.release_date).getFullYear()}</span>}
                  </div>
                </div>
              </Link>
              
              {/* Icône de note en haut à droite (en dehors du lien principal pour éviter les conflits) */}
              <div className="absolute top-4 right-4 z-10">
                <RatingIcon rating={film.note_sur_10} size={64} />
              </div>
              
              {/* Badge Hunted by MovieHunt (en dehors du lien principal pour conserver sa fonctionnalité) */}
              {film.is_hunted_by_moviehunt && (
                <div className="absolute bottom-20 left-4 z-10">
                  {typeof Link !== 'undefined' ? (
                    <Link 
                      href="/huntedbymoviehunt" 
                      className="block transition-transform hover:scale-110"
                      title="En savoir plus sur Hunted by MovieHunt"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img 
                        src="/images/badges/hunted-badge.png" 
                        alt="Hunted by MovieHunt" 
                        width={133} 
                        height={133}
                        className="drop-shadow-md cursor-pointer"
                      />
                    </Link>
                  ) : (
                    <img 
                      src="/images/badges/hunted-badge.png" 
                      alt="Hunted by MovieHunt" 
                      width={133} 
                      height={133}
                      className="drop-shadow-md"
                    />
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
      
      {/* Styles CSS personnalisés pour le carrousel */}
      <style jsx global>{`
        .carousel-container {
          margin-bottom: 2rem;
        }
        /* Styles pour l'ombre portée du texte */
        .text-shadow-lg {
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.7);
        }
        .text-shadow-md {
          text-shadow: 0 0 6px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
}
