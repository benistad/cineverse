'use client';

import { createBrowserClient } from '@supabase/ssr';

// Création du client Supabase côté client
const getSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
};

// Fonction utilitaire pour créer un slug à partir d'un titre
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

/**
 * Récupère tous les films avec leur staff remarquable
 */
export async function getAllFilms() {
  try {
    const supabase = getSupabaseClient();
    // Récupérer tous les films, triés par date d'ajout (du plus récent au plus ancien)
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .order('date_ajout', { ascending: false });

    if (error) throw error;
    if (!films) return [];

    // Pour chaque film, récupérer son staff remarquable
    const filmsWithStaff = await Promise.all(
      films.map(async (film) => {
        const supabase = getSupabaseClient();
        const { data: staff, error: staffError } = await supabase
          .from('remarkable_staff')
          .select('*')
          .eq('film_id', film.id);

        if (staffError) {
          console.error(`Erreur lors de la récupération du staff pour le film ${film.id}:`, staffError);
          return { ...film, remarkable_staff: [] };
        }

        return {
          ...film,
          remarkable_staff: staff || [],
        };
      })
    );

    return filmsWithStaff;
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return [];
  }
}

/**
 * Récupère un film par son ID avec son staff remarquable
 */
export async function getFilmById(id) {
  try {
    const supabase = getSupabaseClient();
    // Récupérer le film
    const { data: film, error } = await supabase
      .from('films')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!film) return null;

    // Récupérer le staff remarquable du film
    const { data: staff, error: staffError } = await supabase
      .from('remarkable_staff')
      .select('*')
      .eq('film_id', film.id);

    if (staffError) throw staffError;

    return {
      ...film,
      remarkable_staff: staff || [],
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du film ${id}:`, error);
    return null;
  }
}

/**
 * Récupère un film par son slug avec son staff remarquable
 */
export async function getFilmBySlug(slug) {
  try {
    const supabase = getSupabaseClient();
    // Récupérer le film
    const { data: film, error } = await supabase
      .from('films')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!film) return null;

    // Récupérer le staff remarquable du film
    const { data: staff, error: staffError } = await supabase
      .from('remarkable_staff')
      .select('*')
      .eq('film_id', film.id);

    if (staffError) throw staffError;

    return {
      ...film,
      remarkable_staff: staff || [],
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du film avec le slug ${slug}:`, error);
    return null;
  }
}

/**
 * Ajoute ou met à jour un film
 */
export async function saveFilm(film) {
  try {
    const supabase = getSupabaseClient();
    // Vérifier si le film existe déjà (par tmdb_id)
    const { data: existingFilm, error: checkError } = await supabase
      .from('films')
      .select('id')
      .eq('tmdb_id', film.tmdb_id)
      .maybeSingle();

    if (checkError) throw checkError;

    // Générer un slug à partir du titre si non fourni
    const filmToSave = {
      ...film,
      slug: film.slug || createSlug(film.title),
      date_ajout: film.date_ajout || new Date().toISOString(),
    };

    let result;

    if (existingFilm) {
      // Mettre à jour le film existant
      const { data, error } = await supabase
        .from('films')
        .update(filmToSave)
        .eq('id', existingFilm.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insérer un nouveau film
      const { data, error } = await supabase
        .from('films')
        .insert(filmToSave)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du film:', error);
    return null;
  }
}

/**
 * Ajoute ou met à jour un membre du staff remarquable
 */
export async function saveRemarkableStaff(staffMember) {
  try {
    const supabase = getSupabaseClient();
    // Vérifier si ce membre du staff avec ce rôle spécifique existe déjà pour ce film
    const { data: existingStaff, error: checkError } = await supabase
      .from('remarkable_staff')
      .select('id')
      .eq('film_id', staffMember.film_id)
      .eq('nom', staffMember.nom)
      .eq('role', staffMember.role) // Ajouter la vérification du rôle
      .maybeSingle();

    if (checkError) throw checkError;

    let result;

    if (existingStaff) {
      // Mettre à jour le membre du staff existant avec ce rôle spécifique
      const { data, error } = await supabase
        .from('remarkable_staff')
        .update(staffMember)
        .eq('id', existingStaff.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insérer un nouveau membre du staff avec ce rôle
      const { data, error } = await supabase
        .from('remarkable_staff')
        .insert(staffMember)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du membre du staff:', error);
    return null;
  }
}

/**
 * Supprime un film et son staff remarquable
 */
export async function deleteFilm(id) {
  try {
    const supabase = getSupabaseClient();
    // Supprimer d'abord le staff remarquable associé au film
    const { error: staffError } = await supabase
      .from('remarkable_staff')
      .delete()
      .eq('film_id', id);

    if (staffError) throw staffError;

    // Supprimer ensuite le film
    const { error } = await supabase
      .from('films')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du film ${id}:`, error);
    return false;
  }
}

/**
 * Supprime un membre du staff remarquable
 */
export async function deleteRemarkableStaff(id) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('remarkable_staff')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du membre du staff ${id}:`, error);
    return false;
  }
}
