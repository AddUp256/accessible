# AI_HANDOFF — Accessible

> Fichier de reprise pour le prochain modèle IA. Lire en premier, puis `PROJECT_STATUS.md` et `TASKS.md`.

## Contexte en une phrase

Accessible est une app locale hors ligne (SvelteKit → Tauri 2) qui aide étudiants/adultes à adapter leur environnement numérique **sans poser de diagnostic**.

## Règle d'or

**Adapter l'environnement, pas nommer la personne.**  
Profils médicaux = départ optionnel. Profils fonctionnels + réglages validés = vérité UX.

## Stack validée

- **Frontend :** SvelteKit SPA, TypeScript strict, CSS variables
- **Desktop :** Tauri 2 ✅ (Windows packagé ; macOS/Linux Phase 41)
- **Storage :** SQLite Tauri + migration JSON ; localStorage en web
- **TTS :** Web Speech API + Piper TTS (Tauri, `PIPER_MODEL`)
- **OCR :** Tesseract CLI (Tauri) ; PDF scanné ✅ Phase 39
- **Correcteur :** Hunspell + Grammalecte CLI (Tauri) ; stub web
- **PDF :** jsPDF
- **npm** (pas pnpm)

## Phase actuelle

**Phase 37 terminée** — réglages expert fonctionnels, lecteur média, FALC/glossaire, notes Cornell, routines visuelles, parcours discovery à jour.  
**Phase 40 terminée** — export Anki CSV, ODT/DOCX notes/synthèse, cartes mentales.  
**Phase 42 terminée** — CAA multi-étapes, parcours `/enseignant`, moteur FALC, PDF enrichi, plugins.  
**Phase 43 terminée** — a11y masque lecture, mode très simple polish, i18n Lire.  
**Phase 44 terminée** — À propos (crédits), pictogrammes nav, nav épurée verySimple.  
**Phase 45 terminée** — Quitter app, parcours personnalisé, i18n EN fallback.  
**Phase 46 terminée** — Lecture interface à la demande (double-clic droit + zone).  
**Phase 47 terminée** — i18n Paramètres (messages, confirmations, stockage expert).  
**Phase 48 terminée** — confirmations i18n restantes, packs ES/DE dynamiques, `npm run smoke`.  
**Phase 49 terminée** — RouteFeatureGuard, i18n dictée/écriture/CAA.  
**Phase 50 terminée** — UnlockOverlay bilingue, ReadAloudButton defaults, packs ES/DE étendus.  
**Phase 51 terminée** — 9 packs langue installateur, NSIS FR/EN, voix/dictée `secondaryLanguage`, `validate:lang-packs`.  
**Prochaine :** TEST_PLAN phase 51 (installateur + bilingue) — tests manuels.

## Workflow obligatoire pour chaque session IA

1. Lire ce fichier + `PROJECT_STATUS.md` + `TASKS.md` + `ARCHITECTURE.md`
2. Cocher la **prochaine tâche non cochée** dans `TASKS.md`
3. Modifier **uniquement** les fichiers nécessaires (patchs ciblés)
4. Mettre à jour `PROJECT_STATUS.md`, `TASKS.md`, ce fichier
5. Donner une checklist de test manuel courte (3–5 points)

## Économie de crédits

- Pas de refonte globale
- Config statique > code dynamique pour presets/recommandations
- Stubs explicites pour TTS, OCR, correcteur (pas fausse implémentation)
- Composer 2.5 Fast pour UI routine ; Opus pour architecture/décisions

## Structure cible (rappel)

```
src/lib/config/     → medical-profiles, functional-needs, setting-presets, specialists, fonts-catalog
src/lib/types/      → profile.ts
src/lib/modules/    → onboarding, reading, writing, comprehension, organizer, memorization
src/lib/services/   → storage, tts, ocr, correcteur, export
src/lib/components/accessibility/  → shell expert (sons, TTS focus, dictée, toasts)
src/routes/         → accueil, onboarding, lire, ecrire, organiser, comprendre, communiquer, notes, memoriser, profil, parametres
```

## Texte d'accueil obligatoire (à intégrer en UI)

> Accessible ne pose pas de diagnostic.  
> Accessible vous aide à repérer vos besoins.  
> Accessible vous aide à tester des réglages.  
> Accessible vous aide à préparer un rendez-vous si besoin.

## Modèle de profil (extrait)

Voir `DATA_MODEL.md` pour le schéma complet. Champs clés :

- `declaredProfiles.medicalOrAdministrative[]`
- `functionalProfiles.{reading,writing,...}[]`
- `settings` (actifs)
- `rejectedSettings[]` (rejetés par l'utilisateur, jamais réactivés auto)
- `comprehension.glossary[]`, `organizer.visualRoutines[]`, `notes[]` (format Cornell)

## Modules — état réel (2026-06-02)

| Module | État |
|--------|------|
| Lire | ✅ Complet base + syllabes, masque, OCR image, lecteur média |
| Écrire | ✅ Éditeur, correcteur, prédiction, dictée |
| Organiser | ✅ Checklists, Kanban, minuteur, routines visuelles |
| Comprendre | ✅ Consignes, FALC heuristique, glossaire perso |
| Communiquer | ✅ Cartes, ARASAAC, scénarios |
| Notes | ✅ Cornell + Markdown |
| Mémoriser | ✅ Flashcards + spaced repetition |
| Réglages expert | ✅ Fonctionnels (Phase 37) |
| Cartes mentales | ✅ Phase 40 |
| Transcription auto | ✅ Phase 39 (Whisper + ffmpeg) |
| Export Anki/ODT/DOCX | ✅ Phase 40 |

## Dernière action

2026-06-02 : Phase 44 — `AboutPanel`, crédits OSS/polices, pictogrammes nav (`nav-pictograms.ts`).

## Prochaine action attendue

Définir Phase 45+ ou nouvelles priorités produit.

## Fichiers clés Phase 38

```
src/lib/i18n/ui-dynamic.ts       # messages dynamiques dyn.*
src/lib/i18n/ui-config.ts        # catalogues config cfg.*
src/lib/i18n/dynamic-message.ts  # dynamicMessage, notifyUserI18n
src/lib/i18n/config-i18n.ts      # configLabel helper
```
src/lib/services/transcription/     # Whisper service + SRT utils
src-tauri/src/transcribe.rs         # whisper-cli + ffmpeg
src-tauri/src/ocr.rs                # PDF OCR + pdftoppm fallback
EXTERNAL_DEPENDENCIES.md            # Whisper, ffmpeg, Poppler
```

## Checklist test rapide Phase 38

1. `npm run check` sans erreur
2. Bilingue EN activé → parcourir accueil + 1 module → repérer textes FR hardcodés restants
3. Mode expert → toggles moteur/sensoriel/motricité toujours fonctionnels
4. `npm run tauri:build` si changements Rust ou packaging
