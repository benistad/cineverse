# Audit TTI (Time to Interactive) - MovieHunt

**Date**: 6 octobre 2025  
**Objectif**: Analyser et optimiser le Time to Interactive pour améliorer l'expérience utilisateur

---

## 📊 État Actuel

### Problèmes Identifiés

#### 🔴 **CRITIQUE - JavaScript Bloquant**

1. **Slick Carousel chargé globalement** (layout.jsx lignes 4-5)
   ```javascript
   import 'slick-carousel/slick/slick.css';
   import 'slick-carousel/slick/slick-theme.css';
   ```
   - ❌ **Impact**: ~50-80KB de CSS chargé sur TOUTES les pages
   - ❌ **Problème**: Bloque le rendu initial même sur les pages qui n'utilisent pas de carrousel
   - ❌ **TTI Impact**: +200-400ms

2. **Multiples bibliothèques de carrousel**
   - Slick Carousel (chargé globalement mais peu utilisé)
   - Swiper (utilisé dans OptimizedFeaturedCarousel)
   - React Slick (package.json ligne 24)
   - ❌ **Impact**: Code redondant, bundle JavaScript gonflé
   - ❌ **TTI Impact**: +300-500ms

3. **Composants chargés côté client sans lazy loading optimal**
   - `ClientComponents` (ligne 51-54)
   - `Footer` (ligne 57-60)
   - `MobilePerformanceOptimizer` (ligne 65-68)
   - ⚠️ **Impact**: Tous chargés avec `ssr: false` mais sans priorisation

#### 🟡 **MOYEN - Chargement des données**

4. **6 requêtes Supabase en parallèle au chargement** (page.jsx lignes 63-77)
   ```javascript
   const [recent, topRated, topRatedCount, gems, hiddenGemsCount, paginatedResult] = 
     await Promise.all([...6 requêtes...]);
   ```
   - ⚠️ **Impact**: Bloque l'interactivité jusqu'à ce que toutes les données soient chargées
   - ⚠️ **TTI Impact**: +500-1000ms selon la latence réseau

5. **Pas de cache côté client**
   - Les données sont rechargées à chaque visite
   - Pas d'utilisation de localStorage ou sessionStorage
   - ⚠️ **TTI Impact**: +300-800ms pour les visiteurs récurrents

#### 🟢 **BON - Points positifs**

✅ **Scripts analytics chargés en lazy** (strategy="lazyOnload")
✅ **Fonts avec display: swap** (pas de FOIT)
✅ **Préconnexion aux domaines critiques** (preconnect)
✅ **Images avec Next.js Image** (optimisées)

---

## 🎯 Recommandations d'Optimisation

### 1️⃣ **PRIORITÉ HAUTE - Nettoyer les bibliothèques de carrousel**

**Action**: Supprimer Slick Carousel et ne garder que Swiper

```javascript
// À SUPPRIMER de layout.jsx
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// À SUPPRIMER de package.json
// "react-slick": "^0.30.3",
// "slick-carousel": "^1.8.1"
```

**Gain estimé**: -50-80KB CSS, -100-150KB JS = **-300-500ms TTI**

---

### 2️⃣ **PRIORITÉ HAUTE - Lazy load progressif des sections**

**Action**: Charger les sections de la page d'accueil progressivement

```javascript
// page.jsx - Charger d'abord le carrousel principal, puis le reste
useEffect(() => {
  async function fetchFilms() {
    setLoading(true);
    
    // PHASE 1: Carrousel principal (critique pour LCP)
    const featuredFilms = await getFeaturedFilms(5, 6);
    setLoading(false); // Rendre la page interactive
    
    // PHASE 2: Sections secondaires (en arrière-plan)
    Promise.all([
      getRecentlyRatedFilms(8),
      getTopRatedFilms(10),
      getTopRatedFilmsCount(),
      getHiddenGems(8),
      getHiddenGemsCount(),
      getPaginatedFilms(1, filmsPerPage)
    ]).then(([recent, topRated, topRatedCount, gems, hiddenGemsCount, paginatedResult]) => {
      setRecentFilms(recent);
      setTopRatedFilms(topRated);
      // ... etc
    });
  }
  fetchFilms();
}, []);
```

**Gain estimé**: **-500-800ms TTI** (page interactive plus rapidement)

---

### 3️⃣ **PRIORITÉ MOYENNE - Implémenter un cache côté client**

