# Guide rapide — moteurs et test (Windows)

Ce document résume **comment tester les correctifs** après installation des moteurs optionnels. Le détail complet est dans **[EXTERNAL_DEPENDENCIES.md](./EXTERNAL_DEPENDENCIES.md)**.

---

## 1. Lancer la bonne cible

| Commande | Usage |
|----------|--------|
| `npm run dev` | Interface seule — Web Speech, pas d’OCR/Whisper/Hunspell natifs |
| `npm run tauri:dev` | **Application complète** — OCR, Piper, dictée Windows, correcteur |

Pour valider le rapport de test (OCR, Whisper, dictée Tauri, Piper multi-voix), utilisez **`npm run tauri:dev`**.

---

## 2. Checklist installation (PowerShell)

```powershell
# Vérifications rapides
tesseract --version
hunspell -h
piper --help
whisper-cli --help
ffmpeg -version
pdftoppm -v
```

Variables d’environnement (nouvelle session après `setx`) :

```powershell
setx PIPER_MODEL "C:\Tools\piper-voices\fr_FR-siwis-medium.onnx"
setx PIPER_MODEL_EN "C:\Tools\piper-voices\en_US-lessac-medium.onnx"
setx PIPER_MODEL_ES "C:\Tools\piper-voices\es_ES-sharvard-medium.onnx"
setx PIPER_MODEL_DE "C:\Tools\piper-voices\de_DE-thorsten-medium.onnx"
rem Optionnel — langues prioritaires bilingues (alignées sur secondaryLanguage) :
setx PIPER_MODEL_AR "C:\Tools\piper-voices\ar_JO-kareem-medium.onnx"
setx PIPER_MODEL_ZH "C:\Tools\piper-voices\zh_CN-huayan-medium.onnx"
setx PIPER_MODEL_IT "C:\Tools\piper-voices\it_IT-riccardo-medium.onnx"
setx PIPER_MODEL_PT "C:\Tools\piper-voices\pt_PT-tugão-medium.onnx"
setx PIPER_MODEL_HI "C:\Tools\piper-voices\hi_IN-pratham-medium.onnx"
setx PIPER_MODEL_UK "C:\Tools\piper-voices\uk_UA-ukrainian_tts-medium.onnx"
setx PIPER_MODEL_TR "C:\Tools\piper-voices\tr_TR-dfki-medium.onnx"
setx WHISPER_MODEL "C:\Tools\whisper\models\ggml-base.bin"
```

Voir [EXTERNAL_DEPENDENCIES.md](./EXTERNAL_DEPENDENCIES.md) pour winget, chemins et dépannage.

---

## 3. Parcours de test (rapport utilisateur)

### Onboarding
- Changer de parcours (reconnaissance) → le parcours personnalisé repart de zéro.
- **Confort** : aperçu visible en haut ; taille boutons « Grand » appliquée.

### Lire (`/lire`)
- Aperçu en haut, puis réglages.
- **Guide-ligne** : bandeau sous la ligne active.
- **Comparer** : boutons préféré / fatigue avec retour visuel ; « Enregistrer » applique les polices.
- **Voix** : sélecteur Web Speech (navigateur/Tauri) ; **Voix Piper** si `PIPER_MODEL*` définis.
- **OCR** : message clair si Tesseract absent ; guide d’installation.
- **Audio/vidéo** : bouton **Transcrire** visible (message si Whisper absent).

### Écrire (`/ecrire`)
- **Dictée** : bouton visible si activée dans le profil ; en Tauri → dictée Windows (~8 s), culture alignée sur la langue secondaire bilingue ; en navigateur → Edge/Chrome (Web Speech).
- **Prédiction** + toggle **Internet** (en-tête).

### Organiser
- **Minuteur** : bip ou son personnalisé si sons activés.

### Interface
- **Mémoriser** dans le menu si la fonction est visible.
- **Bilingue ES** : deuxième ligne en espagnol (pas d’anglais de repli) pour les clés traduites.

---

## 4. Dictée Windows (Tauri)

1. Profil → activer **Dictée vocale**.
2. `/ecrire` → **Dictée vocale** → parler quand le statut indique l’écoute (~8 s).
3. Le texte s’ajoute au champ ; relire à voix haute si « relecture » est activée.

Si échec : vérifier le micro Windows et relancer l’app après mise à jour du PATH.

---

## 5. Piper multi-voix

1. Installer Piper + au moins `PIPER_MODEL` (voir EXTERNAL_DEPENDENCIES).
2. `npm run tauri:dev` → `/lire` → activer lecture vocale.
3. Choisir **Voix Piper (hors-ligne)** dans la liste.
4. Lire un passage — le moteur expert « Piper » doit synthétiser localement.

---

## 6. Commandes projet

```powershell
npm run check    # TypeScript + Svelte
npm run smoke    # smoke tests
cd src-tauri; cargo check
npm run tauri:build   # installateur Windows
```

---

## 7. Dépannage express

| Symptôme | Action |
|----------|--------|
| OCR / Whisper « indisponible » | Tester en **Tauri**, pas `npm run dev` |
| Piper absent dans la liste | `PIPER_MODEL` + redémarrer l’app |
| Dictée sans effet | Micro + app Tauri ; ou Edge pour le navigateur |
| ES affiche de l’anglais | Clé non traduite dans `ui-es-pack.ts` — signaler la clé |

Documentation complète : **[EXTERNAL_DEPENDENCIES.md](./EXTERNAL_DEPENDENCIES.md)** · **[TEST_PLAN.md](./TEST_PLAN.md)**
