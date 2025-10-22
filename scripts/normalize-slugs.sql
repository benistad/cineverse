-- Script SQL pour normaliser tous les slugs existants dans la base de données
-- Supprime les accents et normalise les caractères spéciaux
-- À exécuter dans Supabase SQL Editor

-- Fonction pour normaliser un slug (équivalent de slugify en JavaScript)
-- Cette fonction utilise les fonctions PostgreSQL pour normaliser les caractères
CREATE OR REPLACE FUNCTION normalize_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          -- Normaliser les caractères Unicode (décomposer les accents)
          unaccent(text_input),
          '[^a-zA-Z0-9\s-]', '', 'g'  -- Supprimer les caractères spéciaux
        ),
        '\s+', '-', 'g'  -- Remplacer les espaces par des tirets
      ),
      '-+', '-', 'g'  -- Remplacer les tirets multiples par un seul
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Vérifier que l'extension unaccent est installée (nécessaire pour supprimer les accents)
-- Si elle n'est pas installée, exécuter d'abord cette commande :
-- CREATE EXTENSION IF NOT EXISTS unaccent;

-- Mettre à jour tous les slugs des films
-- Cette requête va normaliser tous les slugs existants
UPDATE films
SET slug = normalize_slug(title)
WHERE title IS NOT NULL;

-- Vérifier les résultats
-- Cette requête affiche les anciens et nouveaux slugs pour vérification
SELECT 
  id,
  title,
  slug AS nouveau_slug,
  normalize_slug(title) AS slug_normalise
FROM films
WHERE title IS NOT NULL
ORDER BY title
LIMIT 20;

-- Statistiques : Compter combien de films ont été mis à jour
SELECT 
  COUNT(*) AS total_films,
  COUNT(CASE WHEN slug IS NOT NULL THEN 1 END) AS films_avec_slug,
  COUNT(CASE WHEN slug IS NULL THEN 1 END) AS films_sans_slug
FROM films;

-- Vérifier s'il y a des doublons de slugs (ne devrait pas arriver normalement)
SELECT 
  slug, 
  COUNT(*) AS nombre_films,
  STRING_AGG(title, ', ') AS titres
FROM films
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY nombre_films DESC;

-- Si vous voulez voir les changements avant de les appliquer, utilisez cette requête :
-- SELECT 
--   id,
--   title,
--   slug AS ancien_slug,
--   normalize_slug(title) AS nouveau_slug,
--   CASE 
--     WHEN slug = normalize_slug(title) THEN '✓ Identique'
--     ELSE '⚠ Changé'
--   END AS statut
-- FROM films
-- WHERE title IS NOT NULL
-- ORDER BY title;
