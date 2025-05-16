// Script pour vérifier et ajouter la colonne is_hunted_by_moviehunt à la table des films
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: Variables d\'environnement NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY non définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndAddHuntedColumn() {
  try {
    console.log('Vérification de la présence de la colonne is_hunted_by_moviehunt dans la table films...');
    
    // Vérifier si la colonne existe déjà
    const { data: columns, error: columnsError } = await supabase
      .from('films')
      .select('is_hunted_by_moviehunt')
      .limit(1);
    
    if (columnsError) {
      // Si l'erreur indique que la colonne n'existe pas
      if (columnsError.message.includes('column "is_hunted_by_moviehunt" does not exist')) {
        console.log('La colonne is_hunted_by_moviehunt n\'existe pas. Création de la colonne...');
        
        // Exécuter une requête SQL pour ajouter la colonne
        const { error: alterError } = await supabase.rpc('add_hunted_column');
        
        if (alterError) {
          console.error('Erreur lors de l\'ajout de la colonne:', alterError);
          
          // Essayer une approche alternative avec une requête SQL directe
          console.log('Tentative avec une requête SQL directe...');
          const { error: sqlError } = await supabase.rpc('execute_sql', {
            sql_query: 'ALTER TABLE films ADD COLUMN IF NOT EXISTS is_hunted_by_moviehunt BOOLEAN DEFAULT FALSE'
          });
          
          if (sqlError) {
            console.error('Erreur lors de l\'exécution de la requête SQL directe:', sqlError);
            return false;
          } else {
            console.log('Colonne is_hunted_by_moviehunt ajoutée avec succès via SQL directe!');
            return true;
          }
        } else {
          console.log('Colonne is_hunted_by_moviehunt ajoutée avec succès!');
          return true;
        }
      } else {
        console.error('Erreur lors de la vérification de la colonne:', columnsError);
        return false;
      }
    } else {
      console.log('La colonne is_hunted_by_moviehunt existe déjà dans la table films.');
      return true;
    }
  } catch (error) {
    console.error('Erreur non gérée:', error);
    return false;
  }
}

// Exécuter la fonction principale
checkAndAddHuntedColumn()
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
