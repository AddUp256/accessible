# PROJECT_STATUS — Accessible

**Dernière mise à jour :** 2026-06-02  
**Phase actuelle :** 51 — Packs installateur + voix bilingues ✅  
**Phase précédente :** 50 — Déverrouillage + ReadAloud i18n ✅  

**Prochaine tâche :** smoke tests manuels TEST_PLAN (installateur NSIS + parcours bilingue)

---

## Décisions validées

| Sujet | Décision |
|-------|----------|
| Stack | SvelteKit SPA + TypeScript strict + Tauri 2 |
| UI | CSS variables, composants maison, pas de lib lourde |
| Stockage | SQLite (Tauri) + migration JSON ; JSON localStorage en web |
| OS prioritaire | Windows 10/11 |
| Profils | Multi-profils locaux (Tauri) ✅ |
| Gestionnaire paquets | npm |
| Dossier données | `%APPDATA%/Accessible/` + mode portable `./data/` |
| TTS | Web Speech API + Piper TTS (Tauri, `PIPER_MODEL`) |
| PDF | jsPDF côté frontend |
| Moteurs externes | Tesseract, Hunspell, Grammalecte, Piper = binaires/modèles **non embarqués** ; stubs propres si absents |

---

## État des livrables

| Livrable | Statut |
|----------|--------|
| Documentation fondation (11 fichiers) | ✅ Fait |
| Squelette SvelteKit + Tauri 2 Windows | ✅ Fait |
| Config déclarative (profils, presets) | ✅ Fait |
| Storage JSON / SQLite + multi-profils | ✅ Fait |
| Accueil FALC + tableau de bord | ✅ Fait |
| Onboarding (3 entrées + discovery) | ✅ Fait |
| Module Lire (polices, comparateur, OCR image, média) | ✅ Fait |
| Module Écrire (éditeur, correcteur, prédiction, dictée) | ✅ Fait |
| Module Organiser (checklists, Kanban, minuteur, routines visuelles) | ✅ Fait |
| Module Comprendre (consignes, FALC heuristique, glossaire) | ✅ Fait |
| Module Communiquer (CAA, ARASAAC, scénarios) | ✅ Fait |
| Module Notes (Cornell + Markdown) | ✅ Fait |
| Module Mémoriser (flashcards + répétition espacée) | ✅ Fait |
| Export JSON / PDF | ✅ Fait |
| Mode pause / vie privée / chiffrement | ✅ Fait |
| Mode enseignant (base) + mode expert | ✅ Fait |
| Réglages expert **fonctionnels** (Phase 37) | ✅ Fait |
| Interface bilingue FR + EN (titres, nav, modules, panneaux) | ✅ Fait |
| i18n messages dynamiques + catalogues config | ✅ Phase 38.1–38.2 |
| Guide dépendances externes (Tesseract, Hunspell, Grammalecte, Piper) | ✅ Phase 38.5 |
| OCR PDF scanné | ✅ Phase 39 |
| Transcription locale audio/vidéo | ✅ Phase 39 (Whisper + ffmpeg) |
| Export Anki / ODT / DOCX | ✅ Phase 40 |
| Cartes mentales | ✅ Phase 40 |
| eSpeak NG TTS | ✅ Phase 41 |
| Polices embarquées (@fontsource) | ✅ Phase 41 |
| Builds macOS / Linux | ✅ Phase 41 (BUILD.md) |
| Mode portable `./data/` + SQLite | ✅ Phase 41 |
| CAA avancée, FLE complet, plugins | ✅ Phase 42 |
| Crédits polices / OSS (À propos) | ✅ Phase 44 |
| Quitter app + parcours personnalisé | ✅ Phase 45 |
| Lecture interface double-clic droit + zone | ✅ Phase 46 |
| i18n Paramètres (statuts + confirmations) | ✅ Phase 47 |
| Confirmations i18n + smoke script | ✅ Phase 48 |
| FeatureGuard routes + i18n dictée/CAA | ✅ Phase 49 |
| Unlock overlay + ReadAloud bilingue | ✅ Phase 50 |
| Packs langue NSIS (9 langues) + voix/dictée bilingues | ✅ Phase 51 |

---

## Maturité par version (résumé)

| Version | État |
|-------|------|
| **V1 MVP** | ✅ Livré (core onboarding, lecture, export, Tauri Windows) |
| **V1.1** | ✅ Fait — SQLite ✅, i18n ✅, polices embarquées ✅, comparateur avancé ✅, « Expliquer autrement » ✅ |
| **V2** | ✅ Livré |
| **V3** | ✅ Livré — Phase 42 |

---

## Commandes utiles

```powershell
cd c:\Users\addup\Accessible
npm install
npm run dev          # Web (navigateur)
npm run check
npm run smoke       # check + build + validation artefacts
npm run build
npm run tauri:dev    # App desktop (dev)
npm run tauri:build  # Installateurs MSI + NSIS
```

Installateurs produits dans `src-tauri\target\release\bundle\`.

---

## Points d'attention

1. **Ne jamais poser de diagnostic** — voir `ACCESSIBILITY_PRINCIPLES.md`.
2. **Profils médicaux ≠ profils fonctionnels** — presets rejetables (`rejectedSettings`).
3. **Stubs explicites** — OCR/TTS/correcteur en web ou sans binaires : message clair, pas de fausse promesse.
4. **FALC / syllabes / simplification** — heuristiques FR ; pas un moteur linguistique professionnel (Phase 42).
5. **Polices** — embarquées via @fontsource (Phase 41) ; voir `LICENSES_AND_FONTS.md`.
6. **Crédits IA** — une tâche atomique à la fois ; lire `AI_HANDOFF.md` avant chaque session.

---

## Fichiers clés (Phase 37+)

```
src/lib/components/accessibility/   # AccessibilityShell, InterfaceTTS, GlobalDictation, AppToast
src/lib/components/reading/         # ReadingPane, MediaReaderPanel
src/lib/modules/reading/            # syllabify-fr, silent-letters-fr, text-decoration
src/lib/modules/comprehension/      # falc-simplify, glossary
src/lib/modules/organizer/          # visual-routine
src/lib/i18n/                       # ui-modules, ui-extended, ui-panels
src/routes/onboarding/discovery/    # parcours découverte à jour
```
