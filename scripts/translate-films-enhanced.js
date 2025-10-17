/**
 * Script de traduction amélioré utilisant TMDB + DeepL
 * - Récupère les titres originaux et synopsis depuis TMDB
 * - Utilise DeepL uniquement pour le contenu custom
 * Usage: node scripts/translate-films-enhanced.js
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Polyfill fetch pour Node.js
global.fetch = fetch;

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTFmYzFkODkzNTExZjgwYTBjNmI0YzRkZTE2MWM1MSIsIm5iZiI6MTc0NjUxNTA1NC4yODE5OTk4LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hj-9KXl-h5-7CtFhFSC6V4NJE__c1ozx5OnrETtCS9c';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

if (!DEEPL_API_KEY) {
  console.error('❌ DeepL API key not found in .env.local');
  console.error('Note: DeepL will be used only for custom content');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Statistiques
const stats = {
  total: 0,
  fromTMDB: 0,
  fromDeepL: 0,
  deepLCharacters: 0,
  errors: 0
};

/**
 * Récupère les données TMDB en anglais
 */
async function getTmdbDataInEnglish(tmdbId) {
  if (!tmdbId) return null;

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
      return null;
    }

    const data = await response.json();
    return {
      title: data.original_title || data.title,
      synopsis: data.overview || ''
    };
  } catch (error) {
    return null;
  }
}

/**
 * Traduit avec DeepL
 */
async function translateWithDeepL(text) {
  if (!text || text.trim() === '' || !DEEPL_API_KEY) {
    return text;
  }

  stats.deepLCharacters += text.length;

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
      return text;
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    return text;
  }
}

/**
 * Traduit un film de manière intelligente
 */
async function translateFilmEnhanced(film) {
  const translations = {
    title: '',
    synopsis: '',
    why_watch_content: ''
  };

  let usedTMDB = false;

  // 1. Essayer TMDB d'abord
  if (film.tmdb_id) {
    const tmdbData = await getTmdbDataInEnglish(film.tmdb_id);
    
    if (tmdbData && tmdbData.title) {
      translations.title = tmdbData.title;
      translations.synopsis = tmdbData.synopsis || '';
      usedTMDB = true;
      stats.fromTMDB++;
    }
  }

  // 2. Fallback sur DeepL si nécessaire
  if (!usedTMDB) {
    translations.title = await translateWithDeepL(film.title);
    translations.synopsis = await translateWithDeepL(film.synopsis || '');
    stats.fromDeepL++;
  }

  // 3. Toujours traduire le contenu custom avec DeepL
  if (film.why_watch_content) {
    translations.why_watch_content = await translateWithDeepL(film.why_watch_content);
  }

  return { translations, usedTMDB };
}

async function translateAllFilmsEnhanced() {
  console.log('🚀 Starting enhanced translation (TMDB + DeepL)...\n');

  try {
    // 1. Récupérer tous les films
    console.log('📥 Fetching all films from database...');
    const { data: films, error: fetchError } = await supabase
      .from('films')
      .select('id, tmdb_id, title, synopsis, why_watch_content')
      .order('date_ajout', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    console.log(`✅ Found ${films.length} films\n`);
    stats.total = films.length;

    // 2. Vérifier les traductions existantes
    console.log('🔍 Checking existing translations...');
    const { data: existingTranslations } = await supabase
      .from('film_translations')
      .select('film_id')
      .eq('locale', 'en');

    const translatedFilmIds = new Set(existingTranslations?.map(t => t.film_id) || []);
    const filmsToTranslate = films.filter(f => !translatedFilmIds.has(f.id));

    console.log(`✅ ${translatedFilmIds.size} films already translated`);
    console.log(`📝 ${filmsToTranslate.length} films to translate\n`);

    if (filmsToTranslate.length === 0) {
      console.log('✨ All films are already translated!');
      return;
    }

    // 3. Compter les films avec TMDB ID
    const filmsWithTmdb = filmsToTranslate.filter(f => f.tmdb_id).length;
    console.log(`🎬 ${filmsWithTmdb} films have TMDB ID (will use TMDB data)`);
    console.log(`⚡ ${filmsToTranslate.length - filmsWithTmdb} films without TMDB ID (will use DeepL)\n`);

    // 4. Traduire par lots
    const batchSize = 5;
    let translated = 0;
    let failed = 0;

    for (let i = 0; i < filmsToTranslate.length; i += batchSize) {
      const batch = filmsToTranslate.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(filmsToTranslate.length / batchSize)}`);
      
      const results = await Promise.allSettled(
        batch.map(async (film) => {
          try {
            const { translations, usedTMDB } = await translateFilmEnhanced(film);

            const { error: insertError } = await supabase
              .from('film_translations')
              .upsert({
                film_id: film.id,
                locale: 'en',
                ...translations
              }, {
                onConflict: 'film_id,locale'
              });

            if (insertError) throw insertError;

            const source = usedTMDB ? '🎬 TMDB' : '⚡ DeepL';
            console.log(`  ✅ ${source}: ${film.title}`);
            return { success: true };
          } catch (error) {
            console.error(`  ❌ ${film.title}: ${error.message}`);
            return { success: false };
          }
        })
      );

      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.success) {
          translated++;
        } else {
          failed++;
        }
      });

      if (i + batchSize < filmsToTranslate.length) {
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // 5. Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 ENHANCED TRANSLATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully translated: ${translated} films`);
    console.log(`❌ Failed: ${failed} films`);
    console.log(`\n📈 Source breakdown:`);
    console.log(`  🎬 From TMDB: ${stats.fromTMDB} films (title + synopsis)`);
    console.log(`  ⚡ From DeepL: ${stats.fromDeepL} films (full translation)`);
    console.log(`\n💰 DeepL usage:`);
    console.log(`  📊 Characters used: ${stats.deepLCharacters.toLocaleString()}`);
    console.log(`  💵 Remaining free tier: ${(500000 - stats.deepLCharacters).toLocaleString()} characters`);
    console.log(`  📉 Savings vs full DeepL: ~${Math.round((1 - stats.deepLCharacters / (translated * 500)) * 100)}%`);
    console.log('='.repeat(60) + '\n');

    if (failed === 0) {
      console.log('✨ All films successfully translated!\n');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

translateAllFilmsEnhanced()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
