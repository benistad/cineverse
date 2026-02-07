import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * POST /api/newsletter/subscribe
 * Inscrit un nouvel abonné à la newsletter via Supabase
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

    // Vérifier si l'abonné existe déjà
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_confirmed, unsubscribed_at')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      // Si déjà inscrit et confirmé
      if (existing.is_confirmed && !existing.unsubscribed_at) {
        return NextResponse.json({
          success: true,
          message: 'Vous êtes déjà inscrit à la newsletter !',
        });
      }
      
      // Si désinscrit, réinscrire
      if (existing.unsubscribed_at) {
        await supabase
          .from('newsletter_subscribers')
          .update({ 
            unsubscribed_at: null, 
            is_confirmed: true,
            confirmed_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        
        return NextResponse.json({
          success: true,
          message: 'Réinscription réussie ! Vous recevrez nos prochaines recommandations de films.',
        });
      }
    }

    // Nouvel abonné : inscription directe (confirmé automatiquement)
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        first_name: firstName || null,
        is_confirmed: true,
        confirmed_at: new Date().toISOString(),
      });

    if (insertError) {
      // Doublon possible (race condition)
      if (insertError.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'Vous êtes déjà inscrit à la newsletter !',
        });
      }
      throw insertError;
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
