# SEO Multilingue - MovieHunt

## 📋 Vue d'ensemble

MovieHunt implémente les meilleures pratiques SEO pour le contenu multilingue selon les recommandations de Google.

---

## ✅ Implémentation SEO

### 1. **Structure d'URLs distinctes** ✅

Chaque langue a sa propre URL :
```
https://www.moviehunt.fr/films/slug          → Version française
https://www.moviehunt.fr/en/films/slug       → Version anglaise
```

**Avantages :**
- ✅ Recommandé par Google
- ✅ Meilleur pour le référencement local
- ✅ Facilite le ciblage géographique
- ✅ URLs claires et compréhensibles

**Alternatives évitées :**
- ❌ Paramètres URL (`?lang=en`) - Moins bon pour SEO
- ❌ Sous-domaines (`en.moviehunt.fr`) - Complexe à gérer
- ❌ Domaines séparés (`moviehunt.com`) - Coûteux

---

### 2. **Balises hreflang** ✅

**Composant :** `src/components/HreflangTags.jsx`

Les balises hreflang indiquent à Google les versions linguistiques d'une page :

```html
<link rel="alternate" hreflang="fr" href="https://www.moviehunt.fr/films/slug" />
<link rel="alternate" hreflang="en" href="https://www.moviehunt.fr/en/films/slug" />
<link rel="alternate" hreflang="x-default" href="https://www.moviehunt.fr/films/slug" />
```

**Fonctionnement :**
- Détection automatique du pathname
- Support des pages statiques et dynamiques (films)
- Mapping des URLs différentes (ex: `/films-inconnus` → `/hidden-gems`)
- Mise à jour dynamique lors de la navigation

**Pages couvertes :**
- Homepage (`/`)
- Pages statiques (`/top-rated`, `/all-films`, etc.)
- Pages dynamiques (`/films/[slug]`)
- Pages avec URLs différentes (`/films-inconnus` ↔ `/hidden-gems`)

**Bénéfices :**
- ✅ Évite le contenu dupliqué
- ✅ Google affiche la bonne version selon la langue de l'utilisateur
- ✅ Améliore le référencement international

---

### 3. **Balises canonical dynamiques** ✅

**Composant :** `src/components/CanonicalTag.jsx`

Chaque version linguistique a sa propre URL canonique :

```html
<!-- Page française -->
<link rel="canonical" href="https://www.moviehunt.fr/films/slug" />

<!-- Page anglaise -->
<link rel="canonical" href="https://www.moviehunt.fr/en/films/slug" />
```

**Fonctionnement :**
- Mise à jour automatique selon l'URL actuelle
- Suppression de l'ancienne canonical avant d'ajouter la nouvelle
- Évite les conflits entre versions linguistiques

**Bénéfices :**
- ✅ Chaque version est considérée comme unique
- ✅ Pas de cannibalisation entre versions
- ✅ Google indexe correctement les deux versions

---

### 4. **Attribut lang dynamique** ✅

**Composant :** `src/components/HtmlLangAttribute.jsx`

L'attribut `lang` de la balise `<html>` change selon la langue :

```html
<!-- Version française -->
<html lang="fr">

<!-- Version anglaise -->
<html lang="en">
```

**Fonctionnement :**
- Détection automatique via `useLanguage()`
- Mise à jour dynamique lors du changement de langue
- `suppressHydrationWarning` pour éviter les warnings React

**Bénéfices :**
- ✅ Améliore l'accessibilité (lecteurs d'écran)
- ✅ Signal clair pour Google sur la langue du contenu
- ✅ Meilleur référencement

---

### 5. **Contenu unique par langue** ✅

**Source :** API TMDB

Chaque version a un contenu réellement différent :

**Version française :**
- Titre : "Kiss Kiss Bang Bang"
- Genres : "Comédie, Crime, Mystère, Thriller"
- Synopsis : "Synopsis en français..."

**Version anglaise :**
- Titre : "Kiss Kiss Bang Bang"
- Genres : "Comedy, Crime, Mystery, Thriller"
- Synopsis : "English synopsis..."

**Bénéfices :**
- ✅ Pas de contenu dupliqué
- ✅ Chaque version est unique pour Google
- ✅ Meilleur référencement dans chaque langue

---

### 6. **Sitemap multilingue** ✅

**Fichier :** `src/app/sitemap.js`

Le sitemap inclut toutes les versions linguistiques :

