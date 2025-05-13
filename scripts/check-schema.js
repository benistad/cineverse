/**
 * Script de vérification du schéma Supabase
 * Compare les structures de tables entre deux instances Supabase
 */

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Interface pour les entrées utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour demander des informations à l'utilisateur
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Récupère la structure des tables d'une instance Supabase
 * @param {Object} supabase - Client Supabase
 * @returns {Promise<Object>} - Structure des tables
 */
async function getTableStructure(supabase) {
  try {
    // Utiliser la fonction système de Postgres pour obtenir les informations sur les tables
    const { data, error } = await supabase.rpc('get_schema_info');
    
    if (error) {
      // Si la fonction RPC n'existe pas, nous devons la créer
      console.log('Création de la fonction get_schema_info...');
      
      const { error: createError } = await supabase.rpc('create_schema_info_function', {});
      
      if (createError) {
        // Si nous ne pouvons pas créer la fonction, créons-la manuellement
        const createFunctionSQL = `
          CREATE OR REPLACE FUNCTION get_schema_info()
          RETURNS JSONB AS $$
          DECLARE
              result JSONB;
          BEGIN
              SELECT jsonb_object_agg(table_name, columns)
              INTO result
              FROM (
                  SELECT 
                      t.table_name,
                      jsonb_agg(
                          jsonb_build_object(
                              'column_name', c.column_name,
                              'data_type', c.data_type,
                              'is_nullable', c.is_nullable,
                              'column_default', c.column_default
                          ) ORDER BY c.ordinal_position
                      ) AS columns
                  FROM 
                      information_schema.tables t
                  JOIN 
                      information_schema.columns c ON t.table_name = c.table_name
                  WHERE 
                      t.table_schema = 'public'
                      AND t.table_type = 'BASE TABLE'
                  GROUP BY 
                      t.table_name
              ) subquery;
              
              RETURN result;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
        
        if (sqlError) {
          throw new Error(`Impossible de créer la fonction d'analyse de schéma: ${sqlError.message}`);
        }
        
        // Réessayer d'appeler la fonction
        const { data: retryData, error: retryError } = await supabase.rpc('get_schema_info');
        
        if (retryError) {
          throw new Error(`Impossible d'obtenir les informations de schéma: ${retryError.message}`);
        }
        
        return retryData;
      }
      
      // Réessayer après avoir créé la fonction
      const { data: newData, error: newError } = await supabase.rpc('get_schema_info');
      
      if (newError) {
        throw new Error(`Impossible d'obtenir les informations de schéma: ${newError.message}`);
      }
      
      return newData;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la structure des tables:', error.message);
    
    // Méthode alternative: récupérer manuellement la liste des tables puis leurs colonnes
    console.log('Utilisation d\'une méthode alternative pour obtenir la structure...');
    
    // Récupérer la liste des tables
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      throw new Error(`Impossible de récupérer la liste des tables: ${tablesError.message}`);
    }
    
    // Structure à retourner
    const structure = {};
    
    // Pour chaque table, récupérer ses colonnes
    for (const table of tables) {
      const tableName = table.tablename;
      
      // Récupérer les colonnes de la table
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName);
      
      if (columnsError) {
        console.error(`Impossible de récupérer les colonnes de la table ${tableName}:`, columnsError.message);
        continue;
      }
      
      structure[tableName] = columns;
    }
    
    return structure;
  }
}

/**
 * Compare deux structures de tables
 * @param {Object} source - Structure source
 * @param {Object} destination - Structure destination
 * @returns {Object} - Différences trouvées
 */
function compareStructures(source, destination) {
  const differences = {
    missingTables: [],
    missingColumns: {},
    typeMismatches: {}
  };
  
  // Vérifier les tables manquantes
  for (const tableName in source) {
    if (!destination[tableName]) {
      differences.missingTables.push(tableName);
      continue;
    }
    
    // Vérifier les colonnes manquantes ou avec des types différents
    const sourceColumns = source[tableName];
    const destColumns = destination[tableName];
    
    // Convertir les colonnes de destination en map pour un accès plus facile
    const destColumnMap = {};
    destColumns.forEach(col => {
      destColumnMap[col.column_name] = col;
    });
    
    // Vérifier chaque colonne source
    for (const sourceCol of sourceColumns) {
      const columnName = sourceCol.column_name;
      
      // Colonne manquante
      if (!destColumnMap[columnName]) {
        if (!differences.missingColumns[tableName]) {
          differences.missingColumns[tableName] = [];
        }
        differences.missingColumns[tableName].push(columnName);
        continue;
      }
      
      // Type de données différent
      const destCol = destColumnMap[columnName];
      if (sourceCol.data_type !== destCol.data_type) {
        if (!differences.typeMismatches[tableName]) {
          differences.typeMismatches[tableName] = [];
        }
        differences.typeMismatches[tableName].push({
          column: columnName,
          sourceType: sourceCol.data_type,
          destType: destCol.data_type
        });
      }
    }
  }
  
  return differences;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔍 Vérification du schéma entre deux instances Supabase');
  console.log('=====================================================');
  
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
  
  try {
    console.log('\n🔄 Récupération de la structure des tables de l\'instance SOURCE...');
    const sourceStructure = await getTableStructure(sourceClient);
    
    console.log('🔄 Récupération de la structure des tables de l\'instance DESTINATION...');
    const destStructure = await getTableStructure(destClient);
    
    console.log('\n🔍 Comparaison des structures...');
    const differences = compareStructures(sourceStructure, destStructure);
    
    // Afficher les résultats
    console.log('\n📊 Résultats de la comparaison:');
    
    if (differences.missingTables.length === 0 && 
        Object.keys(differences.missingColumns).length === 0 && 
        Object.keys(differences.typeMismatches).length === 0) {
      console.log('✅ Les deux instances ont des structures identiques!');
    } else {
      console.log('⚠️ Des différences ont été détectées:');
      
      // Tables manquantes
      if (differences.missingTables.length > 0) {
        console.log('\n❌ Tables manquantes dans l\'instance DESTINATION:');
        differences.missingTables.forEach(table => {
          console.log(`  - ${table}`);
        });
      }
      
      // Colonnes manquantes
      if (Object.keys(differences.missingColumns).length > 0) {
        console.log('\n❌ Colonnes manquantes dans l\'instance DESTINATION:');
        for (const table in differences.missingColumns) {
          console.log(`  - Table '${table}': ${differences.missingColumns[table].join(', ')}`);
        }
      }
      
      // Types incompatibles
      if (Object.keys(differences.typeMismatches).length > 0) {
        console.log('\n⚠️ Types de données incompatibles:');
        for (const table in differences.typeMismatches) {
          console.log(`  - Table '${table}':`);
          differences.typeMismatches[table].forEach(mismatch => {
            console.log(`    • Colonne '${mismatch.column}': ${mismatch.sourceType} (source) vs ${mismatch.destType} (destination)`);
          });
        }
      }
      
      console.log('\n⚠️ Vous devrez créer les tables/colonnes manquantes avant de procéder à la migration des données.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du schéma:', error.message);
  }
  
  rl.close();
}

main().catch(error => {
  console.error('Erreur inattendue:', error);
  rl.close();
  process.exit(1);
});
