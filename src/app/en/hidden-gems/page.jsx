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
  const [sortBy, setSortBy] = useState('date'); // 'date', 'rating', 'alphabetical'

  useEffect(() => {
    async function fetchHiddenGems() {
      try {
        setLoading(true);
        // Fetch all hidden gems (no limit)
        const hiddenGems = await getHiddenGems(50); // Higher limit to get all hidden gems
        setFilms(hiddenGems);
      } catch (err) {
        console.error('Error fetching hidden gems:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHiddenGems();
  }, []);

  // Film sorting function
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

  // Prepare critical image paths for preloading
  const criticalImagePaths = [];
  
  // Add hidden gems images if available
  if (films.length > 0) {
    // Add the first 3 hidden gems images
    films.slice(0, 3).forEach(film => {
      if (film.poster_url) {
        criticalImagePaths.push(film.poster_url);
      }
    });
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Preload critical images */}
      <PreloadCriticalImages imagePaths={criticalImagePaths} />
      
      {/* Header with back button */}
      <div className="flex items-center justify-end mb-6">
        <Link href="/en" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors group font-medium">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </div>

      {/* Title and description section */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-900 mb-6">
          <strong>Hidden gem films</strong> to watch: <span style={{ color: '#FEBE29' }}>discover the <strong>hidden treasures</strong> of cinema</span>
        </h1>
        
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl p-6 md:p-8 shadow-sm border border-indigo-100">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Discover our selection of <strong className="text-indigo-800">hidden gem films</strong> and cinema <strong className="text-indigo-800">treasures</strong> too often overlooked. Each title has been chosen for its quality, originality and the emotion it provides. These <strong className="text-indigo-800">hidden films to watch</strong> will take you off the beaten path: intense dramas, surprising thrillers, offbeat comedies or independent pearls. If you're looking for a <strong className="text-indigo-800">hidden film to watch</strong> today, explore this unique list of underrated treasures that finally deserve to be discovered by true cinema lovers.
          </p>
        </div>
      </div>

      {/* Sort menu and counter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
        {/* Sort menu */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer"
          >
            <option value="date">Date added</option>
            <option value="rating">Rating</option>
            <option value="alphabetical">Alphabetical order</option>
          </select>
        </div>

        {/* Film counter */}
        {!loading && !error && films.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Number of films:</span>
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
