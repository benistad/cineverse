# 📊 Guide d'indexation Google - URLs bilingues

## 🎯 Objectif

Indexer les **286 URLs** (143 films × 2 langues) sur Google pour maximiser la visibilité internationale.

---

## ✅ Étape 1 : Vérifier le sitemap

### Rebuild du sitemap

```bash
npm run build
```

Cela génère automatiquement :
- `public/sitemap.xml` : Index principal
- `public/sitemap-0.xml` : URLs françaises + anglaises

### Vérifier le contenu

```bash
curl https://www.moviehunt.fr/sitemap.xml
curl https://www.moviehunt.fr/sitemap-0.xml
```

Vous devriez voir :
- `/films/vicious` avec hreflang fr, en, x-default
- `/en/films/vicious` avec hreflang fr, en, x-default

---

## ✅ Étape 2 : Soumettre à Google Search Console

### 2.1 Accéder à Google Search Console

1. Aller sur https://search.google.com/search-console
2. Sélectionner votre propriété `www.moviehunt.fr`

### 2.2 Soumettre le sitemap

1. Menu **Sitemaps** (à gauche)
2. Ajouter un nouveau sitemap : `https://www.moviehunt.fr/sitemap.xml`
3. Cliquer sur **Envoyer**

**Résultat attendu** :
- Google découvre automatiquement toutes les URLs (FR + EN)
- Indexation progressive sur 1-2 semaines

### 2.3 Demander une indexation rapide (optionnel)

Pour accélérer l'indexation de quelques URLs importantes :

1. Menu **Inspection de l'URL**
2. Entrer une URL : `https://www.moviehunt.fr/en/films/vicious`
3. Cliquer sur **Demander une indexation**

**Limite** : ~10 URLs/jour maximum

---

## ✅ Étape 3 : Vérifier l'indexation

### 3.1 Vérifier dans Google Search Console

1. Menu **Couverture** ou **Pages**
2. Vérifier que les URLs `/en/films/...` apparaissent
3. Statut devrait être **Valide** (vert)

### 3.2 Vérifier dans Google

Recherche Google :
```
site:www.moviehunt.fr/en/films/
```

Vous devriez voir toutes vos pages anglaises indexées.

### 3.3 Vérifier hreflang

Outil Google : https://support.google.com/webmasters/answer/189077

Ou utiliser : https://technicalseo.com/tools/hreflang/

---

## ✅ Étape 4 : Optimisations supplémentaires

### 4.1 Créer un fichier robots.txt optimisé

Le fichier `public/robots.txt` devrait contenir :

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /debug-dates/
Disallow: /test-carousel

Sitemap: https://www.moviehunt.fr/sitemap.xml
```

### 4.2 Ajouter des liens internes

Dans votre site, ajoutez des liens vers les versions anglaises :

**Exemple** : Sélecteur de langue qui pointe vers `/en/films/...`

```jsx
<Link href={`/en${pathname}`}>
  🇬🇧 English
</Link>
```

### 4.3 Partager sur les réseaux sociaux

Partagez quelques URLs `/en/films/...` sur :
- Twitter/X
- LinkedIn
- Facebook

Google suit les signaux sociaux pour l'indexation.

---

## 📊 Timeline d'indexation

| Jour | Action | Résultat attendu |
|------|--------|------------------|
| **J+0** | Soumettre sitemap | Google découvre les URLs |
| **J+1-3** | Crawl initial | Google commence à crawler |
| **J+3-7** | Indexation partielle | ~30% des URLs indexées |
| **J+7-14** | Indexation complète | ~80-100% des URLs indexées |
| **J+14+** | Indexation stable | Toutes les URLs indexées |

---

## 🔍 Vérifications importantes

### ✅ Checklist avant soumission

- [ ] Sitemap généré avec URLs `/en/films/...`
- [ ] hreflang présent sur toutes les pages
- [ ] Métadonnées en anglais pour URLs `/en/`
- [ ] Contenu traduit (titres, synopsis, etc.)
- [ ] Pas d'erreurs 404 sur URLs `/en/`
- [ ] robots.txt permet l'indexation

### ✅ Checklist après soumission

- [ ] Sitemap soumis dans Google Search Console
- [ ] Aucune erreur dans la couverture
- [ ] hreflang validé (aucune erreur)
- [ ] URLs commencent à apparaître dans l'index
- [ ] Trafic organique en anglais augmente

---

## 🚨 Problèmes courants

### Problème 1 : URLs /en/ non indexées

**Cause** : Sitemap ne contient pas les URLs `/en/`

**Solution** :
```bash
npm run build  # Rebuild le sitemap
```

### Problème 2 : Erreurs hreflang

**Cause** : hreflang mal configuré

**Solution** : Vérifier que chaque page a :
- `hreflang="fr"` → `/films/...`
- `hreflang="en"` → `/en/films/...`
- `hreflang="x-default"` → `/films/...`

### Problème 3 : Contenu dupliqué

**Cause** : Google pense que FR et EN sont identiques

**Solution** : Vérifier que :
- Métadonnées différentes (FR vs EN)
- Contenu traduit (pas juste l'URL)
- hreflang correct

---

## 📈 Suivi des performances

### Métriques à surveiller

**Google Search Console** :
- Impressions par langue (FR vs EN)
- Clics par langue
- Position moyenne par langue
- Taux de clic (CTR)

**Google Analytics** :
- Trafic organique par langue
- Pages vues `/films/` vs `/en/films/`
- Taux de rebond par langue
- Conversions par langue

---

## 🎯 Résultats attendus

### Court terme (1 mois)

- ✅ 286 URLs indexées (143 FR + 143 EN)
- ✅ Trafic organique anglophone +20-30%
- ✅ Impressions Google.com (EN) augmentent

### Moyen terme (3 mois)

- ✅ Classement Google.com amélioré
- ✅ Trafic international +50-100%
- ✅ Partages sociaux en anglais

### Long terme (6+ mois)

- ✅ Autorité de domaine augmentée
- ✅ Backlinks internationaux
- ✅ Trafic organique doublé

---

## 📝 Commandes utiles

### Vérifier le sitemap localement
```bash
npm run build
cat public/sitemap-0.xml | grep "/en/films/"
```

### Compter les URLs dans le sitemap
```bash
curl https://www.moviehunt.fr/sitemap-0.xml | grep -c "<loc>"
```

### Tester une URL /en/
```bash
curl -I https://www.moviehunt.fr/en/films/vicious
```

### Vérifier hreflang
```bash
curl -s https://www.moviehunt.fr/en/films/vicious | grep hreflang
```

---

## ✅ Checklist finale

Avant de soumettre à Google :

- [ ] Build production : `npm run build`
- [ ] Vérifier sitemap : `curl https://www.moviehunt.fr/sitemap.xml`
- [ ] Tester 5 URLs `/en/films/...` : Toutes fonctionnent
- [ ] Vérifier hreflang : Présent sur toutes les pages
- [ ] Vérifier métadonnées : En anglais pour `/en/`
- [ ] Soumettre sitemap dans Google Search Console
- [ ] Demander indexation de 5-10 URLs importantes
- [ ] Surveiller la couverture dans GSC

---

**Version** : 1.0  
**Dernière mise à jour** : Octobre 2025  
**Auteur** : MovieHunt Team
