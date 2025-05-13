/**
 * Script simplifié pour vérifier et ajouter la colonne carousel_image_url
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Vérifier que les variables d'environnement sont définies
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Erreur: Variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY requises.');
  process.exit(1);
}

// Créer le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fonction principale
 */
async function main() {
  console.log('🔍 Vérification de la colonne carousel_image_url...');
  
  try {
    // Tester si la colonne existe déjà
    const { data, error } = await supabase
      .from('films')
      .select('carousel_image_url')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column "carousel_image_url" does not exist')) {
        console.log('❌ La colonne carousel_image_url n\'existe pas encore.');
        console.log('Pour ajouter cette colonne, vous devez exécuter la requête SQL suivante dans l\'interface SQL de Supabase:');
        console.log('\nALTER TABLE films ADD COLUMN IF NOT EXISTS "carousel_image_url" varchar;\n');
      } else {
        throw error;
      }
    } else {
      console.log('✅ La colonne carousel_image_url existe déjà dans la table films.');
      console.log('Exemple de valeur:', data[0]?.carousel_image_url || 'null');
    }
    
    // Tester la mise à jour d'un film avec une URL d'image de carrousel
    console.log('\n🔍 Test de mise à jour d\'un film avec une URL d\'image de carrousel...');
    
    // Récupérer un film existant
    const { data: film, error: filmError } = await supabase
      .from('films')
      .select('id, title')
      .limit(1)
      .single();
    
    if (filmError) {
      throw filmError;
    }
    
    if (!film) {
      console.log('❌ Aucun film trouvé pour le test.');
      return;
    }
    
    console.log(`Film sélectionné pour le test: ${film.title} (ID: ${film.id})`);
    
    // URL de test pour l'image du carrousel
    const testImageUrl = 'https://image.tmdb.org/t/p/original/testimage.jpg';
    
    // Mettre à jour le film avec l'URL de test
    const { data: updatedFilm, error: updateError } = await supabase
      .from('films')
      .update({ carousel_image_url: testImageUrl })
      .eq('id', film.id)
      .select()
      .single();
    
    if (updateError) {
      console.log('❌ Erreur lors de la mise à jour du film:', updateError);
      
      if (updateError.message.includes('column "carousel_image_url" does not exist')) {
        console.log('La colonne carousel_image_url n\'existe pas dans la table films.');
      } else if (updateError.message.includes('value too long')) {
        console.log('L\'URL de l\'image est trop longue pour la colonne. Vous devriez modifier le type de la colonne:');
        console.log('\nALTER TABLE films ALTER COLUMN "carousel_image_url" TYPE text;\n');
      } else {
        console.log('Détails de l\'erreur:', updateError);
      }
    } else {
      console.log('✅ Mise à jour réussie!');
      console.log(`Nouvelle valeur de carousel_image_url: ${updatedFilm.carousel_image_url}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exécuter la fonction principale
main().catch(error => {
  console.error('❌ Erreur inattendue:', error);
});
