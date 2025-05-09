-- Ajouter le champ is_hidden_gem à la table films
ALTER TABLE films ADD COLUMN is_hidden_gem BOOLEAN DEFAULT FALSE;

-- Mise à jour des commentaires de la table
COMMENT ON COLUMN films.is_hidden_gem IS 'Indique si le film est considéré comme un film méconnu à voir';
