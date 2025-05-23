import { NextResponse } from 'next/server';

// Token d'authentification TMDB
// Mis à jour le 24/05/2025
// Clé API: 0e1fc1d893511f80a0c6b4c4de161c51
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTFmYzFkODkzNTExZjgwYTBjNmI0YzRkZTE2MWM1MSIsIm5iZiI6MTc0NjUxNTA1NC4yODE5OTk4LCJzdWIiOiI2ODE5YjQ2ZTA5OWE2ZTNmZjk0NDNkN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Hj-9KXl-h5-7CtFhFSC6V4NJE__c1ozx5OnrETtCS9c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Gestionnaire de requêtes GET pour le proxy TMDB
 * Cette fonction intercepte toutes les requêtes à /api/tmdb/[...path] et les transmet à l'API TMDB
 */
export async function GET(request, { params }) {
  try {
    // Récupérer le chemin de l'API TMDB à partir des paramètres de route
    const path = params.path.join('/');
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();
    
    // Copier tous les paramètres de recherche
    for (const [key, value] of searchParams.entries()) {
      queryParams.append(key, value);
    }
    
    // Construire l'URL complète pour l'API TMDB
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const tmdbUrl = `${TMDB_BASE_URL}/${path}${queryString}`;
    
    console.log(`[Proxy TMDB] Requête à: ${tmdbUrl}`);
    
    // Faire la requête à l'API TMDB avec le token d'authentification
    const response = await fetch(tmdbUrl, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Vérifier si la requête a réussi
    if (!response.ok) {
      console.error(`[Proxy TMDB] Erreur ${response.status}: ${response.statusText}`);
      return NextResponse.json(
        { error: `Erreur lors de la requête à l'API TMDB: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Récupérer les données JSON de la réponse
    const data = await response.json();
    
    // Retourner les données avec les en-têtes CORS appropriés
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('[Proxy TMDB] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la requête à l\'API TMDB' },
      { status: 500 }
    );
  }
}
