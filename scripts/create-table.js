/**
 * Script pour créer la table films dans l'instance Supabase française
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { DESTINATION_SUPABASE } from './supabase-config.js';

// Créer le client Supabase pour l'instance de destination
const supabase = createClient(DESTINATION_SUPABASE.url, DESTINATION_SUPABASE.key);

// Définition du schéma de la table films
const createTableSQL = `
CREATE TABLE IF NOT EXISTS films (
  "id" varchar PRIMARY KEY NOT NULL,
  "tmdb_id" integer,
  "title" varchar,
  "slug" varchar,
  "synopsis" varchar,
  "poster_url" varchar,
  "backdrop_url" varchar,
  "note_sur_10" integer,
  "youtube_trailer_key" text,
  "date_ajout" timestamp with time zone,
  "created_at" timestamp with time zone,
  "why_watch_enabled" boolean,
  "why_watch_content" text,
  "release_date" date,
  "genres" varchar,
  "is_hidden_gem" boolean
);
`;

async function createTable() {
  console.log('🔄 Création de la table films dans l\'instance Supabase française...');
  
  try {
    // Utiliser l'API SQL de Supabase pour créer la table
    const { data, error } = await supabase.rpc('execute_sql', { sql: createTableSQL });
    
    if (error) {
      // Si la fonction RPC n'est pas disponible, essayons une autre approche
      console.log('Méthode RPC non disponible, utilisation d\'une approche alternative...');
      
      // Utiliser l'interface REST pour créer la table
      // Note: Cette approche est limitée avec un plan gratuit, mais essayons
      
      // D'abord, vérifions si la table existe déjà
      const { error: checkError } = await supabase
        .from('films')
        .select('count')
        .limit(1);
      
      if (!checkError) {
        console.log('✅ La table films existe déjà dans l\'instance de destination.');
        return true;
      }
      
      console.log('❌ Impossible de créer la table via l\'API.');
      console.log('⚠️ Vous devrez créer la table manuellement via l\'interface SQL de Supabase.');
      console.log('\n📝 Voici le SQL à exécuter dans l\'éditeur SQL de Supabase:');
      console.log(createTableSQL);
      
      return false;
    }
    
    console.log('✅ Table films créée avec succès dans l\'instance de destination.');
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('⚠️ Vous devrez créer la table manuellement via l\'interface SQL de Supabase.');
    console.log('\n📝 Voici le SQL à exécuter dans l\'éditeur SQL de Supabase:');
    console.log(createTableSQL);
    
    return false;
  }
}

// Exécuter la fonction
createTable().catch(console.error);
