import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendNewFilmNewsletter } from '@/lib/mailerlite';

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

    // Vérifier que la clé API MailerLite est configurée
    if (!process.env.MAILERLITE_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'MAILERLITE_API_KEY non configurée',
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

    // Envoyer la newsletter à tous les abonnés
    const result = await sendNewFilmNewsletter(film);

    console.log(`Newsletter envoyée pour le film: ${film.title}`);

    return NextResponse.json({
      success: true,
      message: `Newsletter envoyée pour "${film.title}"`,
      film: {
        title: film.title,
        slug: film.slug,
        note: film.note_sur_10,
      },
      campaignId: result?.data?.id,
    });

  } catch (error) {
    console.error('Erreur envoi newsletter:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors de l\'envoi de la newsletter',
    }, { status: 500 });
  }
}
