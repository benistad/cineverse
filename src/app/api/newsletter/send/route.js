import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendNewFilmNewsletter } from '@/lib/resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * POST /api/newsletter/send
 * Envoie la newsletter pour un film via Resend
 * Appelé depuis l'admin (bouton sur la FilmCard)
 */
export async function POST(request) {
  try {
    const film = await request.json();

    if (!film || !film.title || !film.slug) {
      return NextResponse.json(
        { error: 'Données du film manquantes (title, slug requis)' },
        { status: 400 }
      );
    }

    // Vérifier que la clé API Resend est configurée
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY non configurée - newsletter non envoyée');
      return NextResponse.json({
        success: false,
        error: 'Newsletter non configurée (RESEND_API_KEY manquante)',
        skipped: true,
      });
    }

    // Récupérer les abonnés confirmés depuis Supabase
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_confirmed', true)
      .is('unsubscribed_at', null);

    if (subError) {
      console.error('Erreur récupération abonnés:', subError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des abonnés' },
        { status: 500 }
      );
    }

    const emails = (subscribers || []).map(s => s.email);

    if (emails.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Aucun abonné confirmé trouvé',
      });
    }

    // Envoyer la newsletter via Resend
    const result = await sendNewFilmNewsletter(film, emails);

    console.log(`Newsletter envoyée pour "${film.title}": ${result.sent}/${result.total} emails`);

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
      message: `Newsletter envoyée pour "${film.title}" à ${result.sent} abonné(s)`,
      sent: result.sent,
      total: result.total,
    });

  } catch (error) {
    console.error('Erreur envoi newsletter:', error.message);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi de la newsletter' },
      { status: 500 }
    );
  }
}
