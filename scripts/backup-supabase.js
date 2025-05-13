/**
 * Script de sauvegarde pour Supabase (plan gratuit)
 * Ce script exporte les données de toutes les tables de votre base Supabase
 * et les sauvegarde dans des fichiers JSON dans le dossier /backups
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

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

// Créer le dossier de sauvegarde s'il n'existe pas
const backupDir = path.join(process.cwd(), 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupSubDir = path.join(backupDir, `backup-${timestamp}`);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}
fs.mkdirSync(backupSubDir);

// Liste des tables à sauvegarder (à adapter selon votre schéma)
const tables = [
  'films',
  'genres',
  'staff_picks',
  'staff_members',
  // Ajoutez ici toutes vos autres tables
];

/**
 * Fonction pour sauvegarder une table
 * @param {string} tableName - Nom de la table
 * @returns {Promise<void>}
 */
async function backupTable(tableName) {
  console.log(`Sauvegarde de la table ${tableName}...`);
  
  try {
    // Récupérer toutes les données de la table
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Écrire les données dans un fichier JSON
    const filePath = path.join(backupSubDir, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Table ${tableName} sauvegardée avec succès (${data.length} enregistrements)`);
    return data.length;
  } catch (error) {
    console.error(`❌ Erreur lors de la sauvegarde de la table ${tableName}:`, error);
    return 0;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Démarrage de la sauvegarde Supabase...');
  console.log(`📁 Les fichiers seront sauvegardés dans: ${backupSubDir}`);
  
  let totalRecords = 0;
  
  // Sauvegarder chaque table
  for (const table of tables) {
    const recordCount = await backupTable(table);
    totalRecords += recordCount;
  }
  
  // Créer un fichier de métadonnées
  const metadata = {
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    tables: tables,
    totalRecords: totalRecords
  };
  
  fs.writeFileSync(
    path.join(backupSubDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('\n✅ Sauvegarde terminée avec succès!');
  console.log(`📊 Total des enregistrements sauvegardés: ${totalRecords}`);
  console.log(`📁 Sauvegarde disponible dans: ${backupSubDir}`);
}

main().catch(error => {
  console.error('Erreur lors de la sauvegarde:', error);
  process.exit(1);
});
