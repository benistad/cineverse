#!/usr/bin/env node

/**
 * Script pour générer un sitemap.xml statique complet
 * Cette version ne dépend pas de l'API et utilise directement le sitemap.js existant
 */

const fs = require('fs');
const path = require('path');
const { getAllFilmsForSitemap } = require('../src/lib/supabase/server');

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
    // S'assurer que chaque film a un slug valide
    const slug = film.slug || (film.title ? film.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-') : film.id);
    
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
  console.log('Génération du sitemap statique complet...');
  
  try {
    // Récupérer les films directement depuis Supabase
    const films = await getAllFilmsForSitemap();
    console.log(`${films.length} films récupérés.`);
    
    // Générer le sitemap
    const sitemapXML = generateSitemapXML(STATIC_PAGES, films);
    
    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, sitemapXML);
    console.log(`Sitemap généré avec succès: ${OUTPUT_FILE}`);
    console.log(`Total: ${STATIC_PAGES.length + films.length} URLs`);
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    
    // En cas d'erreur, générer un sitemap avec seulement les pages statiques
    const sitemapXML = generateSitemapXML(STATIC_PAGES, []);
    fs.writeFileSync(OUTPUT_FILE, sitemapXML);
    console.log(`Sitemap généré avec seulement les pages statiques: ${OUTPUT_FILE}`);
    console.log(`Total: ${STATIC_PAGES.length} URLs`);
  }
}

main().catch(error => {
  console.error('Erreur lors de l\'exécution du script:', error);
  process.exit(1);
});
