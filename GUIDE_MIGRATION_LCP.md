# Guide de migration - Optimisations LCP

Ce guide vous accompagne étape par étape pour implémenter les optimisations LCP sur votre site MovieHunt.

---

## 🎯 Objectif

Réduire le LCP (Largest Contentful Paint) de **~3.5s à ~2.0s** (-43%)

---

## ⚠️ Avant de commencer

### 1. Créer une branche de test
```bash
git checkout -b feature/optimize-lcp
```

### 2. Sauvegarder l'état actuel
```bash
# Créer un backup de la page actuelle
cp src/app/page.jsx src/app/page.backup.jsx
```

### 3. Installer les dépendances de test (optionnel)
```bash
npm install --save-dev lighthouse chrome-launcher
```

---

## 📋 Étapes de migration

### ✅ Étape 1: Tester la performance actuelle (5 min)

**Objectif:** Établir une baseline de performance

```bash
# Lancer le serveur en mode production
npm run build
npm run start

# Dans un autre terminal, tester la performance
node scripts/test-lcp.js http://localhost:3000
```

**Ou utiliser PageSpeed Insights:**
- Aller sur https://pagespeed.web.dev/
- Tester votre URL de production

**📝 Noter les métriques actuelles:**
- LCP: _____ s
- FCP: _____ s
- TBT: _____ ms
- Score Performance: _____ /100

---

### ✅ Étape 2: Remplacer le carrousel (10 min)

**Fichier:** `src/app/page.jsx`

**Changement 1 - Import:**
```javascript
// AVANT
import FeaturedFilmsCarousel from '@/components/home/FeaturedFilmsCarousel';

// APRÈS
import OptimizedFeaturedCarousel from '@/components/home/OptimizedFeaturedCarousel';
```

**Changement 2 - Utilisation:**
```javascript
// AVANT
<section>
  <FeaturedFilmsCarousel />
</section>

// APRÈS
<section>
  <OptimizedFeaturedCarousel />
</section>
```

**Changement 3 - Supprimer le préchargement inutile:**
```javascript
// SUPPRIMER ces lignes (si présentes)
import PreloadCriticalImages from '@/components/ui/PreloadCriticalImages';
const criticalImagePaths = [];
// ... code de préparation des images
<PreloadCriticalImages imagePaths={criticalImagePaths} />
```

**✅ Vérifier:**
```bash
npm run dev
# Ouvrir http://localhost:3000
# Le carrousel doit s'afficher correctement
```

---

### ✅ Étape 3: Tester les changements (5 min)

```bash
# Build et test
npm run build
npm run start

# Tester la performance
node scripts/test-lcp.js http://localhost:3000
```

**📝 Comparer avec la baseline:**
- LCP: _____ s (amélioration: _____ %)
- FCP: _____ s (amélioration: _____ %)
- Score Performance: _____ /100

**Amélioration attendue:** LCP devrait être réduit de 20-30%

---

### ✅ Étape 4: Vérifier le bon fonctionnement (10 min)

**Tests à effectuer:**

1. **Navigation du carrousel:**
   - [ ] Les flèches gauche/droite fonctionnent
   - [ ] Le défilement automatique fonctionne (5 secondes)
   - [ ] Le clic sur une slide redirige vers le film

2. **Images:**
   - [ ] Toutes les images du carrousel se chargent
   - [ ] Pas d'images cassées ou de placeholders
   - [ ] Les images sont nettes (pas floues)

3. **Responsive:**
   - [ ] Mobile (375px): carrousel adapté
   - [ ] Tablet (768px): carrousel adapté
   - [ ] Desktop (1920px): carrousel adapté

4. **Badge Hunted:**
   - [ ] Le badge s'affiche sur les films concernés
   - [ ] Le clic sur le badge redirige vers /huntedbymoviehunt

5. **Performance:**
   - [ ] Pas de flash de contenu non stylisé (FOUC)
   - [ ] Pas de décalage de mise en page (CLS)
   - [ ] Chargement fluide

---

### ✅ Étape 5: Déployer en staging (optionnel)

Si vous avez un environnement de staging:

