#!/usr/bin/env node

/**
 * Script pour générer un sitemap.xml statique
 * Cela permet de s'assurer que toutes les pages sont correctement indexées par Google
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const OUTPUT_FILE = path.join(__dirname, '../public/static-sitemap.xml');
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';

// Pages statiques importantes
const STATIC_PAGES = [
  {
    url: '/',
    priority: 1.0,
    changefreq: 'daily'
  },
  {
    url: '/search',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    url: '/advanced-search',
    priority: 0.7,
    changefreq: 'weekly'
  },
  {
    url: '/all-films',
    priority: 0.9,
    changefreq: 'daily'
  },
  {
    url: '/top-rated',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    url: '/hidden-gems',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    url: '/huntedbymoviehunt',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    url: '/quel-film-regarder',
    priority: 0.9,
    changefreq: 'weekly'
  }
];

/**
 * Récupère la liste des films depuis l'API
 */
async function fetchFilms() {
  try {
    const response = await axios.get(`${BASE_URL}/api/sitemap-films`);
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return [];
  }
}

/**
 * Génère le contenu du sitemap XML
 */
function generateSitemapXML(staticPages, films) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Ajouter les pages statiques
  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }
  
  // Ajouter les pages de films
  for (const film of films) {
    const slug = film.slug || film.id;
    const lastmod = film.date_ajout ? new Date(film.date_ajout).toISOString() : new Date().toISOString();
    
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/films/${slug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  return xml;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('Génération du sitemap statique...');
  
  // Récupérer les films
  const films = await fetchFilms();
  console.log(`${films.length} films récupérés.`);
  
  // Générer le sitemap
  const sitemapXML = generateSitemapXML(STATIC_PAGES, films);
  
  // Écrire le fichier
  fs.writeFileSync(OUTPUT_FILE, sitemapXML);
  console.log(`Sitemap généré avec succès: ${OUTPUT_FILE}`);
  console.log(`Total: ${STATIC_PAGES.length + films.length} URLs`);
}

main().catch(error => {
  console.error('Erreur lors de la génération du sitemap:', error);
  process.exit(1);
});
