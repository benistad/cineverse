/**
 * Script pour mettre à jour les genres dans les traductions existantes
 * Récupère les genres en anglais depuis TMDB pour tous les films traduits
 */

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTFmYzFkODkzNTExZjgwYTBjNmI0YzRkZTE2MWM1MSIsIm5iZiI6MTc0NjUxNTA1NC4yODE5OTk4LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hj-9KXl-h5-7CtFhFSC6V4NJE__c1ozx5OnrETtCS9c';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Récupère les genres en anglais depuis TMDB
 */
async function getGenresFromTMDB(tmdbId) {
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
    const genres = data.genres ? data.genres.map(g => g.name).join(', ') : '';
    
    return genres;
  } catch (error) {
    console.error(`Error fetching genres for TMDB ID ${tmdbId}:`, error.message);
    return null;
  }
}

async function updateGenres() {
  console.log('🚀 Starting genres update for existing translations...\n');

  try {
    // 1. Récupérer tous les films avec TMDB ID
    console.log('📥 Fetching films with TMDB ID...');
    const { data: films, error: fetchError } = await supabase
      .from('films')
      .select('id, tmdb_id, title')
      .not('tmdb_id', 'is', null)
      .order('date_ajout', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    console.log(`✅ Found ${films.length} films with TMDB ID\n`);

    // 2. Mettre à jour les genres pour chaque film
    let updated = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < films.length; i++) {
      const film = films[i];
      const progress = `[${i + 1}/${films.length}]`;
      
      console.log(`${progress} Processing: ${film.title}`);

      // Récupérer les genres depuis TMDB
      const genres = await getGenresFromTMDB(film.tmdb_id);

      if (!genres) {
        console.log(`  ⚠️  No genres found`);
        skipped++;
        continue;
      }

      // Mettre à jour dans film_translations
      const { error: updateError } = await supabase
        .from('film_translations')
        .update({ genres: genres })
        .eq('film_id', film.id)
        .eq('locale', 'en');

      if (updateError) {
        console.log(`  ❌ Error updating: ${updateError.message}`);
        failed++;
      } else {
        console.log(`  ✅ Updated: ${genres}`);
        updated++;
      }

      // Pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    console.log('\n📊 Summary:');
    console.log(`✅ ${updated} films updated`);
    console.log(`⚠️  ${skipped} films skipped (no genres)`);
    console.log(`❌ ${failed} films failed`);
    console.log('\n✨ Genres update completed!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Exécuter
updateGenres();
