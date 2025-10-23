# Correction des erreurs Google Search Console

## Date
23 octobre 2025

## Problèmes identifiés

Google Search Console remontait 3 erreurs critiques sur les pages de films :

1. **"Vous devez indiquer 'ratingCount' ou 'reviewCount'"** (42 pages)
2. **"L'avis contient plusieurs notes cumulées"** (40 pages)
3. **"La note se situe en dehors de la plage spécifiée ou par défaut"** (30 pages)

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

1. **`src/components/seo/MovieSchema.jsx`**
   - Remplacement de `review` par `aggregateRating`
   - Ajout de `ratingCount: '1'`
   - Conversion de `ratingValue` en string

2. **`src/components/films/FilmPageContent.jsx`**
   - Ajout de `<meta itemProp="ratingCount" content="1" />`

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
- Si vous voulez ajouter des avis utilisateurs plus tard, il faudra :
  - Augmenter `ratingCount` avec le nombre total d'avis
  - Calculer une moyenne pour `ratingValue`
  - Potentiellement ajouter un objet `Review` séparé pour chaque avis

## Références

- [Schema.org AggregateRating](https://schema.org/AggregateRating)
- [Google Search Central - Movie structured data](https://developers.google.com/search/docs/appearance/structured-data/movie)
- [Rich Results Test](https://search.google.com/test/rich-results)
