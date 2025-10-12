import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires.' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      );
    }

    // Préparer le contenu de l'email
    const emailContent = {
      from: email,
      to: 'contact@moviehunt.fr',
      subject: `[MovieHunt Contact] ${subject}`,
      text: `
Nouveau message de contact depuis MovieHunt

De: ${name}
Email: ${email}
Sujet: ${subject}

Message:
${message}

---
Ce message a été envoyé depuis le formulaire de contact de MovieHunt.
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4A68D9; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
    .value { color: #1f2937; }
    .message-box { background-color: white; padding: 20px; border-left: 4px solid #4A68D9; margin-top: 20px; }
    .footer { background-color: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Nouveau message de contact</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">MovieHunt</p>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="label">Nom :</div>
        <div class="value">${name}</div>
      </div>
      
      <div class="field">
        <div class="label">Email :</div>
        <div class="value"><a href="mailto:${email}" style="color: #4A68D9;">${email}</a></div>
      </div>
      
      <div class="field">
        <div class="label">Sujet :</div>
        <div class="value">${subject}</div>
      </div>
      
      <div class="message-box">
        <div class="label">Message :</div>
        <div class="value" style="white-space: pre-wrap;">${message}</div>
      </div>
    </div>
    
    <div class="footer">
      Ce message a été envoyé depuis le formulaire de contact de MovieHunt<br>
      <a href="https://www.moviehunt.fr" style="color: #60a5fa;">www.moviehunt.fr</a>
    </div>
  </div>
</body>
</html>
      `.trim(),
    };

    // Si vous avez configuré Resend
    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'MovieHunt Contact <noreply@moviehunt.fr>',
          reply_to: email,
          to: ['contact@moviehunt.fr'],
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        console.error('Resend API error:', errorData);
        throw new Error('Erreur lors de l\'envoi de l\'email via Resend');
      }

      return NextResponse.json(
        { success: true, message: 'Message envoyé avec succès !' },
        { status: 200 }
      );
    }

    // Fallback : Si Resend n'est pas configuré, utiliser Nodemailer (optionnel)
    // Pour l'instant, on retourne un succès pour le développement
    console.log('Email à envoyer:', emailContent);
    
    // En production, vous devriez configurer Resend ou un autre service d'email
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message reçu ! (Configuration email en attente)',
        dev: process.env.NODE_ENV === 'development' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du message.' },
      { status: 500 }
    );
  }
}

// Méthodes non autorisées
export async function GET() {
  return NextResponse.json(
    { error: 'Méthode non autorisée' },
    { status: 405 }
  );
}
