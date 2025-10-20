# Sitemap MovieHunt - Soumission Google

## 📍 URL du Sitemap Principal

```
https://www.moviehunt.fr/sitemap.xml
```

## 📊 Contenu du Sitemap

### Pages incluses (19 URLs au total)

#### 1. Page d'accueil
- `https://www.moviehunt.fr` (priorité: 1.0)

#### 2. Pages bilingues (8 pages × 2 langues = 16 URLs)

| Page | URL Française | URL Anglaise |
|------|--------------|--------------|
| **Contact** | `/contact` | `/en/contact` |
| **Hunted** | `/huntedbymoviehunt` | `/en/huntedbymoviehunt` |
| **Hidden Gems** | `/hidden-gems` | `/en/hidden-gems` |
| **Top Rated** | `/top-rated` | `/en/top-rated` |
| **All Films** | `/all-films` | `/en/all-films` |
| **Comment nous travaillons** | `/comment-nous-travaillons` | `/en/comment-nous-travaillons` |
| **Quel film regarder** | `/quel-film-regarder` | `/en/quel-film-regarder` |
| **Halloween 2025** | `/films-horreur-halloween-2025` | `/en/films-horreur-halloween-2025` |

#### 3. Pages utilitaires (3 URLs)
- `/advanced-search` - Recherche avancée
- `/search` - Recherche simple
- `/films-index` - Index des films

### Balises hreflang

Chaque page bilingue inclut les balises `xhtml:link` pour indiquer les versions alternatives :

```xml
<xhtml:link rel="alternate" hreflang="fr" href="https://www.moviehunt.fr/contact"/>
<xhtml:link rel="alternate" hreflang="en" href="https://www.moviehunt.fr/en/contact"/>
<xhtml:link rel="alternate" hreflang="x-default" href="https://www.moviehunt.fr/contact"/>
```

## 🚀 Comment soumettre à Google

### Méthode 1 : Google Search Console (Recommandée)

1. **Accéder à Google Search Console**
   - Aller sur : https://search.google.com/search-console
   - Sélectionner la propriété `moviehunt.fr`

2. **Soumettre le sitemap**
   - Menu latéral → **Sitemaps**
   - Cliquer sur **Ajouter un sitemap**
   - Entrer : `sitemap.xml`
   - Cliquer sur **Envoyer**

3. **Vérifier le statut**
   - Attendre quelques minutes/heures
   - Vérifier que le statut est "Réussi"
   - Vérifier le nombre d'URLs découvertes (devrait être ~19)

### Méthode 2 : Ping Google (Alternative)

Envoyer une requête GET à :
```
https://www.google.com/ping?sitemap=https://www.moviehunt.fr/sitemap.xml
```

## 📈 Priorités et Fréquences

| Type de page | Priorité | Fréquence de mise à jour |
|--------------|----------|--------------------------|
| Page d'accueil | 1.0 | daily |
| Pages principales (Hunted, Hidden Gems, Top Rated, Quel film regarder) | 0.9 | weekly |
| Pages secondaires (All Films, Comment nous travaillons, Halloween) | 0.8 | weekly/monthly |
| Contact | 0.7 | monthly |
| Pages utilitaires | 0.6-0.7 | monthly/daily |

## ✅ Avantages du sitemap actuel

1. **SEO International** : Balises hreflang pour chaque version linguistique
2. **Structure claire** : Commentaires pour chaque section
3. **Priorités optimisées** : Pages importantes mieux référencées
4. **Fréquences réalistes** : Indique à Google quand revenir crawler
5. **x-default** : Indique la version par défaut (français)

## 🔍 Vérification

Pour vérifier que le sitemap est accessible :
```bash
curl https://www.moviehunt.fr/sitemap.xml
```

Pour valider le format XML :
- Outil Google : https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Ou dans Google Search Console après soumission

## 📝 Notes importantes

- Le sitemap est mis à jour automatiquement à chaque déploiement
- Les pages de films individuels (`/films/...`) sont dans un sitemap séparé (`server-sitemap.xml`)
- Les URLs `/en/...` sont des rewrites côté serveur, pas des pages physiques
- Google indexera les deux versions (FR et EN) grâce aux balises hreflang

## 🎯 Résultat attendu

Après soumission et indexation :
- ✅ 19 URLs indexées dans Google
- ✅ Versions FR et EN visibles dans les résultats de recherche appropriés
- ✅ Utilisateurs francophones → versions FR
- ✅ Utilisateurs anglophones → versions EN
- ✅ Meilleur référencement international

## 📅 Prochaines étapes

1. ✅ Soumettre le sitemap à Google Search Console
2. ⏳ Attendre l'indexation (quelques jours)
3. 📊 Vérifier les performances dans Search Console
4. 🔄 Mettre à jour le sitemap si nouvelles pages ajoutées
