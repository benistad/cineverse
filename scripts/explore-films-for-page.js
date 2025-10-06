/**
 * Script pour explorer les films disponibles dans la base de données
 * et suggérer une sélection pour la page "Quel film regarder"
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

async function exploreFilms() {
  console.log('🎬 Exploration des films dans la base de données...\n');

  // Récupérer les films bien notés (>= 7/10) avec des genres variés
  const { data: films, error } = await supabase
    .from('films')
    .select('*')
    .gte('note_sur_10', 7)
    .order('note_sur_10', { ascending: false })
    .limit(50);

  if (error) {
    console.error('❌ Erreur lors de la récupération des films:', error);
    return;
  }

  console.log(`✅ ${films.length} films trouvés avec une note >= 7/10\n`);

  // Catégoriser les films par genre/type
  const categories = {
    action: [],
    thriller: [],
    drame: [],
    comedie: [],
    horreur: [],
    scienceFiction: [],
    guerre: [],
    western: []
  };

  films.forEach(film => {
    const genres = film.genres?.toLowerCase() || '';
    const titre = film.title || film.titre_original;
    
    const filmInfo = {
      titre,
      slug: film.slug,
      note: film.note_sur_10,
      annee: film.annee_sortie,
      genres: film.genres,
      synopsis: film.synopsis?.substring(0, 150) + '...',
      poster: film.poster_path
    };

    if (genres.includes('action')) categories.action.push(filmInfo);
    if (genres.includes('thriller')) categories.thriller.push(filmInfo);
    if (genres.includes('drame') || genres.includes('drama')) categories.drame.push(filmInfo);
    if (genres.includes('comédie') || genres.includes('comedy')) categories.comedie.push(filmInfo);
    if (genres.includes('horreur') || genres.includes('horror')) categories.horreur.push(filmInfo);
    if (genres.includes('science-fiction') || genres.includes('sci-fi')) categories.scienceFiction.push(filmInfo);
    if (genres.includes('guerre') || genres.includes('war')) categories.guerre.push(filmInfo);
    if (genres.includes('western')) categories.western.push(filmInfo);
  });

  // Afficher les meilleures options par catégorie
  console.log('📊 SUGGESTIONS PAR CATÉGORIE\n');
  console.log('=' .repeat(80));

  console.log('\n🔥 ACTION / THRILLER INTENSE (Top 5):');
  categories.thriller.slice(0, 5).forEach(f => {
    console.log(`  • ${f.titre} (${f.annee}) - Note: ${f.note}/10 - Slug: ${f.slug}`);
  });

  console.log('\n🎭 DRAMES TOUCHANTS (Top 5):');
  categories.drame.slice(0, 5).forEach(f => {
    console.log(`  • ${f.titre} (${f.annee}) - Note: ${f.note}/10 - Slug: ${f.slug}`);
  });

  console.log('\n😄 COMÉDIES / FILMS DÉTENTE (Top 5):');
  categories.comedie.slice(0, 5).forEach(f => {
    console.log(`  • ${f.titre} (${f.annee}) - Note: ${f.note}/10 - Slug: ${f.slug}`);
  });

  console.log('\n🚀 SCIENCE-FICTION (Top 5):');
  categories.scienceFiction.slice(0, 5).forEach(f => {
    console.log(`  • ${f.titre} (${f.annee}) - Note: ${f.note}/10 - Slug: ${f.slug}`);
  });

  console.log('\n💀 HORREUR (Top 5):');
  categories.horreur.slice(0, 5).forEach(f => {
    console.log(`  • ${f.titre} (${f.annee}) - Note: ${f.note}/10 - Slug: ${f.slug}`);
  });

  console.log('\n⚔️ GUERRE / HISTORIQUE (Top 5):');
  categories.guerre.slice(0, 5).forEach(f => {
    console.log(`  • ${f.titre} (${f.annee}) - Note: ${f.note}/10 - Slug: ${f.slug}`);
  });

  console.log('\n🤠 WESTERN (Top 3):');
  categories.western.slice(0, 3).forEach(f => {
    console.log(`  • ${f.titre} (${f.annee}) - Note: ${f.note}/10 - Slug: ${f.slug}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 RECOMMANDATION POUR LA PAGE "QUEL FILM REGARDER":\n');
  console.log('Sélectionne 5 films variés parmi ces catégories pour offrir');
  console.log('une diversité de genres et d\'émotions aux visiteurs.\n');
}

exploreFilms().catch(console.error);
