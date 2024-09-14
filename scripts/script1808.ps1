# Aller dans le répertoire du script
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)

# URL du site où les images sont hébergées
$BASE_URL = "https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/"
$IMAGE_DIR = "../public/images/noaa/geocolor/1808"  # Chemin relatif au répertoire d'images local
$JS_FILE = "../src/data/images1808.js"  # Chemin relatif où le fichier JS sera généré

# Créer le répertoire des images s'il n'existe pas
If (-Not (Test-Path -Path $IMAGE_DIR)) {
    New-Item -ItemType Directory -Path $IMAGE_DIR
}

# Télécharger la page HTML
Invoke-WebRequest -Uri $BASE_URL -OutFile "index.html"

# Extraire les fichiers .jpg contenant "GOES16-ABI-FD-GEOCOLOR-1808"
Select-String -Path "index.html" -Pattern 'href="([^"]*GOES16-ABI-FD-GEOCOLOR-1808[^"]*\.jpg)' | 
    ForEach-Object { $_.Matches[0].Groups[1].Value } > image_list.txt

# Préparer le fichier JS
@"
// Ce fichier est généré automatiquement par un script PowerShell
const imageUrls = [
"@ | Out-File -FilePath $JS_FILE

# Parcourir la liste des fichiers d'images trouvés
Get-Content "image_list.txt" | ForEach-Object {
    $image = $_
    
    # Si le fichier n'existe pas localement, téléchargez-le
    $localImagePath = Join-Path $IMAGE_DIR $image
    If (-Not (Test-Path -Path $localImagePath)) {
        Invoke-WebRequest -Uri "$BASE_URL$image" -OutFile $localImagePath
    }

    # Ajouter l'URL de l'image au fichier JS
    "`t'/images/noaa/geocolor/1808/$image'," | Add-Content -Path $JS_FILE
}

# Clôturer le fichier JS
@"
];
export default imageUrls;
"@ | Add-Content -Path $JS_FILE

# Nettoyage du fichier temporaire
Remove-Item -Path "index.html", "image_list.txt"

Write-Host "Le fichier JS avec la liste des images a été généré : $JS_FILE"
