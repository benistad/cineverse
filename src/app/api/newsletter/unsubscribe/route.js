import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * GET /api/newsletter/unsubscribe?email=xxx
 * Désinscrit un abonné de la newsletter
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response('Email manquant', { status: 400 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim());

    if (error) {
      console.error('Erreur désinscription:', error);
    }

    // Rediriger vers une page de confirmation
    return new Response(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Désinscription - MovieHunt</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f9fafb; }
          .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          h1 { color: #1a1a2e; font-size: 24px; }
          p { color: #6b7280; line-height: 1.6; }
          a { color: #4f46e5; text-decoration: none; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Désinscription confirmée</h1>
          <p>Vous ne recevrez plus de newsletters de MovieHunt.</p>
          <p><a href="https://www.moviehunt.fr">Retour sur MovieHunt</a></p>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    console.error('Erreur désinscription:', error);
    return new Response('Erreur lors de la désinscription', { status: 500 });
  }
}
