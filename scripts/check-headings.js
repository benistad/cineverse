#!/usr/bin/env node

/**
 * Script pour vérifier que toutes les pages de films ont des balises H1 et H2 appropriées
 * Ce script peut être exécuté régulièrement pour s'assurer que tous les nouveaux films
 * respectent les standards SEO.
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// URL de base du site
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Fonction principale
async function main() {
  try {
    console.log('🔍 Vérification des balises H1 et H2 sur les pages de films...');
    
    // Récupérer tous les films depuis Supabase
    const { data: films, error } = await supabase
      .from('films')
      .select('id, title, slug')
      .order('date_ajout', { ascending: false });
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des films:', error);
      process.exit(1);
    }
    
    console.log(`📊 Nombre de films trouvés: ${films.length}`);
    
    // Tableau pour stocker les résultats
    const results = {
      total: films.length,
      checked: 0,
      missingH1: [],
      missingH2: [],
      errors: []
    };
    
    // Vérifier chaque film
    for (const film of films) {
      try {
        // Construire l'URL de la page du film
        const filmUrl = `${baseUrl}/films/${film.slug}`;
        console.log(`🔎 Vérification de: ${film.title} (${filmUrl})`);
        
        // Récupérer le contenu HTML de la page
        const response = await fetch(filmUrl);
        const html = await response.text();
        
        // Parser le HTML
        const root = parse(html);
        
        // Vérifier les balises H1
        const h1Tags = root.querySelectorAll('h1');
        if (h1Tags.length === 0) {
          console.log(`❌ Balise H1 manquante pour: ${film.title}`);
          results.missingH1.push({ id: film.id, title: film.title, slug: film.slug });
        }
        
        // Vérifier les balises H2
        const h2Tags = root.querySelectorAll('h2');
        if (h2Tags.length === 0) {
          console.log(`❌ Balise H2 manquante pour: ${film.title}`);
          results.missingH2.push({ id: film.id, title: film.title, slug: film.slug });
        }
        
        results.checked++;
      } catch (err) {
        console.error(`❌ Erreur lors de la vérification de ${film.title}:`, err);
        results.errors.push({ id: film.id, title: film.title, error: err.message });
      }
    }
    
    // Afficher un résumé
    console.log('\n📝 Résumé:');
    console.log(`Total des films: ${results.total}`);
    console.log(`Films vérifiés: ${results.checked}`);
    console.log(`Films sans balise H1: ${results.missingH1.length}`);
    console.log(`Films sans balise H2: ${results.missingH2.length}`);
    console.log(`Erreurs: ${results.errors.length}`);
    
    // Sauvegarder les résultats dans un fichier JSON
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const outputFile = path.join(__dirname, `../logs/heading-check-${timestamp}.json`);
    
    // Créer le dossier logs s'il n'existe pas
    if (!fs.existsSync(path.join(__dirname, '../logs'))) {
      fs.mkdirSync(path.join(__dirname, '../logs'));
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`📄 Résultats sauvegardés dans: ${outputFile}`);
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main();
