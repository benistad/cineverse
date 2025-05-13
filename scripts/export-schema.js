/**
 * Script pour exporter le schéma d'une table Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { SOURCE_SUPABASE } from './supabase-config.js';

// Créer le client Supabase
const supabase = createClient(SOURCE_SUPABASE.url, SOURCE_SUPABASE.key);

// Table à analyser
const TABLE_NAME = 'films';

async function exportTableSchema() {
  console.log(`📋 Analyse de la structure de la table '${TABLE_NAME}'...`);
  
  try {
    // Récupérer quelques enregistrements pour analyser la structure
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .limit(5);
    
    if (error) {
      throw new Error(`Erreur lors de la récupération des données: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Aucune donnée trouvée dans la table '${TABLE_NAME}'.`);
    }
    
    // Analyser la structure à partir des données
    const sample = data[0];
    const schema = {};
    
    for (const [key, value] of Object.entries(sample)) {
      let type = typeof value;
      
      // Déterminer le type PostgreSQL approprié
      let pgType;
      if (type === 'number') {
        if (Number.isInteger(value)) {
          pgType = 'integer';
        } else {
          pgType = 'numeric';
        }
      } else if (type === 'string') {
        if (value.length > 255) {
          pgType = 'text';
        } else {
          pgType = 'varchar';
        }
        
        // Vérifier si c'est une date
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          pgType = 'date';
        }
        
        // Vérifier si c'est un timestamp
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          pgType = 'timestamp with time zone';
        }
      } else if (type === 'boolean') {
        pgType = 'boolean';
      } else if (type === 'object') {
        if (value === null) {
          pgType = 'text'; // Par défaut pour les valeurs nulles
        } else if (Array.isArray(value)) {
          pgType = 'jsonb';
        } else {
          pgType = 'jsonb';
        }
      } else {
        pgType = 'text'; // Type par défaut
      }
      
      schema[key] = {
        type,
        pgType,
        nullable: true, // Par défaut, on suppose que les champs sont nullables
        sample: value
      };
    }
    
    // Identifier la clé primaire (supposons que c'est 'id')
    if (schema.id) {
      schema.id.primaryKey = true;
      schema.id.nullable = false;
    }
    
    // Générer le SQL pour créer la table
    let createTableSQL = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (\n`;
    
    const columns = [];
    for (const [key, info] of Object.entries(schema)) {
      let columnDef = `  "${key}" ${info.pgType}`;
      
      if (info.primaryKey) {
        columnDef += ' PRIMARY KEY';
      }
      
      if (!info.nullable) {
        columnDef += ' NOT NULL';
      }
      
      columns.push(columnDef);
    }
    
    createTableSQL += columns.join(',\n');
    createTableSQL += '\n);';
    
    // Sauvegarder le schéma et le SQL
    const outputDir = path.join(process.cwd(), 'schema');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    fs.writeFileSync(
      path.join(outputDir, `${TABLE_NAME}_schema.json`),
      JSON.stringify(schema, null, 2)
    );
    
    fs.writeFileSync(
      path.join(outputDir, `${TABLE_NAME}_create.sql`),
      createTableSQL
    );
    
    console.log(`✅ Schéma de la table '${TABLE_NAME}' exporté avec succès.`);
    console.log(`📁 Fichiers sauvegardés dans le dossier 'schema'.`);
    
    // Afficher le SQL
    console.log('\n📝 SQL pour créer la table:');
    console.log(createTableSQL);
    
    return { schema, createTableSQL };
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return null;
  }
}

// Exécuter la fonction
exportTableSchema().catch(console.error);
