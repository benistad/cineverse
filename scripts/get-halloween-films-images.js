import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const filmTitles = [
  { search: 'Funny Games', display: 'Funny Games US' },
  { search: 'Final Destination', display: 'Destination Finale : Bloodlines' },
  { search: 'Until Dawn', display: 'Until Dawn' },
  { search: 'Heretic', display: 'Heretic' },
  { search: '1BR', display: '1BR : The Apartment' },
  { search: 'Triangle', display: 'Triangle' },
  { search: 'Vivarium', display: 'Vivarium' },
  { search: 'Barbar', display: 'Barbarian' }, // Peut être "Barbare" en français
  { search: 'Blood Star', display: 'Blood Star' },
  { search: 'Night', display: 'Night of the Hunted' }
];

async function getFilmImages() {
  console.log('🎃 Récupération des images des films Halloween...\n');

  // D'abord, récupérons un film pour voir la structure
  console.log('📋 Structure d\'un film:\n');
  const { data: sampleFilm, error: sampleError } = await supabase
    .from('films')
    .select('*')
    .limit(1)
    .single();

  if (sampleError) {
    console.log('❌ Erreur:', sampleError.message);
  } else if (sampleFilm) {
    console.log('Colonnes disponibles:', Object.keys(sampleFilm).join(', '));
    console.log('\nExemple de film:', sampleFilm.title);
  }

  // Maintenant listons tous les films
  console.log('\n📋 Tous les films dans la base:\n');
  const { data: allFilms, error: allError } = await supabase
    .from('films')
    .select('*')
    .order('title')
    .limit(100);

  if (allError) {
    console.log('❌ Erreur:', allError.message);
  } else if (allFilms) {
    console.log(`Total de films trouvés: ${allFilms.length}\n`);
    allFilms.slice(0, 20).forEach(film => {
      console.log(`- ${film.title} (slug: ${film.slug})`);
    });
  }

  console.log('\n\n🔍 Recherche des films spécifiques...\n');

  for (const filmObj of filmTitles) {
    const searchTerm = filmObj.search;
    const displayName = filmObj.display;
    
    // Essayons plusieurs variantes du titre
    const variants = [
      searchTerm,
      searchTerm.toLowerCase(),
      searchTerm.toUpperCase(),
      searchTerm.replace(':', ''),
      searchTerm.replace(' : ', ' ')
    ];

    let found = false;
    for (const variant of variants) {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .ilike('title', `%${variant}%`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const film = data[0];
        // Chercher le champ d'image (peut être poster_path, poster_url, image_url, etc.)
        const posterField = film.poster_url || film.poster_path || film.image_url || film.affiche || '';
        const posterUrl = posterField?.startsWith('http') 
          ? posterField 
          : `https://image.tmdb.org/t/p/w500${posterField}`;
        
        console.log(`✅ ${displayName} → ${film.title}`);
        console.log(`   slug: "${film.slug}",`);
        console.log(`   poster: "${posterUrl}"\n`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(`❌ "${displayName}": Film non trouvé\n`);
    }
  }
}

getFilmImages();
