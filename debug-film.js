// Script de débogage pour afficher les informations d'un film
const { createClient } = require('@supabase/supabase-js');

// Créer un client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugFilm(slug) {
  try {
    // Rechercher le film par son slug
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération du film:', error);
      return;
    }
    
    if (!data) {
      console.log('Film non trouvé');
      return;
    }
    
    // Afficher les informations du film
    console.log('Informations du film:');
    console.log('-------------------');
    console.log(`ID: ${data.id}`);
    console.log(`Titre: ${data.title}`);
    console.log(`Slug: ${data.slug}`);
    console.log(`TMDB ID: ${data.tmdb_id}`);
    console.log(`poster_url: ${data.poster_url}`);
    console.log(`poster_path: ${data.poster_path}`);
    console.log(`backdrop_path: ${data.backdrop_path}`);
    console.log('-------------------');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Utiliser le premier argument comme slug
const slug = process.argv[2];
if (!slug) {
  console.log('Usage: node debug-film.js <slug>');
  process.exit(1);
}

debugFilm(slug);
