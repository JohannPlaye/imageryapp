#!/bin/bash

# Aller dans le répertoire du script
cd "$(dirname "$0")"

# URL de la page à analyser pour les images d'EUMETSAT
BASE_URL="https://eumetview.eumetsat.int/static-images/MSG/IMAGERY/WV062/BW/FULLDISC/"
IMAGE_DIR="/mnt/data/imageryapp/images/eumetsat/WaterVapor/FD/LR"  # Répertoire des images locales
JS_FILE="../src/data/waterVaporFullDiscEumetsat.js"  # Fichier JS généré

# Créer le répertoire des images s'il n'existe pas
mkdir -p "$IMAGE_DIR"

# Supprimer le fichier JS existant s'il existe
if [ -f "$JS_FILE" ]; then
  rm "$JS_FILE"
  echo "Fichier $JS_FILE supprimé."
fi

# Télécharger la page HTML
curl -s "${BASE_URL}index.htm" -o index.htm

# Extraire les identifiants et les dates des images avec sed
sed -n 's/.*array_nom_imagen\[[0-9]*\]="\([^"]*\)".*/\1/p' index.htm > image_list.txt
sed -n 's/<option value="[0-9]*">\([^<]*\)<\/option>/\1/p' index.htm > date_list.txt

# Trier les listes extraites par ordre chronologique croissant
paste -d ',' date_list.txt image_list.txt | sort > sorted_list.txt

# Préparer le fichier JS
echo "// Ce fichier est généré automatiquement par un script shell" > "$JS_FILE"
echo "const imageUrls = [" >> "$JS_FILE"

# Ajouter les images locales non listées (synchro avec le répertoire local)
for image in "$IMAGE_DIR"/*.jpg; do
  image=$(basename "$image")
  if ! grep -q "$image" "$JS_FILE"; then
    # Si l'image n'est pas encore dans le fichier JS, l'ajouter
    echo "  '/images/eumetsat/WaterVapor/FD/LR/$image'," >> "$JS_FILE"
  fi
done

# Parcourir la liste triée et traiter les images
while IFS=',' read -r image_date image_id; do
  # Extraire les informations de date et heure
  day=$(echo "$image_date" | awk '{print $1}' | cut -d'/' -f1)
  month=$(echo "$image_date" | awk '{print $1}' | cut -d'/' -f2)
  year="20$(echo "$image_date" | awk '{print $1}' | cut -d'/' -f3)" # Extraire l'année complète

  time=$(echo "$image_date" | awk '{print $2}')
  hour=$(echo "$time" | cut -d':' -f1)
  minute=$(echo "$time" | cut -d':' -f2)

  # Conversion de la date au jour julien (basé sur l'année complète)
  date_string="$year-$month-$day $hour:$minute"
  julian_day=$(python3 -c "from datetime import datetime; print(datetime.strptime('$date_string', '%Y-%m-%d %H:%M').timetuple().tm_yday)")

  # Utilisation de printf sans interprétation de zéro initial comme octal
  new_filename="${year}${julian_day}$(printf '%02d' $((10#$hour)))$(printf '%02d' $((10#$minute)))_EUMETSAT-FD-WATERVAPOR-BW-LD.jpg"
  
  # Vérifier si l'image est déjà présente localement ou dans la liste JS
  if [ ! -f "$IMAGE_DIR/$new_filename" ]; then
    # Télécharger et renommer l'image si elle n'existe pas localement
    curl -s "${BASE_URL}IMAGESDisplay/${image_id}" --output "$IMAGE_DIR/$new_filename"
  fi

  # Ajouter l'URL de l'image au fichier JS si elle n'y est pas déjà
  if ! grep -q "$new_filename" "$JS_FILE"; then
    echo "  '/images/eumetsat/WaterVapor/FD/LR/$new_filename'," >> "$JS_FILE"
  fi
  
done < sorted_list.txt

# Clôturer le fichier JS
echo "];" >> "$JS_FILE"
echo "export default imageUrls;" >> "$JS_FILE"

# Nettoyer les fichiers temporaires
rm index.htm image_list.txt date_list.txt sorted_list.txt

echo "Le fichier JS avec la liste des images a été généré : $JS_FILE"
