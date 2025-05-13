/**
 * Script de restauration pour Supabase (plan gratuit)
 * Ce script importe les données depuis des fichiers JSON de sauvegarde
 * vers votre base de données Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import readline from 'readline';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Vérifier que les variables d'environnement sont définies
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies dans le fichier .env.local');
  process.exit(1);
}

// Créer le client Supabase avec la clé de service (pour avoir accès à toutes les tables)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Interface pour les entrées utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Fonction pour lister les sauvegardes disponibles
 * @returns {Array<string>} - Liste des dossiers de sauvegarde
 */
function listAvailableBackups() {
  const backupDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    console.error('Aucun dossier de sauvegarde trouvé.');
    process.exit(1);
  }
  
  const backups = fs.readdirSync(backupDir)
    .filter(dir => dir.startsWith('backup-'))
    .map(dir => {
      const fullPath = path.join(backupDir, dir);
      const stats = fs.statSync(fullPath);
      return {
        name: dir,
        path: fullPath,
        date: stats.mtime
      };
    })
    .sort((a, b) => b.date - a.date); // Trier par date, plus récent en premier
  
  if (backups.length === 0) {
    console.error('Aucune sauvegarde trouvée dans le dossier backups.');
    process.exit(1);
  }
  
  console.log('Sauvegardes disponibles:');
  backups.forEach((backup, index) => {
    console.log(`${index + 1}. ${backup.name} (${backup.date.toLocaleString()})`);
  });
  
  return backups;
}

/**
 * Fonction pour restaurer une table
 * @param {string} tableName - Nom de la table
 * @param {string} backupPath - Chemin vers le fichier de sauvegarde
 * @returns {Promise<number>} - Nombre d'enregistrements restaurés
 */
async function restoreTable(tableName, backupPath) {
  console.log(`Restauration de la table ${tableName}...`);
  
  try {
    // Lire le fichier de sauvegarde
    const filePath = path.join(backupPath, `${tableName}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Fichier de sauvegarde pour la table ${tableName} introuvable.`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`⚠️ Aucune donnée à restaurer pour la table ${tableName}.`);
      return 0;
    }
    
    // Supprimer les données existantes (optionnel, à utiliser avec précaution)
    console.log(`Suppression des données existantes de la table ${tableName}...`);
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .neq('id', -1); // Condition toujours vraie pour supprimer toutes les lignes
    
    if (deleteError) {
      console.error(`Erreur lors de la suppression des données de ${tableName}:`, deleteError);
      // Continuer malgré l'erreur
    }
    
    // Insérer les données sauvegardées
    console.log(`Insertion de ${data.length} enregistrements dans la table ${tableName}...`);
    
    // Insérer par lots pour éviter les limitations d'API
    const batchSize = 100;
    let successCount = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batch);
      
      if (insertError) {
        console.error(`Erreur lors de l'insertion dans ${tableName} (lot ${i/batchSize + 1}):`, insertError);
      } else {
        successCount += batch.length;
        console.log(`Progression: ${Math.min(i + batchSize, data.length)}/${data.length} enregistrements`);
      }
    }
    
    console.log(`✅ Table ${tableName} restaurée avec succès (${successCount}/${data.length} enregistrements)`);
    return successCount;
  } catch (error) {
    console.error(`❌ Erreur lors de la restauration de la table ${tableName}:`, error);
    return 0;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Utilitaire de restauration Supabase');
  
  // Lister les sauvegardes disponibles
  const backups = listAvailableBackups();
  
  // Demander à l'utilisateur quelle sauvegarde restaurer
  rl.question('Entrez le numéro de la sauvegarde à restaurer: ', async (answer) => {
    const backupIndex = parseInt(answer) - 1;
    
    if (isNaN(backupIndex) || backupIndex < 0 || backupIndex >= backups.length) {
      console.error('Numéro de sauvegarde invalide.');
      rl.close();
      process.exit(1);
    }
    
    const selectedBackup = backups[backupIndex];
    console.log(`Vous avez sélectionné: ${selectedBackup.name}`);
    
    // Demander confirmation
    rl.question('Cette opération va remplacer les données existantes. Continuer? (oui/non): ', async (confirm) => {
      if (confirm.toLowerCase() !== 'oui') {
        console.log('Opération annulée.');
        rl.close();
        return;
      }
      
      console.log(`🔄 Démarrage de la restauration depuis: ${selectedBackup.path}`);
      
      // Lire le fichier de métadonnées pour connaître les tables
      const metadataPath = path.join(selectedBackup.path, 'metadata.json');
      
      if (!fs.existsSync(metadataPath)) {
        console.error('Fichier de métadonnées introuvable. Impossible de continuer.');
        rl.close();
        process.exit(1);
      }
      
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const tables = metadata.tables || [];
      
      if (tables.length === 0) {
        console.error('Aucune table à restaurer dans les métadonnées.');
        rl.close();
        process.exit(1);
      }
      
      let totalRestored = 0;
      
      // Restaurer chaque table
      for (const table of tables) {
        const restoredCount = await restoreTable(table, selectedBackup.path);
        totalRestored += restoredCount;
      }
      
      console.log('\n✅ Restauration terminée!');
      console.log(`📊 Total des enregistrements restaurés: ${totalRestored}`);
      
      rl.close();
    });
  });
}

main().catch(error => {
  console.error('Erreur lors de la restauration:', error);
  rl.close();
  process.exit(1);
});
