import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

// Client Supabase côté serveur
const getServerSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
};

/**
 * Récupère les films récemment notés (version serveur avec cache)
 */
export const getRecentlyRatedFilmsServer = unstable_cache(
  async (limit = 8) => {
    try {
      const supabase = getServerSupabase();
      
      const { data: films, error } = await supabase
        .from('films')
        .select('*')
        .order('date_ajout', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return films || [];
    } catch (error) {
      console.error('Erreur getRecentlyRatedFilmsServer:', error);
      return [];
    }
  },
  ['recent-films'],
  { revalidate: 3600, tags: ['homepage'] }
);

/**
 * Récupère les films les mieux notés (version serveur avec cache)
 */
export const getTopRatedFilmsServer = unstable_cache(
  async (limit = 10, minRating = 6) => {
    try {
      const supabase = getServerSupabase();
      
      const { data: films, error } = await supabase
        .from('films')
        .select('*')
        .gt('note_sur_10', minRating)
        .order('note_sur_10', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return films || [];
    } catch (error) {
      console.error('Erreur getTopRatedFilmsServer:', error);
      return [];
    }
  },
  ['top-rated-films'],
  { revalidate: 3600, tags: ['homepage'] }
);

/**
 * Récupère les films méconnus (version serveur avec cache)
 */
export const getHiddenGemsServer = unstable_cache(
  async (limit = 8) => {
    try {
      const supabase = getServerSupabase();
      
      const { data: films, error } = await supabase
        .from('films')
        .select('*')
        .eq('is_hidden_gem', true)
        .order('date_ajout', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return films || [];
    } catch (error) {
      console.error('Erreur getHiddenGemsServer:', error);
      return [];
    }
  },
  ['hidden-gems'],
  { revalidate: 3600, tags: ['homepage'] }
);

/**
 * Récupère les films en vedette pour le carrousel (version serveur avec cache)
 */
export const getFeaturedFilmsServer = unstable_cache(
  async (limit = 5, minRating = 6) => {
    try {
      const supabase = getServerSupabase();
      
      const { data: films, error } = await supabase
        .from('films')
        .select('*')
        .gt('note_sur_10', minRating)
        .not('carousel_image_url', 'is', null)
        .order('date_ajout', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Si pas assez de films avec carousel_image_url, compléter avec les mieux notés
      if (!films || films.length < limit) {
        const { data: topFilms } = await supabase
          .from('films')
          .select('*')
          .gt('note_sur_10', minRating)
          .order('note_sur_10', { ascending: false })
          .limit(limit);
        
        return topFilms || [];
      }
      
      return films;
    } catch (error) {
      console.error('Erreur getFeaturedFilmsServer:', error);
      return [];
    }
  },
  ['featured-films'],
  { revalidate: 3600, tags: ['homepage'] }
);

/**
 * Récupère les compteurs (version serveur avec cache)
 */
export const getFilmCountsServer = unstable_cache(
  async () => {
    try {
      const supabase = getServerSupabase();
      
      const [totalResult, topRatedResult, hiddenGemsResult] = await Promise.all([
        supabase.from('films').select('*', { count: 'exact', head: true }),
        supabase.from('films').select('*', { count: 'exact', head: true }).gt('note_sur_10', 6),
        supabase.from('films').select('*', { count: 'exact', head: true }).eq('is_hidden_gem', true)
      ]);
      
      return {
        total: totalResult.count || 0,
        topRated: topRatedResult.count || 0,
        hiddenGems: hiddenGemsResult.count || 0
      };
    } catch (error) {
      console.error('Erreur getFilmCountsServer:', error);
      return { total: 0, topRated: 0, hiddenGems: 0 };
    }
  },
  ['film-counts'],
  { revalidate: 3600, tags: ['homepage'] }
);

/**
 * Récupère les films paginés (version serveur avec cache)
 */
export const getPaginatedFilmsServer = unstable_cache(
  async (page = 1, limit = 8) => {
    try {
      const supabase = getServerSupabase();
      const offset = (page - 1) * limit;
      
      const { data: films, error, count } = await supabase
        .from('films')
        .select('*', { count: 'exact' })
        .order('date_ajout', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      return {
        films: films || [],
        totalCount: count || 0
      };
    } catch (error) {
      console.error('Erreur getPaginatedFilmsServer:', error);
      return { films: [], totalCount: 0 };
    }
  },
  ['paginated-films'],
  { revalidate: 3600, tags: ['homepage'] }
);
