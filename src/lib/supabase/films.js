'use client';

import { createBrowserClient } from '@supabase/ssr';
import { withCache } from '@/lib/cache/supabaseCache';
import { slugify } from '@/lib/utils/slugify';

// Création du client Supabase côté client
const getSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
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
 * Récupère les films récemment notés avec leur staff remarquable
 * @param {number} limit - Nombre maximum de films à récupérer
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 */
export async function getRecentlyRatedFilms(limit = 8, locale = 'fr') {
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

    // Pour chaque film, récupérer son staff remarquable et enrichir avec TMDB si en anglais
    const filmsWithStaff = await Promise.all(
      films.map(async (film) => {
        const supabase = getSupabaseClient();
        const { data: staff, error: staffError } = await supabase
          .from('remarkable_staff')
          .select('*')
          .eq('film_id', film.id);

        if (staffError) {
          console.error(`Erreur lors de la récupération du staff pour le film ${film.id}:`, staffError);
        }

        let enrichedFilm = {
          ...film,
          remarkable_staff: staff || [],
        };

        // Si la langue est anglaise, enrichir avec les données TMDB
        if (locale === 'en') {
          enrichedFilm = await enrichFilmWithTMDB(enrichedFilm);
        }

        return enrichedFilm;
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
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 */
export async function getTopRatedFilms(limit = 8, minRating = 6, locale = 'fr') {
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

    // Pour chaque film, récupérer son staff remarquable et enrichir avec TMDB si en anglais
    const filmsWithStaff = await Promise.all(
      films.map(async (film) => {
        const supabase = getSupabaseClient();
        const { data: staff, error: staffError } = await supabase
          .from('remarkable_staff')
          .select('*')
          .eq('film_id', film.id);

        if (staffError) {
          console.error(`Erreur lors de la récupération du staff pour le film ${film.id}:`, staffError);
        }

        let enrichedFilm = {
          ...film,
          remarkable_staff: staff || [],
        };

        // Si la langue est anglaise, enrichir avec les données TMDB
        if (locale === 'en') {
          enrichedFilm = await enrichFilmWithTMDB(enrichedFilm);
        }

        return enrichedFilm;
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
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 */
export async function getAllFilms(locale = 'fr') {
  try {
    const supabase = getSupabaseClient();
    // Récupérer tous les films, triés par date d'ajout (du plus récent au plus ancien)
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .order('date_ajout', { ascending: false });

    if (error) throw error;
    if (!films) return [];

    // Pour chaque film, récupérer son staff remarquable et enrichir avec TMDB si en anglais
    const filmsWithStaff = await Promise.all(
      films.map(async (film) => {
        const supabase = getSupabaseClient();
        const { data: staff, error: staffError } = await supabase
          .from('remarkable_staff')
          .select('*')
          .eq('film_id', film.id);

        if (staffError) {
          console.error(`Erreur lors de la récupération du staff pour le film ${film.id}:`, staffError);
        }

        let enrichedFilm = {
          ...film,
          remarkable_staff: staff || [],
        };

        // Si la langue est anglaise, enrichir avec les données TMDB
        if (locale === 'en') {
          enrichedFilm = await enrichFilmWithTMDB(enrichedFilm);
        }

        return enrichedFilm;
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
    console.log(`Début de getFilmByTmdbId pour tmdbId: ${tmdbId}`);
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
    
    // Amélioration de la requête pour éviter les erreurs 406
    const { data: existingFilm, error: checkError } = await supabase
      .from('films')
      .select('id')
      .eq('tmdb_id', film.tmdb_id)
      .limit(1)
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
        
        // Vérifier si l'URL est valide
        try {
          new URL(cleanedFilm[field]);
        } catch {
          // Si l'URL commence par un slash, on suppose que c'est un chemin relatif
          if (cleanedFilm[field].startsWith('/')) {
            cleanedFilm[field] = `https://image.tmdb.org/t/p/original${cleanedFilm[field]}`;
          } else {
            // Si ce n'est pas une URL valide et ne commence pas par un slash, on la supprime
            cleanedFilm[field] = null;
          }
        }
        
        // Limiter la longueur des URLs pour éviter les erreurs de base de données
        if (cleanedFilm[field] && cleanedFilm[field].length > 500) {
          console.warn(`${field} est trop long (${cleanedFilm[field].length} caractères), troncature à 500 caractères`);
          cleanedFilm[field] = cleanedFilm[field].substring(0, 500);
        }
      }
    });
    
    // Générer un slug normalisé (sans accents) à partir du titre
    const filmToSave = {
      ...cleanedFilm,
      slug: slugify(cleanedFilm.title),
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
        // Ne sélectionner que les champs essentiels pour éviter les erreurs 400
        const essentialFields = {
          title: filmToSave.title,
          slug: filmToSave.slug,
          synopsis: filmToSave.synopsis,
          poster_url: filmToSave.poster_url,
          backdrop_url: filmToSave.backdrop_url,
          note_sur_10: filmToSave.note_sur_10,
          youtube_trailer_key: filmToSave.youtube_trailer_key,
          why_watch_enabled: filmToSave.why_watch_enabled,
          why_watch_content: filmToSave.why_watch_content,
          not_liked_enabled: filmToSave.not_liked_enabled,
          not_liked_content: filmToSave.not_liked_content,
          is_hidden_gem: filmToSave.is_hidden_gem,
          is_hunted_by_moviehunt: filmToSave.is_hunted_by_moviehunt,
          blog_article_url: filmToSave.blog_article_url,
          genres: filmToSave.genres,
          release_date: filmToSave.release_date
        };
        
        console.log('Mise à jour du film avec les champs essentiels uniquement');
        console.log('Valeur is_hunted_by_moviehunt:', essentialFields.is_hunted_by_moviehunt);
        
        const { data, error } = await supabase
          .from('films')
          .update(essentialFields)
          .eq('id', existingFilm.id)
          .select()
          .single();
        
        if (error) {
          console.error('Erreur lors de la mise à jour du film:', error);
          throw error;
        }
        
        result = data;
        console.log('Film mis à jour avec succès, y compris is_hunted_by_moviehunt:', data.is_hunted_by_moviehunt);
        
        console.log('Film mis à jour avec succès');
      } catch (updateError) {
        console.error('Erreur lors de la mise à jour du film:', updateError);
        throw updateError;
      }
    } else {
      console.log('Insertion d\'un nouveau film');
      
      try {
        // Vérifier et nettoyer les données avant insertion
        const cleanedFilmToSave = { ...filmToSave };
        
        // S'assurer que tmdb_id est un nombre
        if (cleanedFilmToSave.tmdb_id && typeof cleanedFilmToSave.tmdb_id !== 'number') {
          cleanedFilmToSave.tmdb_id = parseInt(cleanedFilmToSave.tmdb_id, 10);
          if (isNaN(cleanedFilmToSave.tmdb_id)) {
            console.error('tmdb_id invalide, conversion impossible');
            throw new Error('tmdb_id invalide');
          }
        }
        
        // Essayer d'insérer sans l'URL du carrousel pour éviter les problèmes
        const filmWithoutCarousel = { ...cleanedFilmToSave };
        delete filmWithoutCarousel.carousel_image_url;
        
        console.log('Insertion du film avec les données:', filmWithoutCarousel);
        
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
        console.log('Film inséré avec succès, ID:', result.id);
        
        // Si l'URL du carrousel existe, essayer de la mettre à jour séparément
        if (cleanedFilmToSave.carousel_image_url && result.id) {
          console.log('Mise à jour de l\'URL du carrousel pour le nouveau film');
          
          // Vérifier que l'URL du carrousel est valide
          let carouselUrl = cleanedFilmToSave.carousel_image_url;
          try {
            new URL(carouselUrl);
          } catch {
            if (carouselUrl.startsWith('/')) {
              carouselUrl = `https://image.tmdb.org/t/p/original${carouselUrl}`;
            } else {
              carouselUrl = null;
            }
          }
          
          if (carouselUrl) {
            const { error: carouselError } = await supabase
              .from('films')
              .update({ carousel_image_url: carouselUrl })
              .eq('id', result.id);
            
            if (carouselError) {
              console.error('Erreur lors de la mise à jour de l\'URL du carrousel pour le nouveau film:', carouselError);
              // Ne pas faire échouer toute la sauvegarde si seule l'URL du carrousel échoue
              console.warn('L\'insertion du film a réussi, mais l\'URL du carrousel n\'a pas pu être mise à jour');
            } else {
              console.log('URL du carrousel mise à jour avec succès pour le nouveau film');
            }
          } else {
            console.warn('URL du carrousel invalide, mise à jour ignorée');
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
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 * @returns {Object} - Objet contenant les films et le nombre total de films
 */
export async function getPaginatedFilms(page = 1, filmsPerPage = 8, locale = 'fr') {
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

    // Pour chaque film, récupérer son staff remarquable et enrichir avec TMDB si en anglais
    const filmsWithStaff = await Promise.all(
      films.map(async (film) => {
        const supabase = getSupabaseClient();
        const { data: staff, error: staffError } = await supabase
          .from('remarkable_staff')
          .select('*')
          .eq('film_id', film.id);

        if (staffError) {
          console.error(`Erreur lors de la récupération du staff pour le film ${film.id}:`, staffError);
        }

        let enrichedFilm = {
          ...film,
          remarkable_staff: staff || [],
        };

        // Si la langue est anglaise, enrichir avec les données TMDB
        if (locale === 'en') {
          enrichedFilm = await enrichFilmWithTMDB(enrichedFilm);
        }

        return enrichedFilm;
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
 * Récupère les films marqués comme "Films inconnus à voir"
 * @param {number} limit - Nombre maximum de films à récupérer
 * @param {string} locale - Langue pour les données (défaut: 'fr')
 */
export async function getHiddenGems(limit = 8, locale = 'fr') {
  try {
    const supabase = getSupabaseClient();
    // Récupérer les films marqués comme "Films inconnus à voir"
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .eq('is_hidden_gem', true)
      .order('date_ajout', { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!films) return [];

    // Pour chaque film, récupérer son staff remarquable et enrichir avec TMDB si en anglais
    const filmsWithStaff = await Promise.all(
      films.map(async (film) => {
        const supabase = getSupabaseClient();
        const { data: staff, error: staffError } = await supabase
          .from('remarkable_staff')
          .select('*')
          .eq('film_id', film.id);

        if (staffError) {
          console.error(`Erreur lors de la récupération du staff pour le film ${film.id}:`, staffError);
        }

        let enrichedFilm = {
          ...film,
          remarkable_staff: staff || [],
        };

        // Si la langue est anglaise, enrichir avec les données TMDB
        if (locale === 'en') {
          enrichedFilm = await enrichFilmWithTMDB(enrichedFilm);
        }

        return enrichedFilm;
      })
    );

    return filmsWithStaff;
  } catch (error) {
    console.error('Erreur lors de la récupération des films inconnus à voir:', error);
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
  return withCache('getFeaturedFilms', { limit, minRating }, async () => {
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
  });
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
 * Récupère le nombre total de films inconnus à voir
 * @returns {number} - Nombre total de films inconnus à voir
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
    console.error('Erreur lors du comptage des films inconnus à voir:', error);
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
