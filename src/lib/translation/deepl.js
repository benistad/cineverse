/**
 * Service de traduction DeepL
 * Traduit automatiquement le contenu des films du français vers l'anglais
 */

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

/**
 * Traduit un texte du français vers l'anglais avec DeepL
 * @param {string} text - Texte à traduire
 * @returns {Promise<string>} Texte traduit
 */
export async function translateText(text) {
  if (!text || text.trim() === '') {
    return '';
  }

  if (!DEEPL_API_KEY) {
    console.warn('DeepL API key not configured. Skipping translation.');
    return text; // Retourner le texte original si pas de clé
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text: text,
        source_lang: 'FR',
        target_lang: 'EN-US',
        formality: 'default',
        preserve_formatting: '1'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepL API error:', error);
      return text; // Retourner le texte original en cas d'erreur
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Retourner le texte original en cas d'erreur
  }
}

/**
 * Traduit tout le contenu d'un film
 * @param {Object} film - Objet film avec title, synopsis, etc.
 * @returns {Promise<Object>} Objet avec les traductions
 */
export async function translateFilmContent(film) {
  console.log(`Translating film: ${film.title}`);

  try {
    // Traduire tous les champs en parallèle pour optimiser les performances
    const [
      translatedTitle,
      translatedSynopsis,
      translatedWhyWatch,
      translatedWhatWeDidntLike
    ] = await Promise.all([
      translateText(film.title || ''),
      translateText(film.synopsis || ''),
      translateText(film.why_watch_content || ''),
      translateText(film.what_we_didnt_like || '')
    ]);

    return {
      title: translatedTitle,
      synopsis: translatedSynopsis,
      why_watch_content: translatedWhyWatch,
      what_we_didnt_like: translatedWhatWeDidntLike
    };
  } catch (error) {
    console.error(`Error translating film ${film.id}:`, error);
    throw error;
  }
}

/**
 * Traduit le contenu du staff remarquable
 * @param {string} description - Description du staff
 * @returns {Promise<string>} Description traduite
 */
export async function translateStaffDescription(description) {
  return translateText(description);
}

/**
 * Vérifie si la clé API DeepL est configurée
 * @returns {boolean}
 */
export function isDeepLConfigured() {
  return !!DEEPL_API_KEY;
}

/**
 * Estime le nombre de caractères à traduire pour un film
 * @param {Object} film - Objet film
 * @returns {number} Nombre de caractères
 */
export function estimateCharacterCount(film) {
  let count = 0;
  if (film.title) count += film.title.length;
  if (film.synopsis) count += film.synopsis.length;
  if (film.why_watch_content) count += film.why_watch_content.length;
  if (film.what_we_didnt_like) count += film.what_we_didnt_like.length;
  return count;
}
