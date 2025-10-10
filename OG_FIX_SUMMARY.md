# Résolution du problème Open Graph - MovieHunt

## 🔍 Problème initial
Les images Open Graph n'apparaissaient pas lors du partage sur les réseaux sociaux (testé sur opengraph.xyz).

## 🛠️ Solutions apportées

### 1. Création de l'image Open Graph
- **Fichier créé** : `/public/images/og-image.jpg`
- **Dimensions** : 1200 x 630 pixels (ratio optimal 1.91:1)
- **Poids** : 190 KB (< 300 KB recommandé)
- **Méthode** : Redimensionnement du placeholder existant avec `sips` (outil macOS)

### 2. Conversion des URLs relatives en absolues
**Fichiers modifiés** :
- `src/app/metadata.js`
- `src/app/quel-film-regarder/metadata.js`
- `src/app/films-horreur-halloween-2025/metadata.js`

**Changement** :
```javascript
// ❌ Avant (URL relative)
url: '/images/og-image.jpg'

// ✅ Après (URL absolue)
url: 'https://www.moviehunt.fr/images/og-image.jpg'
```

### 3. Refactorisation du Layout pour SSR

**Problème principal** : Le `layout.jsx` utilisait `'use client'`, empêchant l'export des métadonnées côté serveur.

**Solution** :
1. Renommé `layout.jsx` → `ClientLayout.jsx`
2. Créé nouveau `layout.jsx` (composant serveur)
3. Export des métadonnées depuis le layout serveur
4. Wrapper du ClientLayout dans le layout serveur

**Structure finale** :
```
layout.jsx (Server Component)
  ├── Export metadata
  ├── <html> et <body>
  └── <ClientLayout>
        ├── Scripts analytics
        ├── Navbar
        └── Contenu dynamique
```

### 4. Amélioration des métadonnées Open Graph

**Métadonnées ajoutées** :
- `og:image:width` et `og:image:height`
- `og:image:alt` (accessibilité)
- `og:locale` (fr_FR)
- `og:site_name`
- `twitter:site` et `twitter:creator` (@MovieHunt)
- `twitter:image:alt`

**Pour les pages de films** :
- Type spécifique : `og:type: "video.movie"`
- Images haute résolution (w780)
- Métadonnées Twitter dédiées
- Fallback vers image par défaut

### 5. API de génération d'images OG dynamiques

**Nouveau endpoint** : `/api/og/route.jsx`
- Génération d'images OG personnalisées
- Utilise Next.js `ImageResponse`
- Edge Runtime pour performance optimale

**Exemples d'utilisation** :
```
/api/og?title=Inception&rating=9.5
/api/og?title=MovieHunt&subtitle=Découvrez des films incroyables
```

## ✅ Résultat

Les métadonnées Open Graph sont maintenant correctement rendues côté serveur :

```html
<meta property="og:image" content="https://www.moviehunt.fr/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="MovieHunt - Découvrez votre prochain film coup de cœur">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://www.moviehunt.fr/images/og-image.jpg">
```

## 🧪 Tests recommandés

1. **OpenGraph.xyz**
   ```
   https://www.opengraph.xyz/?url=https://www.moviehunt.fr
   ```

2. **Facebook Sharing Debugger**
   ```
   https://developers.facebook.com/tools/debug/?q=https://www.moviehunt.fr
   ```
   Cliquer sur "Scrape Again" pour forcer le rafraîchissement

3. **Twitter Card Validator**
   ```
   https://cards-dev.twitter.com/validator
   ```

4. **LinkedIn Post Inspector**
   ```
   https://www.linkedin.com/post-inspector/
   ```

## 📊 Commits

1. `feat: Install Microsoft Clarity Analytics` (82d4a7b)
2. `feat: Amélioration complète des métadonnées Open Graph` (fa63167)
3. `feat: Add default Open Graph image (1200x630)` (80fe3ec)
4. `fix: Use absolute URLs for Open Graph images` (2d2df57)
5. `fix: Refactor layout to enable SSR Open Graph metadata` (28376d3)

## 📝 Notes importantes

### Cache
- **Vercel** : Cache automatique, peut prendre quelques minutes à se mettre à jour
- **Facebook** : Cache les métadonnées OG, utiliser le Sharing Debugger pour forcer le rafraîchissement
- **Twitter** : Cache automatique, mise à jour après quelques heures

### URLs absolues obligatoires
Les réseaux sociaux nécessitent des URLs absolues pour les images OG :
```javascript
// ❌ Ne fonctionne pas
<meta property="og:image" content="/images/og-image.jpg" />

// ✅ Fonctionne
<meta property="og:image" content="https://www.moviehunt.fr/images/og-image.jpg" />
```

### Composants serveur vs client
- **Métadonnées** : Doivent être exportées depuis des Server Components
- **Interactivité** : Nécessite des Client Components (`'use client'`)
- **Solution** : Séparer layout serveur (métadonnées) et client (interactivité)

## 🎨 Amélioration future

L'image OG actuelle est un placeholder redimensionné. Pour une meilleure présentation :

1. Créer une image personnalisée avec :
   - Logo MovieHunt
   - Texte accrocheur
   - Design professionnel
   - Couleurs de marque (#4A68D9)

2. Outils recommandés :
   - Canva (templates "Facebook Post")
   - Figma
   - Photopea (gratuit, en ligne)

3. Spécifications :
   - 1200 x 630 px
   - Format JPG ou PNG
   - < 300 KB
   - Texte lisible même en petit

## 🔗 Documentation

- `OPEN_GRAPH_IMPROVEMENTS.md` : Documentation complète des améliorations
- `public/images/og-image-instructions.md` : Instructions pour créer l'image OG
- `API_DOCUMENTATION.md` : Documentation de l'API `/api/og`
