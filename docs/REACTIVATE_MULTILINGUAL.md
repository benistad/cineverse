# 🌍 Guide de Réactivation du Système Multilingue

Ce guide explique comment réactiver le support anglais sur MovieHunt. Le système a été désactivé le 2 décembre 2024 mais tout le code est conservé et commenté.

---

## 📋 Checklist Rapide

- [ ] 1. Middleware - Réactiver la détection de langue
- [ ] 2. LanguageContext - Restaurer la logique de changement
- [ ] 3. Navbar - Réactiver le sélecteur de langue
- [ ] 4. Footer - Restaurer les liens dynamiques
- [ ] 5. Page d'accueil - Restaurer les liens et traductions
- [ ] 6. HreflangTags - Réactiver le composant
- [ ] 7. LocaleDetector - Restaurer la détection
- [ ] 8. Sitemap - Décommenter les pages anglaises
- [ ] 9. Server-sitemap - Restaurer les URLs anglaises
- [ ] 10. Admin - Réactiver la page de traductions
- [ ] 11. Tester le build
- [ ] 12. Déployer

---

## 🔧 Étapes Détaillées

### 1. Middleware (`src/middleware.js`)

**Localiser :** Lignes commentées avec `// MULTILINGUAL DISABLED`

**Restaurer la fonction `getLocale` :**
```javascript
const locales = ['fr', 'en'];
const defaultLocale = 'fr';

function getLocale(request) {
  // 1. Vérifier le cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  // 2. Vérifier l'en-tête Accept-Language
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => {
      const [code] = lang.trim().split(';');
      return code.split('-')[0];
    });
    
    for (const lang of languages) {
      if (locales.includes(lang)) {
        return lang;
      }
    }
  }

  return defaultLocale;
}
```

**Restaurer la logique de gestion des langues :**
```javascript
// Remplacer le bloc "MULTILINGUAL DISABLED - Redirect /en/*" par :
if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
  const pathnameHasLocale = pathname === '/en' || pathname.startsWith('/en/');

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', 'en', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } else {
    const locale = getLocale(request);
    const response = NextResponse.next();
    
    if (!request.cookies.get('NEXT_LOCALE') || request.cookies.get('NEXT_LOCALE').value !== locale) {
      response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    
    return response;
  }
}
```

---

### 2. LanguageContext (`src/contexts/LanguageContext.jsx`)

**Remplacer tout le fichier par :**
```javascript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLocale = 'fr' }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      const isEnglishPath = pathname?.startsWith('/en');
      if (isEnglishPath) return 'en';
      
      const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      return cookieLocale || initialLocale;
    }
    return initialLocale;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  }, []);

  const changeLocale = (newLocale) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLocale(newLocale);
    
    const staticPages = [
      '/contact', '/huntedbymoviehunt', '/films-inconnus', '/hidden-gems',
      '/top-rated', '/all-films', '/comment-nous-travaillons', '/how-we-work',
      '/quel-film-regarder', '/what-movie-to-watch', '/films-horreur-halloween-2025',
      '/halloween-horror-movies-2025', '/idees-films-pour-ados', '/teen-movie-ideas'
    ];
    
    const urlMapping = {
      '/idees-films-pour-ados': '/teen-movie-ideas',
      '/films-inconnus': '/hidden-gems',
      '/films-horreur-halloween-2025': '/halloween-horror-movies-2025',
      '/quel-film-regarder': '/what-movie-to-watch',
      '/comment-nous-travaillons': '/how-we-work'
    };
    
    const currentPath = pathname.replace(/^\/en/, '') || '/';
    const isStaticPage = staticPages.some(page => currentPath === page || currentPath.startsWith(page + '/'));
    
    if (isStaticPage) {
      if (newLocale === 'en') {
        if (!pathname.startsWith('/en/')) {
          const mappedPath = urlMapping[currentPath] || currentPath;
          window.location.href = `/en${mappedPath}`;
        } else {
          window.location.reload();
        }
      } else {
        if (pathname.startsWith('/en/')) {
          const reverseMappedPath = Object.keys(urlMapping).find(
            key => urlMapping[key] === currentPath
          ) || currentPath;
          window.location.href = reverseMappedPath;
        } else {
          window.location.reload();
        }
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

---

### 3. Navbar (`src/components/layout/Navbar.jsx`)

**Décommenter les imports :**
```javascript
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
```

**Remplacer `const locale = 'fr';` par :**
```javascript
const { locale } = useLanguage();
```

**Décommenter le sélecteur de langue (desktop) :**
```javascript
<LanguageSelector />
```

**Décommenter le sélecteur de langue (mobile) :**
```javascript
<div className="px-3 py-2 mt-2 border-t border-gray-200">
  <LanguageSelector />
</div>
```

**Restaurer les liens dynamiques :**
Remplacer tous les `href="/page"` par `href={locale === 'en' ? '/en/page' : '/page'}`

Exemple :
```javascript
// Avant
href="/advanced-search"

