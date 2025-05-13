/**
 * Script de migration Supabase amélioré
 * Migre les données d'une instance Supabase (USA) vers une nouvelle instance (France)
 * Spécifiquement adapté pour le projet Cineverse
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { SOURCE_SUPABASE, DESTINATION_SUPABASE, TABLES_TO_MIGRATE } from './supabase-config.js';

// Créer les clients Supabase
const sourceClient = createClient(SOURCE_SUPABASE.url, SOURCE_SUPABASE.key);
const destClient = createClient(DESTINATION_SUPABASE.url, DESTINATION_SUPABASE.key);

// Créer le dossier temporaire pour stocker les données
const tempDir = path.join(process.cwd(), 'temp_migration');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

/**
 * Fonction pour extraire les données d'une table
 * @param {string} tableName - Nom de la table
 * @returns {Promise<Array>} - Données extraites
 */
async function extractTableData(tableName) {
  console.log(`📤 Extraction des données de la table '${tableName}'...`);
  
  try {
    const { data, error } = await sourceClient
      .from(tableName)
      .select('*');
    
    if (error) {
      throw new Error(`Erreur lors de l'extraction des données: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log(`  ↳ Aucune donnée trouvée dans la table '${tableName}'.`);
      return [];
    }
    
    console.log(`  ↳ ${data.length} enregistrements extraits.`);
    
    // Sauvegarder les données dans un fichier temporaire
    const tempFile = path.join(tempDir, `${tableName}.json`);
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return [];
  }
}

/**
 * Fonction pour insérer les données dans une table
 * @param {string} tableName - Nom de la table
 * @param {Array} data - Données à insérer
 * @returns {Promise<Object>} - Résultat de l'insertion
 */
async function insertTableData(tableName, data) {
  console.log(`📥 Insertion des données dans la table '${tableName}'...`);
  
  if (!data || data.length === 0) {
    console.log(`  ↳ Aucune donnée à insérer.`);
    return { inserted: 0, errors: 0 };
  }
  
  try {
    // Insérer par lots pour éviter les limitations d'API
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const { error } = await destClient
        .from(tableName)
        .upsert(batch, { 
          onConflict: 'id',  // Utiliser l'ID comme clé de conflit
          ignoreDuplicates: false  // Mettre à jour si l'enregistrement existe déjà
        });
      
      if (error) {
        console.error(`  ↳ Erreur lors de l'insertion (lot ${Math.floor(i/batchSize) + 1}):`, error.message);
        errorCount += batch.length;
      } else {
        insertedCount += batch.length;
        console.log(`  ↳ Progression: ${Math.min(i + batchSize, data.length)}/${data.length} enregistrements`);
      }
    }
    
    return { inserted: insertedCount, errors: errorCount };
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return { inserted: 0, errors: data.length };
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Migration Supabase (USA vers France) - Projet Cineverse');
  console.log('=======================================================');
  console.log(`📤 Source: ${SOURCE_SUPABASE.url}`);
  console.log(`📥 Destination: ${DESTINATION_SUPABASE.url}`);
  console.log(`📁 Dossier temporaire: ${tempDir}`);
  console.log('\n');
  
  // Vérifier la connexion aux deux instances
  try {
    console.log('🔍 Vérification de la connexion aux instances Supabase...');
    
    // Vérifier l'instance source
    const { data: sourceData, error: sourceError } = await sourceClient
      .from('films')
      .select('count')
      .limit(1);
      
    if (sourceError) {
      throw new Error(`Erreur de connexion à l'instance source: ${sourceError.message}`);
    }
    
    console.log('✅ Connexion à l\'instance source établie.');
    
    // Vérifier l'instance destination (la table peut ne pas exister encore)
    const { data: destData, error: destError } = await destClient
      .from('films')
      .select('count')
      .limit(1);
      
    if (destError && !destError.message.includes('does not exist')) {
      throw new Error(`Erreur de connexion à l'instance destination: ${destError.message}`);
    }
    
    console.log('✅ Connexion à l\'instance destination établie.');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('Migration annulée.');
    process.exit(1);
  }
  
  console.log('\n🔄 Démarrage de la migration des tables...');
  
  const summary = [];
  let totalMigrated = 0;
  
  // Migrer chaque table dans l'ordre défini
  for (const tableName of TABLES_TO_MIGRATE) {
    console.log(`\n📋 Table: ${tableName}`);
    
    // Extraire les données
    const data = await extractTableData(tableName);
    
    // Insérer les données
    const result = await insertTableData(tableName, data);
    
    // Ajouter au résumé
    summary.push({
      table: tableName,
      extracted: data.length,
      inserted: result.inserted,
      errors: result.errors
    });
    
    totalMigrated += result.inserted;
    
    console.log(`✅ Migration de '${tableName}' terminée: ${result.inserted}/${data.length} enregistrements migrés ${result.errors > 0 ? `(${result.errors} erreurs)` : ''}`);
  }
  
  // Afficher le résumé
  console.log('\n📊 Résumé de la migration:');
  console.log('======================');
  
  summary.forEach(item => {
    console.log(`- ${item.table}: ${item.inserted}/${item.extracted} enregistrements migrés ${item.errors > 0 ? `(${item.errors} erreurs)` : ''}`);
  });
  
  console.log(`\n📊 Total des enregistrements migrés: ${totalMigrated}`);
  console.log(`📁 Les données extraites sont disponibles dans: ${tempDir}`);
  
  console.log('\n✅ Migration terminée!');
  console.log('\n⚠️ Prochaines étapes:');
  console.log('1. Vérifiez que toutes les données ont été correctement migrées');
  console.log('2. Mettez à jour votre fichier .env.local avec les nouvelles informations de connexion');
  console.log('3. Testez votre application avec la nouvelle instance Supabase');
}

// Exécuter la fonction principale
main().catch(error => {
  console.error('❌ Erreur inattendue:', error);
  process.exit(1);
});
