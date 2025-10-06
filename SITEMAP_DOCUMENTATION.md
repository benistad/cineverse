# Documentation Sitemap - MovieHunt

**Date**: 6 octobre 2025  
**Objectif**: Assurer une indexation optimale de toutes les pages du site

---

## 📋 Structure du Sitemap

### 1. **Sitemap Statique** (`sitemap-0.xml`)
Généré automatiquement par `next-sitemap` lors du build.

**Pages incluses**:
- Page d'accueil (`/`)
- Pages de catégories (`/top-rated`, `/hidden-gems`, etc.)
- Pages statiques (`/quel-film-regarder`, `/comment-nous-travaillons`, etc.)

**Pages exclues**:
- ❌ `/admin*` - Interface d'administration
- ❌ `/api*` - Endpoints API
- ❌ `/debug-dates*` - Pages de debug
- ❌ `/test-carousel*` - Pages de test
- ❌ Fichiers techniques (icon.png, robots.txt, etc.)

### 2. **Sitemap Dynamique** (`server-sitemap.xml`)
Généré dynamiquement à chaque requête depuis `/api/server-sitemap.xml/route.js`.

**Contenu**:
- ✅ Toutes les pages de films (`/films/[slug]`)
- ✅ Pages principales (avec priorités optimisées)
- ✅ Mise à jour automatique lors de l'ajout de nouveaux films

---

## 🔄 Mise à Jour Automatique

### Quand un nouveau film est ajouté

1. **Le film est créé dans Supabase** avec un slug
2. **Le sitemap dynamique se met à jour automatiquement**
   - Accessible via: `https://www.moviehunt.fr/server-sitemap.xml`
   - Pas besoin de rebuild
3. **Google découvre la nouvelle page** lors du prochain crawl

### Quand une nouvelle page statique est ajoutée

1. **Créer la page** dans `/src/app/`
2. **Rebuild le projet**: `npm run build`
3. **Le sitemap statique se régénère** automatiquement (postbuild)
4. **Pusher sur GitHub** pour déployer

---

## 📊 Priorités et Fréquences

### Pages Principales

| Page | Priorité | Changefreq | Raison |
|------|----------|------------|--------|
| `/` | 1.0 | daily | Page d'accueil |
| `/quel-film-regarder` | 0.9 | weekly | Page SEO importante |
| `/top-rated` | 0.9 | daily | Contenu mis à jour fréquemment |
| `/hidden-gems` | 0.9 | daily | Contenu mis à jour fréquemment |
| `/all-films` | 0.8 | daily | Liste complète des films |
| `/huntedbymoviehunt` | 0.8 | weekly | Page de marque |
| `/comment-nous-travaillons` | 0.7 | monthly | Contenu statique |
| `/advanced-search` | 0.7 | weekly | Fonctionnalité de recherche |
| `/search` | 0.6 | weekly | Page de recherche |

### Pages de Films

| Type | Priorité | Changefreq | Raison |
|------|----------|------------|--------|
| `/films/[slug]` | 0.8 | weekly | Pages de contenu principal |

---

## 🛠️ Configuration

### Fichier: `next-sitemap.config.js`

```javascript
{
  siteUrl: 'https://www.moviehunt.fr',
  generateRobotsTxt: true,
  exclude: ['/admin*', '/api*', '/debug*', '/test*'],
  additionalSitemaps: [
    'https://www.moviehunt.fr/server-sitemap.xml'
  ]
}
```

### Fichier: `/api/server-sitemap.xml/route.js`

**Fonctionnalités**:
- Récupère tous les films depuis Supabase
- Génère les URLs avec les slugs
- Ajoute les pages principales
- Retourne un sitemap XML valide

---

## 🔍 Vérification du Sitemap

### 1. Sitemap Statique
```bash
# Après un build
cat public/sitemap-0.xml
```

**Doit contenir**:
- ✅ Page d'accueil
- ✅ Pages de catégories
- ✅ Pages statiques importantes
- ❌ Pas de pages admin
- ❌ Pas de pages de debug

### 2. Sitemap Dynamique
```bash
# En production
curl https://www.moviehunt.fr/server-sitemap.xml
```

**Doit contenir**:
- ✅ Toutes les pages de films
- ✅ Pages principales
- ✅ URLs correctes avec slugs

