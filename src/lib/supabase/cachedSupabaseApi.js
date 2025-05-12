/**
 * API Supabase avec mise en cache côté serveur
 * Optimise les performances en réduisant les appels API redondants
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { fetchWithCache, invalidateCache, invalidateCacheByPrefix } from '../utils/serverCache';

// Durées de cache par type de requête (en millisecondes)
const CACHE_TTL = {
  FILMS_LIST: 30 * 60 * 1000, // 30 minutes pour les listes de films
  FILM_DETAILS: 60 * 60 * 1000, // 1 heure pour les détails d'un film
  GENRES: 24 * 60 * 60 * 1000, // 24 heures pour les genres
  STAFF_PICKS: 12 * 60 * 60 * 1000, // 12 heures pour les recommandations
  DEFAULT: 15 * 60 * 1000, // 15 minutes par défaut
};

// Préfixes pour les clés de cache
const CACHE_PREFIXES = {
  FILMS: 'supabase_films',
  GENRES: 'supabase_genres',
  STAFF_PICKS: 'supabase_staff_picks',
};

/**
 * Crée un client Supabase pour les composants serveur
 * @returns {Object} - Client Supabase
 */
export function getSupabaseServer() {
  return createServerComponentClient({ cookies });
}

/**
 * Récupère tous les films avec mise en cache
 * @param {Object} options - Options de requête
 * @returns {Promise<Array>} - Liste des films
 */
export async function getAllFilmsWithCache(options = {}) {
  const {
    limit = 50,
    orderBy = 'date_ajout',
    orderDirection = 'desc',
    bypassCache = false,
  } = options;
  
  const cacheKey = `${CACHE_PREFIXES.FILMS}_all_${limit}_${orderBy}_${orderDirection}`;
  
  if (!bypassCache) {
    // Vérifier si les données sont en cache côté client
    if (typeof window !== 'undefined') {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch (e) {
          console.error('Erreur lors de la lecture du cache client:', e);
        }
      }
    }
  }
  
  // Fonction pour récupérer les données de Supabase
  const fetchFromSupabase = async () => {
    const supabase = getSupabaseServer();
    
    let query = supabase
      .from('films')
      .select('*')
      .order(orderBy, { ascending: orderDirection === 'asc' });
    
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des films:', error);
      throw error;
    }
    
    // Mettre en cache côté client si possible
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        console.error('Erreur lors de la mise en cache côté client:', e);
      }
    }
    
    return data;
  };
  
  // Utiliser le cache serveur
  return fetchWithCache(
    cacheKey,
    { fetchFn: fetchFromSupabase },
    {
      ttl: CACHE_TTL.FILMS_LIST,
      bypassCache,
    }
  );
}

/**
 * Récupère un film par son ID avec mise en cache
 * @param {number} filmId - ID du film
 * @param {boolean} bypassCache - Ignorer le cache
 * @returns {Promise<Object>} - Détails du film
 */
export async function getFilmByIdWithCache(filmId, bypassCache = false) {
  if (!filmId) return null;
  
  const cacheKey = `${CACHE_PREFIXES.FILMS}_id_${filmId}`;
  
  // Fonction pour récupérer les données de Supabase
  const fetchFromSupabase = async () => {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .eq('id', filmId)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du film ${filmId}:`, error);
      return null;
    }
    
    return data;
  };
  
  // Utiliser le cache serveur
  return fetchWithCache(
    cacheKey,
    { fetchFn: fetchFromSupabase },
    {
      ttl: CACHE_TTL.FILM_DETAILS,
      bypassCache,
    }
  );
}

/**
 * Récupère un film par son slug avec mise en cache
 * @param {string} slug - Slug du film
 * @param {boolean} bypassCache - Ignorer le cache
 * @returns {Promise<Object>} - Détails du film
 */
export async function getFilmBySlugWithCache(slug, bypassCache = false) {
  if (!slug) return null;
  
  const cacheKey = `${CACHE_PREFIXES.FILMS}_slug_${slug}`;
  
  // Fonction pour récupérer les données de Supabase
  const fetchFromSupabase = async () => {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du film avec le slug ${slug}:`, error);
      return null;
    }
    
    return data;
  };
  
  // Utiliser le cache serveur
  return fetchWithCache(
    cacheKey,
    { fetchFn: fetchFromSupabase },
    {
      ttl: CACHE_TTL.FILM_DETAILS,
      bypassCache,
    }
  );
}

