/**
 * Helpers côté client pour appliquer les traductions aux films
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Applique les traductions à une liste de films
 * @param {Array<Object>} films - Liste des films
 * @param {string} locale - Locale (fr ou en)
 * @returns {Promise<Array<Object>>} Films avec traductions appliquées
 */
export async function applyTranslationsToFilms(films, locale = 'fr') {
  if (!films || films.length === 0 || locale === 'fr') {
    return films;
  }

  try {
    // Récupérer toutes les traductions en une seule requête
    const filmIds = films.map(f => f.id);
    const { data: translations, error } = await supabase
      .from('film_translations')
      .select('*')
      .in('film_id', filmIds)
      .eq('locale', locale);

    if (error) {
      console.error('Error fetching translations:', error);
      return films;
    }

    if (!translations || translations.length === 0) {
      return films;
    }

    // Créer un map des traductions par film_id
    const translationsMap = new Map(
      translations.map(t => [t.film_id, t])
    );

    // Fusionner chaque film avec sa traduction
    return films.map(film => {
      const translation = translationsMap.get(film.id);
      if (translation) {
        return {
          ...film,
          title: translation.title || film.title,
          synopsis: translation.synopsis || film.synopsis,
          why_watch_content: translation.why_watch_content || film.why_watch_content,
          what_we_didnt_like: translation.what_we_didnt_like || film.what_we_didnt_like,
          _hasTranslation: true
        };
      }
      return { ...film, _hasTranslation: false };
    });
  } catch (error) {
    console.error('Error applying translations:', error);
    return films;
  }
}

/**
 * Applique la traduction à un seul film
 * @param {Object} film - Film
 * @param {string} locale - Locale (fr ou en)
 * @returns {Promise<Object>} Film avec traduction appliquée
 */
export async function applyTranslationToFilm(film, locale = 'fr') {
  if (!film || locale === 'fr') {
    return film;
  }

  try {
    const { data: translation, error } = await supabase
      .from('film_translations')
      .select('*')
      .eq('film_id', film.id)
      .eq('locale', locale)
      .single();

    if (error || !translation) {
      return { ...film, _hasTranslation: false };
    }

    return {
      ...film,
      title: translation.title || film.title,
      synopsis: translation.synopsis || film.synopsis,
      why_watch_content: translation.why_watch_content || film.why_watch_content,
      what_we_didnt_like: translation.what_we_didnt_like || film.what_we_didnt_like,
      _hasTranslation: true
    };
  } catch (error) {
    console.error('Error applying translation:', error);
    return { ...film, _hasTranslation: false };
  }
}
