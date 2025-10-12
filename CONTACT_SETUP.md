# Configuration du formulaire de contact

## 📧 Page de contact créée

Une page de contact complète a été créée à l'URL : `/contact`

### Fonctionnalités

- ✅ Formulaire avec validation
- ✅ Design moderne et responsive
- ✅ Messages de succès/erreur
- ✅ Informations de contact affichées
- ✅ Envoi d'emails à `contact@moviehunt.fr`
- ✅ Lien ajouté dans le footer

## 🔧 Configuration de l'envoi d'emails

Pour que les emails soient réellement envoyés, vous devez configurer **Resend** (recommandé) :

### Option 1 : Resend (Recommandé)

Resend est un service d'envoi d'emails moderne et fiable.

#### Étapes :

1. **Créer un compte Resend**
   - Allez sur https://resend.com
   - Créez un compte gratuit (100 emails/jour gratuits)

2. **Obtenir votre clé API**
   - Dans le dashboard Resend, allez dans "API Keys"
   - Créez une nouvelle clé API
   - Copiez la clé

3. **Configurer le domaine (optionnel mais recommandé)**
   - Dans Resend, allez dans "Domains"
   - Ajoutez `moviehunt.fr`
   - Suivez les instructions pour configurer les enregistrements DNS
   - Cela permet d'envoyer depuis `noreply@moviehunt.fr`

4. **Ajouter la clé API dans Vercel**
   - Allez dans les paramètres de votre projet Vercel
   - Section "Environment Variables"
   - Ajoutez : `RESEND_API_KEY` = votre clé API
   - Redéployez l'application

5. **Variables d'environnement locales**
   
   Créez/modifiez `.env.local` :
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

### Option 2 : Nodemailer (Alternative)

Si vous préférez utiliser un serveur SMTP traditionnel :

1. Installez Nodemailer :
   ```bash
   npm install nodemailer
   ```

2. Modifiez `/src/app/api/contact/route.js` pour utiliser Nodemailer

3. Ajoutez les variables d'environnement :
   ```bash
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-password
   ```

## 📝 Exemple d'email reçu

Lorsqu'un utilisateur envoie un message, vous recevrez un email formaté avec :

- Nom de l'expéditeur
- Email de l'expéditeur (avec reply-to configuré)
- Sujet du message
- Contenu du message
- Design HTML professionnel

## 🧪 Test en développement

En développement (sans configuration), le formulaire :
- ✅ Accepte les soumissions
- ✅ Affiche un message de succès
- ✅ Log le contenu dans la console
- ⚠️ N'envoie pas réellement d'email

Pour tester l'envoi réel d'emails en local :
1. Configurez `RESEND_API_KEY` dans `.env.local`
2. Redémarrez le serveur de développement
3. Testez le formulaire

## 🚀 En production

Une fois `RESEND_API_KEY` configuré dans Vercel :
- ✅ Les emails seront envoyés automatiquement
- ✅ Vous recevrez les messages à `contact@moviehunt.fr`
- ✅ Le reply-to sera configuré avec l'email de l'expéditeur

## 🎨 Personnalisation

### Modifier l'email de destination

Dans `/src/app/api/contact/route.js`, ligne 58 :
```javascript
to: ['contact@moviehunt.fr'],
```

### Modifier le design de l'email

Le template HTML est dans `/src/app/api/contact/route.js`, lignes 32-86.

### Modifier le formulaire

Le formulaire est dans `/src/app/contact/page.jsx`.

## 📊 Limites Resend (plan gratuit)

- 100 emails/jour
- 3,000 emails/mois
- Parfait pour un formulaire de contact

Pour plus d'emails, passez au plan payant (20$/mois pour 50,000 emails).

## 🔒 Sécurité

- ✅ Validation des données côté serveur
- ✅ Validation de l'email avec regex
- ✅ Protection contre les champs vides
- ✅ Rate limiting (à ajouter si nécessaire)

### Ajouter un rate limiting (optionnel)

Pour éviter le spam, vous pouvez ajouter un rate limiting avec Vercel Edge Config ou Upstash Redis.

## 📱 Responsive

Le formulaire est entièrement responsive et fonctionne sur :
- 📱 Mobile
- 💻 Tablette
- 🖥️ Desktop

## ✅ Checklist de déploiement

- [ ] Créer un compte Resend
- [ ] Obtenir la clé API
- [ ] Ajouter `RESEND_API_KEY` dans Vercel
- [ ] (Optionnel) Configurer le domaine dans Resend
- [ ] Tester le formulaire en production
- [ ] Vérifier la réception des emails

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que `RESEND_API_KEY` est bien configuré
2. Vérifiez les logs Vercel pour les erreurs
3. Testez avec l'API Resend directement
4. Consultez la documentation Resend : https://resend.com/docs
