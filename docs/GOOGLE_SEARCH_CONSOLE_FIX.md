# Correction des erreurs Google Search Console

## Date
23 octobre 2025

## Problèmes identifiés

Google Search Console remontait 3 erreurs critiques sur les pages de films :

1. **"Vous devez indiquer 'ratingCount' ou 'reviewCount'"** (42 pages)
2. **"L'avis contient plusieurs notes cumulées"** (40 pages) ⚠️ **CAUSE PRINCIPALE**
3. **"La note se situe en dehors de la plage spécifiée ou par défaut"** (30 pages)

### Cause racine découverte
Après le premier déploiement, Google détectait toujours **"L'avis contient plusieurs notes cumulées"**. 
La cause : **duplication du schema.org** - le même `AggregateRating` était présent à la fois dans :
- Le **microdata HTML** (attributs `itemProp`, `itemScope`, `itemType`)
- Le **JSON-LD** (script structuré)

Google comptait donc 2 notes pour chaque film au lieu d'une seule.

### URLs affectées (exemples)
- https://www.moviehunt.fr/films/marche-ou-creve
- https://www.moviehunt.fr/films/napoleon
- https://www.moviehunt.fr/films/conclave
- https://www.moviehunt.fr/films/1br-the-apartment
- Et potentiellement beaucoup d'autres pages de films

## Cause des erreurs

Le schema.org JSON-LD utilisait un objet `Review` avec un `Rating` imbriqué :

```json
{
  "@type": "Movie",
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": 8.5,
      "bestRating": "10",
      "worstRating": "0"
    }
  }
}
```

**Problèmes :**
- Google exige `AggregateRating` au lieu de `Review/Rating` pour les notes de films
- `AggregateRating` nécessite obligatoirement `ratingCount` ou `reviewCount`
- Les valeurs numériques devaient être des strings pour éviter les erreurs de plage

## Solutions appliquées

### 1. Modification du JSON-LD (`MovieSchema.jsx`)

**Avant :**
```javascript
review: {
  '@type': 'Review',
  reviewRating: {
    '@type': 'Rating',
    ratingValue: film.note_sur_10,
    bestRating: '10',
    worstRating: '0'
  },
  author: {
    '@type': 'Organization',
    name: 'MovieHunt',
    url: baseUrl
  },
  datePublished: film.date_ajout,
  reviewBody: film.why_watch_content || film.synopsis
}
```

**Après :**
```javascript
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue: film.note_sur_10.toString(),
  bestRating: '10',
  worstRating: '0',
  ratingCount: '1'
}
```

### 2. Ajout de `ratingCount` dans le microdata HTML (`FilmPageContent.jsx`)

**Avant :**
```jsx
<span itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
  <span itemProp="ratingValue">{film.note_sur_10}</span>
  <span itemProp="bestRating" content="10">/10</span>
</span>
```

**Après :**
```jsx
<span itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
  <span itemProp="ratingValue">{film.note_sur_10}</span>
  <span itemProp="bestRating" content="10">/10</span>
  <meta itemProp="ratingCount" content="1" />
</span>
```

## Fichiers modifiés

### Phase 1 : Correction du JSON-LD
1. **`src/components/seo/MovieSchema.jsx`**
   - Remplacement de `review` par `aggregateRating`
   - Ajout de `ratingCount: '1'`
   - Conversion de `ratingValue` en string

### Phase 2 : Suppression du microdata HTML (pour éviter les doublons)
2. **`src/components/films/FilmPageContent.jsx`**
   - ❌ Suppression de tous les attributs `itemScope`, `itemType`, `itemProp`
   - ❌ Suppression du microdata `AggregateRating`

3. **`src/components/films/FilmContent.jsx`**
   - ❌ Suppression de `itemProp="description"`

4. **`src/components/films/FilmHeader.jsx`**
   - ❌ Suppression de `itemProp="datePublished"`
   - ❌ Suppression de `itemProp="genre"`

5. **`src/components/films/FilmTitle.jsx`**
   - ❌ Suppression de `itemProp="name"`

6. **`src/components/films/FilmPoster.jsx`**
   - ❌ Suppression de `itemProp="image"`

7. **`src/components/films/SimilarFilms.jsx`**
   - ❌ Suppression du microdata `AggregateRating` dans les cartes de films similaires

### Résultat
✅ **Une seule source de vérité** : le JSON-LD dans `MovieSchema.jsx`
✅ **Plus de doublons** détectés par Google
✅ **HTML plus propre** sans attributs microdata

## Validation

✅ Build Next.js réussi sans erreurs
✅ Pas d'erreurs TypeScript
✅ Structure JSON-LD conforme aux spécifications Schema.org

## Prochaines étapes

1. **Déployer sur Vercel**
2. **Attendre l'indexation Google** (peut prendre quelques jours)
3. **Vérifier dans Google Search Console** que les erreurs disparaissent
4. **Tester avec l'outil de test des résultats enrichis** :
   - https://search.google.com/test/rich-results
   - Tester quelques URLs de films

## Notes importantes

- `ratingCount: '1'` est correct car chaque film a UNE note MovieHunt
- **Microdata vs JSON-LD** : Nous avons choisi le JSON-LD comme source unique car :
  - Plus facile à maintenir (un seul fichier)
  - Évite les doublons et conflits
  - Recommandé par Google pour les données structurées complexes
  - Séparation claire entre présentation (HTML) et données structurées (JSON-LD)
- Si vous voulez ajouter des avis utilisateurs plus tard, il faudra :
  - Augmenter `ratingCount` avec le nombre total d'avis
  - Calculer une moyenne pour `ratingValue`
  - Potentiellement ajouter un objet `Review` séparé pour chaque avis

## Références

- [Schema.org AggregateRating](https://schema.org/AggregateRating)
- [Google Search Central - Movie structured data](https://developers.google.com/search/docs/appearance/structured-data/movie)
- [Rich Results Test](https://search.google.com/test/rich-results)
