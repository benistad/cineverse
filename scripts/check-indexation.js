#!/usr/bin/env node

/**
 * Script pour vérifier les problèmes d'indexation et de redirection
 * Permet d'identifier les pages non indexées et les redirections problématiques
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const axios = require('axios');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const OUTPUT_FILE = path.join(__dirname, '../indexation-report.json');

async function fetchXML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${url}:`, error);
    return null;
  }
}

async function checkURL(url) {
  try {
    const response = await axios.head(url, {
      maxRedirects: 0,
      validateStatus: status => true // Accepter tous les codes de statut
    });
    
    const redirected = response.status >= 300 && response.status < 400;
    
    return {
      url,
      status: response.status,
      redirected: redirected,
      redirectUrl: response.headers.location,
      hasIssue: response.status !== 200 || redirected
    };
  } catch (error) {
    // Si l'erreur est due à une redirection, c'est ce que nous voulons capturer
    if (error.response) {
      const redirected = error.response.status >= 300 && error.response.status < 400;
      return {
        url,
        status: error.response.status,
        redirected: redirected,
        redirectUrl: error.response.headers.location,
        hasIssue: error.response.status !== 200 || redirected
      };
    }
    
    console.error(`Erreur lors de la vérification de ${url}:`, error);
    return {
      url,
      status: 'error',
      hasIssue: true,
      error: error.message
    };
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

async function main() {
  console.log('Vérification des problèmes d\'indexation et de redirection...');
  
  // Récupérer le sitemap
  const sitemapXML = await fetchXML(SITEMAP_URL);
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
    
    const result = await checkURL(url);
    results.push(result);
    
    if (result.hasIssue) {
      issueCount++;
      console.log(`  Problème détecté: ${result.status} ${result.redirectUrl || ''}`);
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
