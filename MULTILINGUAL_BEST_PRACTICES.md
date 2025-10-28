# Guide des Bonnes Pratiques Multilingues - MovieHunt

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture de traduction](#architecture-de-traduction)
3. [Checklist pour nouvelles pages](#checklist-pour-nouvelles-pages)
4. [Checklist pour nouveaux composants](#checklist-pour-nouveaux-composants)
5. [Gestion des données films](#gestion-des-données-films)
6. [Liens et navigation](#liens-et-navigation)
7. [Erreurs courantes à éviter](#erreurs-courantes-à-éviter)
8. [Exemples de code](#exemples-de-code)

---

## 🎯 Vue d'ensemble

MovieHunt utilise un système de traduction **automatique via TMDB** pour les contenus films (titres, synopsis, genres) et **next-intl** pour l'interface utilisateur.

### Principes clés
- ✅ **Toujours** passer le paramètre `locale` aux fonctions de récupération de films
- ✅ **Ne jamais** utiliser `useFilmTranslations` (obsolète, conflit avec TMDB)
- ✅ **Toujours** rendre les liens dynamiques selon la langue
- ✅ **Toujours** ajouter `locale` dans les dépendances `useEffect`

---

## 🏗️ Architecture de traduction

### 1. Traductions Interface (UI)
**Fichiers :** `messages/fr.json` et `messages/en.json`

```javascript
// ✅ BON - Utiliser le hook useTranslations
import { useTranslations } from '@/hooks/useTranslations';

function MyComponent() {
  const { t } = useTranslations();
  return <h1>{t('page.title')}</h1>;
}
```

### 2. Traductions Films (Contenu)
**Source :** API TMDB (automatique)

```javascript
// ✅ BON - Enrichissement automatique via TMDB
import { getTopRatedFilms } from '@/lib/supabase/films';
import { useLanguage } from '@/contexts/LanguageContext';

function MyPage() {
  const { locale } = useLanguage();
  const [films, setFilms] = useState([]);
  
  useEffect(() => {
    async function fetchFilms() {
      const data = await getTopRatedFilms(10, 6, locale); // ✅ Passer locale
      setFilms(data);
    }
    fetchFilms();
  }, [locale]); // ✅ Ajouter locale en dépendance
}
```

---

## ✅ Checklist pour nouvelles pages

### 1. Structure de base
```javascript
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFunctionName } from '@/lib/supabase/films';

export default function MyNewPage() {
  const { t } = useTranslations();
  const { locale } = useLanguage();
  const [data, setData] = useState([]);
  
  // ✅ Toujours inclure locale dans useEffect
  useEffect(() => {
    async function fetchData() {
      const result = await getFunctionName(limit, locale); // ✅ Passer locale
      setData(result);
    }
    fetchData();
  }, [locale]); // ✅ Dépendance locale
  
  return (
    <div>
      <h1>{t('myPage.title')}</h1>
      {/* Contenu */}
    </div>
  );
}
```

### 2. Métadonnées SEO
```javascript
useEffect(() => {
  document.title = t('myPage.metaTitle');
  
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = t('myPage.metaDescription');
}, [t]);
```

### 3. Liens de navigation
```javascript
// ✅ BON - Liens dynamiques
<Link href={locale === 'en' ? '/en/my-page' : '/my-page'}>
  {t('nav.myPage')}
</Link>

// ✅ BON - URLs différentes selon la langue
<Link href={locale === 'en' ? '/en/halloween-horror-movies-2025' : '/films-horreur-halloween-2025'}>
  {t('nav.halloween')}
</Link>

// ❌ MAUVAIS - Lien statique
<Link href="/my-page">Ma Page</Link>
```

### 4. Créer la version `/en`
```bash
# Structure de fichiers
src/app/my-page/page.jsx          # Version française
src/app/en/my-page/page.jsx       # Version anglaise
```

```javascript
// src/app/en/my-page/page.jsx
export { default } from '@/app/my-page/page';
```

### 5. Ajouter au sitemap
```javascript
// src/app/sitemap.js
{
  url: `${baseUrl}/my-page`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.7,
},
{
  url: `${baseUrl}/en/my-page`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.7,
},
```

---

## ✅ Checklist pour nouveaux composants

### 1. Composants affichant des films

```javascript
'use client';

import FilmCard from '@/components/films/FilmCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyFilmComponent() {
  const { locale } = useLanguage();
  const [films, setFilms] = useState([]);
  
  useEffect(() => {
    async function fetchFilms() {
      // ✅ Toujours passer locale
      const data = await getFilms(locale);
      setFilms(data);
    }
    fetchFilms();
  }, [locale]); // ✅ Dépendance locale
  
  return (
    <div>
      {films.map(film => (
        <FilmCard 
          key={film.id} 
          film={film} // ✅ Film déjà enrichi avec TMDB
          // ❌ NE PAS passer translation={...}
        />
      ))}
    </div>
  );
}
```

### 2. Composants avec cache

```javascript
// ✅ Cache par langue
const cachedData = clientCache.get(`my_data_${locale}`);
if (cachedData) {
  setData(cachedData);
} else {
  const data = await fetchData(locale);
  clientCache.set(`my_data_${locale}`, data, 300000);
  setData(data);
}
```

### 3. Composants avec liens internes

```javascript
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { locale } = useLanguage();
  
  return (
    <Link href={locale === 'en' ? '/en/films/slug' : '/films/slug'}>
      Voir le film
    </Link>
  );
}
```

---

## 🎬 Gestion des données films

### Fonctions disponibles avec support `locale`

Toutes ces fonctions acceptent un paramètre `locale` :

```javascript
// films.js
getRecentlyRatedFilms(limit, locale)
getTopRatedFilms(limit, minRating, locale)
getHiddenGems(limit, locale)
getAllFilms(locale)
getPaginatedFilms(page, filmsPerPage, locale)
getFeaturedFilms(limit, minRating, timestamp, locale)

// optimizedFilms.js
getRecentlyRatedFilms(limit, locale)
getTopRatedFilms(limit, minRating, locale)
getHiddenGems(limit, locale)
```

### Enrichissement automatique TMDB

Quand `locale === 'en'`, ces fonctions enrichissent automatiquement avec :
- ✅ `title` : Titre original anglais
- ✅ `synopsis` : Synopsis en anglais
- ✅ `genres` : Genres en anglais (ex: "Comedy, Crime, Mystery")

```javascript
// Fonction enrichFilmWithTMDB (déjà implémentée)
async function enrichFilmWithTMDB(film) {
  if (!film.tmdb_id) return film;
  
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${film.tmdb_id}?language=en-US`,
    {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  const data = await response.json();
  const genresString = data.genres?.map(g => g.name).join(', ') || film.genres;
  
  return {
    ...film,
    title: data.original_title || data.title || film.title,
    synopsis: data.overview || film.synopsis,
    genres: genresString,
  };
}
```

### ❌ NE PLUS UTILISER

```javascript
// ❌ OBSOLÈTE - Ne plus utiliser useFilmTranslations
import { useFilmTranslations } from '@/hooks/useFilmTranslations';

// Ce hook chargeait depuis la DB et écrasait les données TMDB
// Les films sont maintenant enrichis directement dans les fonctions de récupération
```

---

## 🔗 Liens et navigation

### Règles pour les liens

1. **Liens vers pages de films**
```javascript
// ✅ BON
href={locale === 'en' ? `/en/films/${film.slug}` : `/films/${film.slug}`}

// ❌ MAUVAIS
href={`/films/${film.slug}`}
```

2. **Liens vers pages statiques**
```javascript
// ✅ BON - URLs identiques
href={locale === 'en' ? '/en/top-rated' : '/top-rated'}
href={locale === 'en' ? '/en/all-films' : '/all-films'}

// ✅ BON - URLs différentes (mapping requis)
href={locale === 'en' ? '/en/hidden-gems' : '/films-inconnus'}
href={locale === 'en' ? '/en/halloween-horror-movies-2025' : '/films-horreur-halloween-2025'}
href={locale === 'en' ? '/en/teen-movie-ideas' : '/idees-films-pour-ados'}

// ❌ MAUVAIS
href="/top-rated"
```

3. **Liens avec query params**
```javascript
// ✅ BON
href={locale === 'en' ? '/en/advanced-search?hunted=true' : '/advanced-search?hunted=true'}

// ❌ MAUVAIS
href="/advanced-search?hunted=true"
```

4. **Liens dans la navbar**
```javascript
// Déjà implémenté dans Navbar.jsx
const navLinks = [
  { 
    href: locale === 'en' ? '/en/top-rated' : '/top-rated',
    label: t('nav.topRated')
  },
  // ...
];
```

---

## ⚠️ Erreurs courantes à éviter

### 1. Oublier le paramètre `locale`
```javascript
// ❌ MAUVAIS
const films = await getTopRatedFilms(10, 6);

// ✅ BON
const films = await getTopRatedFilms(10, 6, locale);
```

### 2. Oublier `locale` dans les dépendances
```javascript
// ❌ MAUVAIS
useEffect(() => {
  fetchFilms();
}, []); // Pas de rechargement si langue change

// ✅ BON
useEffect(() => {
  fetchFilms();
}, [locale]); // Recharge quand langue change
```

### 3. Liens statiques
```javascript
// ❌ MAUVAIS
<Link href="/films/slug">Voir</Link>

// ✅ BON
<Link href={locale === 'en' ? '/en/films/slug' : '/films/slug'}>
  {t('common.view')}
</Link>
```

### 4. Cache sans distinction de langue
```javascript
// ❌ MAUVAIS
clientCache.get('films');
clientCache.set('films', data);

// ✅ BON
clientCache.get(`films_${locale}`);
clientCache.set(`films_${locale}`, data);
```

### 5. Utiliser useFilmTranslations
```javascript
// ❌ OBSOLÈTE - Ne plus utiliser
const { translations } = useFilmTranslations(films);

// ✅ BON - Les films sont déjà enrichis
// Pas besoin de hook, utiliser directement film.title, film.synopsis, film.genres
```

### 6. Passer translation à FilmCard
```javascript
// ❌ MAUVAIS
<FilmCard film={film} translation={translations[film.id]} />

// ✅ BON
<FilmCard film={film} />
```

---

## 💡 Exemples de code

### Exemple 1 : Nouvelle page avec liste de films

```javascript
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTopRatedFilms } from '@/lib/supabase/films';
import FilmGrid from '@/components/films/FilmGrid';
import Link from 'next/link';

export default function MyNewFilmPage() {
  const { t } = useTranslations();
  const { locale } = useLanguage();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      try {
        setLoading(true);
        const data = await getTopRatedFilms(20, 6, locale); // ✅ Passer locale
        setFilms(data);
      } catch (error) {
        console.error('Error fetching films:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFilms();
  }, [locale]); // ✅ Dépendance locale

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">
        {t('myPage.title')}
      </h1>
      
      <FilmGrid films={films} showRating={true} />
      
      <Link href={locale === 'en' ? '/en' : '/'}>
        {t('common.backToHome')}
      </Link>
    </div>
  );
}
```

### Exemple 2 : Nouveau composant carrousel

```javascript
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getHiddenGems } from '@/lib/supabase/films';
import FilmCard from '@/components/films/FilmCard';

export default function MyCarousel() {
  const { locale } = useLanguage();
  const [films, setFilms] = useState([]);

  useEffect(() => {
    async function loadFilms() {
      // ✅ Cache par langue
      const cacheKey = `my_carousel_${locale}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached) {
        setFilms(JSON.parse(cached));
      } else {
        const data = await getHiddenGems(8, locale); // ✅ Passer locale
        setFilms(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }
    }
    loadFilms();
  }, [locale]); // ✅ Dépendance locale

  return (
    <div className="flex gap-4 overflow-x-auto">
      {films.map(film => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  );
}
```

### Exemple 3 : Nouvelle fonction de récupération

```javascript
// src/lib/supabase/films.js

/**
 * Récupère les films d'un genre spécifique
 * @param {string} genre - Genre à filtrer
 * @param {number} limit - Nombre de films
 * @param {string} locale - Langue (défaut: 'fr')
 */
export async function getFilmsByGenre(genre, limit = 10, locale = 'fr') {
  try {
    const supabase = getSupabaseClient();
    
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .ilike('genres', `%${genre}%`)
      .limit(limit);

    if (error) throw error;
    if (!films) return [];

    // ✅ Enrichir avec TMDB si anglais
    if (locale === 'en') {
      const enrichedFilms = await Promise.all(
        films.map(film => enrichFilmWithTMDB(film))
      );
      return enrichedFilms;
    }

    return films;
  } catch (error) {
    console.error('Error fetching films by genre:', error);
    return [];
  }
}
```

---

## 📝 Checklist finale avant commit

Avant de créer une nouvelle page ou composant, vérifier :

- [ ] Import de `useLanguage` si nécessaire
- [ ] Import de `useTranslations` pour les textes UI
- [ ] Paramètre `locale` passé aux fonctions de récupération
- [ ] `locale` dans les dépendances `useEffect`
- [ ] Liens dynamiques selon `locale`
- [ ] Cache par langue si applicable
- [ ] Pas d'utilisation de `useFilmTranslations`
- [ ] Pas de prop `translation` sur `FilmCard`
- [ ] Version `/en` créée si page
- [ ] Ajout au sitemap si page
- [ ] Traductions ajoutées dans `messages/fr.json` et `messages/en.json`

---

## 🔄 Workflow de développement

### Pour une nouvelle page

1. **Créer la page française** : `src/app/my-page/page.jsx`
2. **Implémenter avec locale** : Suivre la checklist ci-dessus
3. **Créer la version anglaise** : `src/app/en/my-page/page.jsx`
4. **Ajouter au sitemap** : `src/app/sitemap.js`
5. **Ajouter traductions** : `messages/fr.json` et `messages/en.json`
6. **Tester les deux langues** : Vérifier FR et EN
7. **Commit** : Message clair sur le support multilingue

### Pour un nouveau composant

1. **Implémenter avec locale** : Si affiche des films
2. **Rendre liens dynamiques** : Si contient des liens
3. **Tester dans les deux langues**
4. **Documenter** : Ajouter commentaires si complexe

---

## 📚 Ressources

- **Hooks disponibles** :
  - `useLanguage()` → Récupère `locale` et `setLocale`
  - `useTranslations()` → Récupère `t()` et `locale`

- **Fonctions films** : `src/lib/supabase/films.js`
- **Fonctions optimisées** : `src/lib/supabase/optimizedFilms.js`
- **Traductions UI** : `messages/fr.json` et `messages/en.json`
- **Composants** : `src/components/films/`

---

## 🎯 Résumé des principes

1. **Toujours passer `locale`** aux fonctions de récupération de films
2. **Toujours ajouter `locale`** dans les dépendances `useEffect`
3. **Toujours rendre les liens dynamiques** selon la langue
4. **Ne jamais utiliser `useFilmTranslations`** (obsolète)
5. **Ne jamais passer `translation`** à `FilmCard`
6. **Toujours créer une version `/en`** pour les nouvelles pages
7. **Toujours cacher par langue** si cache utilisé

---

**Dernière mise à jour** : 28 octobre 2025
**Version** : 2.0 (Post-migration TMDB)
