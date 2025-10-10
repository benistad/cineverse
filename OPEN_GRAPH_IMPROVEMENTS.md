# Améliorations Open Graph - MovieHunt

## 📋 Résumé des améliorations

Les métadonnées Open Graph ont été considérablement améliorées pour optimiser le partage sur les réseaux sociaux (Facebook, Twitter, LinkedIn, etc.).

## ✅ Modifications apportées

### 1. Layout principal (`src/app/layout.jsx`)

**Ajouts Open Graph:**
- `og:image:width` et `og:image:height` (1200x630)
- `og:image:alt` pour l'accessibilité
- `og:site_name` pour identifier le site
- `og:locale` pour la langue (fr_FR)
- URLs absolues pour les images (https://www.moviehunt.fr/images/og-image.jpg)

**Ajouts Twitter Card:**
- `twitter:site` et `twitter:creator` (@MovieHunt)
- `twitter:image:alt` pour l'accessibilité
- URLs absolues pour les images

### 2. Composant MetaTags (`src/components/seo/MetaTags.jsx`)

**Nouvelles propriétés:**
- `ogImageWidth` (défaut: 1200)
- `ogImageHeight` (défaut: 630)
- `ogImageAlt` (texte alternatif)
- `ogLocale` (défaut: fr_FR)
- `twitterSite` (défaut: @MovieHunt)
- `twitterCreator` (défaut: @MovieHunt)

**Améliorations:**
- Support complet des dimensions d'image OG
- Texte alternatif automatique si non fourni
- Métadonnées Twitter enrichies

### 3. Pages de films (`src/app/films/[slug]/page.jsx`)

**Améliorations:**
- Type OG spécifique: `video.movie`
- URL canonique complète
- Images en haute résolution (w780 au lieu de w500)
- Métadonnées Twitter dédiées
- Fallback vers l'image OG par défaut si pas d'affiche

### 4. API de génération d'images OG (`src/app/api/og/route.jsx`)

**Nouvelle fonctionnalité:**
- Génération dynamique d'images Open Graph
- Personnalisable via paramètres URL
- Optimisé avec Edge Runtime

**Exemples d'utilisation:**
```
/api/og?title=Inception&rating=9.5
/api/og?title=MovieHunt&subtitle=Découvrez des films incroyables
```

## 📊 Spécifications Open Graph

### Dimensions recommandées
- **Facebook/LinkedIn**: 1200 x 630 px (ratio 1.91:1)
- **Twitter**: 1200 x 675 px (ratio 16:9) ou 1200 x 630 px
- **Format**: JPG ou PNG
- **Poids**: < 1 MB (idéalement < 300 KB)

### Métadonnées essentielles
✅ `og:title` - Titre de la page
✅ `og:description` - Description
✅ `og:image` - URL absolue de l'image
✅ `og:image:width` - Largeur de l'image
✅ `og:image:height` - Hauteur de l'image
✅ `og:image:alt` - Texte alternatif
✅ `og:type` - Type de contenu (website, video.movie, etc.)
✅ `og:url` - URL canonique
✅ `og:site_name` - Nom du site
✅ `og:locale` - Langue/région

## 🎨 Image Open Graph par défaut

### À créer
L'image par défaut doit être créée et placée dans:
```
/public/images/og-image.jpg
```

### Contenu suggéré
1. Logo MovieHunt (centré ou en haut)
2. Texte principal: "Découvrez votre prochain film coup de cœur"
3. Sous-texte: "Notes, critiques et recommandations"
4. Couleur de marque: #4A68D9 (bleu MovieHunt)
5. Fond: dégradé ou image cinématographique

### Outils recommandés
- [Canva](https://www.canva.com/) - Templates "Facebook Post"
- [Figma](https://www.figma.com/)
- [Photopea](https://www.photopea.com/) - Gratuit, en ligne

## 🧪 Tests

### Outils de validation
1. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Permet de voir comment Facebook affiche votre page

2. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Prévisualisation des cartes Twitter

3. **LinkedIn Post Inspector**
   - https://www.linkedin.com/post-inspector/
   - Validation pour LinkedIn

4. **Open Graph Check**
   - https://www.opengraph.xyz/
   - Vérification multi-plateformes

### Commandes de test
```bash
# Vérifier les métadonnées d'une page
curl -s https://www.moviehunt.fr | grep -i "og:"

# Tester l'API de génération d'images OG
curl http://localhost:3000/api/og?title=Test > test-og.png
```

## 📈 Impact attendu

### Avantages
- ✅ Meilleur affichage lors du partage sur les réseaux sociaux
- ✅ Taux de clics amélioré (CTR)
- ✅ Image et description contrôlées
- ✅ Meilleure reconnaissance de marque
- ✅ SEO social amélioré

### Plateformes supportées
- Facebook
- Twitter/X
- LinkedIn
- WhatsApp
- Telegram
- Discord
- Slack
- iMessage
- Et plus...

## 🔄 Prochaines étapes

1. **Créer l'image OG par défaut** (`og-image.jpg`)
2. **Tester sur toutes les plateformes** avec les outils de validation
3. **Optionnel**: Utiliser l'API `/api/og` pour générer des images dynamiques par film
4. **Optionnel**: Créer des variations d'images OG pour différentes pages

## 📝 Notes techniques

### URLs absolues
Les images OG doivent toujours utiliser des URLs absolues:
```javascript
// ❌ Incorrect
<meta property="og:image" content="/images/og-image.jpg" />

// ✅ Correct
<meta property="og:image" content="https://www.moviehunt.fr/images/og-image.jpg" />
```

### Cache des réseaux sociaux
Les réseaux sociaux cachent les métadonnées OG. Pour forcer un rafraîchissement:
- **Facebook**: Utiliser le Sharing Debugger et cliquer "Scrape Again"
- **Twitter**: Les cartes se mettent à jour automatiquement après quelques heures
- **LinkedIn**: Utiliser le Post Inspector

### Performance
- Les images OG ne doivent pas dépasser 1 MB
- Privilégier le format JPG pour les photos (meilleure compression)
- Privilégier le format PNG pour les designs avec texte (meilleure netteté)

## 🆘 Support

Pour toute question ou problème:
1. Vérifier les logs de la console navigateur
2. Utiliser les outils de validation mentionnés ci-dessus
3. Vérifier que l'image existe et est accessible publiquement
4. S'assurer que les URLs sont absolues (avec https://)
