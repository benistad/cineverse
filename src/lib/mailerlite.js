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
 * Design responsive avec charte graphique MovieHunt exacte
 * @param {Object} film - Données du film
 */
export function generateFilmEmailTemplate(film) {
  const filmUrl = `https://moviehunt.fr/film/${film.slug}`;
  const posterUrl = film.poster_url || 'https://moviehunt.fr/images/placeholder-poster.jpg';
  
  // Tronquer le synopsis si trop long
  const synopsis = film.synopsis?.length > 350 
    ? film.synopsis.substring(0, 350) + '...' 
    : film.synopsis || '';

  // Note sur 10
  const rating = Math.round(film.note_sur_10 || 0);
  
  // Couleur indigo selon la note (comme RatingIcon.jsx)
  const getRatingColor = (r) => {
    if (r <= 3) return '#818CF8'; // indigo-400 (notes basses)
    if (r <= 5) return '#6366F1'; // indigo-500 (notes moyennes-basses)
    if (r <= 7) return '#4F46E5'; // indigo-600 (notes moyennes)
    if (r <= 8) return '#4338CA'; // indigo-700 (bonnes notes)
    return '#3730A3'; // indigo-800 (excellentes notes)
  };
  const ratingColor = getRatingColor(rating);
  
  // Extraire l'année de la date de sortie
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
  
  // Genres
  const genres = film.genres || '';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Nouveau film sur MovieHunt : ${film.title}</title>
  <!-- Google Fonts Poppins -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #ffffff; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    
    /* Mobile */
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; padding: 20px 12px !important; }
      .content { width: 100% !important; }
      .poster { width: 75% !important; max-width: 300px !important; }
      .title-banner { padding: 14px 20px !important; }
      .title { font-size: 22px !important; }
      .synopsis-box { padding: 20px 16px !important; }
      .synopsis-title { font-size: 20px !important; }
      .synopsis-text { font-size: 15px !important; }
      .cta-button { padding: 14px 36px !important; font-size: 15px !important; }
      .footer-text { font-size: 12px !important; }
      .meta-text { font-size: 13px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; color: #1a1a2e;">
  
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" class="wrapper" style="padding: 40px 20px;">
        
        <!-- Content Container -->
        <table role="presentation" class="content" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%;">
          
          <!-- Logo MovieHunt -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="https://moviehunt.fr" style="text-decoration: none;">
                <img src="https://moviehunt.fr/images/logo-mh.png" alt="MovieHunt" width="200" style="width: 200px; height: auto; display: block;" />
              </a>
            </td>
          </tr>
          
          <!-- Subtitle -->
          <tr>
            <td align="center" style="padding-bottom: 16px;">
              <p style="margin: 0; font-size: 14px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 2px;">
                Nouveau film noté
              </p>
            </td>
          </tr>
          
          <!-- Content Card with Shadow -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); overflow: hidden;">
                
                <!-- Film Title - Yellow Banner -->
                <tr>
                  <td class="title-banner" style="background-color: #fbbf24; padding: 16px 24px;">
                    <h1 class="title" style="margin: 0; font-size: 28px; font-weight: 800; color: #1a1a2e; line-height: 1.2; font-family: 'Poppins', sans-serif;">
                      ${film.title}
                    </h1>
                  </td>
                </tr>
                
                <!-- Card Content -->
                <tr>
                  <td style="padding: 24px;">
                    
                    <!-- Poster - 75% width responsive -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding-bottom: 16px;">
                          <a href="${filmUrl}" style="text-decoration: none;">
                            <img src="${posterUrl}" alt="${film.title}" class="poster" width="420" style="width: 75%; max-width: 420px; height: auto; border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);" />
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Genre & Year - Under poster -->
                    ${(genres || releaseYear) ? `
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <p class="meta-text" style="margin: 0; font-size: 15px; color: #6b7280; font-family: 'Poppins', sans-serif;">
                            ${genres}${genres && releaseYear ? ' • ' : ''}${releaseYear}
                          </p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    <!-- Rating - Circle design like homepage carousel (RatingIcon) -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding-bottom: 28px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td valign="middle" style="padding-right: 12px;">
                                <span style="font-size: 18px; font-weight: 600; color: #1a1a2e; font-family: 'Poppins', sans-serif;">Note :</span>
                              </td>
                              <td valign="middle">
                                <div style="width: 60px; height: 60px; background-color: ${ratingColor}; border-radius: 50%; text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); border: 3px solid #FEBE29; display: inline-block;">
                                  <span style="font-size: 28px; font-weight: 700; color: #ffffff; line-height: 54px; font-family: 'Poppins', sans-serif;">${rating}</span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Synopsis -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left" style="padding-bottom: 24px;">
                          <!-- Synopsis Title -->
                          <h2 class="synopsis-title" style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #1a1a2e; font-family: 'Poppins', sans-serif;">
                            Synopsis de ${film.title}
                          </h2>
                          <!-- Divider line -->
                          <div style="width: 100%; height: 3px; background: linear-gradient(90deg, #6366f1 0%, #818cf8 50%, transparent 100%); margin-bottom: 16px; border-radius: 2px;"></div>
                          <!-- Synopsis text -->
                          <p class="synopsis-text" style="margin: 0; font-size: 16px; line-height: 1.7; color: #374151; text-align: left; font-family: 'Poppins', sans-serif;">
                            ${synopsis}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding-top: 8px;">
                          <a href="${filmUrl}" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 16px 44px; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); font-family: 'Poppins', sans-serif;">
                            Voir la fiche complète →
                          </a>
                        </td>
                      </tr>
                    </table>
                    
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
                  <td style="height: 1px; background-color: #e5e7eb;"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center">
              <p class="footer-text" style="margin: 0 0 12px 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                Vous recevez cet email car vous êtes abonné à la newsletter MovieHunt.
              </p>
              <p class="footer-text" style="margin: 0; font-size: 13px;">
                <a href="https://moviehunt.fr" style="color: #6366f1; text-decoration: none; font-weight: 500;">Visiter MovieHunt</a>
                <span style="color: #d1d5db; margin: 0 8px;">•</span>
                <a href="{$unsubscribe}" style="color: #9ca3af; text-decoration: none;">Se désabonner</a>
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
