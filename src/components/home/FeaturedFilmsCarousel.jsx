'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { getTopRatedFilms } from '@/lib/supabase/films';
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
        const topFilms = await getTopRatedFilms(5, 6);
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
    dots: true,
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
              <div className="relative h-[400px] rounded-lg overflow-hidden cursor-pointer group">
                {/* Image d'arrière-plan avec SafeImage */}
                <div className="absolute inset-0">
                  <SafeImage
                    src={film.poster_url}
                    alt={film.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    unoptimized={true}
                  />
                </div>
                
                {/* Contenu du film */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">{film.title}</h2>
                  <div className="flex items-center">
                    <RatingIcon rating={film.note_sur_10} size={30} />
                    <span className="ml-2 text-xl font-semibold">{film.note_sur_10}/10</span>
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
        .carousel-container .slick-dots {
          bottom: 15px;
        }
        .carousel-container .slick-dots li button:before {
          color: white;
          opacity: 0.5;
          font-size: 10px;
        }
        .carousel-container .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }
        .carousel-container .slick-prev, 
        .carousel-container .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
        }
        .carousel-container .slick-prev {
          left: 15px;
        }
        .carousel-container .slick-next {
          right: 15px;
        }
        .carousel-container .slick-prev:before, 
        .carousel-container .slick-next:before {
          font-size: 40px;
          opacity: 0.7;
        }
        .carousel-container .slick-prev:hover:before, 
        .carousel-container .slick-next:hover:before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
