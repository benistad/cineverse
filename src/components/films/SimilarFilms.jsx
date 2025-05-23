'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import RatingIcon from '@/components/ui/RatingIcon';
import { optimizePosterImage } from '@/lib/utils/imageOptimizer';

export default function SimilarFilms({ currentFilm }) {
  const [similarFilms, setSimilarFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchSimilarFilms() {
      if (!currentFilm) return;
      
      try {
        setLoading(true);
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        // Critères de similarité : même genre ou même réalisateur
        let genreCondition = '';
        if (currentFilm.genres) {
          // Extraire le premier genre pour la recherche
          const primaryGenre = currentFilm.genres.split(',')[0].trim();
          genreCondition = `genres.ilike.%${primaryGenre}%`;
        }
        
        // Trouver les films du même réalisateur
        let directorName = '';
        if (currentFilm.remarkable_staff && currentFilm.remarkable_staff.length > 0) {
          const director = currentFilm.remarkable_staff.find(
            staff => staff.role === 'Réalisateur' || staff.role === 'director'
          );
          if (director) {
            directorName = director.name;
          }
        }
        
        // Requête pour trouver des films similaires
        let query = supabase
          .from('films')
          .select('*')
          .neq('id', currentFilm.id) // Exclure le film actuel
          .order('note_sur_10', { ascending: false }) // Trier par note
          .limit(4); // Limiter à 4 recommandations
        
        // Ajouter des conditions de filtrage si nous avons des informations
        if (genreCondition) {
          query = query.or(genreCondition);
        }
        
        // Exécuter la requête
        const { data, error } = await query;
        
        if (error) {
          console.error('Erreur lors de la récupération des films similaires:', error);
          return;
        }
        
        // Préparer les films similaires avec des URLs SEO-friendly
        const filmsWithSeoUrls = data.map(film => {
          // Créer un slug à partir du titre
          const slug = film.title
            ? film.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
            : '';
          
          // Ajouter l'année si disponible
          const releaseYear = film.release_date 
            ? new Date(film.release_date).getFullYear() 
            : '';
            
          // Construire l'URL SEO basée uniquement sur le slug
          const seoUrl = `/films/${encodeURIComponent(slug)}`;
          
          return {
            ...film,
            seoUrl
          };
        });
        
        setSimilarFilms(filmsWithSeoUrls);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSimilarFilms();
  }, [currentFilm]);
  
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Films similaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (similarFilms.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de films similaires
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Films similaires que vous pourriez aimer</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarFilms.map(film => (
          <Link 
            href={film.seoUrl} 
            key={film.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-[2/3] w-full">
              {/* Utiliser une balise img standard au lieu de Next/Image pour éviter les problèmes de quota */}
              <img
                src={film.poster_url || film.poster_path ? 
                  (film.poster_path && film.poster_path.startsWith('/') ? 
                    `https://image.tmdb.org/t/p/w342${film.poster_path}` : 
                    film.poster_url) : 
                  '/images/placeholder.jpg'
                }
                alt={film.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // En cas d'erreur, essayer une taille plus petite
                  if (e.target.src.includes('/w500/')) {
                    e.target.src = e.target.src.replace('/w500/', '/w342/');
                  } else if (e.target.src.includes('/w342/')) {
                    e.target.src = e.target.src.replace('/w342/', '/w185/');
                  } else {
                    // Si toutes les tentatives échouent, utiliser un placeholder
                    e.target.src = '/images/placeholder.jpg';
                  }
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm md:text-base line-clamp-1">{film.title}</h3>
              <div className="flex items-center mt-1">
                <RatingIcon rating={film.note_sur_10} size={16} />
                <span className="ml-1 text-sm">{film.note_sur_10}/10</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
