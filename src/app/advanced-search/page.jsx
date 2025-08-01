'use client';

import { Suspense } from 'react';

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

function AdvancedSearch() {
  // Composant interne qui utilise useSearchParams

  const router = useRouter();
  const searchParams = useSearchParams();
  
  // État pour les filtres
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [isHuntedByMovieHunt, setIsHuntedByMovieHunt] = useState(false);
  
  // État pour les résultats et le chargement
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // État pour les années disponibles
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);
  
  // État pour les accordéons de filtres
  const [expandedFilters, setExpandedFilters] = useState({
    genres: true,
    ratings: true,
    years: true,
    hunted: true
  });

  // Fonction pour récupérer les années des films déjà notés et publiés
  const fetchAvailableYears = async () => {
    setLoadingYears(true);
    
    try {
      // Récupérer tous les films
      const { data, error } = await supabase
        .from('films')
        .select('release_date');
      
      if (error) {
        console.error('Erreur lors de la récupération des années:', error);
        setAvailableYears([]);
        return;
      }
      
      // Extraire les années uniques des dates de sortie
      const years = data
        .filter(film => film.release_date) // Filtrer les films sans date de sortie
        .map(film => {
          try {
            return new Date(film.release_date).getFullYear();
          } catch (e) {
            console.error('Erreur lors de l\'extraction de l\'année:', e, film.release_date);
            return null;
          }
        })
        .filter(year => year !== null); // Filtrer les années invalides
      
      // Supprimer les doublons et trier par ordre décroissant
      const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
      
      setAvailableYears(uniqueYears);
    } catch (error) {
      console.error('Erreur lors de la récupération des années:', error);
      setAvailableYears([]);
    } finally {
      setLoadingYears(false);
    }
  };
  
  // Récupérer les filtres depuis l'URL au chargement et les années disponibles
  useEffect(() => {
    const genres = searchParams.get('genres')?.split(',') || [];
    const ratings = searchParams.get('ratings')?.split(',').map(Number) || [];
    const years = searchParams.get('years')?.split(',').map(Number) || [];
    const hunted = searchParams.get('hunted') === 'true';
    
    setSelectedGenres(genres);
    setSelectedRatings(ratings);
    setSelectedYears(years);
    setIsHuntedByMovieHunt(hunted);
    
    // Récupérer les années disponibles
    fetchAvailableYears();
    
    // Si des filtres sont présents, lancer la recherche
    if (genres.length > 0 || ratings.length > 0 || years.length > 0 || hunted) {
      searchFilms(genres, ratings, years, hunted);
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
    
    // Mettre à jour l'URL et lancer la recherche automatiquement
    updateUrlAndSearch(newSelectedGenres, selectedRatings, selectedYears);
  };

  // Fonction pour basculer la sélection d'une note
  const toggleRating = (rating) => {
    const newSelectedRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newSelectedRatings);
    
    // Mettre à jour l'URL et lancer la recherche automatiquement
    updateUrlAndSearch(selectedGenres, newSelectedRatings, selectedYears);
  };

  // Fonction pour basculer la sélection d'une année
  const toggleYear = (year) => {
    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter(y => y !== year)
      : [...selectedYears, year];
    setSelectedYears(newSelectedYears);
    updateUrlAndSearch(selectedGenres, selectedRatings, newSelectedYears, isHuntedByMovieHunt);
  };

  // Fonction pour basculer le filtre Hunted by MovieHunt
  const toggleHuntedByMovieHunt = () => {
    const newValue = !isHuntedByMovieHunt;
    setIsHuntedByMovieHunt(newValue);
    updateUrlAndSearch(selectedGenres, selectedRatings, selectedYears, newValue);
  };

  // Fonction pour effacer tous les filtres
  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedRatings([]);
    setSelectedYears([]);
    setIsHuntedByMovieHunt(false);
    
    // Mettre à jour l'URL et lancer la recherche automatiquement
    updateUrlAndSearch([], [], [], false);
    
    // Réinitialiser les résultats
    setFilms([]);
    setTotalCount(0);
  };

  // Fonction pour mettre à jour l'URL et lancer la recherche
  const updateUrlAndSearch = (genres, ratings, years, hunted = false) => {
    // Construire l'URL avec les paramètres de recherche
    let params = new URLSearchParams();
    
    if (genres.length > 0) {
      params.set('genres', genres.join(','));
    }
    
    if (ratings.length > 0) {
      params.set('ratings', ratings.join(','));
    }
    
    if (years.length > 0) {
      params.set('years', years.join(','));
    }
    
    if (hunted) {
      params.set('hunted', 'true');
    }
    
    // Mettre à jour l'URL sans recharger la page
    const newUrl = `/advanced-search${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
    
    // Lancer la recherche
    searchFilms(genres, ratings, years, hunted);
  };

  // Fonction pour rechercher les films avec les filtres
  const searchFilms = async (genres, ratings, years, hunted = false) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('films')
        .select('*', { count: 'exact' });
      
      // Appliquer les filtres de genres
      if (genres.length > 0) {
        // Utiliser une logique ET pour les genres (tous les genres sélectionnés doivent être présents)
        genres.forEach(genre => {
          query = query.filter('genres', 'ilike', `%${genre}%`);
        });
      }
      
      // Appliquer les filtres de notes
      if (ratings.length > 0) {
        query = query.in('note_sur_10', ratings);
      }
      
      // Appliquer le filtre Hunted by MovieHunt
      if (hunted) {
        query = query.eq('is_hunted_by_moviehunt', true);
      }
      
      // Trier par note décroissante
      query = query.order('note_sur_10', { ascending: false });
      
      // Exécuter la requête
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Erreur lors de la recherche des films:', error);
        setFilms([]);
        setTotalCount(0);
        return;
      }
      
      let filteredData = data || [];
      
      // Appliquer le filtre d'années manuellement si nécessaire
      if (years.length > 0) {
        filteredData = filteredData.filter(film => {
          if (!film.release_date) return false;
          
          try {
            const filmYear = new Date(film.release_date).getFullYear();
            return years.includes(filmYear);
          } catch (e) {
            console.error('Erreur lors de l\'extraction de l\'année:', e, film.release_date);
            return false;
          }
        });
      }
      
      setFilms(filteredData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error('Erreur lors de la recherche des films:', error);
      setFilms([]);
      setTotalCount(0);
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
          
          {/* Filtre Hunted by MovieHunt */}
          <div className="mb-4 border-b pb-4">
            <button 
              className="flex justify-between items-center w-full text-left font-medium mb-2"
              onClick={() => toggleFilter('hunted')}
            >
              Hunted by MovieHunt
              {expandedFilters.hunted ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedFilters.hunted && (
              <div className="mt-2">
                <button
                  onClick={toggleHuntedByMovieHunt}
                  className={`px-4 py-2 rounded-lg flex items-center ${isHuntedByMovieHunt ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  <span className="mr-2">{isHuntedByMovieHunt ? '✓' : ''}</span>
                  Afficher uniquement les films Hunted
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Films sélectionnés par l'équipe de MovieHunt
                </p>
              </div>
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
          <div className="mb-4 border-b pb-4">
            <button 
              className="flex justify-between items-center w-full text-left font-medium mb-2"
              onClick={() => toggleFilter('years')}
            >
              Années de sortie
              {expandedFilters.years ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedFilters.years && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                {loadingYears ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : availableYears.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableYears.map(year => (
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
                ) : (
                  <p className="text-gray-500 text-sm py-2">Aucune année disponible</p>
                )}
              </div>
            )}
          </div>
          
          
          {/* Indicateur de recherche automatique */}
          <div className="w-full py-2 text-center text-sm text-gray-600 italic">
            La recherche s'effectue automatiquement
          </div>
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

// Composant principal avec Suspense boundary
export default function AdvancedSearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Recherche avancée</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <AdvancedSearch />
    </Suspense>
  );
}
