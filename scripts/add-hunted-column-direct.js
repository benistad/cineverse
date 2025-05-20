// Script pour ajouter la colonne is_hunted_by_moviehunt à la table des films
// en utilisant directement l'API REST de Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase - URL utilisée dans les logs d'erreur
const SUPABASE_URL = 'https://ynumbbsdniheeqktblyq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludW1iYnNkbmloZWVxa3RibHlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjYyMDQ3NCwiZXhwIjoyMDYyMTk2NDc0fQ.IliW3hcB4RNQwD6mXzkRaIc4C7usCcz3-xd5_fL87lU';

// Créer un client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateFilmsWithHuntedColumn() {
  try {
    console.log('Récupération de tous les films...');
    
    // Récupérer tous les films
    const { data: films, error } = await supabase
      .from('films')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des films:', error);
      return false;
    }
    
    console.log(`${films.length} films récupérés.`);
    
    // Vérifier si la colonne is_hunted_by_moviehunt existe déjà
    const hasHuntedColumn = films.length > 0 && 'is_hunted_by_moviehunt' in films[0];
    
    if (hasHuntedColumn) {
      console.log('La colonne is_hunted_by_moviehunt existe déjà dans la table films.');
    } else {
      console.log('La colonne is_hunted_by_moviehunt n\'existe pas dans la table films.');
      console.log('Vous devez ajouter cette colonne manuellement via l\'interface Supabase.');
      console.log('Instructions:');
      console.log('1. Connectez-vous à votre dashboard Supabase');
      console.log('2. Allez dans "Table Editor" > "films"');
      console.log('3. Cliquez sur "Edit table"');
      console.log('4. Ajoutez une nouvelle colonne "is_hunted_by_moviehunt" de type "boolean" avec une valeur par défaut "false"');
      return false;
    }
    
    console.log('Mise à jour des films pour initialiser is_hunted_by_moviehunt à false...');
    
    // Mettre à jour tous les films pour initialiser is_hunted_by_moviehunt à false
    const { error: updateError } = await supabase
      .from('films')
      .update({ is_hunted_by_moviehunt: false })
      .is('is_hunted_by_moviehunt', null);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour des films:', updateError);
      return false;
    }
    
    console.log('Tous les films ont été mis à jour avec succès!');
    return true;
  } catch (error) {
    console.error('Erreur non gérée:', error);
    return false;
  }
}

// Exécuter la fonction principale
updateFilmsWithHuntedColumn()
  .then(success => {
    if (success) {
      console.log('Opération terminée avec succès.');
    } else {
      console.log('Opération terminée avec des erreurs.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Erreur non gérée dans la fonction principale:', error);
    process.exit(1);
  });
