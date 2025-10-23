/**
 * Script pour corriger les slugs des films dans la base de données
 * 
 * Problèmes corrigés :
 * 1. Accents mal gérés : "à" → "a", "é" → "e", etc.
 * 2. Mots manquants : "À l'ouest" → "a-louest" au lieu de "louest"
 * 3. Caractères spéciaux mal gérés
 * 
 * Usage: node scripts/fix-slugs.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Fonction améliorée pour créer un slug
function createSlug(str) {
  if (!str) return '';
  
  return str
    .toString()
    .toLowerCase()
    .trim()
    // Normaliser les caractères Unicode (décompose les caractères accentués)
    .normalize('NFD')
    // Supprimer les diacritiques (accents)
    .replace(/[\u0300-\u036f]/g, '')
    // Gestion explicite des caractères qui pourraient ne pas être normalisés
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    // Supprimer les apostrophes (pas de tiret pour l'article)
    .replace(/[''`]/g, '')
    // Remplacer les espaces et underscores par des tirets
    .replace(/[\s_]+/g, '-')
    // Supprimer tous les caractères non alphanumériques sauf les tirets
    .replace(/[^\w-]+/g, '')
    // Remplacer les tirets multiples par un seul tiret
    .replace(/--+/g, '-')
    // Supprimer les tirets au début et à la fin
    .replace(/^-+|-+$/g, '');
}

async function fixSlugs() {
  // Initialiser Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('🔍 Récupération de tous les films...\n');

  // Récupérer tous les films
  const { data: films, error } = await supabase
    .from('films')
    .select('id, title, slug')
    .order('title');

  if (error) {
    console.error('❌ Erreur lors de la récupération des films:', error);
    return;
  }

  console.log(`📊 ${films.length} films trouvés\n`);

  const filmsToUpdate = [];
  const slugMap = new Map(); // Pour détecter les doublons

  // Analyser chaque film
  for (const film of films) {
    const correctSlug = createSlug(film.title);
    
    if (film.slug !== correctSlug) {
      // Vérifier si le nouveau slug existe déjà
      if (slugMap.has(correctSlug)) {
        console.log(`⚠️  DOUBLON DÉTECTÉ:`);
        console.log(`   Titre: "${film.title}"`);
        console.log(`   Slug actuel: "${film.slug}"`);
        console.log(`   Nouveau slug: "${correctSlug}" (déjà utilisé par "${slugMap.get(correctSlug)}")`);
        console.log(`   → Ajout de l'ID pour rendre unique\n`);
        
        // Ajouter l'ID pour rendre le slug unique
        const uniqueSlug = `${correctSlug}-${film.id}`;
        filmsToUpdate.push({
          id: film.id,
          title: film.title,
          oldSlug: film.slug,
          newSlug: uniqueSlug
        });
        slugMap.set(uniqueSlug, film.title);
      } else {
        filmsToUpdate.push({
          id: film.id,
          title: film.title,
          oldSlug: film.slug,
          newSlug: correctSlug
        });
        slugMap.set(correctSlug, film.title);
      }
    } else {
      slugMap.set(film.slug, film.title);
    }
  }

  if (filmsToUpdate.length === 0) {
    console.log('✅ Tous les slugs sont déjà corrects !\n');
    return;
  }

  console.log(`\n📝 ${filmsToUpdate.length} films à mettre à jour:\n`);
  
  // Afficher les changements
  for (const film of filmsToUpdate) {
    console.log(`📌 "${film.title}"`);
    console.log(`   Ancien: ${film.oldSlug}`);
    console.log(`   Nouveau: ${film.newSlug}`);
    console.log('');
  }

  // Demander confirmation (en mode interactif)
  console.log('\n⚠️  ATTENTION: Cette opération va modifier la base de données !');
  console.log('🔄 Mise à jour en cours...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const film of filmsToUpdate) {
    const { error: updateError } = await supabase
      .from('films')
      .update({ slug: film.newSlug })
      .eq('id', film.id);

    if (updateError) {
      console.error(`❌ Erreur pour "${film.title}":`, updateError.message);
      errorCount++;
    } else {
      console.log(`✅ Mis à jour: "${film.title}"`);
      successCount++;
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ Succès: ${successCount}`);
  console.log(`   ❌ Erreurs: ${errorCount}`);
  console.log(`   📝 Total: ${filmsToUpdate.length}\n`);
}

// Exécuter le script
fixSlugs().catch(console.error);