/**
 * Récupère les films par genre avec mise en cache
 * @param {string} genre - Genre des films
 * @param {Object} options - Options de requête
 * @returns {Promise<Array>} - Liste des films
 */
export async function getFilmsByGenreWithCache(genre, options = {}) {
  if (!genre) return [];
  
  const {
    limit = 20,
    orderBy = 'date_ajout',
    orderDirection = 'desc',
    bypassCache = false,
  } = options;
  
  const cacheKey = `${CACHE_PREFIXES.FILMS}_genre_${genre}_${limit}_${orderBy}_${orderDirection}`;
  
  // Fonction pour récupérer les données de Supabase
  const fetchFromSupabase = async () => {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .ilike('genres', `%${genre}%`)
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .limit(limit);
    
    if (error) {
      console.error(`Erreur lors de la récupération des films du genre ${genre}:`, error);
      return [];
    }
    
    return data;
  };
  
  // Utiliser le cache serveur
  return fetchWithCache(
    cacheKey,
    { fetchFn: fetchFromSupabase },
    {
      ttl: CACHE_TTL.FILMS_LIST,
      bypassCache,
    }
  );
}

/**
 * Récupère les recommandations du staff avec mise en cache
 * @param {number} filmId - ID du film pour lequel récupérer les recommandations
 * @param {boolean} bypassCache - Ignorer le cache
 * @returns {Promise<Array>} - Liste des recommandations
 */
export async function getStaffPicksWithCache(filmId, bypassCache = false) {
  const cacheKey = `${CACHE_PREFIXES.STAFF_PICKS}_film_${filmId}`;
  
  // Fonction pour récupérer les données de Supabase
  const fetchFromSupabase = async () => {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('staff_picks')
      .select('*, staff_members(*)')
      .eq('film_id', filmId);
    
    if (error) {
      console.error(`Erreur lors de la récupération des recommandations pour le film ${filmId}:`, error);
      return [];
    }
    
    return data;
  };
  
  // Utiliser le cache serveur
  return fetchWithCache(
    cacheKey,
    { fetchFn: fetchFromSupabase },
    {
      ttl: CACHE_TTL.STAFF_PICKS,
      bypassCache,
    }
  );
}

/**
 * Récupère tous les genres avec mise en cache
 * @param {boolean} bypassCache - Ignorer le cache
 * @returns {Promise<Array>} - Liste des genres
 */
export async function getAllGenresWithCache(bypassCache = false) {
  const cacheKey = `${CACHE_PREFIXES.GENRES}_all`;
  
  // Fonction pour récupérer les données de Supabase
  const fetchFromSupabase = async () => {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des genres:', error);
      return [];
    }
    
    return data;
  };
  
  // Utiliser le cache serveur
  return fetchWithCache(
    cacheKey,
    { fetchFn: fetchFromSupabase },
    {
      ttl: CACHE_TTL.GENRES,
      bypassCache,
    }
  );
}

/**
 * Invalide le cache pour un film spécifique
 * @param {number} filmId - ID du film
 * @param {string} slug - Slug du film
 */
export function invalidateFilmCache(filmId, slug) {
  if (filmId) {
    invalidateCache(`${CACHE_PREFIXES.FILMS}_id_${filmId}`);
  }
  
  if (slug) {
    invalidateCache(`${CACHE_PREFIXES.FILMS}_slug_${slug}`);
  }
  
  // Invalider également les listes de films qui pourraient contenir ce film
  invalidateCacheByPrefix(`${CACHE_PREFIXES.FILMS}_all`);
  invalidateCacheByPrefix(`${CACHE_PREFIXES.FILMS}_genre`);
}

/**
 * Invalide tout le cache des films
 */
export function invalidateAllFilmsCache() {
  invalidateCacheByPrefix(CACHE_PREFIXES.FILMS);
}

/**
 * Invalide le cache des genres
 */
export function invalidateGenresCache() {
  invalidateCacheByPrefix(CACHE_PREFIXES.GENRES);
}

/**
 * Invalide le cache des recommandations du staff
 * @param {number} filmId - ID du film (optionnel, si non fourni, invalide toutes les recommandations)
 */
export function invalidateStaffPicksCache(filmId) {
  if (filmId) {
    invalidateCache(`${CACHE_PREFIXES.STAFF_PICKS}_film_${filmId}`);
  } else {
    invalidateCacheByPrefix(CACHE_PREFIXES.STAFF_PICKS);
  }
}
