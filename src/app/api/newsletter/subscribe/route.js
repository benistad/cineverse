import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { addSubscriber } from '@/lib/mailerlite';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * POST /api/newsletter/subscribe
 * Inscrit un nouvel abonné à la newsletter
 */
export async function POST(request) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // 1. Ajouter à MailerLite
    let mailerliteSubscriber = null;
    try {
      mailerliteSubscriber = await addSubscriber(email, firstName);
    } catch (mlError) {
      console.error('Erreur MailerLite:', mlError);
      // Continuer même si MailerLite échoue - on sauvegarde en local
    }

    // 2. Sauvegarder en local dans Supabase
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email: email.toLowerCase().trim(),
        first_name: firstName || null,
        is_confirmed: true, // MailerLite gère le double opt-in si configuré
        confirmed_at: new Date().toISOString(),
        mailerlite_subscriber_id: mailerliteSubscriber?.id || null,
      }, {
        onConflict: 'email',
      });

    if (error) {
      console.error('Erreur Supabase:', error);
      // Si l'erreur est une violation de contrainte unique, c'est OK
      if (!error.message?.includes('duplicate')) {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie ! Vous recevrez nos prochaines recommandations de films.',
    });

  } catch (error) {
    console.error('Erreur inscription newsletter:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
