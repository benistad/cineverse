/**
 * Script de migration Supabase
 * Ce script migre les données d'une instance Supabase (USA) vers une nouvelle instance (France)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import readline from 'readline';

// Interface pour les entrées utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour demander des informations à l'utilisateur
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Utilitaire de migration Supabase (USA vers France)');
  console.log('====================================================');
  
  // Demander les informations de connexion pour les deux instances
  console.log('\n📌 Instance SOURCE (USA):');
  const sourceUrl = await question('URL Supabase source (USA): ');
  const sourceKey = await question('Clé de service (service_role) source: ');
  
  console.log('\n📌 Instance DESTINATION (France):');
  const destUrl = await question('URL Supabase destination (France): ');
  const destKey = await question('Clé de service (service_role) destination: ');
  
  // Créer les clients Supabase
  const sourceClient = createClient(sourceUrl, sourceKey);
  const destClient = createClient(destUrl, destKey);
  
  // Vérifier la connexion aux deux instances
  try {
    const { data: sourceData, error: sourceError } = await sourceClient.from('films').select('count').limit(1);
    if (sourceError) throw new Error(`Erreur de connexion à l'instance source: ${sourceError.message}`);
    
    const { data: destData, error: destError } = await destClient.from('films').select('count').limit(1);
    // Si la table n'existe pas encore, ce n'est pas une erreur fatale
    if (destError && !destError.message.includes('does not exist')) {
      throw new Error(`Erreur de connexion à l'instance destination: ${destError.message}`);
    }
    
    console.log('✅ Connexion établie avec les deux instances Supabase');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    rl.close();
    process.exit(1);
  }
  
  // Définir l'ordre de migration des tables (important pour les relations)
  const migrationOrder = [
    'genres',           // Pas de dépendances
    'staff_members',    // Pas de dépendances
    'films',            // Peut avoir des références aux genres
    'staff_picks',      // Dépend de films et staff_members
    // Ajoutez ici toutes vos autres tables dans l'ordre approprié
  ];
  
  // Demander confirmation
  console.log('\n⚠️ Cette opération va migrer les données de l\'instance USA vers l\'instance France.');
  console.log('Les tables existantes dans l\'instance de destination ne seront PAS vidées.');
  console.log('Ordre de migration des tables:', migrationOrder.join(', '));
  
  const confirm = await question('\nVoulez-vous continuer? (oui/non): ');
  if (confirm.toLowerCase() !== 'oui') {
    console.log('Migration annulée.');
    rl.close();
    return;
  }
  
  // Créer un dossier temporaire pour stocker les données
  const tempDir = path.join(process.cwd(), 'temp_migration');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  console.log('\n🔄 Démarrage de la migration...');
  
  let totalMigrated = 0;
  let tableSummary = [];
  
  // Migrer chaque table dans l'ordre
  for (const table of migrationOrder) {
    console.log(`\n📋 Migration de la table '${table}'...`);
    
    try {
      // 1. Extraire les données de la source
      console.log(`  ↳ Extraction des données depuis l'instance source...`);
      const { data, error } = await sourceClient.from(table).select('*');
      
      if (error) {
        console.error(`❌ Erreur lors de l'extraction des données de '${table}':`, error.message);
        console.log(`  ↳ Passage à la table suivante...`);
        continue;
      }
      
      if (!data || data.length === 0) {
        console.log(`  ↳ Aucune donnée trouvée dans la table '${table}'. Passage à la suivante.`);
        continue;
      }
      
      console.log(`  ↳ ${data.length} enregistrements extraits.`);
      
      // Sauvegarder les données dans un fichier temporaire (utile en cas d'erreur)
      const tempFile = path.join(tempDir, `${table}.json`);
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
      
      // 2. Insérer les données dans la destination
      console.log(`  ↳ Insertion des données dans l'instance destination...`);
      
      // Insérer par lots pour éviter les limitations d'API
      const batchSize = 100;
      let insertedCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const { error: insertError } = await destClient.from(table).upsert(batch, { 
          onConflict: 'id',  // Utiliser l'ID comme clé de conflit
          ignoreDuplicates: false  // Mettre à jour si l'enregistrement existe déjà
        });
        
        if (insertError) {
          console.error(`  ↳ Erreur lors de l'insertion dans '${table}' (lot ${Math.floor(i/batchSize) + 1}):`, insertError.message);
          errorCount += batch.length;
        } else {
          insertedCount += batch.length;
          console.log(`  ↳ Progression: ${Math.min(i + batchSize, data.length)}/${data.length} enregistrements`);
        }
      }
      
      console.log(`✅ Table '${table}' migrée: ${insertedCount} insérés, ${errorCount} erreurs`);
      totalMigrated += insertedCount;
      
      tableSummary.push({
        table,
        extracted: data.length,
        inserted: insertedCount,
        errors: errorCount
      });
      
    } catch (error) {
      console.error(`❌ Erreur inattendue lors de la migration de '${table}':`, error.message);
    }
  }
  
  // Afficher le résumé
  console.log('\n✅ Migration terminée!');
  console.log('=====================');
  console.log('Résumé par table:');
  
  tableSummary.forEach(item => {
    console.log(`- ${item.table}: ${item.inserted}/${item.extracted} enregistrements migrés ${item.errors > 0 ? `(${item.errors} erreurs)` : ''}`);
  });
  
  console.log(`\n📊 Total des enregistrements migrés: ${totalMigrated}`);
  console.log(`📁 Les données extraites sont disponibles dans: ${tempDir}`);
  console.log('\n⚠️ N\'oubliez pas de vérifier les relations entre les tables et les séquences d\'ID dans la nouvelle instance.');
  
  rl.close();
}

main().catch(error => {
  console.error('Erreur lors de la migration:', error);
  rl.close();
  process.exit(1);
});
