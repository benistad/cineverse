import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Récupère la locale actuelle depuis les cookies
 */
export async function getCurrentLocale() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  return localeCookie?.value || 'fr';
}

/**
 * Récupère un film avec sa traduction
 * @param {string} filmId - ID du film
 * @param {string} locale - Locale (fr ou en)
 * @returns {Promise<Object>} Film avec traduction si disponible
 */
export async function getFilmWithTranslation(filmId, locale = 'fr') {
  const supabase = await createClient();
  
  // Récupérer le film
  const { data: film, error } = await supabase
    .from('films')
    .select('*')
    .eq('id', filmId)
    .single();
  
  if (error || !film) {
    return null;
  }
  
  // Si la locale est 'fr', retourner directement le film
  if (locale === 'fr') {
    return film;
  }
  
  // Sinon, récupérer la traduction
  const { data: translation } = await supabase
    .from('film_translations')
    .select('*')
    .eq('film_id', filmId)
    .eq('locale', locale)
    .single();
  
  // Fusionner le film avec sa traduction
  if (translation) {
    return {
      ...film,
      title: translation.title || film.title,
      synopsis: translation.synopsis || film.synopsis,
      why_watch_content: translation.why_watch_content || film.why_watch_content,
      what_we_didnt_like: translation.what_we_didnt_like || film.what_we_didnt_like
    };
  }
  
  return film;
}

/**
 * Récupère plusieurs films avec leurs traductions
 * @param {Array<string>} filmIds - IDs des films
 * @param {string} locale - Langue souhaitée (fr ou en)
 * @returns {Promise<Array>} Films avec traductions appliquées
 */
export async function getFilmsWithTranslations(filmIds, locale = null) {
  const supabase = await createClient();
  const currentLocale = locale || await getCurrentLocale();

  // Récupérer les films
  const { data: films, error: filmsError } = await supabase
    .from('films')
    .select('*')
    .in('id', filmIds);

  if (filmsError || !films) {
    return [];
  }

  // Si la langue est le français, retourner directement les films
  if (currentLocale === 'fr') {
    return films;
  }

  // Récupérer toutes les traductions en une seule requête
  const { data: translations } = await supabase
    .from('film_translations')
    .select('*')
    .in('film_id', filmIds)
    .eq('locale', currentLocale);

  // Créer un map des traductions par film_id
  const translationsMap = {};
  if (translations) {
    translations.forEach(t => {
      translationsMap[t.film_id] = t;
    });
  }

  // Appliquer les traductions
  return films.map(film => {
    const translation = translationsMap[film.id];
    if (translation) {
      return {
        ...film,
        title: translation.title || film.title,
        synopsis: translation.synopsis || film.synopsis,
        why_watch_content: translation.why_watch_content || film.why_watch_content,
        what_we_didnt_like: translation.what_we_didnt_like || film.what_we_didnt_like,
        _translation: translation,
      };
    }
    return film;
  });
}

/**
 * Récupère le staff remarquable avec traductions
 * @param {string} filmId - ID du film
 * @param {string} locale - Langue souhaitée (fr ou en)
 * @returns {Promise<Array>} Staff avec traductions appliquées
 */
export async function getStaffWithTranslations(filmId, locale = null) {
  const supabase = await createClient();
  const currentLocale = locale || await getCurrentLocale();

  // Récupérer le staff
  const { data: staff, error: staffError } = await supabase
    .from('remarkable_staff')
    .select('*')
    .eq('film_id', filmId)
    .order('order_index', { ascending: true });

  if (staffError || !staff) {
    return [];
  }

  // Si la langue est le français, retourner directement le staff
  if (currentLocale === 'fr') {
    return staff;
  }

  // Récupérer les traductions
  const staffIds = staff.map(s => s.id);
  const { data: translations } = await supabase
    .from('staff_translations')
    .select('*')
    .in('staff_id', staffIds)
    .eq('locale', currentLocale);

  // Créer un map des traductions
  const translationsMap = {};
  if (translations) {
    translations.forEach(t => {
      translationsMap[t.staff_id] = t;
    });
  }

  // Appliquer les traductions
  return staff.map(member => {
    const translation = translationsMap[member.id];
    if (translation) {
      return {
        ...member,
        description: translation.description || member.description,
        _translation: translation,
      };
    }
    return member;
  });
}

/**
 * Sauvegarde ou met à jour une traduction de film
 * @param {string} filmId - ID du film
 * @param {string} locale - Langue (fr ou en)
 * @param {Object} translationData - Données de traduction
 * @returns {Promise<Object>} Traduction sauvegardée
 */
export async function saveFilmTranslation(filmId, locale, translationData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('film_translations')
    .upsert({
      film_id: filmId,
      locale,
      ...translationData,
    }, {
      onConflict: 'film_id,locale'
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sauvegarde ou met à jour une traduction de staff
 * @param {string} staffId - ID du membre du staff
 * @param {string} locale - Langue (fr ou en)
 * @param {Object} translationData - Données de traduction
 * @returns {Promise<Object>} Traduction sauvegardée
 */
export async function saveStaffTranslation(staffId, locale, translationData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('staff_translations')
    .upsert({
      staff_id: staffId,
      locale,
      ...translationData,
    }, {
      onConflict: 'staff_id,locale'
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
