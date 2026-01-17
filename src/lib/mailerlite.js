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
 * Design responsive avec charte graphique MovieHunt
 * @param {Object} film - Données du film
 */
export function generateFilmEmailTemplate(film) {
  const filmUrl = `https://moviehunt.fr/film/${film.slug}`;
  const posterUrl = film.poster_url || 'https://moviehunt.fr/images/placeholder-poster.jpg';
  
  // Tronquer le synopsis si trop long
  const synopsis = film.synopsis?.length > 280 
    ? film.synopsis.substring(0, 280) + '...' 
    : film.synopsis || '';

  // Note sur 10
  const rating = film.note_sur_10 || 0;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Nouveau film sur MovieHunt : ${film.title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Base */
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0a0a0a; }
    
    /* Mobile */
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; padding: 20px 16px !important; }
      .content { width: 100% !important; }
      .poster { width: 180px !important; }
      .title { font-size: 26px !important; line-height: 32px !important; }
      .rating-box { padding: 12px 24px !important; }
      .rating-number { font-size: 28px !important; }
      .synopsis { padding: 16px 20px !important; font-size: 15px !important; }
      .cta-button { padding: 16px 40px !important; font-size: 16px !important; }
      .footer-text { font-size: 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" class="wrapper" style="padding: 40px 20px;">
        
        <!-- Content Container -->
        <table role="presentation" class="content" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="https://moviehunt.fr" style="text-decoration: none;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 12px 24px; border-radius: 8px;">
                      <span style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">🎬 MovieHunt</span>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
          
          <!-- Subtitle -->
          <tr>
            <td align="center" style="padding-bottom: 8px;">
              <p style="margin: 0; font-size: 13px; font-weight: 500; color: #8b5cf6; text-transform: uppercase; letter-spacing: 3px;">
                Nouveau film noté
              </p>
            </td>
          </tr>
          
          <!-- Film Title -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <h1 class="title" style="margin: 0; font-size: 34px; font-weight: 700; color: #ffffff; line-height: 40px; letter-spacing: -0.5px;">
                ${film.title}
              </h1>
            </td>
          </tr>
          
          <!-- Poster -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <a href="${filmUrl}" style="text-decoration: none;">
                <img src="${posterUrl}" alt="${film.title}" class="poster" width="220" style="width: 220px; height: auto; border-radius: 16px; box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4);" />
              </a>
            </td>
          </tr>
          
          <!-- Rating -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="rating-box" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%); padding: 14px 32px; border-radius: 100px; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);">
                    <span class="rating-number" style="font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">${rating}<span style="font-size: 18px; font-weight: 500; opacity: 0.8;">/10</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Synopsis -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="synopsis" style="background-color: #18181b; padding: 24px 28px; border-radius: 16px; border: 1px solid #27272a;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #a1a1aa; text-align: center;">
                      ${synopsis}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <a href="${filmUrl}" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 18px 48px; font-size: 17px; font-weight: 600; border-radius: 100px; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4); letter-spacing: 0.3px;">
                      Découvrir ce film →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height: 1px; background: linear-gradient(90deg, transparent 0%, #27272a 50%, transparent 100%);"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center">
              <p class="footer-text" style="margin: 0 0 12px 0; font-size: 13px; color: #52525b; line-height: 1.5;">
                Vous recevez cet email car vous êtes abonné à la newsletter MovieHunt.
              </p>
              <p class="footer-text" style="margin: 0; font-size: 13px;">
                <a href="https://moviehunt.fr" style="color: #8b5cf6; text-decoration: none; font-weight: 500;">Visiter MovieHunt</a>
                <span style="color: #3f3f46; margin: 0 8px;">•</span>
                <a href="{$unsubscribe}" style="color: #52525b; text-decoration: none;">Se désabonner</a>
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
