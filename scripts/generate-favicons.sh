#!/bin/bash

# Script pour générer les différentes tailles de favicon
# Nécessite ImageMagick: brew install imagemagick

# Chemin vers le favicon source
SOURCE_FAVICON="public/favicon.png"

# Vérifier que le fichier source existe
if [ ! -f "$SOURCE_FAVICON" ]; then
  echo "Erreur: Le fichier source $SOURCE_FAVICON n'existe pas."
  exit 1
fi

# Créer le dossier de destination s'il n'existe pas
mkdir -p public/images

# Générer les différentes tailles de favicon
echo "Génération des favicons..."

# Favicon 16x16
convert "$SOURCE_FAVICON" -resize 16x16 public/images/favicon-16x16.png
echo "✓ favicon-16x16.png généré"

# Favicon 32x32
convert "$SOURCE_FAVICON" -resize 32x32 public/images/favicon-32x32.png
echo "✓ favicon-32x32.png généré"

# Apple Touch Icon (180x180)
convert "$SOURCE_FAVICON" -resize 180x180 public/images/apple-touch-icon.png
echo "✓ apple-touch-icon.png généré"

# MS Tile Image (144x144)
convert "$SOURCE_FAVICON" -resize 144x144 public/images/mstile-144x144.png
echo "✓ mstile-144x144.png généré"

# Safari Pinned Tab SVG (utilise potrace pour convertir en SVG)
# Note: Cette conversion est basique et pourrait nécessiter des ajustements manuels
convert "$SOURCE_FAVICON" -resize 512x512 -flatten -negate public/images/safari-pinned-tab-temp.png
if command -v potrace &> /dev/null; then
  potrace -s -o public/images/safari-pinned-tab.svg public/images/safari-pinned-tab-temp.png
  rm public/images/safari-pinned-tab-temp.png
  echo "✓ safari-pinned-tab.svg généré"
else
  echo "⚠️ potrace n'est pas installé, impossible de générer le SVG pour Safari"
  echo "  Pour installer potrace: brew install potrace"
  # Créer un SVG basique comme fallback
  echo '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>' > public/images/safari-pinned-tab.svg
fi

echo "Génération des favicons terminée!"
