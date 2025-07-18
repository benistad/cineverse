'use client';

import { useState, useEffect } from 'react';
import { getFeaturedFilms } from '@/lib/supabase/films';
import Image from 'next/image';
import Link from 'next/link';
import { optimizeBackdropImage, optimizePosterImage } from '@/lib/utils/imageOptimizer';

export default function BasicCarousel() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  // Charger les films
  useEffect(() => {
    async function loadFilms() {
      try {
        console.log('Chargement des films pour le carrousel basique...');
        setLoading(true);
        setError(null); // Réinitialiser les erreurs précédentes
        
        // Ajouter un timestamp pour éviter la mise en cache du navigateur
        const timestamp = new Date().getTime();
        console.log(`Timestamp: ${timestamp}`);
        
        const topFilms = await getFeaturedFilms(5, 6);
        console.log('Films chargés pour le carrousel basique:', topFilms);
        
        if (topFilms && topFilms.length > 0) {
          setFilms(topFilms);
        } else {
          console.warn('Aucun film n\'a été récupéré pour le carrousel');
          setFilms([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des films:', err);
        setError(err.message || 'Erreur lors du chargement des films');
        setFilms([]);
      } finally {
        setLoading(false);
      }
    }

    loadFilms();
    
    // Recharger les films toutes les 30 secondes
    const interval = setInterval(() => {
      loadFilms();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Gérer le défilement automatique
  useEffect(() => {
    if (films.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % films.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [films]);

  // Fonction pour passer au film suivant
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % films.length);
  };

  // Fonction pour passer au film précédent
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + films.length) % films.length);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">Chargement des films en vedette...</p>
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
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Bienvenue sur MovieHunt</h2>
        <p className="text-gray-700">
          Découvrez notre sélection de films et partagez vos impressions.
        </p>
      </div>
    );
  }

  const currentFilm = films[currentIndex];

  // Fonction pour forcer le rechargement des données
  const forceReload = () => {
    setLoading(true);
    setError(null);
    
    // Ajouter un timestamp pour éviter la mise en cache du navigateur
    const timestamp = new Date().getTime();
    console.log(`Rechargement forcé des films (timestamp: ${timestamp})...`);
    
    // Appeler getFeaturedFilms avec un paramètre supplémentaire pour éviter la mise en cache
    getFeaturedFilms(5, 6, timestamp)
      .then(topFilms => {
        console.log('Films rechargés:', topFilms);
        if (topFilms && topFilms.length > 0) {
          setFilms(topFilms);
        } else {
          console.warn('Aucun film n\'a été récupéré lors du rechargement');
        }
      })
      .catch(err => {
        console.error('Erreur lors du rechargement des films:', err);
        setError(err.message || 'Erreur lors du rechargement des films');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Bouton de rechargement */}
      <button 
        onClick={forceReload}
        className="absolute top-2 right-2 z-20 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
      >
        Recharger
      </button>
      
      {/* Carrousel */}
      <div className="relative h-[250px] sm:h-[300px] md:h-[500px] rounded-lg overflow-hidden">
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0 bg-gray-800">
          {currentFilm && (
            <div className="relative w-full h-full">
              {/* Afficher l'URL de l'image pour le débogage */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 text-white text-xs p-1 overflow-hidden">
                <div>Film ID: {currentFilm.id}</div>
                <div className="truncate">Carousel URL: {currentFilm.carousel_image_url || 'non définie'}</div>
                <div className="truncate">Backdrop URL: {currentFilm.backdrop_url || 'non définie'}</div>
              </div>
              
              <Image
                src={
                  currentFilm.carousel_image_url 
                    ? optimizeBackdropImage(currentFilm.carousel_image_url)
                    : currentFilm.backdrop_url 
                      ? optimizeBackdropImage(currentFilm.backdrop_url)
                      : optimizePosterImage(currentFilm.poster_url)
                }
                alt={currentFilm.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                priority
              />
            </div>
          )}
        </div>
        
        {/* Contenu du film avec ombre portée */}
        {currentFilm && (
          <Link href={`/films/${currentFilm.slug || currentFilm.id}`}>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{currentFilm.title}</h2>
              <div className="flex items-center">
                <span className="text-base sm:text-lg md:text-xl font-semibold">{currentFilm.note_sur_10}/10</span>
                {currentFilm.genres && <span className="ml-3 text-sm sm:text-base opacity-90">• {currentFilm.genres.split(',')[0]}</span>}
                {currentFilm.release_date && <span className="ml-2 text-sm sm:text-base opacity-90">• {new Date(currentFilm.release_date).getFullYear()}</span>}
              </div>
            </div>
          </Link>
        )}
        
        {/* Boutons de navigation */}
        <button 
          onClick={prevSlide} 
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
          aria-label="Précédent"
        >
          ←
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
          aria-label="Suivant"
        >
          →
        </button>
        
        {/* Indicateurs de position */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {films.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Aller au film ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Informations de débogage */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold">Informations sur le film actuel:</h3>
        <p>ID: {currentFilm.id}</p>
        <p>Titre: {currentFilm.title}</p>
        <p>Image du carrousel: {currentFilm.carousel_image_url ? 'Oui' : 'Non'}</p>
        {currentFilm.carousel_image_url && (
          <p className="text-xs overflow-auto">URL: {currentFilm.carousel_image_url}</p>
        )}
      </div>
    </div>
  );
}
