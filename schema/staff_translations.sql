-- Table pour stocker les traductions du staff remarquable
CREATE TABLE IF NOT EXISTS staff_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES remarkable_staff(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL CHECK (locale IN ('fr', 'en')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(staff_id, locale)
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_staff_translations_staff_id ON staff_translations(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_translations_locale ON staff_translations(locale);
CREATE INDEX IF NOT EXISTS idx_staff_translations_staff_locale ON staff_translations(staff_id, locale);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_staff_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS trigger_update_staff_translations_updated_at ON staff_translations;
CREATE TRIGGER trigger_update_staff_translations_updated_at
  BEFORE UPDATE ON staff_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_staff_translations_updated_at();

-- Commentaires pour la documentation
COMMENT ON TABLE staff_translations IS 'Stocke les traductions des descriptions du staff remarquable';
COMMENT ON COLUMN staff_translations.staff_id IS 'Référence au membre du staff dans la table remarkable_staff';
COMMENT ON COLUMN staff_translations.locale IS 'Code de langue (fr, en)';
COMMENT ON COLUMN staff_translations.description IS 'Description traduite du membre du staff';
