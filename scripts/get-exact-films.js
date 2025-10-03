import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const slugs = [
  'destination-finale-bloodlines',
  'until-dawn-la-mort-sans-fin', 
  'triangle',
  'night-of-the-hunted'
];

async function getFilms() {
  console.log('🔍 Récupération des films...\n');
  
  for (const slug of slugs) {
    const { data, error } = await supabase
      .from('films')
      .select('title, slug, poster_url, note_sur_10')
      .eq('slug', slug);
    
    if (error) {
      console.log(`❌ ${slug}: ${error.message}`);
    } else if (data && data.length > 0) {
      const film = data[0];
      console.log(`✅ ${film.title}`);
      console.log(`   slug: "${film.slug}"`);
      console.log(`   note: ${film.note_sur_10}/10`);
      console.log(`   poster: "${film.poster_url}"`);
      console.log('');
    } else {
      console.log(`❌ ${slug}: Film non trouvé`);
      console.log('');
    }
  }
}

getFilms();
