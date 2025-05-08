-- Ajouter les champs pour la fonctionnalité "Pourquoi regarder ce film ?"
ALTER TABLE films 
ADD COLUMN IF NOT EXISTS why_watch_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS why_watch_content TEXT DEFAULT NULL;
