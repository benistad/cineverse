-- Ajouter une colonne slug à la table films
ALTER TABLE films ADD COLUMN IF NOT EXISTS slug TEXT;

-- Créer un index unique sur la colonne slug pour garantir l'unicité
CREATE UNIQUE INDEX IF NOT EXISTS films_slug_idx ON films(slug);

-- Mettre à jour les films existants avec un slug basé sur leur titre
UPDATE films 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^\w\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '--+', '-', 'g'
  )
)
WHERE slug IS NULL;
