/**
 * Script pour migrer uniquement la table films
 * de l'instance Supabase USA vers l'instance France
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { SOURCE_SUPABASE, DESTINATION_SUPABASE } from './supabase-config.js';

// Créer les clients Supabase
const sourceClient = createClient(SOURCE_SUPABASE.url, SOURCE_SUPABASE.key);
const destClient = createClient(DESTINATION_SUPABASE.url, DESTINATION_SUPABASE.key);

// Créer le dossier temporaire pour stocker les données
const tempDir = path.join(process.cwd(), 'temp_migration');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

/**
 * Fonction pour migrer la table films
 */
async function migrateFilmsTable() {
  console.log('🔄 Migration de la table films...');
  
  try {
    // 1. Extraire les données de la source
    console.log('📤 Extraction des films de l\'instance source (USA)...');
    
    const { data, error } = await sourceClient
      .from('films')
      .select('*');
    
    if (error) {
      throw new Error(`Erreur lors de l'extraction des données: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ Aucun film trouvé dans l\'instance source.');
      return { migrated: 0, total: 0 };
    }
    
    console.log(`✅ ${data.length} films extraits.`);
    
    // Sauvegarder les données dans un fichier temporaire
    const tempFile = path.join(tempDir, 'films.json');
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    console.log(`📁 Données sauvegardées dans: ${tempFile}`);
    
    // 2. Vérifier si la table existe dans la destination
    console.log('🔍 Vérification de la table films dans l\'instance destination...');
    
    const { error: checkError } = await destClient
      .from('films')
      .select('count')
      .limit(1);
    
    if (checkError) {
      console.error('❌ La table films n\'existe pas dans l\'instance de destination.');
      console.error('⚠️ Vous devez d\'abord créer la table. Utilisez le SQL fourni par le script create-table.js');
      return { migrated: 0, total: data.length };
    }
    
    console.log('✅ La table films existe dans l\'instance destination.');
    
    // 3. Insérer les données dans la destination
    console.log('📥 Insertion des films dans l\'instance destination (France)...');
    
    // Insérer par lots pour éviter les limitations d'API
    const batchSize = 50;
    let insertedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const { error: insertError } = await destClient
        .from('films')
        .upsert(batch, { 
          onConflict: 'id',  // Utiliser l'ID comme clé de conflit
          ignoreDuplicates: false  // Mettre à jour si l'enregistrement existe déjà
        });
      
      if (insertError) {
        console.error(`❌ Erreur lors de l'insertion (lot ${Math.floor(i/batchSize) + 1}):`, insertError.message);
        errorCount += batch.length;
      } else {
        insertedCount += batch.length;
        console.log(`📊 Progression: ${Math.min(i + batchSize, data.length)}/${data.length} films`);
      }
    }
    
    console.log(`\n✅ Migration terminée: ${insertedCount}/${data.length} films migrés ${errorCount > 0 ? `(${errorCount} erreurs)` : ''}`);
    return { migrated: insertedCount, total: data.length, errors: errorCount };
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return { migrated: 0, total: 0, errors: 1 };
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Migration Supabase (USA vers France) - Table Films');
  console.log('==================================================');
  console.log(`📤 Source: ${SOURCE_SUPABASE.url}`);
  console.log(`📥 Destination: ${DESTINATION_SUPABASE.url}`);
  
  const result = await migrateFilmsTable();
  
  if (result.migrated === result.total && result.total > 0) {
    console.log('\n✅ Migration réussie!');
  } else if (result.migrated > 0) {
    console.log('\n⚠️ Migration partielle.');
  } else {
    console.log('\n❌ Migration échouée.');
  }
  
  console.log('\n⚠️ Prochaines étapes:');
  console.log('1. Vérifiez que toutes les données ont été correctement migrées');
  console.log('2. Mettez à jour votre fichier .env.local avec les nouvelles informations de connexion:');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL=${DESTINATION_SUPABASE.url}`);
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_de_la_nouvelle_instance');
  console.log('3. Testez votre application avec la nouvelle instance Supabase');
}

// Exécuter la fonction principale
main().catch(error => {
  console.error('❌ Erreur inattendue:', error);
  process.exit(1);
});
