#!/usr/bin/env node

/**
 * Script pour vérifier les balises SEO sur les pages de films
 * Cela permet d'identifier les pages qui pourraient avoir des problèmes d'indexation
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { parse } = require('node-html-parser');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
const OUTPUT_FILE = path.join(__dirname, '../film-pages-seo-report.json');
const SAMPLE_SIZE = 10; // Nombre de films à vérifier (limité pour éviter de surcharger le serveur)

/**
 * Récupère un échantillon de films depuis l'API
 */
async function fetchSampleFilms() {
  try {
    const response = await axios.get(`${BASE_URL}/api/sitemap-films`);
    const films = response.data || [];
    
    // Prendre un échantillon aléatoire
    const sampleFilms = [];
    const totalFilms = films.length;
    
    if (totalFilms <= SAMPLE_SIZE) {
      return films;
    }
    
    // Sélectionner des films aléatoirement
    const indices = new Set();
    while (indices.size < SAMPLE_SIZE) {
      const randomIndex = Math.floor(Math.random() * totalFilms);
      indices.add(randomIndex);
    }
    
    // Construire l'échantillon
    for (const index of indices) {
      sampleFilms.push(films[index]);
    }
    
    return sampleFilms;
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return [];
  }
}

/**
 * Vérifie les balises SEO d'une page de film
 */
async function checkFilmPageSEO(film) {
  const slug = film.slug || film.id;
  const url = `${BASE_URL}/films/${slug}`;
  
  try {
    const response = await axios.get(url);
    const html = response.data;
    const root = parse(html);
    
    // Vérifier la balise title
    const title = root.querySelector('title');
    const titleContent = title ? title.text : null;
    
    // Vérifier la balise canonical
    const canonical = root.querySelector('link[rel="canonical"]');
    const canonicalHref = canonical ? canonical.getAttribute('href') : null;
    
    // Vérifier les balises meta description et robots
    const metaDescription = root.querySelector('meta[name="description"]');
    const descriptionContent = metaDescription ? metaDescription.getAttribute('content') : null;
    
    const metaRobots = root.querySelector('meta[name="robots"]');
    const robotsContent = metaRobots ? metaRobots.getAttribute('content') : null;
    
    // Vérifier si la page a des problèmes d'indexation
    const hasNoIndex = robotsContent && robotsContent.includes('noindex');
    const hasNoFollow = robotsContent && robotsContent.includes('nofollow');
    const missingCanonical = !canonicalHref;
    const incorrectCanonical = canonicalHref && !canonicalHref.includes(slug);
    const missingTitle = !titleContent;
    const missingDescription = !descriptionContent;
    
    return {
      film: {
        id: film.id,
        slug,
        title: film.title
      },
      url,
      seo: {
        title: titleContent,
        canonical: canonicalHref,
        description: descriptionContent,
        robots: robotsContent
      },
      issues: {
        hasNoIndex,
        hasNoFollow,
        missingCanonical,
        incorrectCanonical,
        missingTitle,
        missingDescription
      },
      hasIssue: hasNoIndex || hasNoFollow || missingCanonical || incorrectCanonical || missingTitle || missingDescription
    };
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${url}:`, error);
    return {
      film: {
        id: film.id,
        slug,
        title: film.title
      },
      url,
      error: error.message,
      hasIssue: true
    };
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('Vérification des balises SEO sur les pages de films...');
  
  // Récupérer un échantillon de films
  const films = await fetchSampleFilms();
  console.log(`${films.length} films récupérés pour vérification.`);
  
  if (films.length === 0) {
    console.error('Aucun film à vérifier.');
    return;
  }
  
  // Vérifier chaque film
  const results = [];
  let issueCount = 0;
  
  for (let i = 0; i < films.length; i++) {
    const film = films[i];
    console.log(`Vérification du film ${i+1}/${films.length}: ${film.title || film.id}`);
    
    const result = await checkFilmPageSEO(film);
    results.push(result);
    
    if (result.hasIssue) {
      issueCount++;
      console.log(`  Problème détecté: ${JSON.stringify(result.issues || result.error)}`);
    }
    
    // Pause pour éviter de surcharger le serveur
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Générer le rapport
  const report = {
    totalFilms: films.length,
    issueCount,
    checkedAt: new Date().toISOString(),
    results
  };
  
  // Enregistrer le rapport
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  console.log(`\nRapport terminé: ${issueCount} problèmes détectés sur ${films.length} films.`);
  console.log(`Rapport enregistré dans ${OUTPUT_FILE}`);
}

main().catch(error => {
  console.error('Erreur lors de l\'exécution du script:', error);
  process.exit(1);
});
