-- Ajout du champ genres dans la table film_translations
-- Pour stocker les genres en anglais récupérés depuis TMDB

ALTER TABLE film_translations
ADD COLUMN IF NOT EXISTS genres TEXT;

-- Commentaire sur la colonne
COMMENT ON COLUMN film_translations.genres IS 'Genres du film en anglais (récupérés depuis TMDB)';
