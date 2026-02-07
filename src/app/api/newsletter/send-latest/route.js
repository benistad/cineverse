import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendNewFilmNewsletter } from '@/lib/resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * POST /api/newsletter/send-latest
 * Envoie la newsletter pour le dernier film publié à TOUS les abonnés
 * Utilisé pour envoyer manuellement une newsletter oubliée
 */
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.NEWSLETTER_SECRET_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier que la clé API Resend est configurée
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY non configurée',
      }, { status: 500 });
    }

    // Récupérer le dernier film publié
    const { data: film, error: filmError } = await supabase
      .from('films')
      .select('*')
      .order('date_ajout', { ascending: false })
      .limit(1)
      .single();

    if (filmError || !film) {
      return NextResponse.json({
        success: false,
        error: 'Aucun film trouvé',
      }, { status: 404 });
    }

    // Récupérer les abonnés confirmés
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_confirmed', true)
      .is('unsubscribed_at', null);

    if (subError) {
      return NextResponse.json({
        success: false,
        error: 'Erreur récupération abonnés',
      }, { status: 500 });
    }

    const emails = (subscribers || []).map(s => s.email);

    if (emails.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Aucun abonné confirmé trouvé',
      });
    }

    // Envoyer la newsletter à tous les abonnés via Resend
    const result = await sendNewFilmNewsletter(film, emails);

    console.log(`Newsletter envoyée pour "${film.title}": ${result.sent}/${result.total}`);

    return NextResponse.json({
      success: true,
      message: `Newsletter envoyée pour "${film.title}" à ${result.sent} abonné(s)`,
      film: {
        title: film.title,
        slug: film.slug,
        note: film.note_sur_10,
      },
      sent: result.sent,
    });

  } catch (error) {
    console.error('Erreur envoi newsletter:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors de l\'envoi de la newsletter',
    }, { status: 500 });
  }
}
