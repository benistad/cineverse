'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import FilmCard from '@/components/films/FilmCard';
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

// Liste des genres couramment utilisés dans les films
const COMMON_GENRES = [
  'Action', 'Aventure', 'Animation', 'Comédie', 'Crime', 'Documentaire', 
  'Drame', 'Famille', 'Fantastique', 'Histoire', 'Horreur', 'Musique', 
  'Mystère', 'Romance', 'Science-Fiction', 'Thriller', 'Guerre', 'Western'
];

// Liste des notes possibles (entières de 0 à 10)
const RATINGS = Array.from({ length: 11 }, (_, i) => i);

// Années de sortie (de 1900 à l'année actuelle)
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1899 }, (_, i) => CURRENT_YEAR - i);

export default function AdvancedSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // État pour les filtres
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  
  // État pour les résultats et le chargement
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // État pour les accordéons de filtres
  const [expandedFilters, setExpandedFilters] = useState({
    genres: true,
    ratings: true,
    years: true
  });

  // Récupérer les filtres depuis l'URL au chargement
  useEffect(() => {
    const genres = searchParams.get('genres')?.split(',') || [];
    const ratings = searchParams.get('ratings')?.split(',').map(Number) || [];
    const years = searchParams.get('years')?.split(',').map(Number) || [];
    
    setSelectedGenres(genres);
    setSelectedRatings(ratings);
    setSelectedYears(years);
    
    // Si des filtres sont présents, lancer la recherche
    if (genres.length > 0 || ratings.length > 0 || years.length > 0) {
      searchFilms(genres, ratings, years);
    }
  }, [searchParams]);

  // Fonction pour basculer l'état d'un accordéon
  const toggleFilter = (filter) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter]
    });
  };

  // Fonction pour basculer la sélection d'un genre
  const toggleGenre = (genre) => {
    const newSelectedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newSelectedGenres);
  };

  // Fonction pour basculer la sélection d'une note
  const toggleRating = (rating) => {
    const newSelectedRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newSelectedRatings);
  };

  // Fonction pour basculer la sélection d'une année
  const toggleYear = (year) => {
    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter(y => y !== year)
      : [...selectedYears, year];
    setSelectedYears(newSelectedYears);
  };

  // Fonction pour effacer tous les filtres
  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedRatings([]);
    setSelectedYears([]);
    router.push('/advanced-search');
  };

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    // Construire l'URL avec les paramètres de recherche
    let params = new URLSearchParams();
    
    if (selectedGenres.length > 0) {
      params.set('genres', selectedGenres.join(','));
    }
    
    if (selectedRatings.length > 0) {
      params.set('ratings', selectedRatings.join(','));
    }
    
    if (selectedYears.length > 0) {
      params.set('years', selectedYears.join(','));
    }
    
    // Rediriger vers la même page avec les paramètres
    router.push(`/advanced-search?${params.toString()}`);
    
    // Lancer la recherche
    searchFilms(selectedGenres, selectedRatings, selectedYears);
  };

  // Fonction pour rechercher les films avec les filtres
  const searchFilms = async (genres, ratings, years) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('films')
        .select('*', { count: 'exact' });
      
      // Appliquer les filtres de genres
      if (genres.length > 0) {
        const genreConditions = genres.map(genre => `genres.ilike.%${genre}%`);
        query = query.or(genreConditions.join(','));
      }
      
      // Appliquer les filtres de notes
      if (ratings.length > 0) {
        query = query.in('note_sur_10', ratings);
      }
      
      // Appliquer les filtres d'années
      if (years.length > 0) {
        const yearConditions = years.map(year => 
          `release_date.gte.${year}-01-01,release_date.lte.${year}-12-31`
        );
        query = query.or(yearConditions.join(','));
      }
      
      // Trier par note décroissante
      query = query.order('note_sur_10', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Erreur lors de la recherche des films:', error);
        return;
      }
      
      setFilms(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erreur lors de la recherche des films:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recherche avancée</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panneau de filtres */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiFilter className="mr-2" /> Filtres
            </h2>
            {(selectedGenres.length > 0 || selectedRatings.length > 0 || selectedYears.length > 0) && (
              <button 
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <FiX className="mr-1" /> Effacer tout
              </button>
            )}
          </div>
          
          {/* Filtre par genres */}
          <div className="mb-4 border-b pb-4">
            <button 
              className="flex justify-between items-center w-full text-left font-medium mb-2"
              onClick={() => toggleFilter('genres')}
            >
              Genres
              {expandedFilters.genres ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedFilters.genres && (
              <div className="flex flex-wrap gap-2 mt-2">
                {COMMON_GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedGenres.includes(genre)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Filtre par notes */}
          <div className="mb-4 border-b pb-4">
            <button 
              className="flex justify-between items-center w-full text-left font-medium mb-2"
              onClick={() => toggleFilter('ratings')}
            >
              Notes
              {expandedFilters.ratings ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedFilters.ratings && (
              <div className="flex flex-wrap gap-2 mt-2">
                {RATINGS.map(rating => (
                  <button
                    key={rating}
                    onClick={() => toggleRating(rating)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      selectedRatings.includes(rating)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Filtre par années */}
          <div className="mb-4">
            <button 
              className="flex justify-between items-center w-full text-left font-medium mb-2"
              onClick={() => toggleFilter('years')}
            >
              Années de sortie
              {expandedFilters.years ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedFilters.years && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {YEARS.slice(0, 30).map(year => (
                    <button
                      key={year}
                      onClick={() => toggleYear(year)}
                      className={`px-2 py-1 text-sm rounded ${
                        selectedYears.includes(year)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Bouton pour appliquer les filtres */}
          <button
            onClick={applyFilters}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Appliquer les filtres
          </button>
        </div>
        
        {/* Résultats de recherche */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {films.length > 0 ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                      Résultats ({totalCount} films)
                    </h2>
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
                      ? "Aucun film ne correspond à ces critères"
                      : "Sélectionnez des filtres pour commencer votre recherche"}
                  </p>
                  {(selectedGenres.length > 0 || selectedRatings.length > 0 || selectedYears.length > 0) && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Effacer les filtres
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
