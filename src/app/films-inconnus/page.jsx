'use client';

import { useState, useEffect } from 'react';
import { getHiddenGems } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import PreloadCriticalImages from '@/components/ui/PreloadCriticalImages';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HiddenGemsFilms() {
  const { t } = useTranslations();
  const { locale } = useLanguage();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'rating', 'alphabetical'

  useEffect(() => {
    async function fetchHiddenGems() {
      try {
        setLoading(true);
        // Récupérer tous les films inconnus avec la langue appropriée
        const hiddenGems = await getHiddenGems(50, locale); // Passer le locale
        setFilms(hiddenGems);
      } catch (err) {
        console.error('Erreur lors de la récupération des films inconnus:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHiddenGems();
  }, [locale]);

  // Fonction de tri des films
  const sortedFilms = [...films].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.note_sur_10 || 0) - (a.note_sur_10 || 0);
      case 'alphabetical':
        return (a.title || '').localeCompare(b.title || '');
      case 'date':
      default:
        return new Date(b.date_ajout || 0) - new Date(a.date_ajout || 0);
    }
  });

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
      
      {/* En-tête avec bouton retour */}
      <div className="flex items-center justify-end mb-6">
        <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors group font-medium">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>
      </div>

      {/* Section titre et description */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-900 mb-6">
          <strong>Films inconnus</strong> à voir : <span style={{ color: '#FEBE29' }}>découvrez les <strong>pépites</strong> cachées du cinéma</span>
        </h1>
        
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl p-6 md:p-8 shadow-sm border border-indigo-100">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Découvrez notre sélection de <strong className="text-indigo-800">films inconnus</strong> et de <strong className="text-indigo-800">pépites</strong> du cinéma trop souvent passées sous le radar. Chaque titre a été choisi pour sa qualité, son originalité et l'émotion qu'il procure. Ces <strong className="text-indigo-800">films inconnus à voir</strong> vous feront voyager hors des sentiers battus : drames intenses, thrillers surprenants, comédies décalées ou perles indépendantes. Si vous cherchez un <strong className="text-indigo-800">film inconnu à voir</strong> aujourd'hui, explorez cette liste unique de trésors méconnus qui méritent enfin d'être découverts par les vrais amateurs de cinéma.
          </p>
        </div>
      </div>

      {/* Menu de tri et compteur */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
        {/* Menu de tri */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
            Trier par :
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer"
          >
            <option value="date">Date d'ajout</option>
            <option value="rating">Note</option>
            <option value="alphabetical">Ordre alphabétique</option>
          </select>
        </div>

        {/* Compteur de films */}
        {!loading && !error && films.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Nombre de films :</span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
              {films.length}
            </span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">{t('hiddenGems.error')}</p>
        </div>
      ) : sortedFilms.length > 0 ? (
        <FilmGrid films={sortedFilms} />
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
