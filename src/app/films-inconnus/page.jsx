'use client';

import { useState, useEffect } from 'react';
import { getHiddenGems } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import PreloadCriticalImages from '@/components/ui/PreloadCriticalImages';
import { useTranslations } from '@/hooks/useTranslations';

export default function HiddenGemsFilms() {
  const { t } = useTranslations();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHiddenGems() {
      try {
        setLoading(true);
        // Récupérer tous les films inconnus (sans limite)
        const hiddenGems = await getHiddenGems(50); // Limite plus élevée pour avoir tous les films inconnus
        setFilms(hiddenGems);
      } catch (err) {
        console.error('Erreur lors de la récupération des films inconnus:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHiddenGems();
  }, []);

  // Préparer les chemins d'images critiques pour le préchargement
  const criticalImagePaths = [];
  
  // Ajouter les images des films inconnus s'ils sont disponibles
  if (films.length > 0) {
    // Ajouter les 3 premières images des films inconnus
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
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">{t('hiddenGems.title')}</h1>
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
          <p className="text-red-500">{t('hiddenGems.error')}</p>
        </div>
      ) : films.length > 0 ? (
        <FilmGrid films={films} />
      ) : (
        <div>
          <h1 className="text-4xl font-bold mb-4">{t('hiddenGems.title')}</h1>
          <p className="text-xl text-gray-600">
            {t('hiddenGems.subtitle')}
          </p>
        </div>
      )}
    </div>
  );
}
