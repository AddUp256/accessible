# Compatibilite de distribution

Accessible est une application desktop Tauri 2. Elle est locale, utilisable hors connexion pour les fonctions de base, et ne pose pas de diagnostic.

## Plateformes publiees

| Plateforme | Architecture | Artefacts GitHub Release | Statut |
| --- | --- | --- | --- |
| Windows 10/11 | x64 | `.exe` NSIS, `.msi` | Supporte |
| macOS | Apple Silicon | `.dmg`, `.app` | Supporte, notarisation recommandee |
| macOS | Intel x64 | `.dmg`, `.app` | Supporte, notarisation recommandee |
| Linux | x64 | `.AppImage`, `.deb` | Supporte sur distributions recentes |

## Choisir le bon fichier

- Windows : utiliser l'installateur `.exe` en priorite. Le `.msi` est utile pour certains deploiements administratifs.
- macOS Apple Silicon : utiliser l'artefact `aarch64` ou `arm64`.
- macOS Intel : utiliser l'artefact `x86_64`.
- Linux Ubuntu/Debian : utiliser le `.deb`.
- Linux autre distribution x64 : essayer l'AppImage.

## Avertissements de signature

Les premiers builds GitHub peuvent etre non signes ou signes de maniere ad-hoc.

- Windows : SmartScreen peut afficher un avertissement tant que l'application n'est pas signee avec un certificat de signature de code.
- macOS : Gatekeeper peut demander une confirmation manuelle tant que l'application n'est pas signee et notarisee avec un compte Apple Developer.
- Linux : la signature n'est pas obligatoire, mais une signature GPG des AppImage peut etre ajoutee plus tard.

Pour une distribution grand public sans friction, prevoir la signature Windows et la signature/notarisation macOS.

## Linux : limites pratiques

Les builds Linux sont produits sur Ubuntu 22.04 pour garder une base compatible avec les bibliotheques Tauri v2, notamment WebKitGTK 4.1. Les distributions plus anciennes peuvent echouer a cause de `glibc` ou de dependances systeme trop anciennes.

Compatibilite conseillee :

- Ubuntu 22.04 ou plus recent
- Debian 12 ou plus recent
- Fedora/OpenSUSE/Arch recents via AppImage, a tester selon environnement

## Fonctions optionnelles

Accessible fonctionne sans moteur externe pour les fonctions de base. Certaines fonctions avancees demandent des outils installes localement :

| Fonction | Dependances optionnelles |
| --- | --- |
| OCR image/PDF | Tesseract + langues OCR |
| Correction orthographique | Hunspell + dictionnaires |
| Grammaire | Grammalecte CLI |
| Synthese vocale locale | Piper ou eSpeak NG |
| Transcription media | Whisper + ffmpeg |

Voir `EXTERNAL_DEPENDENCIES.md` pour les chemins et variables d'environnement.
