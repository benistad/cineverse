/**
 * Script pour corriger le slug de "Le Procès du siècle"
 * Usage: node scripts/fix-proces-slug.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixSlug() {
  console.log('🔍 Recherche du film "Le Procès du siècle"...');
  
  // Trouver le film
  const { data: films, error: searchError } = await supabase
    .from('films')
    .select('id, title, slug')
    .or('slug.eq.le-procs-du-sicle,title.ilike.%Procès du siècle%');
  
  if (searchError) {
    console.error('❌ Erreur lors de la recherche:', searchError);
    return;
  }
  
  if (!films || films.length === 0) {
    console.log('⚠️  Film non trouvé');
    return;
  }
  
  console.log('✅ Film trouvé:', films[0]);
  console.log('📝 Ancien slug:', films[0].slug);
  
  // Mettre à jour le slug
  const { data, error } = await supabase
    .from('films')
    .update({ slug: 'le-proces-du-siecle' })
    .eq('id', films[0].id)
    .select();
  
  if (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    return;
  }
  
  console.log('✅ Slug mis à jour avec succès !');
  console.log('📝 Nouveau slug:', data[0].slug);
  console.log('🔗 Nouvelle URL: https://www.moviehunt.fr/films/' + data[0].slug);
}

fixSlug().then(() => {
  console.log('✨ Terminé !');
  process.exit(0);
}).catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
