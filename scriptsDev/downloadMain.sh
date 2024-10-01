#!/bin/bash

# Obtenir le nom du script actuel
main_script=$(basename "$0")

# Lister et trier les scripts, puis les exécuter
for script in $(ls *.sh | sort); do
  if [[ "$script" != "$main_script" ]]; then
    echo "Exécution de $script..."
    bash "$script"
  fi
done

