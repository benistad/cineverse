'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RatingIcon from '@/components/ui/RatingIcon';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

/**
 * Carrousel des films en vedette - Version client qui reçoit les films pré-chargés
 */
export default function FeaturedCarouselClient({ initialFilms }) {
  const swiperRef = useRef(null);

  const getOptimalImageUrl = (film, size = 'w1280') => {
    if (!film) return null;
    
    if (film.carousel_image_url) {
      if (film.carousel_image_url.startsWith('http')) {
        return film.carousel_image_url;
      } else if (film.carousel_image_url.startsWith('/')) {
        return `https://image.tmdb.org/t/p/${size}${film.carousel_image_url}`;
      }
    }
    
    if (film.backdrop_url) {
      if (film.backdrop_url.startsWith('http')) {
        return film.backdrop_url;
      } else if (film.backdrop_url.startsWith('/')) {
        return `https://image.tmdb.org/t/p/${size}${film.backdrop_url}`;
      }
    }
    
    if (film.backdrop_path) {
      if (film.backdrop_path.startsWith('http')) {
        return film.backdrop_path;
      } else if (film.backdrop_path.startsWith('/')) {
        return `https://image.tmdb.org/t/p/${size}${film.backdrop_path}`;
      }
    }
    
    if (film.poster_url) {
      if (film.poster_url.startsWith('http')) {
        return film.poster_url;
      } else if (film.poster_url.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w500${film.poster_url}`;
      }
    }
    
    if (film.poster_path) {
      if (film.poster_path.startsWith('http')) {
        return film.poster_path;
      } else if (film.poster_path.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w500${film.poster_path}`;
      }
    }
    
    return '/images/placeholder.jpg';
  };

  if (!initialFilms || initialFilms.length === 0) {
    return (
      <div className="bg-gray-800 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Bienvenue sur MovieHunt</h2>
        <p>Découvrez notre sélection de films et partagez vos impressions.</p>
      </div>
    );
  }

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
          effect="fade"
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
          {initialFilms.map((film) => {
            const imageUrl = getOptimalImageUrl(film, 'w1280');
            
            return (
              <SwiperSlide key={film.id}>
                <div className="relative h-[320px] sm:h-[370px] md:h-[570px] bg-gray-800">
                  <Image
                    src={imageUrl}
                    alt={`Image du film ${film.title}`}
                    fill
                    priority={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                    className="object-cover object-center"
                    quality={80}
                    loading="lazy"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-5" />
                  
                  <Link href={`/films/${film.slug || film.id}`} className="absolute inset-0 z-10">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-shadow-lg">{film.title}</h2>
                      <div className="flex items-center flex-wrap text-shadow-md">
                        <span className="text-base sm:text-lg md:text-xl font-semibold">{film.note_sur_10}/10</span>
                        {film.genres && <span className="ml-3 text-sm sm:text-base opacity-90">• {film.genres.split(',')[0]}</span>}
                        {film.release_date && <span className="ml-2 text-sm sm:text-base opacity-90">• {new Date(film.release_date).getFullYear()}</span>}
                      </div>
                    </div>
                  </Link>
                  
                  <div className="absolute top-4 right-4 z-15">
                    <RatingIcon rating={film.note_sur_10} size={64} />
                  </div>
                  
                  {film.is_hunted_by_moviehunt && (
                    <div className="absolute bottom-20 left-4 z-15">
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
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      
      <style jsx global>{`
        .carousel-container {
          margin-bottom: 2rem;
        }
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
