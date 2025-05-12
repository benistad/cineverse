'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { getFeaturedFilms } from '@/lib/supabase/films';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';

// Importer les styles CSS de Slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function FeaturedFilmsCarousel() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopRatedFilms() {
      try {
        const topFilms = await getFeaturedFilms(5, 6);
        console.log('Films chargés:', topFilms);
        console.log('URL du poster du premier film:', topFilms[0]?.poster_url);
        setFilms(topFilms);
      } catch (error) {
        console.error('Erreur lors du chargement des films en vedette:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTopRatedFilms();
  }, []);

  // Afficher un message de chargement pendant la récupération des films
  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">Chargement des films en vedette...</p>
      </div>
    );
  }

  // Si aucun film n'est disponible
  if (films.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Bienvenue sur MovieHunt</h2>
        <p className="text-gray-700">
          Découvrez notre sélection de films et partagez vos impressions.
        </p>
      </div>
    );
  }

  // Configuration du carrousel
  const settings = {
    dots: false, // Points de navigation désactivés
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {films.map((film, index) => (
          <div key={film.id} className="carousel-item">
            <Link href={`/films/${film.id}`}>
              <div className="relative h-[250px] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden cursor-pointer group">
                {/* Image d'arrière-plan avec SafeImage */}
                <div className="absolute inset-0">
                  <SafeImage
                    src={film.backdrop_url || film.poster_url}
                    alt={film.title}
                    fill
                    className="object-cover" 
                    sizes="100vw"
                    priority
                    unoptimized={true}
                  />
                </div>
                
                {/* Contenu du film avec ombre portée */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 group-hover:text-blue-300 transition-colors duration-300 text-shadow-lg">{film.title}</h2>
                  <div className="flex items-center text-shadow-md">
                    <RatingIcon rating={film.note_sur_10} size={window.innerWidth < 640 ? 24 : 30} />
                    <span className="ml-2 text-base sm:text-lg md:text-xl font-semibold">{film.note_sur_10}/10</span>
                    {film.genres && <span className="ml-3 text-sm sm:text-base opacity-90">• {film.genres.split(',')[0]}</span>}
                    {film.release_date && <span className="ml-2 text-sm sm:text-base opacity-90">• {new Date(film.release_date).getFullYear()}</span>}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
      
      {/* Styles CSS personnalisés pour le carrousel */}
      <style jsx global>{`
        .carousel-container {
          margin-bottom: 2rem;
        }
        .carousel-container .slick-prev, 
        .carousel-container .slick-next {
          z-index: 10;
          width: 30px;
          height: 30px;
        }
        @media (min-width: 640px) {
          .carousel-container .slick-prev, 
          .carousel-container .slick-next {
            width: 40px;
            height: 40px;
          }
        }
        .carousel-container .slick-prev {
          left: 15px;
        }
        .carousel-container .slick-next {
          right: 15px;
        }
        .carousel-container .slick-prev:before, 
        .carousel-container .slick-next:before {
          font-size: 30px;
          opacity: 0.7;
        }
        @media (min-width: 640px) {
          .carousel-container .slick-prev:before, 
          .carousel-container .slick-next:before {
            font-size: 40px;
          }
        }
        .carousel-container .slick-prev:hover:before, 
        .carousel-container .slick-next:hover:before {
          opacity: 1;
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
