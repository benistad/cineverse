#!/usr/bin/env node

/**
 * Script pour générer les fichiers metadata.js manquants pour toutes les pages importantes
 * Cela garantit que chaque page a des balises canoniques et des titres corrects
 */

const fs = require('fs');
const path = require('path');

// Configuration
const APP_DIR = path.join(__dirname, '../src/app');
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr';

// Pages importantes qui devraient avoir des métadonnées
const IMPORTANT_PAGES = [
  {
    path: '/all-films',
    title: 'Tous les films',
    description: 'Découvrez tous les films disponibles sur MovieHunt, avec leurs notes, recommandations et informations détaillées.'
  },
  {
    path: '/search',
    title: 'Recherche de films',
    description: 'Recherchez parmi notre collection de films pour trouver votre prochain coup de cœur cinématographique.'
  },
  {
    path: '/advanced-search',
    title: 'Recherche avancée de films',
    description: 'Utilisez notre recherche avancée pour trouver des films selon vos critères précis : genre, année, note, acteurs et plus encore.'
  },
  {
    path: '/top-rated',
    title: 'Films les mieux notés',
    description: 'Découvrez les films les mieux notés sur MovieHunt, une sélection des meilleurs films selon nos critères exigeants.'
  },
  {
    path: '/hidden-gems',
    title: 'Films méconnus à voir',
    description: 'Explorez notre collection de perles rares et de films méconnus qui méritent votre attention.'
  },
  {
    path: '/huntedbymoviehunt',
    title: 'Hunted by MovieHunt',
    description: 'Découvrez les films exceptionnels sélectionnés par notre équipe, des œuvres qui se démarquent par leur qualité et leur originalité.'
  },
  {
    path: '/quel-film-regarder',
    title: 'Quel film regarder ce soir ? Top 10 des films à voir absolument',
    description: 'Vous ne savez pas quel film regarder ce soir ? Découvrez notre sélection des meilleurs films à voir absolument pour tous les goûts.'
  }
];

/**
 * Génère le contenu du fichier metadata.js pour une page
 */
function generateMetadataContent(page) {
  const pathWithoutSlash = page.path.startsWith('/') ? page.path.substring(1) : page.path;
  
  return `/**
 * Métadonnées pour la page ${page.title}
 * Optimisé pour le référencement
 */
export default function generateMetadata() {
  return {
    title: '${page.title}',
    description: '${page.description}',
    alternates: {
      canonical: '${page.path}',
    },
    openGraph: {
      title: '${page.title} | MovieHunt',
      description: '${page.description}',
      url: '${page.path}',
      siteName: 'MovieHunt',
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '${page.title} | MovieHunt',
      description: '${page.description}',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
`;
}

/**
 * Vérifie si un fichier metadata.js existe déjà pour une page
 */
function metadataExists(pagePath) {
  const fullPath = path.join(APP_DIR, pagePath, 'metadata.js');
  return fs.existsSync(fullPath);
}

/**
 * Crée un fichier metadata.js pour une page
 */
function createMetadataFile(page) {
  const pagePath = page.path.startsWith('/') ? page.path.substring(1) : page.path;
  const dirPath = path.join(APP_DIR, pagePath);
  const filePath = path.join(dirPath, 'metadata.js');
  
  // Vérifier si le répertoire existe
  if (!fs.existsSync(dirPath)) {
    console.log(`Le répertoire ${dirPath} n'existe pas, création ignorée.`);
    return false;
  }
  
  // Générer le contenu
  const content = generateMetadataContent(page);
  
  // Écrire le fichier
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Fichier metadata.js créé pour ${page.path}`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la création du fichier metadata.js pour ${page.path}:`, error);
    return false;
  }
}

/**
 * Fonction principale
 */
function main() {
  console.log('Génération des fichiers metadata.js manquants...');
  
  let created = 0;
  let skipped = 0;
  
  for (const page of IMPORTANT_PAGES) {
    if (metadataExists(page.path.startsWith('/') ? page.path.substring(1) : page.path)) {
      console.log(`Le fichier metadata.js existe déjà pour ${page.path}, ignoré.`);
      skipped++;
    } else {
      if (createMetadataFile(page)) {
        created++;
      }
    }
  }
  
  console.log(`\nRésumé:`);
  console.log(`- ${created} fichiers metadata.js créés`);
  console.log(`- ${skipped} fichiers metadata.js existants ignorés`);
  console.log(`- ${IMPORTANT_PAGES.length - created - skipped} fichiers metadata.js non créés (répertoire inexistant)`);
}

main();
