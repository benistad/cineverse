/**
 * Script pour traduire automatiquement tous les films existants
 * Usage: node scripts/translate-all-films.js
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Fonction de traduction DeepL (copie de deepl.js pour CommonJS)
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

async function translateText(text) {
  if (!text || text.trim() === '') {
    return '';
  }

  if (!DEEPL_API_KEY) {
    console.warn('DeepL API key not configured. Skipping translation.');
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
      const error = await response.text();
      console.error('DeepL API error:', error);
      return text;
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
}

async function translateFilmContent(film) {
  console.log(`Translating film: ${film.title}`);

  try {
    const [
      translatedTitle,
      translatedSynopsis,
      translatedWhyWatch
    ] = await Promise.all([
      translateText(film.title || ''),
      translateText(film.synopsis || ''),
      translateText(film.why_watch_content || '')
    ]);

    return {
      title: translatedTitle,
      synopsis: translatedSynopsis,
      why_watch_content: translatedWhyWatch
    };
  } catch (error) {
    console.error(`Error translating film ${film.id}:`, error);
    throw error;
  }
}

function isDeepLConfigured() {
  return !!DEEPL_API_KEY;
}

function estimateCharacterCount(film) {
  let count = 0;
  if (film.title) count += film.title.length;
  if (film.synopsis) count += film.synopsis.length;
  if (film.why_watch_content) count += film.why_watch_content.length;
  return count;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

if (!isDeepLConfigured()) {
  console.error('❌ DeepL API key not found in .env.local');
  console.error('Please add DEEPL_API_KEY to your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function translateAllFilms() {
  console.log('🚀 Starting automatic translation of all films...\n');

  try {
    // 1. Récupérer tous les films
    console.log('📥 Fetching all films from database...');
    const { data: films, error: fetchError } = await supabase
      .from('films')
      .select('id, title, synopsis, why_watch_content')
      .order('date_ajout', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    console.log(`✅ Found ${films.length} films\n`);

    // 2. Vérifier quels films sont déjà traduits
    console.log('🔍 Checking existing translations...');
    const { data: existingTranslations, error: translationsError } = await supabase
      .from('film_translations')
      .select('film_id')
      .eq('locale', 'en');

    if (translationsError) {
      throw translationsError;
    }

    const translatedFilmIds = new Set(existingTranslations.map(t => t.film_id));
    const filmsToTranslate = films.filter(f => !translatedFilmIds.has(f.id));

    console.log(`✅ ${translatedFilmIds.size} films already translated`);
    console.log(`📝 ${filmsToTranslate.length} films to translate\n`);

    if (filmsToTranslate.length === 0) {
      console.log('✨ All films are already translated!');
      return;
    }

    // 3. Estimer le nombre de caractères
    const totalCharacters = filmsToTranslate.reduce((sum, film) => sum + estimateCharacterCount(film), 0);
    console.log(`📊 Estimated characters to translate: ${totalCharacters.toLocaleString()}`);
    console.log(`💰 DeepL free tier: 500,000 characters/month\n`);

    if (totalCharacters > 500000) {
      console.warn('⚠️  Warning: This will exceed the free tier limit!');
      console.log('Consider translating in batches or upgrading to DeepL Pro\n');
    }

    // 4. Traduire les films par lots de 5 pour éviter de surcharger l'API
    const batchSize = 5;
    let translated = 0;
    let failed = 0;

    for (let i = 0; i < filmsToTranslate.length; i += batchSize) {
      const batch = filmsToTranslate.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(filmsToTranslate.length / batchSize)}`);
      
      const results = await Promise.allSettled(
        batch.map(async (film) => {
          try {
            // Traduire le contenu
            const translations = await translateFilmContent(film);

            // Sauvegarder dans la base de données
            const { error: insertError } = await supabase
              .from('film_translations')
              .upsert({
                film_id: film.id,
                locale: 'en',
                ...translations
              }, {
                onConflict: 'film_id,locale'
              });

            if (insertError) {
              throw insertError;
            }

            console.log(`  ✅ ${film.title}`);
            return { success: true, film };
          } catch (error) {
            console.error(`  ❌ ${film.title}: ${error.message}`);
            return { success: false, film, error };
          }
        })
      );

      // Compter les succès et échecs
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.success) {
          translated++;
        } else {
          failed++;
        }
      });

      // Pause entre les lots pour respecter les limites de l'API
      if (i + batchSize < filmsToTranslate.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // 5. Résumé
    console.log('\n' + '='.repeat(50));
    console.log('📊 TRANSLATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully translated: ${translated} films`);
    console.log(`❌ Failed: ${failed} films`);
    console.log(`📈 Total: ${filmsToTranslate.length} films processed`);
    console.log(`🎉 Completion rate: ${((translated / filmsToTranslate.length) * 100).toFixed(1)}%`);
    console.log('='.repeat(50) + '\n');

    if (failed > 0) {
      console.log('⚠️  Some translations failed. Check the logs above for details.');
      console.log('You can re-run this script to retry failed translations.\n');
    } else {
      console.log('✨ All films successfully translated!\n');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Exécuter le script
translateAllFilms()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
