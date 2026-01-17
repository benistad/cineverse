import { NextResponse } from 'next/server';
import { sendNewFilmNewsletter } from '@/lib/mailerlite';

/**
 * POST /api/newsletter/send
 * Envoie la newsletter pour un nouveau film
 * Appelé après la publication d'un film
 */
export async function POST(request) {
  try {
    // Vérifier l'authentification (optionnel mais recommandé)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.NEWSLETTER_SECRET_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const film = await request.json();

    if (!film || !film.title || !film.slug) {
      return NextResponse.json(
        { error: 'Données du film manquantes (title, slug requis)' },
        { status: 400 }
      );
    }

    // Vérifier que la clé API MailerLite est configurée
    if (!process.env.MAILERLITE_API_KEY) {
      console.warn('MAILERLITE_API_KEY non configurée - newsletter non envoyée');
      return NextResponse.json({
        success: false,
        message: 'Newsletter non configurée (MAILERLITE_API_KEY manquante)',
        skipped: true,
      });
    }

    // Envoyer la newsletter
    const result = await sendNewFilmNewsletter(film);

    console.log(`Newsletter envoyée pour le film: ${film.title}`);

    return NextResponse.json({
      success: true,
      message: `Newsletter envoyée pour "${film.title}"`,
      campaignId: result?.data?.id,
    });

  } catch (error) {
    console.error('Erreur envoi newsletter:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la newsletter', details: error.message },
      { status: 500 }
    );
  }
}
