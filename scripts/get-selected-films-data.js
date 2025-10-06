/**
 * Script pour récupérer les données complètes des films sélectionnés
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const selectedSlugs = [
  'greedy-people',
  'old-henry',
  'tetris',
  'dom-hemingway',
  'irresistible'
];

async function getFilmsData() {
  console.log('📥 Récupération des données des films sélectionnés...\n');

  const { data: films, error } = await supabase
    .from('films')
    .select('*')
    .in('slug', selectedSlugs);

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log('✅ Données récupérées\n');
  console.log('='.repeat(80));

  films.forEach((film, index) => {
    console.log(`\n${index + 1}. ${film.title || film.titre_original}`);
    console.log(`   Slug: ${film.slug}`);
    console.log(`   Année: ${film.annee_sortie}`);
    console.log(`   Note: ${film.note_sur_10}/10`);
    console.log(`   Genres: ${film.genres}`);
    console.log(`   Poster: ${film.poster_path}`);
    console.log(`   Synopsis: ${film.synopsis}`);
    console.log(`   Pourquoi regarder: ${film.pourquoi_regarder || 'N/A'}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📋 Données JSON pour copier-coller:\n');
  console.log(JSON.stringify(films, null, 2));
}

getFilmsData().catch(console.error);