**Action**: Utiliser sessionStorage pour les données de la page d'accueil

```javascript
// lib/cache/clientCache.js
export const clientCache = {
  set: (key, data, ttl = 300000) => { // 5 minutes par défaut
    const item = {
      data,
      expiry: Date.now() + ttl
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key) => {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  }
};
```

**Gain estimé**: **-300-800ms TTI** pour les visiteurs récurrents

---

### 4️⃣ **PRIORITÉ MOYENNE - Code splitting des composants lourds**

**Action**: Lazy load les composants non critiques

```javascript
// layout.jsx
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: false,
  loading: () => null // Pas de spinner pour le footer
});

const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next')
  .then(mod => mod.SpeedInsights), {
  ssr: false,
  loading: () => null
});

// Charger MobilePerformanceOptimizer seulement sur mobile
const MobilePerformanceOptimizer = dynamic(
  () => import('@/components/optimization/MobilePerformanceOptimizer'),
  { 
    ssr: false,
    loading: () => null
  }
);
```

**Gain estimé**: **-200-400ms TTI**

---

### 5️⃣ **PRIORITÉ BASSE - Optimiser les fonts**

**Action**: Précharger uniquement les fonts critiques

```html
<!-- layout.jsx head -->
<link 
  rel="preload" 
  href="/fonts/geist-sans.woff2" 
  as="font" 
  type="font/woff2" 
  crossOrigin="anonymous"
/>
```

**Gain estimé**: **-100-200ms TTI**

---

## 📈 Gains Totaux Estimés

| Optimisation | Gain TTI | Priorité |
|-------------|----------|----------|
| Supprimer Slick Carousel | -300-500ms | 🔴 Haute |
| Lazy load progressif | -500-800ms | 🔴 Haute |
| Cache client | -300-800ms | 🟡 Moyenne |
| Code splitting | -200-400ms | 🟡 Moyenne |
| Optimiser fonts | -100-200ms | 🟢 Basse |
| **TOTAL** | **-1400-2700ms** | |

---

## 🎬 Plan d'Action Recommandé

### Phase 1 (Impact immédiat - 1-2h)
1. ✅ Supprimer Slick Carousel du layout.jsx
2. ✅ Désinstaller react-slick et slick-carousel
3. ✅ Implémenter le lazy load progressif des sections

### Phase 2 (Impact moyen - 2-3h)
4. ✅ Ajouter le cache client avec sessionStorage
5. ✅ Optimiser le code splitting des composants

### Phase 3 (Peaufinage - 1h)
6. ✅ Précharger les fonts critiques
7. ✅ Tester et mesurer les gains avec Lighthouse

---

## 🔍 Métriques à Surveiller

### Avant optimisation (estimé)
- **TTI**: 4.5-6.0s (mobile 3G)
- **TBT**: 800-1200ms
- **FID**: 200-400ms

### Après optimisation (objectif)
- **TTI**: 2.5-3.5s (mobile 3G) ✅
- **TBT**: 200-400ms ✅
- **FID**: 50-100ms ✅

---

## 🛠️ Outils de Mesure

1. **Lighthouse** (Chrome DevTools)
   - Mode: Mobile
   - Throttling: Slow 4G
   - Métrique clé: TTI

2. **WebPageTest**
   - Location: Paris, France
   - Connection: 3G
   - Métrique clé: Time to Interactive

3. **Chrome User Experience Report**
   - Données réelles des utilisateurs
   - Métrique clé: FID (First Input Delay)

---

## 📝 Notes Importantes

- ⚠️ Le cache Supabase récemment ajouté (CACHE_SUPABASE.md) aide pour les requêtes serveur mais n'impacte pas directement le TTI côté client
- ⚠️ Les optimisations LCP (GUIDE_MIGRATION_LCP.md) sont bonnes mais le TTI nécessite des optimisations JavaScript spécifiques
- ✅ La structure SEO récemment ajoutée n'impacte pas négativement le TTI (métadonnées légères)

---

## 🎯 Conclusion

Le TTI actuel est probablement dans la fourchette **4.5-6.0s** sur mobile 3G, ce qui est **moyen**.  
Avec les optimisations recommandées, on peut viser **2.5-3.5s**, soit une **amélioration de 40-50%**.

**Prochaine étape recommandée**: Commencer par la Phase 1 (suppression de Slick Carousel et lazy load progressif) pour un gain rapide et significatif.
