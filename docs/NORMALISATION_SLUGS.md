# Normalisation des Slugs - Guide d'utilisation

## 🎯 Objectif

Mettre à jour tous les slugs existants dans la base de données pour supprimer les accents et normaliser les caractères spéciaux.

**Exemple** :
- `marche-ou-crève` → `marche-ou-creve`
- `à-bout-de-souffle` → `a-bout-de-souffle`

## 📋 Prérequis

L'extension PostgreSQL `unaccent` doit être installée dans Supabase.

## 🚀 Étapes d'exécution

### 1. Accéder à Supabase SQL Editor

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet MovieHunt
3. Menu latéral → **SQL Editor**

### 2. Installer l'extension unaccent (si nécessaire)

Exécuter d'abord cette commande :

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
```

Cliquer sur **Run** (ou `Ctrl+Enter`)

### 3. Créer la fonction de normalisation

Copier-coller ce code dans l'éditeur SQL :

```sql
CREATE OR REPLACE FUNCTION normalize_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          unaccent(text_input),
          '[^a-zA-Z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

Cliquer sur **Run**

### 4. Prévisualiser les changements (optionnel mais recommandé)

Avant de mettre à jour, vérifier les changements :

```sql
SELECT 
  id,
  title,
  slug AS ancien_slug,
  normalize_slug(title) AS nouveau_slug,
  CASE 
    WHEN slug = normalize_slug(title) THEN '✓ Identique'
    ELSE '⚠ Changé'
  END AS statut
FROM films
WHERE title IS NOT NULL
ORDER BY title
LIMIT 50;
```

Cliquer sur **Run** pour voir les 50 premiers résultats.

### 5. Mettre à jour tous les slugs

**⚠️ ATTENTION : Cette opération va modifier tous les slugs !**

```sql
UPDATE films
SET slug = normalize_slug(title)
WHERE title IS NOT NULL;
```

Cliquer sur **Run**

Le résultat affichera quelque chose comme :
```
UPDATE 150
```
(où 150 est le nombre de films mis à jour)

### 6. Vérifier les résultats

```sql
SELECT 
  id,
  title,
  slug
FROM films
WHERE title IS NOT NULL
ORDER BY title
LIMIT 20;
```

Vérifier que les slugs n'ont plus d'accents.

### 7. Vérifier les doublons (ne devrait pas arriver)

```sql
SELECT 
  slug, 
  COUNT(*) AS nombre_films,
  STRING_AGG(title, ', ') AS titres
FROM films
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY nombre_films DESC;
```

Si cette requête retourne des résultats, il y a des films avec le même slug (à corriger manuellement).

## 📊 Statistiques

Pour voir combien de films ont été mis à jour :

```sql
SELECT 
  COUNT(*) AS total_films,
  COUNT(CASE WHEN slug IS NOT NULL THEN 1 END) AS films_avec_slug,
  COUNT(CASE WHEN slug IS NULL THEN 1 END) AS films_sans_slug
FROM films;
```

## 🔄 Que se passe-t-il après ?

### Redirections automatiques

Les anciennes URLs continueront de fonctionner grâce au fallback dans le code :

```javascript
// Si le slug n'existe pas, essayer de trouver par titre
const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase();
```

Donc :
- `/films/marche-ou-crève` → Cherche par titre → Trouve le film → Fonctionne ✅
- `/films/marche-ou-creve` → Cherche par slug → Trouve le film → Fonctionne ✅

### Sitemap mis à jour

Le sitemap sera automatiquement régénéré au prochain déploiement avec les nouveaux slugs.

### Google Search Console

Les nouvelles URLs apparaîtront progressivement dans Google. Les anciennes URLs seront redirigées automatiquement.

## ⚠️ Important

1. **Backup** : Supabase fait des backups automatiques, mais tu peux faire un export manuel avant si tu veux être sûr.
2. **Test** : Teste d'abord sur quelques films avec la requête de prévisualisation.
3. **Timing** : Exécute ce script pendant une période de faible trafic si possible.

## 🎯 Exemples de transformation

| Titre | Ancien slug | Nouveau slug |
|-------|-------------|--------------|
| Marche ou crève | `marche-ou-crève` | `marche-ou-creve` |
| À bout de souffle | `à-bout-de-souffle` | `a-bout-de-souffle` |
| L'Été meurtrier | `l'été-meurtrier` | `lete-meurtrier` |
| Le Fabuleux Destin d'Amélie Poulain | `le-fabuleux-destin-d'amélie-poulain` | `le-fabuleux-destin-damelie-poulain` |

## 📝 Rollback (si besoin)

Si tu veux revenir en arrière, tu devras restaurer depuis un backup Supabase ou réimporter les données.

## ✅ Checklist

- [ ] Extension `unaccent` installée
- [ ] Fonction `normalize_slug()` créée
- [ ] Prévisualisation des changements vérifiée
- [ ] Mise à jour exécutée
- [ ] Résultats vérifiés
- [ ] Pas de doublons de slugs
- [ ] Test de quelques URLs sur le site

## 🆘 En cas de problème

Si quelque chose ne fonctionne pas :

1. Vérifier que l'extension `unaccent` est bien installée
2. Vérifier les logs d'erreur dans Supabase
3. Tester la fonction `normalize_slug()` sur un exemple :
   ```sql
   SELECT normalize_slug('Marche ou crève');
   -- Devrait retourner : marche-ou-creve
   ```

## 📞 Support

Si tu as des questions ou des problèmes, vérifie :
- Les logs Supabase
- La console du navigateur pour les erreurs 404
- Le sitemap : `https://www.moviehunt.fr/sitemap.xml`
