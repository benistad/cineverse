import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const filmUrls = [
  'https://www.moviehunt.fr/films/destination-finale-bloodlines',
  'https://www.moviehunt.fr/films/until-dawn-la-mort-sans-fin', 
  'https://www.moviehunt.fr/films/triangle',
  'https://www.moviehunt.fr/films/night-of-the-hunted'
];

async function getPosterFromPage(url) {
  try {
    console.log(`🔍 Récupération de ${url}...`);
    
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Chercher l'image principale du film (plusieurs sélecteurs possibles)
    let posterUrl = null;
    
    // Essayer différents sélecteurs pour trouver l'affiche
    const selectors = [
      'img[alt*="Affiche"]',
      'img[src*="tmdb"]',
      'img[src*="poster"]',
      '.film-poster img',
      '.poster img',
      'article img:first-of-type',
      'img[src*="w500"]',
      'img[src*="w342"]'
    ];
    
    for (const selector of selectors) {
      const img = $(selector).first();
      if (img.length > 0) {
        posterUrl = img.attr('src');
        if (posterUrl) {
          // Si c'est un chemin relatif, le convertir en URL absolue
          if (posterUrl.startsWith('/')) {
            posterUrl = `https://www.moviehunt.fr${posterUrl}`;
          }
          break;
        }
      }
    }
    
    // Récupérer aussi le titre du film
    const title = $('h1').first().text().trim() || $('title').text().split('|')[0].trim();
    
    return {
      url,
      title,
      posterUrl,
      slug: url.split('/').pop()
    };
    
  } catch (error) {
    console.error(`❌ Erreur pour ${url}:`, error.message);
    return {
      url,
      title: null,
      posterUrl: null,
      slug: url.split('/').pop()
    };
  }
}

async function getAllPosters() {
  console.log('🎃 Récupération des affiches depuis les pages du site...\n');
  
  const results = [];
  
  for (const url of filmUrls) {
    const result = await getPosterFromPage(url);
    results.push(result);
    
    if (result.posterUrl) {
      console.log(`✅ ${result.title}`);
      console.log(`   slug: "${result.slug}"`);
      console.log(`   poster: "${result.posterUrl}"`);
    } else {
      console.log(`❌ ${result.slug}: Affiche non trouvée`);
    }
    console.log('');
    
    // Attendre un peu entre les requêtes pour être respectueux
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

getAllPosters();
