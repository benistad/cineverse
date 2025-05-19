'use server';

import { createClient } from '@supabase/supabase-js';

// Création du client Supabase côté serveur
const getServerSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
};

/**
 * Récupère tous les films pour le sitemap (version serveur)
 */
export async function getAllFilmsForSitemap() {
  try {
    const supabase = getServerSupabaseClient();
    // Récupérer tous les films, triés par date d'ajout (du plus récent au plus ancien)
    const { data: films, error } = await supabase
      .from('films')
      .select('id, slug, title, date_ajout')
      .order('date_ajout', { ascending: false });

    if (error) throw error;
    if (!films) return [];

    // Générer des slugs pour les films qui n'en ont pas
    const filmsWithSlugs = films.map(film => {
      if (!film.slug) {
        // Créer un slug à partir du titre si disponible, sinon utiliser l'ID
        const slug = film.title 
          ? film.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
              .replace(/\s+/g, '-')     // Remplacer les espaces par des tirets
              .replace(/--+/g, '-')     // Éviter les tirets multiples
          : film.id;
        return { ...film, slug };
      }
      return film;
    });

    return filmsWithSlugs;
  } catch (error) {
    console.error('Erreur lors de la récupération des films pour le sitemap:', error);
    return [];
  }
}
