#!/usr/bin/env node

/**
 * Script pour vérifier les balises meta robots sur toutes les pages
 * Permet d'identifier les pages qui pourraient avoir des problèmes d'indexation
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const axios = require('axios');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const OUTPUT_FILE = path.join(__dirname, '../meta-robots-report.json');

async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${url}:`, error);
    return null;
  }
}

async function extractURLsFromSitemap(sitemapXML) {
  const root = parse(sitemapXML);
  const urlElements = root.querySelectorAll('url');
  
  return urlElements.map(urlElement => {
    const locElement = urlElement.querySelector('loc');
    return locElement ? locElement.text : null;
  }).filter(Boolean);
}

async function checkMetaRobots(url) {
  try {
    const html = await fetchHTML(url);
    if (!html) return { url, error: 'Impossible de récupérer la page' };
    
    const root = parse(html);
    
    // Vérifier la balise meta robots
    const metaRobots = root.querySelector('meta[name="robots"]');
    const robotsContent = metaRobots ? metaRobots.getAttribute('content') : null;
    
    // Vérifier la balise title
    const title = root.querySelector('title');
    const titleContent = title ? title.text : null;
    
    // Vérifier la balise canonical
    const canonical = root.querySelector('link[rel="canonical"]');
    const canonicalHref = canonical ? canonical.getAttribute('href') : null;
    
    // Vérifier si la page a des problèmes d'indexation
    const hasNoIndex = robotsContent && robotsContent.includes('noindex');
    const hasNoFollow = robotsContent && robotsContent.includes('nofollow');
    const missingCanonical = !canonicalHref;
    const incorrectCanonical = canonicalHref && !url.endsWith(canonicalHref) && !canonicalHref.endsWith(new URL(url).pathname);
    
    return {
      url,
      title: titleContent,
      robotsContent,
      canonicalUrl: canonicalHref,
      issues: {
        hasNoIndex,
        hasNoFollow,
        missingCanonical,
        incorrectCanonical,
        missingTitle: !titleContent,
      },
      hasIssue: hasNoIndex || hasNoFollow || missingCanonical || incorrectCanonical || !titleContent
    };
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${url}:`, error);
    return {
      url,
      error: error.message,
      hasIssue: true
    };
  }
}

async function main() {
  console.log('Vérification des balises meta robots...');
  
  // Récupérer le sitemap
  const sitemapXML = await fetchHTML(SITEMAP_URL);
  if (!sitemapXML) {
    console.error('Impossible de récupérer le sitemap.');
    return;
  }
  
  // Extraire les URLs du sitemap
  const urls = await extractURLsFromSitemap(sitemapXML);
  console.log(`${urls.length} URLs trouvées dans le sitemap.`);
  
  // Vérifier chaque URL
  const results = [];
  let issueCount = 0;
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Vérification de l'URL ${i+1}/${urls.length}: ${url}`);
    
    const result = await checkMetaRobots(url);
    results.push(result);
    
    if (result.hasIssue) {
      issueCount++;
      console.log(`  Problème détecté: ${JSON.stringify(result.issues || result.error)}`);
    }
    
    // Pause pour éviter de surcharger le serveur
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Générer le rapport
  const report = {
    totalUrls: urls.length,
    issueCount,
    checkedAt: new Date().toISOString(),
    results: results.filter(r => r.hasIssue)
  };
  
  // Enregistrer le rapport
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  console.log(`\nRapport terminé: ${issueCount} problèmes détectés sur ${urls.length} URLs.`);
  console.log(`Rapport enregistré dans ${OUTPUT_FILE}`);
}

main().catch(error => {
  console.error('Erreur lors de l\'exécution du script:', error);
  process.exit(1);
});
