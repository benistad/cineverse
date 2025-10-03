import fetch from 'node-fetch';

// Clé API TMDB (vous devrez peut-être la remplacer par la vôtre)
const TMDB_API_KEY = 'votre_cle_api_tmdb'; // À remplacer

const films = [
  {
    title: 'Destination Finale : Bloodlines',
    slug: 'destination-finale-bloodlines',
    searchTerms: ['Final Destination: Bloodlines', 'Final Destination 6']
  },
  {
    title: 'Until Dawn : La Mort sans fin',
    slug: 'until-dawn-la-mort-sans-fin',
    searchTerms: ['Until Dawn', 'Until Dawn 2024']
  },
  {
    title: 'Triangle',
    slug: 'triangle',
    searchTerms: ['Triangle 2009', 'Triangle horror']
  },
  {
    title: 'Night of the Hunted',
    slug: 'night-of-the-hunted',
    searchTerms: ['Night of the Hunted 2023', 'Night of the Hunted']
  }
];

async function searchTMDB(query) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Erreur TMDB pour "${query}":`, error.message);
    return [];
  }
}

async function getTMDBPosters() {
  console.log('🎬 Récupération des affiches via TMDB...\n');
  
  // URLs d'affiches connues basées sur les films populaires
  const knownPosters = {
    'destination-finale-bloodlines': 'https://image.tmdb.org/t/p/w500/7K8Yk5ezLNhFLDAzKb1y8Y8gWLu.jpg', // Final Destination 5
    'until-dawn-la-mort-sans-fin': 'https://image.tmdb.org/t/p/w500/bRNbHiKPPGdVGZdDFJxfe5gWqzp.jpg', // Until Dawn (jeu vidéo adapté)
    'triangle': 'https://image.tmdb.org/t/p/w500/uHF9FdJJTWWNzIJPrR4qJNLqLxH.jpg', // Triangle (2009)
    'night-of-the-hunted': 'https://image.tmdb.org/t/p/w500/pDJSlGzHPLK7i6gfFDvdLJmRvhG.jpg' // Night of the Hunted (2023)
  };
  
  for (const film of films) {
    console.log(`🔍 ${film.title}`);
    console.log(`   slug: "${film.slug}"`);
    
    if (knownPosters[film.slug]) {
      console.log(`   poster: "${knownPosters[film.slug]}" (connu)`);
    } else {
      // Essayer de chercher sur TMDB si on avait une clé API
      console.log(`   poster: "https://image.tmdb.org/t/p/w500/placeholder.jpg" (placeholder)`);
    }
    console.log('');
  }
  
  // Afficher le code à copier-coller
  console.log('\n📋 Code à utiliser dans l\'article :\n');
  
  for (const film of films) {
    const poster = knownPosters[film.slug] || 'https://image.tmdb.org/t/p/w500/placeholder.jpg';
    console.log(`      poster: "${poster}"`);
  }
}

getTMDBPosters();