```xml
<url>
  <loc>https://www.moviehunt.fr/films/slug</loc>
  <lastmod>2025-01-28</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://www.moviehunt.fr/en/films/slug</loc>
  <lastmod>2025-01-28</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

**Bénéfices :**
- ✅ Google découvre toutes les versions
- ✅ Indexation plus rapide
- ✅ Meilleure couverture

---

### 7. **Métadonnées par langue** ✅

Chaque page a ses propres métadonnées traduites :

```javascript
// Version française
document.title = "Film X | MovieHunt";
meta[description] = "Découvrez Film X...";

// Version anglaise
document.title = "Film X | MovieHunt";
meta[description] = "Discover Film X...";
```

**Implémentation :**
- Hook `useTranslations()` pour les textes UI
- Enrichissement TMDB pour les contenus films
- Mise à jour dynamique via `useEffect`

**Bénéfices :**
- ✅ Snippets Google adaptés à chaque langue
- ✅ Meilleur CTR (taux de clic)
- ✅ Expérience utilisateur cohérente

---

## 🎯 Résultat : SEO Optimal

### Checklist Google ✅

- ✅ **URLs distinctes** par langue
- ✅ **Balises hreflang** sur toutes les pages
- ✅ **Canonical unique** par version
- ✅ **Attribut lang** dynamique
- ✅ **Contenu unique** (pas de duplication)
- ✅ **Sitemap** complet
- ✅ **Métadonnées** traduites

### Risques évités ✅

- ✅ **Pas de pénalité** pour contenu dupliqué
- ✅ **Pas de cannibalisation** entre versions
- ✅ **Pas de confusion** pour Google
- ✅ **Pas de problème** d'indexation

### Bénéfices SEO ✅

1. **Référencement international amélioré**
   - Google affiche la bonne version selon la langue de l'utilisateur
   - Meilleur positionnement dans chaque pays

2. **Indexation optimale**
   - Les deux versions sont indexées correctement
   - Pas de conflit entre elles

3. **Expérience utilisateur**
   - Contenu dans la langue de l'utilisateur
   - Navigation cohérente

4. **Conformité Google**
   - Respect des guidelines officielles
   - Implémentation recommandée par Google

---

## 📊 Vérification SEO

### Outils de test

1. **Google Search Console**
   - Vérifier l'indexation des deux versions
   - Surveiller les erreurs hreflang
   - Analyser les performances par pays

2. **Test hreflang**
   - https://technicalseo.com/tools/hreflang/
   - Vérifier la configuration hreflang

3. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Tester les données structurées

4. **Lighthouse**
   - Audit SEO automatique
   - Score SEO > 90

### Commandes de vérification

```bash
# Vérifier les balises hreflang dans le HTML
curl https://www.moviehunt.fr/films/slug | grep hreflang

# Vérifier la canonical
curl https://www.moviehunt.fr/films/slug | grep canonical

# Vérifier l'attribut lang
curl https://www.moviehunt.fr/films/slug | grep '<html lang'
```

---

## 🔄 Maintenance

### Nouvelles pages

Lors de la création d'une nouvelle page, vérifier :

1. ✅ Ajout dans `staticPages` de `HreflangTags.jsx`
2. ✅ Création de la version `/en`
3. ✅ Ajout au sitemap
4. ✅ Traductions des métadonnées
5. ✅ Test des balises hreflang

### Monitoring

- Surveiller Google Search Console mensuellement
- Vérifier l'indexation des nouvelles pages
- Analyser les erreurs hreflang
- Comparer les performances FR vs EN

---

## 📚 Ressources

### Documentation Google

- [Gérer les sites multilingues](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Utiliser hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Éviter le contenu dupliqué](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

### Outils

- [Google Search Console](https://search.google.com/search-console)
- [Hreflang Tags Testing Tool](https://technicalseo.com/tools/hreflang/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)

---

## 🎓 Bonnes pratiques

### À faire ✅

- Utiliser des URLs distinctes par langue
- Implémenter hreflang sur toutes les pages
- Créer un contenu unique pour chaque langue
- Maintenir le sitemap à jour
- Surveiller Google Search Console

### À éviter ❌

- Utiliser des paramètres URL (`?lang=en`)
- Dupliquer le contenu sans traduction
- Oublier les balises hreflang
- Pointer les canonical vers une seule langue
- Négliger les métadonnées traduites

---

**Dernière mise à jour :** 28 octobre 2025  
**Version :** 1.0  
**Status :** ✅ Production Ready
