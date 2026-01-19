import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/mailerlite';

/**
 * POST /api/newsletter/subscribe
 * Inscrit un nouvel abonné à la newsletter via MailerLite
 * MailerLite gère tout : stockage, désinscription, conformité RGPD
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

    // Ajouter à MailerLite (gère tout le cycle de vie de l'abonné)
    await addSubscriber(email, firstName);

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