```bash
# Commit des changements
git add .
git commit -m "feat: optimize LCP with new carousel component"

# Push vers staging
git push origin feature/optimize-lcp

# Déployer sur Vercel (si configuré)
vercel --prod
```

**Tester sur staging:**
- Utiliser PageSpeed Insights sur l'URL de staging
- Vérifier les métriques réelles

---

### ✅ Étape 6: Déployer en production (5 min)

**Si tout fonctionne correctement:**

```bash
# Merger dans main
git checkout main
git merge feature/optimize-lcp

# Push en production
git push origin main
```

**Vercel déploiera automatiquement les changements**

---

## 🔄 Rollback en cas de problème

Si quelque chose ne fonctionne pas:

```bash
# Restaurer la version précédente
cp src/app/page.backup.jsx src/app/page.jsx

# Ou revenir au commit précédent
git checkout main
git reset --hard HEAD~1
```

---

## 📊 Suivi post-déploiement

### Jour 1-3: Surveillance
- Vérifier Vercel Speed Insights
- Surveiller les erreurs dans les logs
- Tester sur différents appareils

### Semaine 1: Analyse
- Comparer les métriques avant/après
- Vérifier l'impact sur le taux de rebond
- Analyser les Core Web Vitals dans Google Search Console

### Mois 1: Optimisations supplémentaires
- Implémenter les optimisations de niveau 2 (voir OPTIMISATIONS_LCP.md)
- Tester le SSR du carrousel
- Optimiser les autres sections

---

## 🐛 Problèmes courants et solutions

### Problème 1: Images ne se chargent pas
**Symptôme:** Placeholders au lieu des images

**Solution:**
```javascript
// Vérifier que les domaines sont autorisés dans next.config.js
images: {
  domains: ['image.tmdb.org', 'via.placeholder.com'],
}
```

### Problème 2: Carrousel ne défile pas
**Symptôme:** Carrousel figé

**Solution:**
```bash
# Vérifier que Swiper est installé
npm list swiper
# Si absent, installer
npm install swiper
```

### Problème 3: Erreur de build
**Symptôme:** `Error: Cannot find module...`

**Solution:**
```bash
# Nettoyer et rebuilder
rm -rf .next
npm run build
```

### Problème 4: LCP pas amélioré
**Symptôme:** Métriques similaires à avant

**Vérifications:**
1. Le nouveau composant est bien utilisé (vérifier dans le code source HTML)
2. Les images ont l'attribut `priority` (inspecter la première image)
3. Les scripts tiers sont en `lazyOnload` (vérifier dans layout.jsx)
4. Test effectué en mode production (`npm run build && npm run start`)

---

## 📞 Support

Si vous rencontrez des problèmes:

1. **Vérifier les logs:**
   ```bash
   # Logs de build
   npm run build
   
   # Logs runtime
   npm run start
   ```

2. **Vérifier la console du navigateur:**
   - Ouvrir DevTools (F12)
   - Onglet Console: chercher les erreurs
   - Onglet Network: vérifier les requêtes d'images

3. **Tester avec Lighthouse:**
   ```bash
   node scripts/test-lcp.js http://localhost:3000
   ```

---

## ✅ Checklist finale

Avant de considérer la migration terminée:

- [ ] Le carrousel s'affiche correctement
- [ ] Les images se chargent rapidement
- [ ] La navigation fonctionne (flèches, auto-scroll)
- [ ] Le site est responsive (mobile, tablet, desktop)
- [ ] Le LCP est réduit d'au moins 20%
- [ ] Aucune erreur dans la console
- [ ] Les tests de performance sont satisfaisants
- [ ] Le code est commité et déployé
- [ ] La documentation est à jour

---

## 🎉 Félicitations!

Vous avez réussi à optimiser le LCP de votre site MovieHunt!

**Prochaines étapes:**
1. Surveiller les métriques pendant quelques jours
2. Implémenter les optimisations de niveau 2 (voir OPTIMISATIONS_LCP.md)
3. Partager les résultats avec l'équipe

---

**Date de création:** 2025-10-06  
**Version:** 1.0  
**Auteur:** Cascade AI
