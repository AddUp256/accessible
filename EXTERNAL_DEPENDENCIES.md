# Dépendances externes — Accessible

Accessible fonctionne **sans connexion Internet** et **sans moteurs externes** : lecture, écriture, organisation, export PDF, etc. restent utilisables. Les binaires ci-dessous sont **optionnels** et **non embarqués** dans l’installateur Tauri.

| Moteur | Module | Rôle | Fallback si absent |
|--------|--------|------|-------------------|
| **Tesseract** | Lire → OCR image / PDF | Extraire le texte d’une photo, capture ou PDF scanné | Message d’installation ; collage manuel |
| **Poppler** (`pdftoppm`) | Lire → OCR PDF | Convertir les pages PDF scannées si Tesseract ne lit pas le PDF directement | Message d’installation ; export en images |
| **Whisper** (`whisper-cli`) | Lire → audio/vidéo | Transcription locale + sous-titres synchronisés | Collage manuel / import SRT |
| **ffmpeg** | Lire → vidéo | Extraire la piste audio avant transcription Whisper | Transcription audio seulement |
| **Hunspell** | Écrire → correcteur | Orthographe (`fr_FR`) | Message d’installation ; phrases longues uniquement |
| **Grammalecte** | Écrire → correcteur | Grammaire française | Hunspell seul ou message d’installation |
| **Piper** | Lire / TTS expert | Synthèse vocale locale hors ligne | Web Speech API ou eSpeak NG |
| **eSpeak NG** | Lire / TTS expert | Synthèse vocale légère hors ligne | Web Speech API ou Piper |

**Navigateur web (`npm run dev`)** : seul Web Speech API est disponible pour la lecture vocale. OCR et correcteur affichent un stub explicite.

**Application Tauri** : les commandes Rust appellent les exécutables via le `PATH` système (ou variables d’environnement documentées ci-dessous).

---

## Prérequis communs

1. Installer le binaire et l’ajouter au **PATH** Windows (ou redémarrer le terminal après installation).
2. **Relancer Accessible** après toute installation ou changement de variable d’environnement.
3. Vérifier depuis un terminal PowerShell :

```powershell
tesseract --version
hunspell -h
grammalecte-cli -h    # ou python grammalecte-cli.py -h
piper --help
espeak-ng --version
whisper-cli --help
ffmpeg -version
pdftoppm -v
```

---

## Tesseract OCR

**Utilisation :** `/lire` → panneau « Importer une image ou un PDF » → extraction vers la zone de lecture.

**Détection :** commande `tesseract` dans le PATH ; langue par défaut `fra`. Les PDF scannés sont traités par Tesseract directement, ou via `pdftoppm` si nécessaire.

### Windows 10/11

```powershell
winget install UB-Mannheim.TesseractOCR
```

Lors de l’installation, cocher le pack de langue **French (`fra`)**. Si besoin, ajouter manuellement au PATH :

```powershell
$env:Path += ";C:\Program Files\Tesseract-OCR"
tesseract --list-langs
```

`fra` doit apparaître dans la liste.

### Linux / macOS

- Linux : paquet `tesseract-ocr` + `tesseract-ocr-fra` (noms selon distribution).
- macOS : `brew install tesseract tesseract-lang`.

### Poppler (PDF scanné — fallback)

Si Tesseract ne lit pas un PDF directement, Accessible convertit chaque page en PNG via `pdftoppm`, puis applique l’OCR page par page.

```powershell
winget install oschwartz10612.Poppler
pdftoppm -v
```

Sur Linux : paquet `poppler-utils`. Sur macOS : `brew install poppler`.

---

## Hunspell

**Utilisation :** `/ecrire` → correcteur orthographique.

**Détection :** commande `hunspell` dans le PATH. Dictionnaire selon l’interface bilingue : `fr_FR` par défaut ; si la langue secondaire est **en**, **es**, **de**, **it** ou **pt**, Accessible tente `en_US`, `es_ES`, `de_DE`, `it_IT`, `pt_PT` / `pt_BR` (paquets Hunspell à installer séparément). **Grammalecte** reste français uniquement.

