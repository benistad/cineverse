-- Ajouter les champs newsletter_sent et newsletter_sent_at à la table films
-- Exécuter ce script dans Supabase SQL Editor

ALTER TABLE films 
ADD COLUMN IF NOT EXISTS newsletter_sent BOOLEAN DEFAULT FALSE;

ALTER TABLE films 
ADD COLUMN IF NOT EXISTS newsletter_sent_at TIMESTAMP WITH TIME ZONE;

-- Créer un index pour les requêtes sur newsletter_sent
CREATE INDEX IF NOT EXISTS idx_films_newsletter_sent ON films(newsletter_sent);

-- Commentaires pour documentation
COMMENT ON COLUMN films.newsletter_sent IS 'Indique si la newsletter a été envoyée pour ce film';
COMMENT ON COLUMN films.newsletter_sent_at IS 'Date et heure d envoi de la newsletter';
