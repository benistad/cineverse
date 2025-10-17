-- Table pour stocker les traductions des films
CREATE TABLE IF NOT EXISTS film_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  film_id VARCHAR NOT NULL REFERENCES films(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL CHECK (locale IN ('fr', 'en')),
  title VARCHAR,
  synopsis TEXT,
  why_watch_content TEXT,
  what_we_didnt_like TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(film_id, locale)
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_film_translations_film_id ON film_translations(film_id);
CREATE INDEX IF NOT EXISTS idx_film_translations_locale ON film_translations(locale);
CREATE INDEX IF NOT EXISTS idx_film_translations_film_locale ON film_translations(film_id, locale);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_film_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS trigger_update_film_translations_updated_at ON film_translations;
CREATE TRIGGER trigger_update_film_translations_updated_at
  BEFORE UPDATE ON film_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_film_translations_updated_at();

-- Commentaires pour la documentation
COMMENT ON TABLE film_translations IS 'Stocke les traductions des films dans différentes langues';
COMMENT ON COLUMN film_translations.film_id IS 'Référence au film dans la table films';
COMMENT ON COLUMN film_translations.locale IS 'Code de langue (fr, en)';
COMMENT ON COLUMN film_translations.title IS 'Titre traduit du film';
COMMENT ON COLUMN film_translations.synopsis IS 'Synopsis traduit';
COMMENT ON COLUMN film_translations.why_watch_content IS 'Contenu "Pourquoi regarder" traduit';
COMMENT ON COLUMN film_translations.what_we_didnt_like IS 'Contenu "Ce qu\'on n\'a pas aimé" traduit';
