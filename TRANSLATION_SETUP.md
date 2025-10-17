# 🌍 Configuration de la traduction automatique avec DeepL

## 📋 Vue d'ensemble

Le système de traduction automatique permet de traduire automatiquement tous les films (existants et nouveaux) du français vers l'anglais en utilisant l'API DeepL.

### Fonctionnalités

✅ **Traduction automatique de tous les films existants**
- Script pour traduire en masse tous les films
- Gestion intelligente des films déjà traduits
- Traitement par lots pour optimiser les performances

✅ **Traduction automatique des nouveaux films**
- API endpoint pour traduire un film à la demande
- Peut être appelé automatiquement lors de l'ajout d'un film

✅ **Affichage automatique des traductions**
- Les cartes de films affichent automatiquement les traductions
- Fallback vers le français si pas de traduction
- Aucun impact sur les performances

✅ **Conservation du SEO**
- Les URLs restent identiques
- Les métadonnées sont traduites dynamiquement
- Pas d'impact sur le référencement existant

---

## 🚀 Installation

### Étape 1 : Obtenir une clé API DeepL

1. Allez sur https://www.deepl.com/pro-api
2. Créez un compte gratuit
   - **500 000 caractères/mois gratuits**
   - Parfait pour commencer
   - Pas de carte bancaire requise
3. Copiez votre clé API

### Étape 2 : Configurer la clé API

Ajoutez cette ligne dans votre fichier `.env.local` :

```bash
DEEPL_API_KEY=votre_cle_api_deepl_ici
```

### Étape 3 : Installer les dépendances

```bash
npm install dotenv
```

---

## 📝 Utilisation

### Traduire tous les films existants

```bash
node scripts/translate-all-films.js
```

**Ce script va** :
1. Récupérer tous les films de la base de données
2. Vérifier quels films sont déjà traduits
3. Traduire les films manquants par lots de 5
4. Sauvegarder les traductions dans `film_translations`
5. Afficher un résumé détaillé

**Exemple de sortie** :
```
🚀 Starting automatic translation of all films...

📥 Fetching all films from database...
✅ Found 150 films

🔍 Checking existing translations...
✅ 20 films already translated
📝 130 films to translate

📊 Estimated characters to translate: 45,000
💰 DeepL free tier: 500,000 characters/month

📦 Processing batch 1/26
  ✅ Inception
  ✅ The Matrix
  ✅ Interstellar
  ✅ The Dark Knight
  ✅ Pulp Fiction
⏳ Waiting 2 seconds before next batch...

...

==================================================
📊 TRANSLATION SUMMARY
==================================================
✅ Successfully translated: 130 films
❌ Failed: 0 films
📈 Total: 130 films processed
🎉 Completion rate: 100.0%
==================================================

✨ All films successfully translated!
```

### Traduire un film spécifique

Vous pouvez appeler l'API pour traduire un film :

```javascript
// Dans votre code admin
const response = await fetch('/api/translate-film', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ filmId: 'film-id-here' })
});

const result = await response.json();
console.log(result); // { success: true, filmId: '...', translations: {...} }
```

### Vérifier si un film est traduit

```javascript
const response = await fetch(`/api/translate-film?filmId=${filmId}`);
const result = await response.json();
console.log(result.translated); // true ou false
```

---

## 🔧 Intégration dans l'admin

### Option A : Bouton manuel dans l'interface admin

Ajoutez un bouton "Traduire" dans votre interface d'édition de film :

```jsx
<button onClick={async () => {
  await fetch('/api/translate-film', {
    method: 'POST',
    body: JSON.stringify({ filmId: film.id })
  });
  alert('Film traduit !');
}}>
  Traduire en anglais
</button>
```

### Option B : Traduction automatique à la sauvegarde

Modifiez votre fonction de sauvegarde de film pour appeler automatiquement la traduction :

```javascript
// Après avoir sauvegardé le film
await fetch('/api/translate-film', {
  method: 'POST',
  body: JSON.stringify({ filmId: newFilm.id })
});
```

