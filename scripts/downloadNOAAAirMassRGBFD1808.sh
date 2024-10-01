#!/bin/bash

# Aller dans le répertoire du script
cd "$(dirname "$0")"

# URL du site où les images sont hébergées
BASE_URL="https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/AirMass/"
IMAGE_DIR="/mnt/data/imageryapp/images/noaa/AirMassRGB/FD/1808"  # Répertoire d'images local
JS_FILE="../src/data/AirMassRGBFD1808.js"  # Fichier JS à générer

# Créer le répertoire des images s'il n'existe pas
mkdir -p "$IMAGE_DIR"

# Supprimer le fichier JS existant s'il existe
if [ -f "$JS_FILE" ]; then
  rm "$JS_FILE"
  echo "Fichier $JS_FILE supprimé."
fi

# Télécharger la page HTML
curl -s "$BASE_URL" > index.html

# Extraire les fichiers .jpg contenant "GOES16-ABI-FD-AirMass-1808"
grep -oE 'href="([^"]*GOES16-ABI-FD-AirMass-1808[^"]*\.jpg)' index.html | sed 's/^href="//' > image_list.txt

# Vérification que le fichier a bien été créé
if [ ! -s image_list.txt ]; then
  echo "Erreur: Aucun fichier d'image trouvé sur le site distant."
  exit 1
fi

# Préparer le fichier JS en ajoutant les images locales présentes
echo "// Ce fichier est généré automatiquement par un script shell" > "$JS_FILE"
echo "const imageUrls = [" >> "$JS_FILE"

# Ajouter les images locales présentes dans le répertoire au fichier JS
for image in "$IMAGE_DIR"/*.jpg; do
  if [ -f "$image" ]; then  # Vérifier que c'est bien un fichier
    image=$(basename "$image")
    if ! grep -q "$image" "$JS_FILE"; then
      # Ajouter l'image locale au fichier JS
      echo "  '/images/noaa/AirMassRGB/FD/1808/$image'," >> "$JS_FILE"
    fi
  fi
done

# Télécharger les images manquantes et les ajouter au fichier JS
while IFS= read -r image; do
  # Si le fichier n'existe pas localement, téléchargez-le
  if [ ! -f "$IMAGE_DIR/$image" ]; then
    curl -s "${BASE_URL}${image}" --output "$IMAGE_DIR/$image"
    echo "Téléchargé : $image"
  fi

  # Ajouter l'URL de l'image au fichier JS (localement ou téléchargé)
  if ! grep -q "$image" "$JS_FILE"; then
    echo "  '/images/noaa/AirMassRGB/FD/1808/$image'," >> "$JS_FILE"
  fi
done < image_list.txt

# Clôturer le fichier JS
echo "];" >> "$JS_FILE"
echo "export default imageUrls;" >> "$JS_FILE"

# Nettoyage du fichier temporaire
rm index.html image_list.txt

echo "Le fichier JS avec la liste des images a été généré : $JS_FILE"
