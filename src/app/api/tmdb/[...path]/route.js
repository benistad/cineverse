import { NextResponse } from 'next/server';

// Token d'authentification TMDB
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDhjN2ZiN2JiNDU5NTVjMjJjY2YxY2YxYzY4MjNkYSIsInN1YiI6IjY4MTliNDZlMDk5YTZlM2ZmOTQ0M2Q3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSMJHsVUQDlz_ZYtgcYSHBOJ2Y-qNQKTgXMt3RjL9Gg';
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
