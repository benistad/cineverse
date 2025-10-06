/**
 * Script pour trouver des pépites méconnues (hidden gems) dans la base de données
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findHiddenGems() {
  console.log('💎 Recherche de pépites méconnues...\n');

  // Récupérer les films marqués comme hidden gems OU avec une bonne note mais peu connus
  const { data: films, error } = await supabase
    .from('films')
    .select('*')
    .gte('note_sur_10', 7)
    .order('note_sur_10', { ascending: false });

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log(`✅ ${films.length} films trouvés\n`);

  // Films très connus à exclure (blockbusters)
  const blockbusters = [
    'inception', 'interstellar', 'django-unchained', 'inglourious-basterds',
    'once-upon-a-time-in-hollywood', 'le-loup-de-wall-street', 'braveheart',
    'love-actually', 'elvis', 'split'
  ];

  // Filtrer pour garder les pépites méconnues
  const hiddenGems = films.filter(f => {
    const isHiddenGem = f.is_hidden_gem === true;
    const isNotBlockbuster = !blockbusters.includes(f.slug);
    return (isHiddenGem || isNotBlockbuster) && f.note_sur_10 >= 7;
  });

  console.log('💎 PÉPITES MÉCONNUES DISPONIBLES:\n');
  console.log('='.repeat(80));

  // Grouper par genre
  const byGenre = {};
  hiddenGems.forEach(film => {
    const genres = film.genres?.toLowerCase() || 'autre';
    const mainGenre = genres.split(',')[0].trim();
    
    if (!byGenre[mainGenre]) byGenre[mainGenre] = [];
    
    byGenre[mainGenre].push({
      titre: film.title || film.titre_original,
      slug: film.slug,
      note: film.note_sur_10,
      annee: film.annee_sortie,
      genres: film.genres,
      isHiddenGem: film.is_hidden_gem,
      synopsis: film.synopsis?.substring(0, 120) + '...',
      poster: film.poster_path
    });
  });

  // Afficher par genre
  Object.keys(byGenre).sort().forEach(genre => {
    console.log(`\n📁 ${genre.toUpperCase()}:`);
    byGenre[genre].slice(0, 5).forEach(f => {
      const badge = f.isHiddenGem ? '💎' : '  ';
      console.log(`  ${badge} ${f.titre} (${f.annee}) - ${f.note}/10 - ${f.slug}`);
      if (f.synopsis) console.log(`     "${f.synopsis}"`);
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n🎯 SUGGESTION DE SÉLECTION VARIÉE:\n');
  
  // Suggérer une sélection équilibrée
  const suggestions = [];
  const genresPriority = ['thriller', 'drame', 'action', 'comédie', 'horreur', 'science-fiction', 'western'];
  
  genresPriority.forEach(genre => {
    const filmsInGenre = byGenre[genre] || [];
    if (filmsInGenre.length > 0) {
      suggestions.push(filmsInGenre[0]);
    }
  });

  suggestions.slice(0, 5).forEach((f, i) => {
    console.log(`${i + 1}. ${f.titre} (${f.annee}) - ${f.note}/10`);
    console.log(`   Genre: ${f.genres}`);
    console.log(`   Slug: ${f.slug}`);
    console.log(`   ${f.synopsis}\n`);
  });
}

findHiddenGems().catch(console.error);
