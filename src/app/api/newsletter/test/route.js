import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateFilmEmailTemplate } from '@/lib/mailerlite';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';
const TEST_EMAIL = 'benoitdurand2@neuf.fr';

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
    // Vérifier que la clé API MailerLite est configurée
    if (!MAILERLITE_API_KEY) {
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

    // Générer le template HTML
    const htmlContent = generateFilmEmailTemplate(film);

    // Envoyer l'email de test via l'API MailerLite
    const response = await fetch(`${MAILERLITE_API_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        name: `[TEST] ${film.title} - ${new Date().toISOString()}`,
        type: 'regular',
        emails: [{
          subject: `[TEST] 🎬 Nouveau film noté : ${film.title}`,
          from_name: 'MovieHunt',
          from: process.env.MAILERLITE_FROM_EMAIL || 'contact@moviehunt.fr',
          content: htmlContent,
        }],
        // Envoyer uniquement à l'adresse de test
        filter: {
          operand: 'and',
          conditions: [{
            field: 'email',
            type: 'string',
            operator: 'exactly',
            value: TEST_EMAIL,
          }],
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur MailerLite:', errorData);
      
      // Si le filtre ne fonctionne pas, essayer d'envoyer directement via l'API subscribers
      // Envoyer un email transactionnel à la place
      const transactionalResponse = await fetch(`${MAILERLITE_API_URL}/subscribers/${encodeURIComponent(TEST_EMAIL)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
          'Accept': 'application/json',
        },
      });

      // Si l'abonné n'existe pas, le créer
      if (!transactionalResponse.ok) {
        await fetch(`${MAILERLITE_API_URL}/subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
          },
          body: JSON.stringify({
            email: TEST_EMAIL,
            fields: { name: 'Test Admin' },
            status: 'active',
          }),
        });
      }

      // Créer et envoyer la campagne
      const campaignResponse = await fetch(`${MAILERLITE_API_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          name: `[TEST] ${film.title} - ${new Date().toISOString()}`,
          type: 'regular',
          emails: [{
            subject: `[TEST] 🎬 Nouveau film noté : ${film.title}`,
            from_name: 'MovieHunt',
            from: process.env.MAILERLITE_FROM_EMAIL || 'contact@moviehunt.fr',
            content: htmlContent,
          }],
        }),
      });

      if (!campaignResponse.ok) {
        const campaignError = await campaignResponse.json();
        throw new Error(campaignError.message || 'Erreur création campagne');
      }

      const campaign = await campaignResponse.json();

      // Programmer l'envoi immédiat
      await fetch(`${MAILERLITE_API_URL}/campaigns/${campaign.data.id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          delivery: 'instant',
        }),
      });

      return NextResponse.json({
        success: true,
        message: `Email de test envoyé à ${TEST_EMAIL}`,
        film: film.title,
        note: `Note: L'email sera envoyé à tous les abonnés. Vérifiez que ${TEST_EMAIL} est le seul abonné pour un vrai test isolé.`,
      });
    }

    const campaign = await response.json();

    // Programmer l'envoi immédiat
    await fetch(`${MAILERLITE_API_URL}/campaigns/${campaign.data.id}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        delivery: 'instant',
      }),
    });

    console.log(`Email de test envoyé à ${TEST_EMAIL} pour le film: ${film.title}`);

    return NextResponse.json({
      success: true,
      message: `Email de test envoyé à ${TEST_EMAIL}`,
      film: film.title,
      campaignId: campaign.data?.id,
    });

  } catch (error) {
    console.error('Erreur envoi email test:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors de l\'envoi de l\'email de test',
    }, { status: 500 });
  }
}
