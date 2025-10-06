import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase pour les opérations côté serveur
 * Utilisé pour le rendu SSR et les Server Components
 */
const getServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

/**
 * Récupère les films en vedette pour le carrousel (version serveur)
 * @param {number} minRating - Note minimale pour être en vedette
 * @param {number} limit - Nombre de films à récupérer
 */
export async function getFeaturedFilmsServer(minRating = 5, limit = 6) {
  try {
    const supabase = getServerSupabaseClient();
    
    const { data: films, error } = await supabase
      .from('films')
      .select('id, title, slug, note_sur_10, genres, release_date, carousel_image_url, backdrop_url, backdrop_path, poster_url, poster_path, is_hunted_by_moviehunt')
      .gte('note_sur_10', minRating)
      .not('carousel_image_url', 'is', null)
      .order('note_sur_10', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la récupération des films en vedette (serveur):', error);
      return [];
    }

    return films || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des films en vedette (serveur):', error);
    return [];
  }
}

/**
 * Récupère les films récemment notés (version serveur)
 * @param {number} limit - Nombre de films à récupérer
 */
export async function getRecentlyRatedFilmsServer(limit = 8) {
  try {
    const supabase = getServerSupabaseClient();
    
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .order('date_ajout', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la récupération des films récents (serveur):', error);
      return [];
    }

    if (!films || films.length === 0) return [];

    // Récupérer le staff pour tous les films en une seule requête
    const filmIds = films.map(film => film.id);
    const { data: allStaff, error: staffError } = await supabase
      .from('remarkable_staff')
      .select('*')
      .in('film_id', filmIds);

    if (staffError) {
      console.error('Erreur lors de la récupération du staff (serveur):', staffError);
      return films.map(film => ({ ...film, remarkable_staff: [] }));
    }

    // Associer le staff à chaque film
    const filmsWithStaff = films.map(film => ({
      ...film,
      remarkable_staff: allStaff?.filter(staff => staff.film_id === film.id) || []
    }));

    return filmsWithStaff;
  } catch (error) {
    console.error('Erreur lors de la récupération des films récents (serveur):', error);
    return [];
  }
}
