# Système de Routing i18n

## Vue d'ensemble

Le site MovieHunt supporte maintenant des URLs bilingues pour toutes les pages statiques :
- **Français** : `/contact`, `/halloween`, etc. (URLs par défaut)
- **Anglais** : `/en/contact`, `/en/halloween`, etc.

## Comment ça fonctionne

### 1. Middleware (`src/middleware.js`)

Le middleware intercepte toutes les requêtes et :
- Détecte si l'URL commence par `/en/`
- Si oui, fait un **rewrite** vers la page sans préfixe mais définit le cookie `NEXT_LOCALE=en`
- Si non, utilise la détection automatique de langue (cookie ou Accept-Language)

**Exemple** :
```
/en/contact → rewrite vers /contact avec cookie NEXT_LOCALE=en
/contact → détection automatique de langue
```

### 2. Pages statiques supportées

Les pages suivantes supportent les URLs `/en/...` :
- `/contact` → `/en/contact`
- `/huntedbymoviehunt` → `/en/huntedbymoviehunt`
- `/hidden-gems` → `/en/hidden-gems`
- `/top-rated` → `/en/top-rated`
- `/all-films` → `/en/all-films`
- `/comment-nous-travaillons` → `/en/comment-nous-travaillons`
- `/quel-film-regarder` → `/en/quel-film-regarder`
- `/films-horreur-halloween-2025` → `/en/films-horreur-halloween-2025`

### 3. Changement de langue

Le composant `LanguageSelector` :
- Change le cookie `NEXT_LOCALE`
- Redirige automatiquement vers l'URL appropriée :
  - FR → EN : ajoute `/en` au début de l'URL
  - EN → FR : enlève `/en` de l'URL

**Exemple** :
```javascript
// Sur /contact, cliquer sur EN
→ Redirige vers /en/contact

// Sur /en/contact, cliquer sur FR
→ Redirige vers /contact
```

### 4. Balises hreflang

Le composant `HreflangTags` ajoute automatiquement les balises SEO :
```html
<link rel="alternate" hreflang="fr" href="https://moviehunt.fr/contact" />
<link rel="alternate" hreflang="en" href="https://moviehunt.fr/en/contact" />
<link rel="alternate" hreflang="x-default" href="https://moviehunt.fr/contact" />
```

## Avantages

✅ **SEO** : Google indexe les deux versions (FR et EN)
✅ **UX** : Les utilisateurs peuvent partager des URLs en anglais
✅ **Simplicité** : Une seule page physique, pas de duplication
✅ **Performance** : Rewrite côté serveur, pas de redirection

## Ajouter une nouvelle page statique

Pour ajouter une nouvelle page avec support i18n :

1. **Ajouter l'URL dans `src/middleware.js`** :
```javascript
const staticPages = [
  '/contact',
  '/ma-nouvelle-page', // ← Ajouter ici
  // ...
];
```

2. **Ajouter l'URL dans `src/contexts/LanguageContext.jsx`** :
```javascript
const staticPages = [
  '/contact',
  '/ma-nouvelle-page', // ← Ajouter ici
  // ...
];
```

3. **Ajouter l'URL dans `src/components/HreflangTags.jsx`** :
```javascript
const staticPages = [
  '/contact',
  '/ma-nouvelle-page', // ← Ajouter ici
  // ...
];
```

4. **Ajouter les traductions dans `messages/en.json` et `messages/fr.json`**

5. **Utiliser le hook `useTranslations()` dans votre page**

C'est tout ! Les URLs `/ma-nouvelle-page` et `/en/ma-nouvelle-page` fonctionneront automatiquement.

## Test

Pour tester :
```bash
# Accéder à la version française
http://localhost:3000/contact

# Accéder à la version anglaise
http://localhost:3000/en/contact

# Changer de langue avec le sélecteur
# → L'URL change automatiquement
```

## Notes importantes

- Les URLs `/en/films/...` pour les pages de films individuels sont gérées séparément
- Le middleware ne touche pas aux routes `/admin` et `/api`
- Le cookie `NEXT_LOCALE` a une durée de vie de 1 an
- La langue par défaut est le français (`fr`)
