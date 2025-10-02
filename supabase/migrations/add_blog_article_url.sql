-- Ajouter la colonne blog_article_url à la table films
ALTER TABLE films
ADD COLUMN IF NOT EXISTS blog_article_url TEXT;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN films.blog_article_url IS 'URL vers l''article de blog associé au film';