---

## 📊 Estimation des coûts

### Limite gratuite DeepL
- **500 000 caractères/mois** gratuits
- Environ **150-200 films** par mois (selon la longueur des synopsis)

### Calcul approximatif par film
- Titre : ~30 caractères
- Synopsis : ~200 caractères
- Pourquoi regarder : ~150 caractères
- Ce qu'on n'a pas aimé : ~100 caractères
- **Total moyen : ~480 caractères par film**

### Si vous dépassez la limite gratuite
- DeepL Pro : 5,49€/mois pour 1 million de caractères
- Ou traduisez par lots de 100 films/mois

---

## 🎯 Fonctionnement technique

### 1. Structure de la base de données

Les traductions sont stockées dans la table `film_translations` :

```sql
CREATE TABLE film_translations (
  id UUID PRIMARY KEY,
  film_id VARCHAR REFERENCES films(id),
  locale VARCHAR(5),
  title VARCHAR,
  synopsis TEXT,
  why_watch_content TEXT,
  what_we_didnt_like TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(film_id, locale)
);
```

### 2. Flux de traduction

```
Film français → DeepL API → Traduction anglaise → film_translations
```

### 3. Affichage côté client

```
1. Récupérer les films (français)
2. Si locale = 'en', récupérer les traductions
3. Fusionner les traductions avec les films
4. Afficher les films traduits
```

### 4. Optimisations

- **Traduction par lots** : 5 films à la fois pour respecter les limites de l'API
- **Cache** : Les traductions sont mises en cache côté client
- **Requêtes optimisées** : Une seule requête pour récupérer toutes les traductions
- **Fallback automatique** : Si pas de traduction, affiche le français

---

## 🐛 Dépannage

### Erreur "DeepL API key not configured"

**Solution** : Vérifiez que `DEEPL_API_KEY` est bien dans votre `.env.local`

### Les traductions ne s'affichent pas

**Vérifications** :
1. Les traductions sont-elles dans la base ? → Vérifier `film_translations`
2. La langue est-elle bien changée ? → Vérifier le cookie `NEXT_LOCALE`
3. Y a-t-il des erreurs dans la console ?

### Erreur "429 Too Many Requests"

**Solution** : Vous avez dépassé la limite de l'API DeepL
- Attendez quelques minutes
- Réduisez la taille des lots dans le script
- Passez à DeepL Pro

### Les traductions sont de mauvaise qualité

**Solutions** :
1. Vérifiez que le texte français est correct
2. DeepL est généralement excellent, mais vous pouvez :
   - Modifier manuellement via `/admin/translations`
   - Utiliser une autre API (OpenAI GPT)

---

## 📈 Prochaines améliorations possibles

### Court terme
- [ ] Bouton "Traduire" dans l'interface admin
- [ ] Traduction automatique à la sauvegarde d'un film
- [ ] Indicateur visuel des films traduits

### Moyen terme
- [ ] Traduction du staff remarquable
- [ ] Support de langues supplémentaires (ES, DE, IT)
- [ ] Traduction automatique des pages statiques

### Long terme
- [ ] Interface de révision des traductions
- [ ] Historique des modifications de traductions
- [ ] Traduction collaborative (plusieurs langues)

---

## 📞 Support

### Ressources
- Documentation DeepL : https://www.deepl.com/docs-api
- Tableau de bord DeepL : https://www.deepl.com/account/usage

### Commandes utiles

```bash
# Traduire tous les films
node scripts/translate-all-films.js

# Vérifier le nombre de films traduits
# Dans Supabase SQL Editor :
SELECT COUNT(*) FROM film_translations WHERE locale = 'en';

# Voir les films non traduits
SELECT f.id, f.title 
FROM films f
LEFT JOIN film_translations ft ON f.id = ft.film_id AND ft.locale = 'en'
WHERE ft.id IS NULL;
```

---

**Version** : 1.0  
**Date** : Octobre 2025  
**Auteur** : Équipe MovieHunt
