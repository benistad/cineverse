'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTopRatedFilms } from '@/lib/supabase/films';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';

export default function FeaturedFilmsCarousel() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopRatedFilms() {
      try {
        const topFilms = await getTopRatedFilms(5, 6);
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

  // Afficher une bannière statique avec le premier film
  const featuredFilm = films[0];
  
  return (
    <div className="featured-banner">
      <Link href={`/films/${featuredFilm.id}`}>
        <div className="relative h-[400px] rounded-lg overflow-hidden cursor-pointer group">
          {/* Image d'arrière-plan avec SafeImage */}
          <div className="absolute inset-0">
            <SafeImage
              src={featuredFilm.poster_url}
              alt={featuredFilm.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized={true}
            />
            {/* Overlay sombre pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
          </div>
          
          {/* Contenu textuel */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white text-3xl font-bold mb-2 group-hover:text-white/90 transition-colors duration-300">
              {featuredFilm.title}
            </h2>
            
            <div className="flex items-center">
              <RatingIcon rating={featuredFilm.note_sur_10} size={30} />
              <span className="text-white ml-2 text-xl font-semibold">{featuredFilm.note_sur_10}/10</span>
            </div>
            
            <p className="text-white/80 mt-4 text-lg max-w-2xl">
              Découvrez ce film et plus de 100 autres dans notre collection soigneusement notée.
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
