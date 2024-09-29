# Projet de visualisation d'images satellites

## Description

Ce projet est une application React qui permet d'afficher des images satellites provenant de différentes sources, telles que la NOAA NESDIS STAR. L'application permet de précharger et de visualiser les images de manière fluide, avec une navigation manuelle ou automatique à travers une interface utilisateur moderne basée sur Material-UI. Les utilisateurs peuvent également filtrer les images par date ou par événement naturel spécifique, ainsi qu'ajuster la vitesse de défilement des images.

À l'avenir, d'autres sources d'images satellites, comme celles de **EUMETSAT** couvrant l'Europe et l'océan Indien, seront ajoutées.

## Fonctionnalités principales

- Affichage d'images satellites de la NOAA (exemple : **Geocolor**, **Airmass**).
- Filtrage des images par **plage de dates** ou par **événement naturel**.
- Lecture automatique ou manuelle des images avec ajustement de la vitesse de défilement.
- Gestion des événements naturels via une interface permettant de basculer entre **recherche par dates** ou **recherche par événements**.
- Intégration de **Material-UI** pour une expérience utilisateur moderne et réactive.
- Utilisation d'une sidebar pour configurer les paramètres de visualisation, comme le jeu d'images, les dates ou la vitesse de défilement.
- Cache des images pour améliorer les performances de préchargement.

## Technologies utilisées

- **React** : pour la construction de l'interface utilisateur.
- **Material-UI (MUI)** : pour les composants de l'interface.
- **Day.js** : pour la gestion des dates et leur manipulation.
- **Bash Scripts** : pour automatiser le téléchargement des images satellites et la génération de fichiers contenant les listes d'images à afficher.
- **NOAA NESDIS STAR** : en tant qu'exemple de source d'images, avec la possibilité d'ajouter des images d'autres sources (comme EUMETSAT).

## Installation et configuration

### Prérequis

- **Node.js** et **npm** doivent être installés.
- **Git** pour cloner le projet.
- Un environnement capable d'exécuter des scripts Bash (par exemple, un système Unix/Linux ou un émulateur Bash sous Windows).

### Étapes d'installation

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/votre-repo-url.git
   cd votre-repo

2. Installer les dépendances Node.js :

   ```bash
    npm install

3. Pour télécharger les jeux d'images et générer les fichiers JS associés, exécuter le script downloadMain.sh :

   ```bash
    cd scripts
    ./downloadMain.sh

4. Démarrer l'application React :

   ```bash
    npm start

5. Ouvrez votre navigateur à l'adresse suivante :
http://localhost:3000

## Structure du projet

/public
  /images
    /noaa
      /geocolor
      /airmass
    ... [Autres sources d'images]
/scripts
  downloadMain.sh
  geocolor678.sh
  ... [Autres scripts de téléchargement]
/src
  /components
    App.js
    Sidebar.js
    ImageViewer.js
    ProgressOverlay.js
  /data
    geocolor678.js
    events.json
    imageSets.json
    ... [Autres listes d'images]

### Description des fichiers
- App.js : le composant principal de l'application qui gère la logique générale et intègre la sidebar et le visionneur d'images.
- Sidebar.js : la barre latérale permettant de configurer les paramètres d'affichage des images (jeu d'images, dates, événements, etc.).
- ImageViewer.js : le composant qui affiche les images et gère le défilement automatique ou manuel.
- ProgressOverlay.js : un composant d'overlay qui affiche l'avancement du préchargement des images.
- /scripts : scripts Bash utilisés pour télécharger les images depuis des sources externes (comme la NOAA NESDIS STAR) et générer des fichiers JS contenant les listes d'images.
- /data : répertoire contenant les fichiers JS générés automatiquement par les scripts Bash, tels que geocolor678.js, qui répertorient les URLs des images à afficher.

## Scripts bash
### downloadMain.sh
Ce script principal exécute tous les scripts individuels de téléchargement pour les différents jeux d'images. Il assure le bon ordre d'exécution des scripts et évite d'exécuter le script principal lui-même.

### Ajout de nouvelles sources d'images

Pour ajouter de nouvelles sources d'images (par exemple, d'autres satellites comme ceux de EUMETSAT), il suffira de suivre la même logique que pour la NOAA :

Créer un script spécifique pour la nouvelle source, similaire à geocolor678.sh.
Ajouter le nouveau script au répertoire /scripts.
Mettre à jour le fichier downloadMain.sh pour exécuter automatiquement le nouveau script.
Ajouter un fichier .js correspondant dans le répertoire /data, qui sera mis à jour automatiquement par le script.


## Déploiement (build)
### Script build
Le build de l'application s'exécute par un script dédié :
```bash
cd scripts/build
./buildExcludeImage.sh
```
Le build produit un dossier "build".
Lors du build les images présentes dans public/images sont transférées vers un repertoire en dehors de l'app pour ne pas être incluses dans le build.
A l'issue du build elles sont redéposées dans public/images.

## Lancement du build
Il est recommandé de renommer le dossier "build" en "imageryapp" sur le serveur d'exécution.

Il est recommandé de lancer l'exécution du build avec serve.

Si serve est absent du système exécutant le build :
```bash
npm install -g serve
```

Pour lancer l'app avec serve :
```bash
serve -s imageryapp -l 3000
```

Il est recommandé de lancer la commande précédente au travers d'un script sh et d'inscrire le lancement du script sh au reboot dans un crontab.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.