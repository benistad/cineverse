-- Migration pour ajouter les colonnes release_date et genres à la table films

-- Ajouter la colonne release_date (date de sortie du film)
ALTER TABLE films ADD COLUMN IF NOT EXISTS release_date DATE;

-- Ajouter la colonne genres (liste des genres du film)
ALTER TABLE films ADD COLUMN IF NOT EXISTS genres TEXT;

-- Commentaires sur les colonnes
COMMENT ON COLUMN films.release_date IS 'Date de sortie officielle du film';
COMMENT ON COLUMN films.genres IS 'Liste des genres du film, séparés par des virgules';
