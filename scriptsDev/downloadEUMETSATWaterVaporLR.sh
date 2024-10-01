#!/bin/bash

# Aller dans le répertoire du script
cd "$(dirname "$0")"

# URL de la page à analyser
BASE_URL="https://eumetview.eumetsat.int/static-images/MSG/IMAGERY/WV062/BW/FULLDISC/"
IMAGE_DIR="../public/images/eumetsat/WaterVapor/FD/LR"  # Répertoire des images locales
JS_FILE="../src/data/waterVaporFullDiscEumetsat.js"  # Fichier JS généré

# Créer le répertoire des images s'il n'existe pas
mkdir -p "$IMAGE_DIR"

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
  
  # Télécharger et renommer l'image si elle n'existe pas localement
  if [ ! -f "$IMAGE_DIR/$new_filename" ]; then
    curl -s "${BASE_URL}IMAGESDisplay/${image_id}" --output "$IMAGE_DIR/$new_filename"
  fi
  
  # Ajouter l'URL de l'image au fichier JS
  echo "  '/images/eumetsat/WaterVapor/FD/LR/$new_filename'," >> "$JS_FILE"
  
done < sorted_list.txt

# Clôturer le fichier JS
echo "];" >> "$JS_FILE"
echo "export default imageUrls;" >> "$JS_FILE"

# Nettoyer les fichiers temporaires
rm index.htm image_list.txt date_list.txt sorted_list.txt

echo "Le fichier JS avec la liste des images a été généré : $JS_FILE"
