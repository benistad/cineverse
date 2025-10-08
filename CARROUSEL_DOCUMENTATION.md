# Documentation du Carrousel - MovieHunt

## 🎬 Comment fonctionne le carrousel ?

Le carrousel de la page d'accueil affiche les **films en vedette** (featured films).

### 📋 Critères de sélection

La fonction `getFeaturedFilms()` sélectionne les films selon ces critères :

```javascript
// Paramètres par défaut
limit = 5        // Nombre de films affichés
minRating = 6    // Note minimale requise
```

### 🔍 Requête SQL

```sql
SELECT * FROM films
WHERE note_sur_10 >= 6
ORDER BY date_ajout DESC
LIMIT 5
```

**En résumé** :
1. ✅ **Note ≥ 6/10** (films bien notés)
2. ✅ **Triés par date d'ajout** (les plus récents en premier)
3. ✅ **Limité à 5 films**

### 📊 Exemple de films affichés actuellement

D'après la base de données, les films dans le carrousel sont :
1. **The Wave** (Note: 6, Ajouté: 01/10/2025)
2. **F1® Le Film** (Note: 7, Ajouté: 23/08/2025)
3. **Jusqu'au bout du rêve** (Note: 7, Ajouté: 18/07/2025)
4. **Until Dawn : La Mort sans fin** (Note: 6, Ajouté: récent)
5. **Companion** (Note: 6, Ajouté: récent)

### 🖼️ Images du carrousel

Le carrousel utilise les images dans cet ordre de priorité :
1. **carousel_image_url** (image personnalisée pour le carrousel)
2. **backdrop_url** (image de fond TMDB)
3. **poster_url** (affiche du film)
4. **backdrop_path** (chemin TMDB)
5. **poster_path** (chemin affiche TMDB)

### 💾 Cache

- **Cache client** : 10 minutes (sessionStorage)
- **Cache serveur** : 5 minutes (Supabase cache)

### 🔄 Comment ajouter un film au carrousel ?

Pour qu'un film apparaisse dans le carrousel, il doit :

1. **Avoir une note ≥ 6/10**
   ```sql
   UPDATE films SET note_sur_10 = 7 WHERE id = 'xxx';
   ```

2. **Être récemment ajouté**
   - Les films sont triés par `date_ajout` (DESC)
   - Les 5 films les plus récents avec note ≥ 6 sont affichés

3. **Avoir une belle image** (optionnel mais recommandé)
   ```sql
   UPDATE films 
   SET carousel_image_url = 'https://...' 
   WHERE id = 'xxx';
   ```

### 📝 Exemple : Ajouter un nouveau film au carrousel

```javascript
// 1. Ajouter le film avec une bonne note
const { data } = await supabase
  .from('films')
  .insert({
    title: 'Mon Super Film',
    note_sur_10: 8,
    date_ajout: new Date().toISOString(),
    backdrop_url: 'https://image.tmdb.org/t/p/original/xxx.jpg',
    // ... autres champs
  });

// 2. Le film apparaîtra automatiquement dans le carrousel
// car il a une note ≥ 6 et est le plus récent
```

### 🎨 Personnaliser l'image du carrousel

Si vous voulez une image spécifique pour le carrousel (différente du backdrop) :

```sql
UPDATE films 
SET carousel_image_url = 'https://image.tmdb.org/t/p/original/custom-image.jpg'
WHERE slug = 'mon-film';
```

### 🔧 Modifier les critères du carrousel

Pour changer les critères (ex: afficher 10 films avec note ≥ 7) :

**Fichier** : `src/components/home/OptimizedFeaturedCarousel.jsx`

```javascript
// Ligne ~87
const topFilms = await getFeaturedFilms(10, 7); // 10 films, note ≥ 7
```

### 📱 Composants utilisés

1. **OptimizedFeaturedCarousel.jsx** - Composant principal du carrousel
2. **getFeaturedFilms()** - Fonction de récupération des films
3. **Swiper** - Bibliothèque pour le carrousel (avec autoplay et transitions)

### ⚡ Performance

- **Lazy loading** : Seule la première image est chargée en priorité
- **Autoplay** : 5 secondes entre chaque slide
- **Transition** : Effet fade pour un rendu élégant
- **Cache** : Évite les requêtes répétées

### 🐛 Dépannage

**Le carrousel est vide ?**
1. Vérifier qu'il y a au moins 1 film avec note ≥ 6
2. Vider le cache (Cmd+Shift+R)
3. Vérifier les logs console pour les erreurs

**Les images ne s'affichent pas ?**
1. Vérifier que `backdrop_url` ou `carousel_image_url` est défini
2. Vérifier que l'URL de l'image est accessible
3. Vérifier le proxy d'images (`/api/image-proxy`)

**Le carrousel ne se met pas à jour ?**
1. Attendre 10 minutes (expiration du cache)
2. Ou vider le sessionStorage
3. Ou incrémenter `CACHE_VERSION` dans `clientCache.js`

---

## 📚 Fichiers Concernés

- `src/components/home/OptimizedFeaturedCarousel.jsx` - Composant carrousel
- `src/lib/supabase/films.js` - Fonction `getFeaturedFilms()`
- `src/lib/cache/clientCache.js` - Système de cache client
- `src/app/page.jsx` - Page d'accueil qui utilise le carrousel

---

**Date de création** : 8 Octobre 2025  
**Dernière mise à jour** : 8 Octobre 2025
