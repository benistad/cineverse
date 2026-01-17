/**
 * MailerLite API Client
 * Documentation: https://developers.mailerlite.com/docs
 */

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

/**
 * Effectue une requête vers l'API MailerLite
 */
async function mailerliteRequest(endpoint, options = {}) {
  if (!MAILERLITE_API_KEY) {
    throw new Error('MAILERLITE_API_KEY non configurée');
  }

  const response = await fetch(`${MAILERLITE_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Erreur MailerLite:', data);
    throw new Error(data.message || 'Erreur API MailerLite');
  }

  return data;
}

/**
 * Ajoute un abonné à MailerLite
 * @param {string} email - Email de l'abonné
 * @param {string} firstName - Prénom (optionnel)
 * @param {string} groupId - ID du groupe MailerLite (optionnel)
 */
export async function addSubscriber(email, firstName = '', groupId = null) {
  const payload = {
    email,
    fields: {
      name: firstName,
    },
    status: 'active',
  };

  if (groupId) {
    payload.groups = [groupId];
  }

  try {
    const result = await mailerliteRequest('/subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    console.log('Abonné ajouté à MailerLite:', result.data?.id);
    return result.data;
  } catch (error) {
    // Si l'abonné existe déjà, ce n'est pas une erreur critique
    if (error.message?.includes('already exists')) {
      console.log('Abonné déjà existant:', email);
      return { email, existing: true };
    }
    throw error;
  }
}

/**
 * Supprime un abonné de MailerLite
 * @param {string} subscriberId - ID de l'abonné MailerLite
 */
export async function removeSubscriber(subscriberId) {
  return mailerliteRequest(`/subscribers/${subscriberId}`, {
    method: 'DELETE',
  });
}

/**
 * Récupère tous les abonnés actifs
 */
export async function getSubscribers() {
  const result = await mailerliteRequest('/subscribers?filter[status]=active&limit=1000');
  return result.data || [];
}

/**
 * Envoie une campagne email à tous les abonnés
 * @param {Object} campaign - Données de la campagne
 * @param {string} campaign.subject - Sujet de l'email
 * @param {string} campaign.htmlContent - Contenu HTML de l'email
 * @param {string} campaign.name - Nom de la campagne (interne)
 */
export async function sendCampaign({ subject, htmlContent, name }) {
  // 1. Créer la campagne
  const campaign = await mailerliteRequest('/campaigns', {
    method: 'POST',
    body: JSON.stringify({
      name: name || `Film - ${new Date().toISOString()}`,
      type: 'regular',
      emails: [{
        subject,
        from_name: 'MovieHunt',
        from: process.env.MAILERLITE_FROM_EMAIL || 'contact@moviehunt.fr',
        content: htmlContent,
      }],
    }),
  });

  console.log('Campagne créée:', campaign.data?.id);

  // 2. Envoyer la campagne immédiatement
  const sendResult = await mailerliteRequest(`/campaigns/${campaign.data.id}/schedule`, {
    method: 'POST',
    body: JSON.stringify({
      delivery: 'instant',
    }),
  });

  console.log('Campagne envoyée:', sendResult);
  return sendResult;
}

/**
 * Génère le template HTML pour un nouveau film
 * @param {Object} film - Données du film
 */
export function generateFilmEmailTemplate(film) {
  const filmUrl = `https://moviehunt.fr/film/${film.slug}`;
  const posterUrl = film.poster_url || 'https://moviehunt.fr/images/placeholder-poster.jpg';
  
  // Tronquer le synopsis si trop long
  const synopsis = film.synopsis?.length > 300 
    ? film.synopsis.substring(0, 300) + '...' 
    : film.synopsis || '';

  // Générer les étoiles pour la note
  const rating = film.note_sur_10 || 0;
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const starsHtml = '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau film sur MovieHunt : ${film.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f0f0f; color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <img src="https://moviehunt.fr/images/logo.png" alt="MovieHunt" style="height: 40px;" />
            </td>
          </tr>
          
          <!-- Titre -->
          <tr>
            <td align="center" style="padding-bottom: 10px;">
              <h1 style="margin: 0; font-size: 14px; font-weight: normal; color: #888888; text-transform: uppercase; letter-spacing: 2px;">
                Nouveau film noté
              </h1>
            </td>
          </tr>
          
          <!-- Nom du film -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <h2 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff;">
                ${film.title}
              </h2>
            </td>
          </tr>
          
          <!-- Affiche -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <a href="${filmUrl}" style="text-decoration: none;">
                <img src="${posterUrl}" alt="${film.title}" style="width: 200px; height: auto; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);" />
              </a>
            </td>
          </tr>
          
          <!-- Note -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 30px; border-radius: 50px;">
                <span style="font-size: 24px; color: #ffd700;">${starsHtml}</span>
                <span style="font-size: 24px; font-weight: bold; color: #ffffff; margin-left: 10px;">${rating}/10</span>
              </div>
            </td>
          </tr>
          
          <!-- Synopsis -->
          <tr>
            <td style="padding: 20px 30px; background-color: #1a1a1a; border-radius: 12px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #cccccc; text-align: center;">
                ${synopsis}
              </p>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 40px 0;">
              <a href="${filmUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; font-size: 18px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Voir la fiche complète →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 40px; border-top: 1px solid #333333;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                Vous recevez cet email car vous êtes abonné à la newsletter MovieHunt.
              </p>
              <p style="margin: 0; font-size: 14px;">
                <a href="https://moviehunt.fr" style="color: #667eea; text-decoration: none;">Visiter MovieHunt</a>
                &nbsp;•&nbsp;
                <a href="{$unsubscribe}" style="color: #666666; text-decoration: none;">Se désabonner</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Envoie la newsletter pour un nouveau film
 * @param {Object} film - Données du film
 */
export async function sendNewFilmNewsletter(film) {
  const htmlContent = generateFilmEmailTemplate(film);
  
  return sendCampaign({
    subject: `🎬 Nouveau film noté : ${film.title}`,
    htmlContent,
    name: `Nouveau film - ${film.title}`,
  });
}
