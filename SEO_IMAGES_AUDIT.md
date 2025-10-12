# Audit SEO des attributs ALT des images - MovieHunt

## 📊 État actuel

### ✅ Images avec ALT optimisé

#### 1. **Pages de films (`/films/[slug]`)**
- ✅ Affiche du film : `alt="Affiche du film ${film.title}"`
- ✅ Badge Hunted : `alt="Hunted by MovieHunt"`
- ✅ Photos du staff : `alt="${person.nom || 'Photo du staff'}"`

#### 2. **Cartes de films (FilmCard.jsx)**
- ✅ Affiches : `alt="Affiche du film ${film.title}"`
- ✅ Badge Hunted : `alt="Hunted by MovieHunt"`

#### 3. **Page "Quel film regarder"**
- ✅ Toutes les affiches ont des ALT descriptifs :
  - `alt="Affiche du film Greedy People"`
  - `alt="Affiche du film Old Henry"`
  - `alt="Affiche du film Tetris"`
  - etc.

#### 4. **Page Halloween 2025**
- ✅ `alt="Affiche du film ${film.title}"`

#### 5. **Page Hunted by MovieHunt**
- ✅ `alt="Hunted by MovieHunt Badge"`

#### 6. **Footer**
- ✅ Logo TMDB : `alt="TMDB Logo"`

#### 7. **Composant SafeImage**
- ✅ Fallback : `alt={alt || 'Image'}` ou `alt || 'Image non disponible'`

### ⚠️ Images avec ALT basique (à améliorer)

#### 1. **Carrousels (FeaturedFilmsCarousel, OptimizedFeaturedCarousel, BasicCarousel)**
- ⚠️ `alt={film.title}` 
- **Recommandation** : Utiliser `alt="Affiche du film ${film.title}"` ou `alt="Image du film ${film.title}"`

#### 2. **Films similaires (SimilarFilms.jsx)**
- ⚠️ `alt={film.title}`
- **Recommandation** : Utiliser `alt="Affiche du film ${film.title}"`

#### 3. **Résultats de recherche (MovieSearchResults.jsx)**
- ⚠️ `alt={movie.title || 'Poster du film'}`
- **Recommandation** : Utiliser `alt="Affiche du film ${movie.title}"` pour cohérence

#### 4. **Logos de streaming (StreamingProviders.jsx)**
- ⚠️ `alt={provider.provider_name}`
- **Recommandation** : Utiliser `alt="Logo ${provider.provider_name}"` ou `alt="Disponible sur ${provider.provider_name}"`

#### 5. **Photos du staff (RemarkableStaffList.jsx)**
- ⚠️ `alt={person.nom || 'Photo du staff'}`
- **Recommandation** : Utiliser `alt="Photo de ${person.nom} - ${person.role}"` pour plus de contexte

#### 6. **Admin - Partage Instagram**
- ⚠️ `alt={film.title}`
- **Recommandation** : Utiliser `alt="Affiche du film ${film.title}"`

## 🎯 Recommandations SEO

### Principes généraux pour les ALT optimisés

1. **Descriptif et contextualisé** : L'ALT doit décrire ce que l'image représente
   - ❌ `alt="Inception"`
   - ✅ `alt="Affiche du film Inception"`

2. **Inclure le type de contenu** :
   - Pour les affiches : "Affiche du film..."
   - Pour les photos : "Photo de..."
   - Pour les logos : "Logo..."
   - Pour les badges : "Badge..." ou nom du badge

3. **Ajouter du contexte quand pertinent** :
   - Photos de personnes : inclure leur rôle
   - Logos de plateformes : mentionner la disponibilité

4. **Éviter les redondances** :
   - ❌ `alt="Image de l'affiche du film..."`
   - ✅ `alt="Affiche du film..."`

5. **Longueur optimale** : 
   - Idéal : 10-15 mots
   - Maximum : 125 caractères

### Exemples d'amélioration

#### Avant / Après

**Carrousels :**
```jsx
// ❌ Avant
alt={film.title}

// ✅ Après
alt={`Affiche du film ${film.title}`}
```

**Logos de streaming :**
```jsx
// ❌ Avant
alt={provider.provider_name}

// ✅ Après
alt={`Disponible sur ${provider.provider_name}`}
// ou
alt={`Logo ${provider.provider_name}`}
```

**Photos du staff :**
```jsx
// ❌ Avant
alt={person.nom || 'Photo du staff'}

// ✅ Après
alt={`Photo de ${person.nom}${person.role ? ` - ${person.role}` : ''}`}
```

## 📝 Plan d'action

### Priorité 1 - Impact SEO élevé
1. ✅ **Pages de films** - Déjà optimisé
2. ✅ **FilmCard** - Déjà optimisé
3. ⚠️ **Carrousels** (page d'accueil) - À améliorer
4. ⚠️ **Films similaires** - À améliorer

### Priorité 2 - Impact SEO moyen
5. ⚠️ **Résultats de recherche** - À améliorer
6. ⚠️ **Logos de streaming** - À améliorer
7. ⚠️ **Photos du staff** - À améliorer

### Priorité 3 - Impact SEO faible
8. ⚠️ **Admin** - Moins critique (non indexé)

## 🔍 Vérification automatique

Pour vérifier les ALT manquants ou vides :

```bash
# Rechercher les images sans ALT
grep -r "<img" src/ --include="*.jsx" | grep -v "alt="

# Rechercher les ALT vides
grep -r 'alt=""' src/ --include="*.jsx"

# Rechercher les ALT avec juste le titre
grep -r 'alt={.*\.title}' src/ --include="*.jsx"
```

## 📊 Score actuel

- **Images avec ALT** : ~100% ✅
- **Images avec ALT optimisé** : ~70% ⚠️
- **Images sans ALT** : 0% ✅

## 🎯 Objectif

- **Images avec ALT optimisé** : 100% 🎯

## 💡 Bonnes pratiques déjà en place

1. ✅ Aucune image sans attribut ALT
2. ✅ Utilisation de fallbacks pour les images manquantes
3. ✅ ALT descriptifs sur les pages principales
4. ✅ Cohérence dans la nomenclature des affiches
5. ✅ Attribut `loading="lazy"` pour les images hors viewport
6. ✅ Attribut `loading="eager"` pour les images critiques (LCP)

## 📚 Ressources

- [Google - Bonnes pratiques pour les images](https://developers.google.com/search/docs/appearance/google-images)
- [W3C - Techniques pour les textes alternatifs](https://www.w3.org/WAI/tutorials/images/)
- [Moz - Image SEO Best Practices](https://moz.com/learn/seo/image-optimization)