// Après
href={locale === 'en' ? '/en/advanced-search' : '/advanced-search'}
```

---

### 4. Footer (`src/components/layout/Footer.jsx`)

**Décommenter l'import :**
```javascript
import { useLanguage } from '@/contexts/LanguageContext';
```

**Ajouter dans le composant :**
```javascript
const { locale } = useLanguage();
```

**Restaurer les liens dynamiques :**
```javascript
// Exemple
href={locale === 'en' ? '/en/what-movie-to-watch' : '/quel-film-regarder'}
```

---

### 5. Page d'accueil (`src/app/page.jsx`)

**Décommenter l'import :**
```javascript
import { useLanguage } from '@/contexts/LanguageContext';
```

**Remplacer `const locale = 'fr';` par :**
```javascript
const { locale } = useLanguage();
```

**Restaurer l'effet de traduction :**
```javascript
useEffect(() => {
  async function applyTranslations() {
    if (locale === 'en' && (recentFilms.length > 0 || topRatedFilms.length > 0 || hiddenGems.length > 0 || allFilms.length > 0)) {
      const [translatedRecent, translatedTopRated, translatedGems, translatedAll] = await Promise.all([
        recentFilms.length > 0 ? applyTranslationsToFilms(recentFilms, locale) : [],
        topRatedFilms.length > 0 ? applyTranslationsToFilms(topRatedFilms, locale) : [],
        hiddenGems.length > 0 ? applyTranslationsToFilms(hiddenGems, locale) : [],
        allFilms.length > 0 ? applyTranslationsToFilms(allFilms, locale) : []
      ]);
      
      if (translatedRecent.length > 0) setRecentFilms(translatedRecent);
      if (translatedTopRated.length > 0) setTopRatedFilms(translatedTopRated);
      if (translatedGems.length > 0) setHiddenGems(translatedGems);
      if (translatedAll.length > 0) setAllFilms(translatedAll);
    }
  }
  
  applyTranslations();
}, [locale, recentFilms.length, topRatedFilms.length, hiddenGems.length, allFilms.length]);
```

**Restaurer les liens dynamiques dans les carrousels et la section "À propos".**

---

### 6. HreflangTags (`src/components/HreflangTags.jsx`)

**Restaurer le code original** qui se trouve dans le commentaire `/* ORIGINAL CODE */` du fichier.

---

### 7. LocaleDetector (`src/components/LocaleDetector.jsx`)

**Remplacer par :**
```javascript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LocaleDetector() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/en/')) {
      document.cookie = `NEXT_LOCALE=en; path=/; max-age=${365 * 24 * 60 * 60}`;
    } else if (!document.cookie.includes('NEXT_LOCALE=')) {
      document.cookie = `NEXT_LOCALE=fr; path=/; max-age=${365 * 24 * 60 * 60}`;
    }
  }, [pathname]);

  return null;
}
```

---

### 8. Sitemap (`src/app/sitemap.js`)

**Décommenter toutes les pages anglaises** (rechercher `// {` et `// url:`).

**Restaurer la génération des URLs de films en anglais :**
```javascript
const filmPages = films.flatMap((film) => {
  const slug = generateFilmSlug(film);
  
  return [
    {
      url: `${baseUrl}/films/${slug}`,
      lastModified: new Date(film.date_ajout),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/films/${slug}`,
      lastModified: new Date(film.date_ajout),
      changeFrequency: 'weekly',
      priority: 0.7,
    }
  ];
});
```

---

### 9. Server-sitemap (`src/app/api/server-sitemap.xml/route.js`)

**Restaurer les pages anglaises** dans le tableau `mainPages`.

**Restaurer la génération des URLs de films :**
```javascript
const filmEntries = films.flatMap((film) => {
  // ... slug logic ...
  return [
    {
      loc: `${baseUrl}/films/${encodeURIComponent(slug)}`,
      lastmod: new Date(film.date_ajout).toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/en/films/${encodeURIComponent(slug)}`,
      lastmod: new Date(film.date_ajout).toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    }
  ];
});
```

---

### 10. Admin - Dashboard (`src/app/admin/dashboard/page.jsx`)

**Décommenter le bouton "Traductions" :**
```javascript
<Link
  href="/admin/translations"
  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
  title="Traduire les films en anglais"
>
  <FiGlobe /> Traductions
</Link>
```

---

### 11. Admin - Page Traductions (`src/app/admin/translations/page.jsx`)

**Option 1 :** Restaurer depuis le backup si disponible.

**Option 2 :** Recréer la page en utilisant le code original documenté dans `MULTILINGUAL_SETUP.md`.

---

## 🧪 Tests à Effectuer

### Avant déploiement :

1. **Build local :**
   ```bash
   npm run build
   ```

2. **Test en dev :**
   ```bash
   npm run dev
   ```

3. **Vérifier :**
   - [ ] Sélecteur de langue visible dans la navbar
   - [ ] Changement de langue fonctionne
   - [ ] URLs `/en/*` accessibles
   - [ ] Traductions des films en anglais
   - [ ] Cookie NEXT_LOCALE correctement défini
   - [ ] Détection automatique de la langue (Accept-Language)
   - [ ] Sitemap contient les URLs anglaises
   - [ ] Balises hreflang présentes dans le HTML

---

## 📚 Fichiers de Référence

- `MULTILINGUAL_SETUP.md` - Documentation originale du système
- `MULTILINGUAL_BEST_PRACTICES.md` - Bonnes pratiques
- `messages/fr.json` - Traductions françaises
- `messages/en.json` - Traductions anglaises
- `schema/film_translations.sql` - Structure table traductions films
- `schema/staff_translations.sql` - Structure table traductions staff

---

## ⚠️ Points d'Attention

1. **Tables Supabase** : Vérifier que `film_translations` et `staff_translations` existent toujours.

2. **next-intl** : Le package est toujours installé, vérifier qu'il est à jour :
   ```bash
   npm update next-intl
   ```

3. **Cache** : Après déploiement, purger le cache Vercel si nécessaire.

4. **SEO** : Les URLs anglaises mettront du temps à être réindexées par Google.

---

## 🆘 En Cas de Problème

1. **Erreur de build** : Vérifier les imports manquants
2. **Liens cassés** : Vérifier le mapping des URLs dans `LanguageContext`
3. **Traductions manquantes** : Vérifier `messages/en.json`
4. **Cookie non défini** : Vérifier le middleware

---

**Dernière mise à jour :** 2 décembre 2024
