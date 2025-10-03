import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const missingFilms = [
  'Destination Finale',
  'Until Dawn', 
  'Triangle',
  'Night of the Hunted'
];

async function findMissingFilms() {
  console.log('🔍 Recherche des films manquants...\n');

  // Récupérer tous les films pour chercher manuellement
  const { data: allFilms, error } = await supabase
    .from('films')
    .select('title, slug, poster_url')
    .order('title');

  if (error) {
    console.log('❌ Erreur:', error.message);
    return;
  }

  console.log(`📋 Total de ${allFilms.length} films dans la base\n`);

  for (const searchTerm of missingFilms) {
    console.log(`\n🔎 Recherche de "${searchTerm}"...`);
    
    // Chercher avec différentes variations
    const matches = allFilms.filter(film => {
      const title = film.title.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return title.includes(search) || 
             title.includes(search.replace(' ', '')) ||
             search.includes(title) ||
             // Variations spécifiques
             (search.includes('destination') && title.includes('destination')) ||
             (search.includes('until') && title.includes('until')) ||
             (search.includes('dawn') && title.includes('dawn')) ||
             (search.includes('triangle') && title.includes('triangle')) ||
             (search.includes('night') && title.includes('night') && title.includes('hunt'));
    });

    if (matches.length > 0) {
      console.log(`✅ Trouvé ${matches.length} correspondance(s):`);
      matches.forEach(film => {
        console.log(`   - ${film.title}`);
        console.log(`     slug: "${film.slug}"`);
        console.log(`     poster: "${film.poster_url}"`);
      });
    } else {
      console.log(`❌ Aucune correspondance trouvée`);
    }
  }

  // Afficher tous les films contenant "final", "dawn", "triangle", "night", "hunt"
  console.log('\n\n📋 Tous les films contenant des mots-clés pertinents:\n');
  
  const keywords = ['final', 'dawn', 'triangle', 'night', 'hunt', 'destination'];
  
  keywords.forEach(keyword => {
    const matches = allFilms.filter(f => f.title.toLowerCase().includes(keyword));
    if (matches.length > 0) {
      console.log(`\n🔑 Films contenant "${keyword}":`);
      matches.forEach(film => {
        console.log(`   - ${film.title} (slug: ${film.slug})`);
      });
    }
  });
}

findMissingFilms();
