/**
 * Traduction améliorée utilisant TMDB + DeepL
 * - Titre original depuis TMDB
 * - Synopsis en anglais depuis TMDB
 * - "Pourquoi regarder" traduit avec DeepL (contenu custom)
 */

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

/**
 * Récupère les données d'un film depuis TMDB en anglais
 * @param {number} tmdbId - ID TMDB du film
 * @returns {Promise<Object>} Données du film en anglais
 */
async function getTmdbDataInEnglish(tmdbId) {
  if (!tmdbId) {
    return null;
  }

  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/${tmdbId}?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`TMDB API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    return {
      title: data.original_title || data.title,
      synopsis: data.overview || ''
    };
  } catch (error) {
    console.error('Error fetching TMDB data:', error);
    return null;
  }
}

/**
 * Traduit un texte avec DeepL
 * @param {string} text - Texte à traduire
 * @returns {Promise<string>} Texte traduit
 */
async function translateWithDeepL(text) {
  if (!text || text.trim() === '' || !DEEPL_API_KEY) {
    return text;
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
      console.error('DeepL API error');
      return text;
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error translating with DeepL:', error);
    return text;
  }
}

/**
 * Traduit un film en utilisant TMDB + DeepL de manière intelligente
 * @param {Object} film - Film avec tmdb_id, title, synopsis, why_watch_content
 * @returns {Promise<Object>} Traductions
 */
export async function translateFilmEnhanced(film) {
  console.log(`Translating film (enhanced): ${film.title}`);

  const translations = {
    title: '',
    synopsis: '',
    why_watch_content: ''
  };

  try {
    // 1. Essayer de récupérer depuis TMDB
    if (film.tmdb_id) {
      const tmdbData = await getTmdbDataInEnglish(film.tmdb_id);
      
      if (tmdbData) {
        translations.title = tmdbData.title || film.title;
        translations.synopsis = tmdbData.synopsis || '';
        console.log(`  ✅ TMDB: Got title and synopsis`);
      }
    }

    // 2. Si pas de données TMDB, fallback sur DeepL pour titre et synopsis
    if (!translations.title || translations.title === film.title) {
      translations.title = await translateWithDeepL(film.title);
      console.log(`  ⚡ DeepL: Translated title`);
    }

    if (!translations.synopsis) {
      translations.synopsis = await translateWithDeepL(film.synopsis || '');
      console.log(`  ⚡ DeepL: Translated synopsis`);
    }

    // 3. Toujours utiliser DeepL pour "Pourquoi regarder" (contenu custom)
    if (film.why_watch_content) {
      translations.why_watch_content = await translateWithDeepL(film.why_watch_content);
      console.log(`  ⚡ DeepL: Translated why_watch_content`);
    }

    return translations;
  } catch (error) {
    console.error(`Error in translateFilmEnhanced for ${film.id}:`, error);
    // Fallback: retourner les textes originaux
    return {
      title: film.title,
      synopsis: film.synopsis || '',
      why_watch_content: film.why_watch_content || ''
    };
  }
}

/**
 * Estime le nombre de caractères DeepL utilisés
 * (seulement pour ce qui n'est pas récupéré depuis TMDB)
 */
export function estimateDeepLCharacters(film, hasTmdbId) {
  let count = 0;
  
  // Si pas de TMDB ID, on doit traduire titre et synopsis
  if (!hasTmdbId) {
    if (film.title) count += film.title.length;
    if (film.synopsis) count += film.synopsis.length;
  }
  
  // On traduit toujours "Pourquoi regarder"
  if (film.why_watch_content) count += film.why_watch_content.length;
  
  return count;
}
