'use client';

import { useState, useEffect } from 'react';
import { getTopRatedFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import PreloadCriticalImages from '@/components/ui/PreloadCriticalImages';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TopRatedFilms() {
  const { t } = useTranslations();
  const { locale } = useLanguage();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopRatedFilms() {
      try {
        setLoading(true);
        // Récupérer tous les films les mieux notés avec la langue appropriée
        const topRated = await getTopRatedFilms(50, 6, locale); // Passer le locale
        setFilms(topRated);
      } catch (err) {
        console.error('Erreur lors de la récupération des films les mieux notés:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopRatedFilms();
  }, [locale]);

  // Préparer les chemins d'images critiques pour le préchargement
  const criticalImagePaths = [];
  
  // Ajouter les images des films les mieux notés s'ils sont disponibles
  if (films.length > 0) {
    // Ajouter les 3 premières images des films les mieux notés
    films.slice(0, 3).forEach(film => {
      if (film.poster_url) {
        criticalImagePaths.push(film.poster_url);
      }
    });
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Préchargement des images critiques */}
      <PreloadCriticalImages imagePaths={criticalImagePaths} />
      
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">{t('topRated.title')}</h1>
          {!loading && !error && films.length > 0 && (
            <span className="ml-4 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
              {films.length}
            </span>
          )}
        </div>
        <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors group font-medium">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">Une erreur est survenue lors du chargement des films.</p>
        </div>
      ) : films.length > 0 ? (
        <FilmGrid films={films} />
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun film disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}
