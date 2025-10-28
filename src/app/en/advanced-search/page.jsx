'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import FilmCard from '@/components/films/FilmCard';
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// English genres shown in UI
const COMMON_GENRES_EN = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
  'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
];

// Map English genres to French tokens stored in DB for filtering
const EN_TO_FR_GENRE_MAP = {
  'Action': 'Action',
  'Adventure': 'Aventure',
  'Animation': 'Animation',
  'Comedy': 'Comédie',
  'Crime': 'Crime',
  'Documentary': 'Documentaire',
  'Drama': 'Drame',
  'Family': 'Famille',
  'Fantasy': 'Fantastique',
  'History': 'Histoire',
  'Horror': 'Horreur',
  'Music': 'Musique',
  'Mystery': 'Mystère',
  'Romance': 'Romance',
  'Science Fiction': 'Science-Fiction',
  'Thriller': 'Thriller',
  'War': 'Guerre',
  'Western': 'Western',
};

const RATINGS = Array.from({ length: 11 }, (_, i) => i);

function AdvancedSearchEn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [isHuntedByMovieHunt, setIsHuntedByMovieHunt] = useState(false);

  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);

  const [expandedFilters, setExpandedFilters] = useState({
    genres: true,
    ratings: true,
    years: true,
    hunted: true,
  });

  const fetchAvailableYears = async () => {
    setLoadingYears(true);
    try {
      const { data, error } = await supabase
        .from('films')
        .select('release_date');
      if (error) {
        console.error('Error while fetching years:', error);
        setAvailableYears([]);
        return;
      }
      const years = (data || [])
        .filter(f => f.release_date)
        .map(f => {
          try { return new Date(f.release_date).getFullYear(); } catch { return null; }
        })
        .filter(y => y !== null);
      const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
      setAvailableYears(uniqueYears);
    } catch (e) {
      console.error('Error while fetching years:', e);
      setAvailableYears([]);
    } finally {
      setLoadingYears(false);
    }
  };

  useEffect(() => {
    const genres = searchParams.get('genres')?.split(',') || [];
    const ratings = searchParams.get('ratings')?.split(',').map(Number) || [];
    const years = searchParams.get('years')?.split(',').map(Number) || [];
    const hunted = searchParams.get('hunted') === 'true';

    setSelectedGenres(genres);
    setSelectedRatings(ratings);
    setSelectedYears(years);
    setIsHuntedByMovieHunt(hunted);

    fetchAvailableYears();

    if (genres.length > 0 || ratings.length > 0 || years.length > 0 || hunted) {
      searchFilms(genres, ratings, years, hunted);
    }
  }, [searchParams]);

  const toggleFilter = (filter) => {
    setExpandedFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const toggleGenre = (genre) => {
    const newSelectedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newSelectedGenres);
    updateUrlAndSearch(newSelectedGenres, selectedRatings, selectedYears);
  };

  const toggleRating = (rating) => {
    const newSelectedRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newSelectedRatings);
    updateUrlAndSearch(selectedGenres, newSelectedRatings, selectedYears);
  };

  const toggleYear = (year) => {
    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter(y => y !== year)
      : [...selectedYears, year];
    setSelectedYears(newSelectedYears);
    updateUrlAndSearch(selectedGenres, selectedRatings, newSelectedYears, isHuntedByMovieHunt);
  };

  const toggleHuntedByMovieHunt = () => {
    const newValue = !isHuntedByMovieHunt;
    setIsHuntedByMovieHunt(newValue);
    updateUrlAndSearch(selectedGenres, selectedRatings, selectedYears, newValue);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedRatings([]);
    setSelectedYears([]);
    setIsHuntedByMovieHunt(false);
    updateUrlAndSearch([], [], [], false);
    setFilms([]);
    setTotalCount(0);
  };

  const updateUrlAndSearch = (genres, ratings, years, hunted = false) => {
    const params = new URLSearchParams();
    if (genres.length > 0) params.set('genres', genres.join(','));
    if (ratings.length > 0) params.set('ratings', ratings.join(','));
    if (years.length > 0) params.set('years', years.join(','));
    if (hunted) params.set('hunted', 'true');
    const newUrl = `/en/advanced-search${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
    searchFilms(genres, ratings, years, hunted);
  };

  const searchFilms = async (genresEn, ratings, years, hunted = false) => {
    setLoading(true);
    try {
      let query = supabase
        .from('films')
        .select('*', { count: 'exact' });

      // Map English genres to French tokens and apply AND logic
      const frGenres = (genresEn || []).map(g => EN_TO_FR_GENRE_MAP[g] || g);
      if (frGenres.length > 0) {
        frGenres.forEach(fr => {
          query = query.filter('genres', 'ilike', `%${fr}%`);
        });
      }

      if (ratings.length > 0) {
        query = query.in('note_sur_10', ratings);
      }

      if (hunted) {
        query = query.eq('is_hunted_by_moviehunt', true);
      }

      query = query.order('note_sur_10', { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error('Error while searching films:', error);
        setFilms([]);
        setTotalCount(0);
        return;
      }

      let filteredData = data || [];
      if (years.length > 0) {
        filteredData = filteredData.filter(film => {
          if (!film.release_date) return false;
          try { return years.includes(new Date(film.release_date).getFullYear()); } catch { return false; }
        });
      }

      setFilms(filteredData);
      setTotalCount(filteredData.length);
    } catch (e) {
      console.error('Error while searching films:', e);
      setFilms([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-indigo-800">Advanced Search</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters panel */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiFilter className="mr-2" /> Filters
            </h2>
            {(selectedGenres.length > 0 || selectedRatings.length > 0 || selectedYears.length > 0) && (
              <button onClick={clearAllFilters} className="text-sm text-red-600 hover:text-red-800 flex items-center">
                <FiX className="mr-1" /> Clear all
              </button>
            )}
          </div>

          {/* Hunted by MovieHunt */}
          <div className="mb-4 border-b pb-4">
            <button className="flex justify-between items-center w-full text-left font-medium mb-2" onClick={() => toggleFilter('hunted')}>
              Hunted by MovieHunt
              {expandedFilters.hunted ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedFilters.hunted && (
              <div className="mt-2">
                <button onClick={toggleHuntedByMovieHunt} className={`px-4 py-2 rounded-lg flex items-center ${isHuntedByMovieHunt ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                  <span className="mr-2">{isHuntedByMovieHunt ? '✓' : ''}</span>
                  Show only Hunted films
                </button>
                <p className="text-sm text-gray-500 mt-2">Films selected by MovieHunt team</p>
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="mb-4 border-b pb-4">
            <button className="flex justify-between items-center w-full text-left font-medium mb-2" onClick={() => toggleFilter('genres')}>
              Genres
              {expandedFilters.genres ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedFilters.genres && (
              <div className="flex flex-wrap gap-2 mt-2">
                {COMMON_GENRES_EN.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 text-sm rounded-full ${selectedGenres.includes(genre) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ratings */}
          <div className="mb-4 border-b pb-4">
            <button className="flex justify-between items-center w-full text-left font-medium mb-2" onClick={() => toggleFilter('ratings')}>
              Ratings
              {expandedFilters.ratings ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedFilters.ratings && (
              <div className="flex flex-wrap gap-2 mt-2">
                {RATINGS.map(rating => (
                  <button
                    key={rating}
                    onClick={() => toggleRating(rating)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedRatings.includes(rating) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Years */}
          <div className="mb-4 border-b pb-4">
            <button className="flex justify-between items-center w-full text-left font-medium mb-2" onClick={() => toggleFilter('years')}>
              Release years
              {expandedFilters.years ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedFilters.years && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                {loadingYears ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : availableYears.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableYears.map(year => (
                      <button
                        key={year}
                        onClick={() => toggleYear(year)}
                        className={`px-2 py-1 text-sm rounded ${selectedYears.includes(year) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-2">No years available</p>
                )}
              </div>
            )}
          </div>

          <div className="w-full py-2 text-center text-sm text-gray-600 italic">
            Search runs automatically
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {films.length > 0 ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Results ({totalCount} films)</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {films.map(film => (
                      <FilmCard key={film.id} film={film} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-xl font-medium text-gray-600 mb-2">
                    {selectedGenres.length > 0 || selectedRatings.length > 0 || selectedYears.length > 0
                      ? 'No films match these criteria'
                      : 'Select filters to start your search'}
                  </p>
                  {(selectedGenres.length > 0 || selectedRatings.length > 0 || selectedYears.length > 0) && (
                    <button onClick={clearAllFilters} className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdvancedSearchPageEn() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-indigo-800">Advanced Search</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    }>
      <AdvancedSearchEn />
    </Suspense>
  );
}
