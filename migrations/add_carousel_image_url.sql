-- Ajouter un champ pour stocker l'URL de l'image sélectionnée pour le carrousel principal
ALTER TABLE films ADD COLUMN IF NOT EXISTS "carousel_image_url" varchar;
