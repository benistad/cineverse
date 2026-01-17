import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * API Route pour invalider le cache après la publication d'un film
 * POST /api/revalidate
 */
export async function POST(request) {
  try {
    // Vérifier le token d'authentification (optionnel mais recommandé)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_TOKEN;
    
    // Si un token est configuré, le vérifier
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Invalider le tag 'homepage' qui est utilisé par toutes les fonctions serveur
    revalidateTag('homepage');
    
    // Invalider aussi le chemin de la page d'accueil
    revalidatePath('/');
    revalidatePath('/en');
    
    console.log('[Revalidate] Cache invalidé pour homepage, / et /en');

    return NextResponse.json({
      success: true,
      message: 'Cache invalidé avec succès',
      revalidated: ['homepage', '/', '/en'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Revalidate] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'invalidation du cache', details: error.message },
      { status: 500 }
    );
  }
}
