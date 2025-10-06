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

/**
 * Récupère les films récemment notés avec leur staff remarquable en une seule requête
 * @param {number} limit - Nombre maximum de films à récupérer
 */
export async function getRecentlyRatedFilms(limit = 8) {
  return withCache('getRecentlyRatedFilms', { limit }, async () => {
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
      const filmsWithStaff = films.map(film => ({
        ...film,
        remarkable_staff: allStaff.filter(staff => staff.film_id === film.id) || []
      }));

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
 */
export async function getTopRatedFilms(limit = 8, minRating = 6) {
  return withCache('getTopRatedFilms', { limit, minRating }, async () => {
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
      const filmsWithStaff = films.map(film => ({
        ...film,
        remarkable_staff: allStaff.filter(staff => staff.film_id === film.id) || []
      }));

      return filmsWithStaff;
    } catch (error) {
      console.error('Erreur lors de la récupération des films les mieux notés:', error);
      return [];
    }
  });
}

/**
 * Récupère les films méconnus à voir avec leur staff remarquable en une seule requête
 * @param {number} limit - Nombre maximum de films à récupérer
 */
export async function getHiddenGems(limit = 8) {
  return withCache('getHiddenGems', { limit }, async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Récupérer les films méconnus
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
      const filmsWithStaff = films.map(film => ({
        ...film,
        remarkable_staff: allStaff.filter(staff => staff.film_id === film.id) || []
      }));

      return filmsWithStaff;
    } catch (error) {
      console.error('Erreur lors de la récupération des films méconnus:', error);
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
 * Récupère le nombre total de films méconnus à voir
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
      console.error('Erreur lors du comptage des films méconnus à voir:', error);
      return 0;
    }
  });
}

// Exporter les autres fonctions nécessaires de films.js
export {
  getSupabaseClient,
  // Vous pouvez ajouter d'autres fonctions au besoin
};
