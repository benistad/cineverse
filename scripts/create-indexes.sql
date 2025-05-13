-- Script pour créer des index optimisés dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Activer d'abord l'extension pg_trgm (nécessaire pour les index de recherche textuelle)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Index pour la table films
-- Index sur date_ajout (utilisé dans getRecentlyRatedFilms et d'autres requêtes de tri)
CREATE INDEX IF NOT EXISTS idx_films_date_ajout ON films (date_ajout DESC);

-- Index sur note_sur_10 (utilisé dans getTopRatedFilms)
CREATE INDEX IF NOT EXISTS idx_films_note_sur_10 ON films (note_sur_10 DESC);

-- Index sur is_hidden_gem (utilisé dans getHiddenGems)
CREATE INDEX IF NOT EXISTS idx_films_is_hidden_gem ON films (is_hidden_gem);

-- Index composite pour les requêtes qui filtrent par note et trient par date
CREATE INDEX IF NOT EXISTS idx_films_note_date ON films (note_sur_10 DESC, date_ajout DESC);

-- Index composite pour les requêtes qui filtrent par is_hidden_gem et trient par date
CREATE INDEX IF NOT EXISTS idx_films_hidden_gem_date ON films (is_hidden_gem, date_ajout DESC);

-- Remarque: La table remarkable_staff n'existe pas dans cette base de données
-- Si vous créez cette table à l'avenir, vous pourrez ajouter l'index ci-dessous
-- CREATE INDEX IF NOT EXISTS idx_remarkable_staff_film_id ON remarkable_staff (film_id);

-- Index pour la recherche de texte (version simplifiée)
-- Index pour la recherche dans le titre (pour searchFilms)
CREATE INDEX IF NOT EXISTS idx_films_title ON films (title);

-- Index pour la recherche dans le synopsis (pour searchFilms)
CREATE INDEX IF NOT EXISTS idx_films_synopsis ON films (synopsis);

-- Index pour la recherche dans les genres (pour searchFilms)
CREATE INDEX IF NOT EXISTS idx_films_genres ON films (genres);

-- Analyser les tables pour mettre à jour les statistiques
ANALYZE films;
-- ANALYZE remarkable_staff; -- Table n'existe pas
