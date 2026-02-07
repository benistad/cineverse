import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateFilmEmailTemplate, sendEmail } from '@/lib/resend';

const TEST_EMAIL = 'benoitdurand2@gmail.com';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * POST /api/newsletter/test
 * Envoie un email de test du dernier film publié à l'adresse de test
 */
export async function POST() {
  try {
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

    // Générer le template HTML
    const htmlContent = generateFilmEmailTemplate(film);
    const unsubscribeUrl = `https://www.moviehunt.fr/api/newsletter/unsubscribe?email=${encodeURIComponent(TEST_EMAIL)}`;
    const personalizedHtml = htmlContent.replace('{{unsubscribe_url}}', unsubscribeUrl);

    // Envoyer l'email de test via Resend
    const result = await sendEmail({
      to: TEST_EMAIL,
      subject: `[TEST] 🎬 Nouveau film noté : ${film.title}`,
      html: personalizedHtml,
    });

    console.log(`Email de test envoyé à ${TEST_EMAIL} pour le film: ${film.title}`, JSON.stringify(result));

    return NextResponse.json({
      success: true,
      message: `Email de test envoyé à ${TEST_EMAIL}`,
      film: film.title,
      emailId: result?.id,
    });

  } catch (error) {
    console.error('Erreur envoi email test:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors de l\'envoi de l\'email de test',
    }, { status: 500 });
  }
}