### Windows 10/11

```powershell
winget install FSFhu.Hunspell
```

Vérifier que le dictionnaire français est accessible :

```powershell
hunspell -d fr_FR -a
# Taper un mot puis Entrée, puis Ctrl+Z + Entrée pour quitter
```

Si `fr_FR` est introuvable, installer les fichiers `fr_FR.dic` / `fr_FR.aff` dans le répertoire de dictionnaires Hunspell (souvent `%ProgramFiles%\Hunspell\` ou `%LOCALAPPDATA%\Hunspell\`) — voir la documentation du paquet installé.

### Linux / macOS

- Debian/Ubuntu : `sudo apt install hunspell-fr`
- macOS : `brew install hunspell` (+ fichiers `fr_FR` si nécessaire)

---

## Grammalecte

**Utilisation :** `/ecrire` → correction grammaticale (en complément de Hunspell).

**Détection :** `grammalecte-cli -h` dans le PATH, **ou** variable `GRAMMALECTE_CLI` pointant vers `grammalecte-cli.py` ou un exécutable.

### Windows 10/11 (via Python)

```powershell
pip install grammalecte
```

Ajouter le dossier Scripts Python au PATH (adapter la version Python) :

```powershell
$env:Path += ";$env:LOCALAPPDATA\Programs\Python\Python312\Scripts"
grammalecte-cli -h
```

**Alternative — variable d’environnement :**

```powershell
setx GRAMMALECTE_CLI "C:\chemin\vers\grammalecte-cli.py"
```

Accessible tentera aussi `python grammalecte-cli.py` si le chemin se termine par `.py`.

### Linux

Souvent disponible via le gestionnaire de paquets de la distribution, ou `pip install grammalecte` comme ci-dessus.

---

## Piper TTS

**Utilisation :** lecture vocale locale dans l’app Tauri ; moteur « Piper » dans les réglages expert (`/lire`, `/parametres`).

**Détection :** commande `piper` dans le PATH **et** au moins une variable de modèle :

| Variable | Langue |
|----------|--------|
| `PIPER_MODEL` | Français (défaut) |
| `PIPER_MODEL_EN` | Anglais |
| `PIPER_MODEL_ES` | Espagnol |
| `PIPER_MODEL_DE` | Allemand |
| `PIPER_MODEL_AR` | Arabe |
| `PIPER_MODEL_ZH` | Chinois (zh-CN) |
| `PIPER_MODEL_IT` | Italien |
| `PIPER_MODEL_PT` | Portugais |
| `PIPER_MODEL_HI` | Hindi |
| `PIPER_MODEL_UK` | Ukrainien |
| `PIPER_MODEL_TR` | Turc |

Chaque variable pointe vers un fichier `.onnx` (et son `.onnx.json` dans le même dossier). Dans `/lire` → réglages, un sélecteur **Voix Piper** liste les voix disponibles.

### Windows 10/11

1. Télécharger la release Windows amd64 : [rhasspy/piper releases](https://github.com/rhasspy/piper/releases) (`piper_windows_amd64.zip`).
2. Extraire (ex. `C:\Tools\piper\`) et ajouter au PATH :

```powershell
$env:Path += ";C:\Tools\piper"
piper --help
```

3. Télécharger une voix française (ex. `fr_FR-siwis-medium`) depuis [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/siwis/medium). Conserver le fichier `.onnx` et le `.onnx.json` dans le même dossier.

4. Définir la variable d’environnement (chemin vers le `.onnx`) :

```powershell
setx PIPER_MODEL "C:\Tools\piper-voices\fr_FR-siwis-medium.onnx"
```

5. **Fermer et rouvrir** Accessible (les variables `setx` ne s’appliquent qu’aux nouvelles sessions).

**Sans Piper :** Accessible utilise **Web Speech API** (voix installées dans Windows : Paramètres → Heure et langue → Voix).

### Linux / macOS

Binaires Piper disponibles dans les mêmes releases GitHub (`piper_linux_*`, `piper_macos_*`). Même principe pour `PIPER_MODEL`.

---

## eSpeak NG

**Utilisation :** lecture vocale locale dans l’app Tauri ; moteur « eSpeak NG » dans les réglages expert (`/lire`).

**Détection :** commande `espeak-ng` ou `espeak` dans le PATH. Voix par défaut : **`fr`**. Optionnel : variable **`ESPEAK_VOICE`** (ex. `fr`, `fr+f2`).

### Windows 10/11

```powershell
winget install espeak-ng.espeak-ng
espeak-ng --version
```

Ou installer depuis [eSpeak NG releases](https://github.com/espeak-ng/espeak-ng/releases) et ajouter au PATH.

### Linux / macOS

```bash
# Debian/Ubuntu
sudo apt install espeak-ng

# macOS
brew install espeak-ng
```

**Sans eSpeak :** le mode automatique utilise Piper (si configuré) ou Web Speech API.

---

## Whisper (transcription audio / vidéo)

**Utilisation :** `/lire` → onglet « Audio / vidéo » → « Transcrire automatiquement ».

**Détection :** `whisper-cli`, `whisper` ou `main` (whisper.cpp) dans le PATH **et** variable **`WHISPER_MODEL`** = chemin vers un modèle `.bin` / `.gguf`.

### Windows 10/11

1. Télécharger une release [whisper.cpp](https://github.com/ggerganov/whisper.cpp/releases) (`whisper-cli` ou binaire équivalent).
2. Extraire et ajouter au PATH.
3. Télécharger un modèle (ex. `ggml-base.bin` ou `ggml-small.bin`) depuis les assets du projet ou [Hugging Face](https://huggingface.co/ggerganov/whisper.cpp).
4. Définir le modèle :

```powershell
setx WHISPER_MODEL "C:\Tools\whisper\models\ggml-base.bin"
```

5. **Relancer Accessible.**

### ffmpeg (vidéos uniquement)

Obligatoire pour extraire l’audio avant transcription :

```powershell
winget install Gyan.FFmpeg
ffmpeg -version
```

---

## Variables d’environnement

| Variable | Obligatoire pour | Description |
|----------|------------------|-------------|
| `PIPER_MODEL` | Piper TTS (FR) | Chemin absolu vers un modèle `.onnx` français |
| `PIPER_MODEL_EN` | Piper TTS (EN) | Voix anglaise (optionnel) |
| `PIPER_MODEL_ES` | Piper TTS (ES) | Voix espagnole (optionnel) |
| `PIPER_MODEL_DE` | Piper TTS (DE) | Voix allemande (optionnel) |
| `PIPER_MODEL_AR` | Piper TTS (AR) | Voix arabe (optionnel) |
| `PIPER_MODEL_ZH` | Piper TTS (ZH) | Voix chinoise (optionnel) |
| `PIPER_MODEL_IT` | Piper TTS (IT) | Voix italienne (optionnel) |
| `PIPER_MODEL_PT` | Piper TTS (PT) | Voix portugaise (optionnel) |
| `PIPER_MODEL_HI` | Piper TTS (HI) | Voix hindi (optionnel) |
| `PIPER_MODEL_UK` | Piper TTS (UK) | Voix ukrainienne (optionnel) |
| `PIPER_MODEL_TR` | Piper TTS (TR) | Voix turque (optionnel) |
| `ESPEAK_VOICE` | eSpeak NG | Code voix (défaut `fr`) |
| `WHISPER_MODEL` | Whisper | Chemin absolu vers un modèle Whisper (`.bin` / `.gguf`) |
| `GRAMMALECTE_CLI` | Grammalecte (optionnel) | Chemin vers `grammalecte-cli.py` ou exécutable si absent du PATH |

Tesseract, Poppler (`pdftoppm`), Hunspell, ffmpeg et Whisper sont résolus via le **PATH** (sauf modèles Piper/Whisper).

---

## Dictée vocale (Windows, app Tauri)

**Utilisation :** activer « Dictée vocale » dans le profil / réglages moteur → bouton **Dictée** sur `/ecrire` ou raccourci global.

**Détection :** assembly **System.Speech** (inclus avec Windows). Accessible lance une session PowerShell de ~8 secondes ; parlez dès le message « Parlez maintenant… ».

**Navigateur (`npm run dev`)** : dictée via **Web Speech API** (Edge ou Chrome recommandés).

**Prérequis :** micro autorisé pour Accessible ; langue de reconnaissance alignée sur la **langue secondaire** en mode bilingue (fr, en, es, de, it, pt, ar, zh, hi, uk, tr — pack Windows Speech correspondant installé).

---

## Vérification dans l’application

| Fonction | Où tester | Comportement attendu |
|----------|-----------|----------------------|
| OCR image | `/lire` → import image | Texte extrait ou message `dyn.service.ocrTesseractMissing` |
| OCR PDF | `/lire` → import PDF | Texte extrait ou message Poppler/Tesseract |
| Transcription | `/lire` → audio/vidéo | Texte + sous-titres ou message Whisper/ffmpeg |
| Orthographe | `/ecrire` → correcteur | Suggestions ou message `dyn.service.hunspellMissing` |
| Grammaire | `/ecrire` → activer grammaire | Suggestions ou message `dyn.service.grammalecteMissing` |
| TTS Piper | `/lire` ou réglages expert → moteur Piper | Lecture audio ou message `dyn.service.ttsPiperStub` |
| TTS eSpeak | `/lire` → moteur eSpeak NG | Lecture audio ou message `dyn.service.ttsEspeakStub` |
| TTS auto | Partout | Piper → eSpeak → Web Speech |

Messages utilisateur traduits (FR/EN) : clés `dyn.service.*` dans `src/lib/i18n/ui-dynamic.ts`.

---

## Données et confidentialité

- Les moteurs s’exécutent **localement** sur la machine ; Accessible ne télécharge ni n’envoie le texte analysé.
- Piper écrit des fichiers WAV temporaires dans `%TEMP%\accessible-piper\`.
- eSpeak NG écrit des fichiers WAV temporaires dans `%TEMP%\accessible-espeak\`.
- Tesseract utilise le cache applicatif Tauri (`app_cache_dir/ocr/`).

Voir aussi [PRIVACY.md](./PRIVACY.md) et [PROJECT_STATUS.md](./PROJECT_STATUS.md).

---

## Dépannage rapide

| Symptôme | Piste |
|----------|-------|
| « introuvable » après installation | PATH non pris en compte → redémarrer le terminal et **relancer Accessible** |
| Tesseract sans `fra` | Réinstaller en cochant French, ou copier `fra.traineddata` dans `tessdata/` |
| Hunspell « Can't open dictionary » | Installer / placer `fr_FR.dic` + `fr_FR.aff` |
| Piper installé mais indisponible | Vérifier `PIPER_MODEL` (fichier `.onnx` existant) dans une **nouvelle** session |
| Whisper absent ou modèle manquant | `whisper-cli --help` + `WHISPER_MODEL` vers un fichier `.bin` existant |
| Vidéo non transcrite | Installer `ffmpeg` et vérifier le PATH |
| PDF scanné illisible | Installer Poppler (`pdftoppm`) ou exporter le PDF en images |
| Grammalecte absent | `pip install grammalecte` + PATH Scripts Python ou `GRAMMALECTE_CLI` |

---

## Évolutions planifiées

- Builds macOS / Linux : voir **[BUILD.md](./BUILD.md)**.