### 3. Sitemap Index
```bash
# Vérifier le sitemap principal
curl https://www.moviehunt.fr/sitemap.xml
```

**Doit référencer**:
- ✅ `sitemap-0.xml` (pages statiques)
- ✅ `server-sitemap.xml` (pages dynamiques)

---

## 🤖 Robots.txt

### Fichier: `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /debug-dates/
Disallow: /test-carousel

Sitemap: https://www.moviehunt.fr/sitemap.xml
Sitemap: https://www.moviehunt.fr/server-sitemap.xml
```

**Règles**:
- ✅ Autoriser l'indexation de tout le site
- ❌ Bloquer les pages admin, API, debug et test
- ✅ Référencer les deux sitemaps

---

## 📈 SEO et Indexation

### Google Search Console

1. **Soumettre le sitemap**:
   - URL: `https://www.moviehunt.fr/sitemap.xml`
   - Google découvrira automatiquement `server-sitemap.xml`

2. **Surveiller l'indexation**:
   - Vérifier le nombre de pages indexées
   - Comparer avec le nombre total de films

3. **Erreurs courantes**:
   - Pages bloquées par robots.txt
   - Erreurs 404 sur les URLs de films
   - Slugs mal formés

### Bing Webmaster Tools

1. **Soumettre le sitemap**:
   - URL: `https://www.moviehunt.fr/sitemap.xml`

2. **Vérifier l'indexation**:
   - Nombre de pages découvertes
   - Nombre de pages indexées

---

## 🔧 Maintenance

### Ajouter une nouvelle page statique

1. Créer la page dans `/src/app/nouvelle-page/page.jsx`
2. Ajouter la priorité dans `next-sitemap.config.js` si nécessaire:
   ```javascript
   if (path === '/nouvelle-page') {
     return {
       loc: path,
       changefreq: 'weekly',
       priority: 0.8,
       lastmod: new Date().toISOString(),
     };
   }
   ```
3. Build: `npm run build`
4. Vérifier: `cat public/sitemap-0.xml`
5. Pusher sur GitHub

### Ajouter un nouveau film

1. Créer le film dans l'interface admin
2. **Aucune action supplémentaire nécessaire** ✅
3. Le sitemap dynamique se met à jour automatiquement
4. Google découvrira la page au prochain crawl

### Exclure une page du sitemap

1. Ajouter dans `next-sitemap.config.js`:
   ```javascript
   exclude: [
     '/admin*',
     '/nouvelle-page-a-exclure'
   ]
   ```
2. OU dans la fonction `transform`:
   ```javascript
   if (path === '/page-a-exclure') {
     return null;
   }
   ```

---

## 🐛 Dépannage

### Problème: Pages admin dans le sitemap

**Solution**:
```javascript
// next-sitemap.config.js
transform: async (config, path) => {
  if (path.startsWith('/admin')) {
    return null; // Exclure
  }
  // ...
}
```

### Problème: Films manquants dans le sitemap

**Vérifier**:
1. Le film a un slug dans Supabase
2. L'API `/api/server-sitemap.xml` fonctionne
3. La variable d'environnement `SUPABASE_SERVICE_ROLE_KEY` est définie

**Test**:
```bash
curl https://www.moviehunt.fr/api/server-sitemap.xml
```

### Problème: Sitemap non mis à jour

**Solutions**:
1. **Sitemap statique**: Rebuild le projet
2. **Sitemap dynamique**: Redémarrer le serveur
3. **Cache**: Vider le cache CDN/navigateur

---

## 📝 Checklist de Déploiement

Avant chaque déploiement:

- [ ] Vérifier que les pages admin sont exclues
- [ ] Vérifier que les pages de debug sont exclues
- [ ] Tester le sitemap statique: `cat public/sitemap-0.xml`
- [ ] Tester le sitemap dynamique: `curl /api/server-sitemap.xml`
- [ ] Vérifier robots.txt
- [ ] Soumettre à Google Search Console (si changements majeurs)

---

## 🎯 Objectifs Atteints

✅ **Sitemap statique** propre et optimisé  
✅ **Sitemap dynamique** pour les films  
✅ **Mise à jour automatique** lors de l'ajout de films  
✅ **Exclusion** des pages admin et debug  
✅ **Priorités SEO** optimisées  
✅ **Robots.txt** configuré correctement  

---

## 📚 Ressources

- [Next-Sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)
- [Google Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
