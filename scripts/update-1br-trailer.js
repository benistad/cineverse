const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function updateTrailer() {
  // Utiliser l'URL de production
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynumbbsdniheeqktblyq.supabase.co';
  const supabase = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  console.log('Connexion à:', supabaseUrl);

  console.log('Mise à jour de la bande-annonce pour 1BR: The Apartment...');

  // Nouvelle clé YouTube publique pour 1BR
  const newTrailerKey = 'IGzb01GrsxQ';

  // Mettre à jour le film avec le slug
  const { data, error } = await supabase
    .from('films')
    .update({ youtube_trailer_key: newTrailerKey })
    .eq('slug', '1br-the-apartment')
    .select();

  if (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Bande-annonce mise à jour avec succès !');
    console.log('Film:', data[0].title);
    console.log('Nouvelle clé YouTube:', newTrailerKey);
    console.log('URL:', `https://www.youtube.com/watch?v=${newTrailerKey}`);
  } else {
    console.log('❌ Film non trouvé avec le slug "1br-the-apartment"');
  }
}

updateTrailer();
