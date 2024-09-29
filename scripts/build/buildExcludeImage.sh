#!/bin/bash

# Chemins des répertoires
PROJECT_DIR="$(cd "$(dirname "$0")/../../" && pwd)"  # Résout le chemin absolu du répertoire racine du projet
WORK_FOLDER="$PROJECT_DIR/../workfolder"  # Résout le chemin absolu vers workfolder
IMAGE_DIR="$PROJECT_DIR/public/images"  # Chemin vers le dossier public/images
TEMP_IMAGE_DIR="$WORK_FOLDER/images"  # Chemin temporaire pour le dossier images

# Vérifier si le répertoire de travail existe, sinon le créer
if [ ! -d "$WORK_FOLDER" ]; then
  mkdir "$WORK_FOLDER"
  echo "Répertoire de travail '$WORK_FOLDER' créé."
fi

# Déplacer le dossier public/images vers le répertoire de travail
if [ -d "$IMAGE_DIR" ]; then
  mv "$IMAGE_DIR" "$TEMP_IMAGE_DIR"
  echo "Dossier 'public/images' déplacé vers '$WORK_FOLDER'."
else
  echo "Le dossier 'public/images' n'existe pas."
  exit 1
fi

# Lancer le build
echo "Lancement de npm run build..."
cd "$PROJECT_DIR" || exit
npm run build

# Vérifier si le build a réussi
if [ $? -eq 0 ]; then
  echo "Le build a réussi."
  # Replacer le dossier images
  if [ -d "$TEMP_IMAGE_DIR" ]; then
    mv "$TEMP_IMAGE_DIR" "$IMAGE_DIR"
    echo "Le dossier 'images' a été replacé dans 'public/'."
  else
    echo "Erreur : Le dossier temporaire des images n'existe pas."
    exit 1
  fi
else
  echo "Le build a échoué."
  # Remettre le dossier images même en cas d'échec du build
  if [ -d "$TEMP_IMAGE_DIR" ]; then
    mv "$TEMP_IMAGE_DIR" "$IMAGE_DIR"
    echo "Le dossier 'images' a été replacé dans 'public/'."
  else
    echo "Erreur : Le dossier temporaire des images n'existe pas."
    exit 1
  fi
fi

exit 0
