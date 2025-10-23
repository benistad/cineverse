# Compression HTTP (gzip/Brotli)

## Problème identifié par Seobility

Les fichiers JavaScript ne sont pas compressés avec gzip ou Brotli :
- `/_next/static/chunks/main-app-6cb4d4205dbe6682.js` (0.5 kB)
- `/_next/static/chunks/app/en/films/%5Bslug%5D/page-df44e8c73281e0fa.js` (0.2 kB)

## Solution

### 1. Configuration Next.js

Le fichier `next.config.js` active explicitement la compression :

```javascript
const nextConfig = {
  compress: true, // Active la compression gzip
  // ...
};
```

### 2. Vercel (Production)

**Vercel active automatiquement la compression en production :**
- Brotli pour les navigateurs qui le supportent
- Gzip comme fallback
- Compression automatique pour tous les fichiers texte (JS, CSS, HTML, JSON, etc.)

**Vérification :**
```bash
curl -H "Accept-Encoding: gzip, deflate, br" -I https://www.moviehunt.fr
```

Vous devriez voir :
```
Content-Encoding: br
```
ou
```
Content-Encoding: gzip
```

### 3. Pourquoi Seobility détecte "No http compression" ?

Plusieurs raisons possibles :

1. **Test sur un environnement de preview** : Les previews Vercel peuvent ne pas avoir la compression activée
2. **Cache CDN** : Le premier accès peut ne pas être compressé
3. **Fichiers très petits** : Les fichiers < 1 kB ne sont parfois pas compressés (overhead)
4. **Headers manquants** : L'outil de test n'envoie pas `Accept-Encoding: gzip, br`

### 4. Vérification manuelle

Pour vérifier que la compression fonctionne en production :

```bash
# Test avec curl
curl -H "Accept-Encoding: gzip, deflate, br" \
  -I https://www.moviehunt.fr/_next/static/chunks/main-app-6cb4d4205dbe6682.js

# Test avec wget
wget --server-response --spider \
  --header="Accept-Encoding: gzip, deflate, br" \
  https://www.moviehunt.fr/_next/static/chunks/main-app-6cb4d4205dbe6682.js
```

### 5. Outils de test recommandés

- **GTmetrix** : https://gtmetrix.com/
- **WebPageTest** : https://www.webpagetest.org/
- **Google PageSpeed Insights** : https://pagespeed.web.dev/
- **Chrome DevTools** : Network tab → Size column (compare "Size" vs "Transferred")

### 6. Résultat attendu

En production sur Vercel, tous les fichiers texte devraient être compressés :
- Ratio de compression : 70-90% pour JS/CSS
- `Content-Encoding: br` ou `Content-Encoding: gzip` dans les headers
- Taille transférée beaucoup plus petite que la taille réelle

## Note importante

⚠️ **Vercel gère automatiquement la compression en production**. Vous n'avez rien à faire de plus. Si Seobility détecte un problème, c'est probablement :
- Un test sur un environnement non-production
- Un problème temporaire de cache
- Une limitation de l'outil de test

La configuration `compress: true` dans `next.config.js` est principalement utile pour le développement local avec `next start`.
