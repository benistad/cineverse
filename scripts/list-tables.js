/**
 * Script pour lister les tables disponibles dans Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { SOURCE_SUPABASE } from './supabase-config.js';

// Créer le client Supabase
const supabase = createClient(SOURCE_SUPABASE.url, SOURCE_SUPABASE.key);

async function listTables() {
  console.log('📋 Recherche des tables disponibles dans Supabase...');
  
  try {
    // Essayer d'obtenir la liste des tables via l'API
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      console.log('Méthode RPC non disponible, utilisation d\'une approche alternative...');
      
      // Approche alternative : essayer de lire quelques tables courantes
      const potentialTables = [
        'films', 'movies', 'users', 'profiles', 'genres', 'categories', 
        'staff_members', 'staff_picks', 'reviews', 'ratings', 'comments',
        'actors', 'directors', 'crew', 'tags', 'bookmarks', 'favorites'
      ];
      
      const existingTables = [];
      
      for (const table of potentialTables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          if (!error) {
            existingTables.push(table);
            console.log(`✅ Table trouvée: ${table}`);
          }
        } catch (e) {
          // Ignorer les erreurs
        }
      }
      
      if (existingTables.length === 0) {
        console.log('❌ Aucune table trouvée.');
      } else {
        console.log(`\n📊 Tables trouvées: ${existingTables.length}`);
        console.log(existingTables.join(', '));
      }
      
      return existingTables;
    }
    
    console.log('📊 Tables trouvées:');
    console.log(data);
    return data;
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return [];
  }
}

// Exécuter la fonction
listTables().catch(console.error);
