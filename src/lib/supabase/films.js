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
 * Récupère les films récemment notés avec leur staff remarquable
 * @param {number} limit - Nombre maximum de films à récupérer
 */
export async function getRecentlyRatedFilms(limit = 8) {
  try {
    const supabase = getSupabaseClient();
    // Récupérer les films récents, triés par date d'ajout (du plus récent au plus ancien)
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .order('date_ajout', { ascending: false })
      .limit(limit);

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
    console.error('Erreur lors de la récupération des films récents:', error);
    return [];
  }
}

/**
 * Récupère les films les mieux notés avec leur staff remarquable
 * @param {number} limit - Nombre maximum de films à récupérer
 * @param {number} minRating - Note minimale stricte pour inclure un film (défaut: 6)
 */
export async function getTopRatedFilms(limit = 8, minRating = 6) {
  try {
    const supabase = getSupabaseClient();
    // Récupérer les films avec une note strictement supérieure à minRating, triés par note (de la plus haute à la plus basse)
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .gt('note_sur_10', minRating)
      .order('note_sur_10', { ascending: false })
      .limit(limit);

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
    console.error('Erreur lors de la récupération des films les mieux notés:', error);
    return [];
  }
}

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
 * Récupère un film par son ID TMDB avec son staff remarquable
 */
