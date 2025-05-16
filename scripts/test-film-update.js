/**
 * Script de test pour vérifier la structure de la table films et tester la mise à jour d'un film
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = 'https://rqdzztobbwmffakqixar.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZHp6dG9iYndtZmZha3FpeGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTEyMzgsImV4cCI6MjA2MjY4NzIzOH0.O5lwnuYfEsgqNH949Fl0wrTv1wAas9tuwOdV52kxMmU';

// Créer un client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fonction pour vérifier la structure de la table films
 */
async function checkTableStructure() {
  try {
    console.log('Vérification de la structure de la table films...');
    
    // Récupérer la structure de la table films
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erreur lors de la récupération de la structure de la table:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('Aucun film trouvé dans la table.');
      return;
    }
    
    // Afficher la structure d'un film
    console.log('Structure d\'un film:');
    const filmKeys = Object.keys(data[0]);
    filmKeys.forEach(key => {
      const value = data[0][key];
      const type = typeof value;
      console.log(`- ${key}: ${type} ${value ? `(exemple: ${value.toString().substring(0, 30)}${value.toString().length > 30 ? '...' : ''})` : '(null)'}`);
    });
    
    // Vérifier spécifiquement la colonne carousel_image_url
    if (filmKeys.includes('carousel_image_url')) {
      console.log('\nLa colonne carousel_image_url existe dans la table films.');
      const carouselImageUrl = data[0].carousel_image_url;
      console.log(`Valeur actuelle: ${carouselImageUrl || 'null'}`);
      console.log(`Type: ${typeof carouselImageUrl}`);
    } else {
      console.log('\nLa colonne carousel_image_url n\'existe PAS dans la table films.');
    }
  } catch (error) {
    console.error('Erreur inattendue lors de la vérification de la structure:', error);
  }
}

/**
 * Fonction pour tester la mise à jour d'un film avec une image de carrousel
 */
async function testFilmUpdate() {
  try {
    console.log('\nTest de mise à jour d\'un film avec une image de carrousel...');
    
    // Récupérer un film existant
    const { data: existingFilm, error: fetchError } = await supabase
      .from('films')
      .select('*')
      .limit(1)
      .single();
    
    if (fetchError) {
      console.error('Erreur lors de la récupération d\'un film:', fetchError);
      return;
    }
    
    if (!existingFilm) {
      console.log('Aucun film trouvé pour le test.');
      return;
    }
    
    console.log(`Film sélectionné pour le test: ${existingFilm.title} (ID: ${existingFilm.id})`);
    
    // Préparer les données de mise à jour
    const testImageUrl = 'https://image.tmdb.org/t/p/original/rPZLY5s2FdKYLSFhh3QxjFL0PNj.jpg';
    
    // Mise à jour du film avec uniquement l'URL de l'image du carrousel
    const { data: updatedFilm, error: updateError } = await supabase
      .from('films')
      .update({ carousel_image_url: testImageUrl })
      .eq('id', existingFilm.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour du film:', updateError);
      
      // Essayer de comprendre l'erreur
      if (updateError.message.includes('column')) {
        console.log('\nIl semble y avoir un problème avec la colonne carousel_image_url.');
        console.log('Vérifions si la colonne existe réellement dans la base de données...');
        
        // Vérifier si la migration a été appliquée
        console.log('\nVérification de l\'existence de la migration pour carousel_image_url...');
        console.log('Vous devriez vérifier si le fichier migrations/add_carousel_image_url.sql a été créé et appliqué.');
      }
      
      return;
    }
    
    console.log('\nMise à jour réussie!');
    console.log(`Nouvelle valeur de carousel_image_url: ${updatedFilm.carousel_image_url}`);
  } catch (error) {
    console.error('Erreur inattendue lors du test de mise à jour:', error);
  }
}

// Exécuter les fonctions de test
async function main() {
  await checkTableStructure();
  await testFilmUpdate();
}

main().catch(error => {
  console.error('Erreur dans le script principal:', error);
});
