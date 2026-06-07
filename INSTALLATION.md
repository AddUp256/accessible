# Installer Accessible

Ce guide est destiné aux utilisateurs, testeurs, services informatiques et personnes qui accompagnent une première installation.

Accessible fonctionne en local. Les fonctions principales ne demandent pas de compte et ne nécessitent pas internet. Certains moteurs externes sont optionnels : OCR, traitement audio/vidéo et synthèse vocale locale.

## Choisir le bon fichier

1. Ouvrir la page des releases : <https://github.com/AddUp256/accessible/releases>.
2. Ouvrir la dernière version publiée.
3. Télécharger le fichier adapté à l’ordinateur.

| Système | Fichier conseillé | Compatibilité |
| --- | --- | --- |
| Windows | `.exe` NSIS pour une installation simple, `.msi` pour un déploiement administré | Windows 10/11 x64 |
| macOS Apple Silicon | `.dmg` ou `.app` `aarch64` / `arm64` | Mac M1, M2, M3, M4 et suivants |
| macOS Intel | `.dmg` ou `.app` `x86_64` | Mac Intel x64 |
| Linux | `.AppImage` ou `.deb` | Linux x64, Ubuntu 22.04 / Debian 12 ou plus récent conseillé |

Les premières versions peuvent ne pas être signées. Windows SmartScreen ou macOS Gatekeeper peuvent afficher un avertissement. Vérifier que le fichier vient bien de la page GitHub officielle du projet.

## Installation clic par clic

### Windows

1. Télécharger le fichier `Accessible_..._windows_x64...exe` ou `.msi`.
2. Double-cliquer sur le fichier.
3. Si Windows affiche un avertissement SmartScreen, choisir `Informations complémentaires`, puis `Exécuter quand même` si le fichier vient de la release officielle.
4. Suivre l’assistant d’installation.
5. Ouvrir Accessible depuis le menu Démarrer.
6. Lire le message d’introduction, puis passer par la personnalisation de départ.

### macOS

1. Télécharger le fichier correspondant à la puce du Mac : Apple Silicon ou Intel.
2. Ouvrir le `.dmg`.
3. Glisser Accessible dans `Applications` si le disque d’installation le propose.
4. Ouvrir Accessible depuis `Applications`.
5. Si macOS bloque l’ouverture car l’app n’est pas notarisee, ouvrir `Réglages système`, puis `Confidentialité et sécurité`, et autoriser l’ouverture du fichier téléchargé depuis GitHub.

### Linux

1. Télécharger l’AppImage ou le paquet `.deb`.
2. Pour AppImage : clic droit, `Propriétés`, autoriser l’exécution, puis double-clic.
3. Pour Debian/Ubuntu : double-cliquer sur le `.deb` ou lancer `sudo apt install ./nom-du-fichier.deb`.
4. Ouvrir Accessible depuis le menu des applications.

## Dépendances optionnelles Windows

Depuis le dossier du projet, un script installe automatiquement les moteurs les plus courants avec Winget :

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -File scripts\install-windows-optional-tools.ps1
```

Le script tente d’installer :

| Moteur | Rôle |
| --- | --- |
| Tesseract OCR | Reconnaissance de texte dans les images et PDF |
| FFmpeg | Traitement audio/vidéo |
| eSpeak NG | Synthèse vocale locale légère |

Après installation, redémarrer Accessible. Si un moteur n’est pas détecté, redémarrer Windows ou vérifier que son dossier est dans le `PATH`.

## Dépendances optionnelles macOS et Linux

Les paquets varient selon l’établissement et la distribution. Pour un déploiement administré, installer si nécessaire :

| Moteur | Exemples de paquets |
| --- | --- |
| Tesseract OCR | `tesseract`, `tesseract-lang`, langue française |
| FFmpeg | `ffmpeg` |
| eSpeak NG | `espeak-ng` |
| Piper | binaire Piper + modèle `.onnx`, avec variables d’environnement `PIPER_MODEL` si utilisé |
| Hunspell | `hunspell`, dictionnaire `fr_FR` |

## Après installation

1. Ouvrir Accessible.
2. Lire le message de première ouverture.
3. Lancer la personnalisation de départ pour garder seulement les fonctions utiles.
4. Aller dans `Paramètres` pour vérifier le thème, la taille du texte, l’audio, les modules visibles et les exports.
5. Utiliser la bulle `Aide` en bas à droite pour demander de l’aide ou signaler un bug.
