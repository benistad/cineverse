# Configuration de la Newsletter MailerLite

## Prérequis

1. Créer un compte sur [mailerlite.com](https://www.mailerlite.com)
2. Récupérer la clé API dans **Settings → Integrations → API**

## Variables d'environnement

Ajouter dans `.env.local` et dans Vercel :

```env
# MailerLite
MAILERLITE_API_KEY=your_api_key_here
MAILERLITE_FROM_EMAIL=newsletter@moviehunt.fr

# Optionnel : token de sécurité pour l'API d'envoi
NEWSLETTER_SECRET_TOKEN=your_secret_token_here
```

## Base de données Supabase

Exécuter le script SQL pour créer la table des abonnés :

```bash
# Dans Supabase SQL Editor
schema/newsletter_subscribers.sql
```

## Architecture

```
┌─────────────────────┐
│   Footer            │
│   (NewsletterForm)  │
└──────────┬──────────┘
           │ POST /api/newsletter/subscribe
           ▼
┌─────────────────────┐     ┌─────────────────┐
│   Supabase          │     │   MailerLite    │
│   (subscribers)     │     │   (contacts)    │
└─────────────────────┘     └─────────────────┘

┌─────────────────────┐
│   FilmEditor        │
│   (après saveFilm)  │
└──────────┬──────────┘
           │ POST /api/newsletter/send
           ▼
┌─────────────────────┐
│   MailerLite        │
│   (campagne email)  │
└─────────────────────┘
```

## Fonctionnement

### Inscription
1. L'utilisateur remplit le formulaire dans le footer
2. L'email est envoyé à `/api/newsletter/subscribe`
3. L'abonné est ajouté à MailerLite ET sauvegardé dans Supabase

### Envoi automatique
1. Un nouveau film est publié via l'admin
2. Après la sauvegarde, `/api/newsletter/send` est appelé
3. Une campagne MailerLite est créée et envoyée immédiatement
4. Tous les abonnés reçoivent l'email avec :
   - Titre du film
   - Affiche
   - Note
   - Synopsis (tronqué à 300 caractères)
   - Bouton CTA vers la fiche du film

## Fichiers créés

- `src/lib/mailerlite.js` - Client API MailerLite
- `src/app/api/newsletter/subscribe/route.js` - Inscription
- `src/app/api/newsletter/send/route.js` - Envoi campagne
- `src/components/newsletter/NewsletterForm.jsx` - Formulaire
- `schema/newsletter_subscribers.sql` - Table Supabase

## Fichiers modifiés

- `src/components/films/FilmEditor.jsx` - Appel API après sauvegarde
- `src/components/layout/Footer.jsx` - Ajout formulaire newsletter

## Notes

- La newsletter n'est envoyée que pour les **nouveaux films** (pas les mises à jour)
- Si `MAILERLITE_API_KEY` n'est pas configurée, l'envoi est ignoré silencieusement
- Le template email est responsive et utilise le design MovieHunt
- Le lien de désabonnement est géré automatiquement par MailerLite (`{$unsubscribe}`)

## Test en local

```bash
# Tester l'inscription
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "firstName": "Test"}'

# Tester l'envoi (nécessite MAILERLITE_API_KEY)
curl -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Film", "slug": "test-film", "synopsis": "Un super film", "poster_url": "https://...", "note_sur_10": 8}'
```