export async function getFilmByTmdbId(tmdbId) {
  try {
    const supabase = getSupabaseClient();
    // Récupérer le film
    const { data: film, error } = await supabase
      .from('films')
      .select('*')
      .eq('tmdb_id', tmdbId)
      .single();

    if (error) {
      // Si l'erreur est que le film n'existe pas, ce n'est pas une erreur critique
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
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
    console.error(`Erreur lors de la récupération du film avec l'ID TMDB ${tmdbId}:`, error);
    return null;
  }
}

/**
 * Ajoute ou met à jour un film
 */
export async function saveFilm(film) {
  try {
    console.log('Début de saveFilm avec les données:', { ...film, synopsis: film.synopsis?.substring(0, 50) + '...' });
    
    const supabase = getSupabaseClient();
    // Vérifier si le film existe déjà (par tmdb_id)
    console.log('Recherche d\'un film existant avec tmdb_id:', film.tmdb_id);
    
    const { data: existingFilm, error: checkError } = await supabase
      .from('films')
      .select('id')
      .eq('tmdb_id', film.tmdb_id)
      .maybeSingle();

    if (checkError) {
      console.error('Erreur lors de la vérification du film existant:', checkError);
      throw checkError;
    }
    
    console.log('Film existant trouvé:', existingFilm);

    // Nettoyer et valider les données du film avant sauvegarde
    const cleanedFilm = { ...film };
    
    // Nettoyer les URLs d'images
    const imageFields = ['poster_url', 'backdrop_url', 'carousel_image_url'];
    imageFields.forEach(field => {
      if (cleanedFilm[field]) {
        // S'assurer que les URLs sont des chaînes de caractères
        if (typeof cleanedFilm[field] !== 'string') {
          cleanedFilm[field] = String(cleanedFilm[field]);
        }
        
        // Limiter la longueur des URLs pour éviter les erreurs de base de données
        if (cleanedFilm[field].length > 500) {
          console.warn(`${field} est trop long (${cleanedFilm[field].length} caractères), troncature à 500 caractères`);
          cleanedFilm[field] = cleanedFilm[field].substring(0, 500);
        }
      }
    });
    
    // Générer un slug à partir du titre si non fourni
    const filmToSave = {
      ...cleanedFilm,
      slug: cleanedFilm.slug || createSlug(cleanedFilm.title),
      date_ajout: cleanedFilm.date_ajout || new Date().toISOString(),
    };
    
    console.log('Données du film nettoyées et prêtes à sauvegarder:', {
      ...filmToSave,
      synopsis: filmToSave.synopsis?.substring(0, 50) + '...',
      poster_url: filmToSave.poster_url?.substring(0, 50) + '...',
      backdrop_url: filmToSave.backdrop_url?.substring(0, 50) + '...',
      carousel_image_url: filmToSave.carousel_image_url?.substring(0, 50) + '...',
    });

    let result;

    if (existingFilm) {
      console.log('Mise à jour du film existant avec ID:', existingFilm.id);
      
      try {
        // Essayer d'abord de mettre à jour sans l'URL du carrousel
        const filmWithoutCarousel = { ...filmToSave };
        delete filmWithoutCarousel.carousel_image_url;
        
        const { data, error } = await supabase
          .from('films')
          .update(filmWithoutCarousel)
          .eq('id', existingFilm.id)
          .select()
          .single();
        
        if (error) {
          console.error('Erreur lors de la mise à jour du film sans carousel_image_url:', error);
          throw error;
        }
        
        result = data;
        
        // Si l'URL du carrousel existe, essayer de la mettre à jour séparément
        if (filmToSave.carousel_image_url) {
          console.log('Mise à jour de l\'URL du carrousel séparément');
          
          const { error: carouselError } = await supabase
            .from('films')
            .update({ carousel_image_url: filmToSave.carousel_image_url })
            .eq('id', existingFilm.id);
          
          if (carouselError) {
            console.error('Erreur lors de la mise à jour de l\'URL du carrousel:', carouselError);
            // Ne pas faire échouer toute la sauvegarde si seule l'URL du carrousel échoue
            console.warn('La sauvegarde du film a réussi, mais l\'URL du carrousel n\'a pas pu être mise à jour');
          } else {
            console.log('URL du carrousel mise à jour avec succès');
          }
        }
        
        console.log('Film mis à jour avec succès');
      } catch (updateError) {
        console.error('Erreur lors de la mise à jour du film:', updateError);
        throw updateError;
      }
    } else {
      console.log('Insertion d\'un nouveau film');
      
      try {
        // Essayer d'abord d'insérer sans l'URL du carrousel
        const filmWithoutCarousel = { ...filmToSave };
        delete filmWithoutCarousel.carousel_image_url;
        
        const { data, error } = await supabase
          .from('films')
          .insert(filmWithoutCarousel)
          .select()
          .single();
        
        if (error) {
          console.error('Erreur lors de l\'insertion du film sans carousel_image_url:', error);
          throw error;
        }
        
        result = data;
        
        // Si l'URL du carrousel existe, essayer de la mettre à jour séparément
        if (filmToSave.carousel_image_url && result.id) {
          console.log('Mise à jour de l\'URL du carrousel pour le nouveau film');
          
          const { error: carouselError } = await supabase
            .from('films')
            .update({ carousel_image_url: filmToSave.carousel_image_url })
            .eq('id', result.id);
          
          if (carouselError) {
            console.error('Erreur lors de la mise à jour de l\'URL du carrousel pour le nouveau film:', carouselError);
            // Ne pas faire échouer toute la sauvegarde si seule l'URL du carrousel échoue
            console.warn('L\'insertion du film a réussi, mais l\'URL du carrousel n\'a pas pu être mise à jour');
          } else {
            console.log('URL du carrousel mise à jour avec succès pour le nouveau film');
          }
        }
        
        console.log('Nouveau film inséré avec succès');
      } catch (insertError) {
        console.error('Erreur lors de l\'insertion du film:', insertError);
        throw insertError;
      }
    }

    return result;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du film:', error);
    throw error; // Propager l'erreur pour permettre une meilleure gestion dans le composant
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

/**
 * Récupère les films paginés avec leur staff remarquable
 * @param {number} page - Numéro de la page (commence à 1)
 * @param {number} filmsPerPage - Nombre de films par page
 * @returns {Object} - Objet contenant les films et le nombre total de films
 */
export async function getPaginatedFilms(page = 1, filmsPerPage = 8) {
  try {
    const supabase = getSupabaseClient();
    
    // Calculer l'offset pour la pagination
    const offset = (page - 1) * filmsPerPage;
    
    // Récupérer les films pour la page actuelle
    const { data: films, error } = await supabase
      .from('films')
      .select('*', { count: 'exact' })
      .order('title', { ascending: true })
      .range(offset, offset + filmsPerPage - 1);

    if (error) throw error;
    if (!films) return { films: [], totalCount: 0 };

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

    // Récupérer le nombre total de films pour calculer le nombre de pages
    const { count: totalCount, error: countError } = await supabase
      .from('films')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    return {
      films: filmsWithStaff,
      totalCount: totalCount || 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des films paginés:', error);
    return { films: [], totalCount: 0 };
  }
}

/**
 * Récupère les films marqués comme "Films méconnus à voir"
 * @param {number} limit - Nombre maximum de films à récupérer
 */
export async function getHiddenGems(limit = 8) {
  try {
    const supabase = getSupabaseClient();
    // Récupérer les films marqués comme "Films méconnus à voir"
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .eq('is_hidden_gem', true)
      .order('date_ajout', { ascending: false })
      .limit(limit);

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
    console.error('Erreur lors de la récupération des films méconnus:', error);
    return [];
  }
}

/**
 * Récupère les derniers films avec une note supérieure à un seuil donné
 * Utilisé pour le carrousel de la page d'accueil
 * @param {number} limit - Nombre maximum de films à récupérer
 * @param {number} minRating - Note minimale des films à récupérer
 * @param {number} timestamp - Timestamp pour forcer le rechargement des données
 * @returns {Array} - Liste des films récupérés
 */
export async function getFeaturedFilms(limit = 5, minRating = 6, timestamp = null) {
  try {
    console.log(`Récupération des films en vedette (limit: ${limit}, minRating: ${minRating}, timestamp: ${timestamp || 'non spécifié'})...`);
    
    const supabase = getSupabaseClient();
    
    // Requête simple sans options de cache qui ne sont pas supportées
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .gte('note_sur_10', minRating)
      .order('date_ajout', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la récupération des films en vedette:', error);
      throw error;
    }
    
    console.log(`${data ? data.length : 0} films en vedette récupérés`);
    
    // Vérifier si les films ont des images de carrousel
    if (data && data.length > 0) {
      data.forEach(film => {
        console.log(`Film: ${film.title}, ID: ${film.id}, carousel_image_url: ${film.carousel_image_url || 'non définie'}`);
      });
    } else {
      console.log('Aucun film récupéré');
    }
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des films bien notés:', error);
    return [];
  }
}

/**
 * Récupère le nombre total de films les mieux notés
 * @param {number} minRating - Note minimale stricte pour inclure un film (défaut: 6)
 * @returns {number} - Nombre total de films les mieux notés
 */
export async function getTopRatedFilmsCount(minRating = 6) {
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
}

/**
 * Récupère le nombre total de films méconnus à voir
 * @returns {number} - Nombre total de films méconnus à voir
 */
export async function getHiddenGemsCount() {
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
}

/**
 * Recherche des films par terme de recherche
 * @param {string} searchTerm - Terme de recherche
 * @returns {Array} - Liste des films correspondant au terme de recherche
 */
export async function searchFilms(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }
    
    const supabase = getSupabaseClient();
    const formattedSearchTerm = searchTerm.trim().toLowerCase();
    
    // Recherche dans le titre, le synopsis et les genres
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .or(
        `title.ilike.%${formattedSearchTerm}%,` +
        `synopsis.ilike.%${formattedSearchTerm}%,` +
        `genres.ilike.%${formattedSearchTerm}%`
      )
      .order('title', { ascending: true });

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
    console.error('Erreur lors de la recherche de films:', error);
    return [];
  }
}
