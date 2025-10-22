-- Migration pour corriger le slug de "Le Procès du siècle"
-- De: le-procs-du-sicle (avec accents mal encodés)
-- Vers: le-proces-du-siecle (sans accents, normalisé)

-- Mise à jour du slug
UPDATE films 
SET slug = 'le-proces-du-siecle'
WHERE slug = 'le-procs-du-sicle' 
   OR title ILIKE '%Procès du siècle%';

-- Vérification
SELECT id, title, slug 
FROM films 
WHERE slug = 'le-proces-du-siecle';
