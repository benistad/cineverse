'use client';

import { createBrowserClient } from '@supabase/ssr';
import { withCache } from '@/lib/cache/supabaseCache';

// Création du client Supabase côté client (singleton)
let supabaseInstance = null;
const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;
  
  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  return supabaseInstance;
};

const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTFmYzFkODkzNTExZjgwYTBjNmI0YzRkZTE2MWM1MSIsIm5iZiI6MTc0NjUxNTA1NC4yODE5OTk4LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hj-9KXl-h5-7CtFhFSC6V4NJE__c1ozx5OnrETtCS9c';

/**
 * Enrichit un film avec les données TMDB en anglais si disponible
 * @param {Object} film - Le film à enrichir
 * @returns {Object} - Le film enrichi avec titre, synopsis et genres en anglais
 */
async function enrichFilmWithTMDB(film) {
  if (!film.tmdb_id) return film;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${film.tmdb_id}?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return film;

    const data = await response.json();
    
    // Convertir les genres TMDB en string (format: "Genre1, Genre2, Genre3")
    const genresString = data.genres?.map(g => g.name).join(', ') || film.genres;
    
    return {
      ...film,
      title: data.original_title || data.title || film.title,
      synopsis: data.overview || film.synopsis,
      genres: genresString,
    };
  } catch (error) {
    console.error(`Error fetching TMDB data for film ${film.id}:`, error);
    return film;
  }
}

/**
 * Récupère les films récemment notés avec leur staff remarquable en une seule requête
 * @param {number} limit - Nombre maximum de films à récupérer
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 */
export async function getRecentlyRatedFilms(limit = 8, locale = 'fr') {
  return withCache('getRecentlyRatedFilms', { limit, locale }, async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Récupérer les films récents
      const { data: films, error } = await supabase
        .from('films')
        .select('*')
        .order('date_ajout', { ascending: false })
        .limit(limit);

      if (error) throw error;
      if (!films || films.length === 0) return [];

      // Récupérer tout le staff pour ces films en une seule requête
      const filmIds = films.map(film => film.id);
      const { data: allStaff, error: staffError } = await supabase
        .from('remarkable_staff')
        .select('*')
        .in('film_id', filmIds);

      if (staffError) {
        console.error('Erreur lors de la récupération du staff:', staffError);
        return films.map(film => ({ ...film, remarkable_staff: [] }));
      }

      // Associer le staff à chaque film
      let filmsWithStaff = films.map(film => ({
        ...film,
        remarkable_staff: allStaff.filter(staff => staff.film_id === film.id) || []
      }));

      // Si la langue est anglaise, enrichir avec les données TMDB
      if (locale === 'en') {
        filmsWithStaff = await Promise.all(
          filmsWithStaff.map(film => enrichFilmWithTMDB(film))
        );
      }

      return filmsWithStaff;
    } catch (error) {
      console.error('Erreur lors de la récupération des films récents:', error);
      return [];
    }
  });
}

/**
 * Récupère les films les mieux notés avec leur staff remarquable en une seule requête
 * @param {number} limit - Nombre maximum de films à récupérer
 * @param {number} minRating - Note minimale stricte pour inclure un film (défaut: 6)
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 */
export async function getTopRatedFilms(limit = 8, minRating = 6, locale = 'fr') {
  return withCache('getTopRatedFilms', { limit, minRating, locale }, async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Récupérer les films avec une note supérieure à minRating
      const { data: films, error } = await supabase
        .from('films')
        .select('*')
        .gt('note_sur_10', minRating)
        .order('note_sur_10', { ascending: false })
        .limit(limit);

      if (error) throw error;
      if (!films || films.length === 0) return [];

      // Récupérer tout le staff pour ces films en une seule requête
      const filmIds = films.map(film => film.id);
      const { data: allStaff, error: staffError } = await supabase
        .from('remarkable_staff')
        .select('*')
        .in('film_id', filmIds);

      if (staffError) {
        console.error('Erreur lors de la récupération du staff:', staffError);
        return films.map(film => ({ ...film, remarkable_staff: [] }));
      }

      // Associer le staff à chaque film
      let filmsWithStaff = films.map(film => ({
        ...film,
        remarkable_staff: allStaff.filter(staff => staff.film_id === film.id) || []
      }));

      // Si la langue est anglaise, enrichir avec les données TMDB
      if (locale === 'en') {
        filmsWithStaff = await Promise.all(
          filmsWithStaff.map(film => enrichFilmWithTMDB(film))
        );
      }

      return filmsWithStaff;
    } catch (error) {
      console.error('Erreur lors de la récupération des films les mieux notés:', error);
      return [];
    }
  });
}

/**
 * Récupère les films inconnus à voir avec leur staff remarquable en une seule requête
 * @param {number} limit - Nombre maximum de films à récupérer
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 */
export async function getHiddenGems(limit = 8, locale = 'fr') {
  return withCache('getHiddenGems', { limit, locale }, async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Récupérer les films inconnus
      const { data: films, error } = await supabase
        .from('films')
        .select('*')
        .eq('is_hidden_gem', true)
        .order('date_ajout', { ascending: false })
        .limit(limit);

      if (error) throw error;
      if (!films || films.length === 0) return [];

      // Récupérer tout le staff pour ces films en une seule requête
      const filmIds = films.map(film => film.id);
      const { data: allStaff, error: staffError } = await supabase
        .from('remarkable_staff')
        .select('*')
        .in('film_id', filmIds);

      if (staffError) {
        console.error('Erreur lors de la récupération du staff:', staffError);
        return films.map(film => ({ ...film, remarkable_staff: [] }));
      }

      // Associer le staff à chaque film
      let filmsWithStaff = films.map(film => ({
        ...film,
        remarkable_staff: allStaff.filter(staff => staff.film_id === film.id) || []
      }));

      // Si la langue est anglaise, enrichir avec les données TMDB
      if (locale === 'en') {
        filmsWithStaff = await Promise.all(
          filmsWithStaff.map(film => enrichFilmWithTMDB(film))
        );
      }

      return filmsWithStaff;
    } catch (error) {
      console.error('Erreur lors de la récupération des films inconnus:', error);
      return [];
    }
  });
}

/**
 * Récupère le nombre total de films les mieux notés
 * @param {number} minRating - Note minimale stricte pour inclure un film (défaut: 6)
 */
export async function getTopRatedFilmsCount(minRating = 6) {
  return withCache('getTopRatedFilmsCount', { minRating }, async () => {
    try {
      const supabase = getSupabaseClient();
      const { count, error } = await supabase
        .from('films')
        .select('*', { count: 'exact', head: true })
        .gt('note_sur_10', minRating);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erreur lors du comptage des films les mieux notés:', error);
      return 0;
    }
  });
}

/**
 * Récupère le nombre total de films inconnus à voir
 */
export async function getHiddenGemsCount() {
  return withCache('getHiddenGemsCount', {}, async () => {
    try {
      const supabase = getSupabaseClient();
      const { count, error } = await supabase
        .from('films')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden_gem', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erreur lors du comptage des films inconnus à voir:', error);
      return 0;
    }
  });
}

// Exporter les autres fonctions nécessaires de films.js
export {
  getSupabaseClient,
  // Vous pouvez ajouter d'autres fonctions au besoin
};
