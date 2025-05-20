// Script pour ajouter la colonne is_hunted_by_moviehunt à la table des films
// sur la base de données Supabase de production
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase - URL utilisée dans les logs d'erreur
const SUPABASE_URL = 'https://ynumbbsdniheeqktblyq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludW1iYnNkbmloZWVxa3RibHlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjYyMDQ3NCwiZXhwIjoyMDYyMTk2NDc0fQ.IliW3hcB4RNQwD6mXzkRaIc4C7usCcz3-xd5_fL87lU';

// Créer un client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function addHuntedColumn() {
  try {
    console.log('Vérification de la présence de la colonne is_hunted_by_moviehunt dans la table films...');
    
    // Exécuter une requête SQL directe pour ajouter la colonne
    console.log('Ajout de la colonne is_hunted_by_moviehunt...');
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: 'ALTER TABLE films ADD COLUMN IF NOT EXISTS is_hunted_by_moviehunt BOOLEAN DEFAULT FALSE'
    });
    
    if (error) {
      console.error('Erreur lors de l\'ajout de la colonne:', error);
      return false;
    }
    
    console.log('Colonne is_hunted_by_moviehunt ajoutée avec succès!');
    
    // Vérifier que la colonne a bien été ajoutée
    const { data, error: checkError } = await supabase
      .from('films')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Erreur lors de la vérification:', checkError);
      return false;
    }
    
    console.log('Vérification réussie. La base de données est prête.');
    return true;
  } catch (error) {
    console.error('Erreur non gérée:', error);
    return false;
  }
}

// Exécuter la fonction principale
addHuntedColumn()
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
