#!/bin/bash

# Aller dans le répertoire du script
cd "$(dirname "$0")"

# URL du site où les images sont hébergées
BASE_URL="https://cdn.star.nesdis.noaa.gov/GOES16/ABI/SECTOR/car/AirMass/"
IMAGE_DIR="mnt/data/imageryapp/images/noaa/AirMassRGB/Caribbean/2000"  # Chemin relatif au répertoire d'images local
JS_FILE="../src/data/airMassRGBCaribbean2000.js"  # Chemin relatif où le fichier JS sera généré

# Créer le répertoire des images s'il n'existe pas
mkdir -p "$IMAGE_DIR"

# Télécharger la page HTML
curl -s "$BASE_URL" > index.html

# Extraire les fichiers .jpg contenant "GOES16-ABI-car-AirMass-2000"
grep -oE 'href="([^"]*GOES16-ABI-car-AirMass-2000[^"]*\.jpg)' index.html | sed 's/^href="//' > image_list.txt

# Préparer le fichier JS
echo "// Ce fichier est généré automatiquement par un script shell" > "$JS_FILE"
echo "const imageUrls = [" >> "$JS_FILE"

# Parcourir la liste des fichiers d'images trouvés
while IFS= read -r image; do
  # Si le fichier n'existe pas localement, téléchargez-le
  if [ ! -f "$IMAGE_DIR/$image" ]; then
    curl -s "${BASE_URL}${image}" --output "$IMAGE_DIR/$image"
  fi
  
  # Ajouter l'URL de l'image au fichier JS
  echo "  '/mnt/data/imageryapp/images/noaa/AirMassRGB/caribbean/2000/$image'," >> "$JS_FILE"
done < image_list.txt

# Clôturer le fichier JS
echo "];" >> "$JS_FILE"
echo "export default imageUrls;" >> "$JS_FILE"

# Nettoyage du fichier temporaire
rm index.html image_list.txt

echo "Le fichier JS avec la liste des images a été généré : $JS_FILE"

