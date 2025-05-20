const https = require('https');
const http = require('http');
const { parse } = require('node-html-parser');

// Liste des URLs à vérifier
const urls = [
  'https://www.moviehunt.fr/',
  'https://www.moviehunt.fr/search',
  'https://www.moviehunt.fr/advanced-search',
  'https://www.moviehunt.fr/all-films',
  'https://www.moviehunt.fr/huntedbymoviehunt',
  'https://www.moviehunt.fr/quel-film-regarder',
  'https://www.moviehunt.fr/top-rated',
  'https://www.moviehunt.fr/hidden-gems',
  'https://www.moviehunt.fr/films/1br-the-apartment', // Un exemple de page de film
];

// Fonction pour récupérer le contenu HTML d'une URL
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Fonction principale pour vérifier les balises de titre
async function checkTitles() {
  console.log('Vérification des balises de titre...\n');
  
  for (const url of urls) {
    try {
      console.log(`Vérification de ${url}`);
      const html = await fetchHTML(url);
      const root = parse(html);
      
      // Rechercher la balise title
      const titleTag = root.querySelector('title');
      
      if (titleTag && titleTag.text.trim()) {
        console.log(`✅ Balise de titre trouvée: "${titleTag.text}"`);
      } else {
        console.log(`❌ Pas de balise de titre trouvée ou balise vide!`);
      }
      console.log('---');
    } catch (error) {
      console.error(`Erreur lors de la vérification de ${url}:`, error.message);
    }
  }
}

// Exécuter la fonction principale
checkTitles();
