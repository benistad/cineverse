import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendNewFilmNewsletter } from '@/lib/mailerlite';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * POST /api/newsletter/send
 * Envoie la newsletter pour un film
 * Appelé depuis l'admin (checkbox ou bouton)
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

    // Marquer le film comme "newsletter envoyée" dans la base de données
    if (film.id) {
      const { error: updateError } = await supabase
        .from('films')
        .update({ 
          newsletter_sent: true, 
          newsletter_sent_at: new Date().toISOString() 
        })
        .eq('id', film.id);
      
      if (updateError) {
        console.warn('Erreur lors de la mise à jour du statut newsletter:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter envoyée pour "${film.title}"`,
      campaignId: result?.data?.id,
    });

  } catch (error) {
    console.error('Erreur envoi newsletter:', error.message);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi de la newsletter' },
      { status: 500 }
    );
  }
}
