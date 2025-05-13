/**
 * Script pour appliquer la migration d'ajout du champ carousel_image_url à la table films
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
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

// Lire le contenu du fichier de migration
const migrationFilePath = path.join(process.cwd(), 'migrations', 'add_carousel_image_url.sql');
const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Application de la migration pour ajouter carousel_image_url à la table films');
  console.log('=======================================================');
  
  try {
    // Vérifier la connexion à Supabase
    console.log('🔍 Vérification de la connexion à Supabase...');
    
    const { data: testData, error: testError } = await supabase
      .from('films')
      .select('count')
      .limit(1);
      
    if (testError) {
      throw new Error(`Erreur de connexion à Supabase: ${testError.message}`);
    }
    
    console.log('✅ Connexion à Supabase établie.');
    
    // Exécuter la requête SQL via l'API rpc de Supabase
    console.log('🔧 Exécution de la migration SQL...');
    console.log(`SQL à exécuter: ${migrationSQL}`);
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      throw new Error(`Erreur lors de l'exécution de la migration: ${error.message}`);
    }
    
    console.log('✅ Migration appliquée avec succès!');
    
    // Vérifier que la colonne a bien été ajoutée
    console.log('🔍 Vérification de la présence de la nouvelle colonne...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('films')
      .select('carousel_image_url')
      .limit(1);
      
    if (verifyError && verifyError.message.includes('column "carousel_image_url" does not exist')) {
      throw new Error('La colonne carousel_image_url n\'a pas été correctement ajoutée.');
    }
    
    console.log('✅ Colonne carousel_image_url correctement ajoutée à la table films.');
    
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    
    // Si l'erreur est due à l'absence de la fonction exec_sql, proposer une alternative
    if (error.message.includes('function exec_sql') || error.message.includes('rpc')) {
      console.log('\n⚠️ Note: La fonction exec_sql n\'est peut-être pas disponible dans votre instance Supabase.');
      console.log('Vous pouvez appliquer cette migration manuellement via l\'interface SQL de Supabase:');
      console.log('1. Connectez-vous à votre dashboard Supabase');
      console.log('2. Allez dans "SQL Editor"');
      console.log('3. Créez une nouvelle requête et collez le contenu suivant:');
      console.log('\n' + migrationSQL + '\n');
      console.log('4. Exécutez la requête');
    }
    
    process.exit(1);
  }
}

// Exécuter la fonction principale
main().catch(error => {
  console.error('❌ Erreur inattendue:', error);
  process.exit(1);
});
