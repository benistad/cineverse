/**
 * API Route pour servir de proxy aux images TMDB et éviter les erreurs CORS
 */
export async function GET(request) {
  try {
    // Récupérer l'URL de l'image depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return new Response('URL de l\'image manquante', { status: 400 });
    }
    
    // Vérifier que l'URL provient bien de TMDB
    if (!imageUrl.startsWith('https://image.tmdb.org/')) {
      return new Response('Seules les images TMDB sont autorisées', { status: 403 });
    }
    
    // Récupérer l'image depuis TMDB
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return new Response('Impossible de récupérer l\'image', { status: response.status });
    }
    
    // Récupérer les données de l'image
    const imageData = await response.arrayBuffer();
    
    // Déterminer le type MIME en fonction de l'extension de fichier
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Retourner l'image avec les bons en-têtes
    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Mise en cache pendant 24 heures
      },
    });
  } catch (error) {
    console.error('Erreur lors du proxy d\'image:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
}
