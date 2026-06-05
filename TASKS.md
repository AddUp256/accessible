# TASKS — Accessible

Tâches atomiques, ordonnées par priorité. Cocher `[x]` quand terminé.

---

## Phase 0 — Documentation ✅

- [x] README.md
- [x] PROJECT_STATUS.md
- [x] AI_HANDOFF.md
- [x] TASKS.md
- [x] ARCHITECTURE.md
- [x] ACCESSIBILITY_PRINCIPLES.md
- [x] DATA_MODEL.md
- [x] ROADMAP.md
- [x] PRIVACY.md
- [x] TEST_PLAN.md
- [x] LICENSES_AND_FONTS.md

---

## Phase 1 — Squelette ✅

- [x] **1.1** Initialiser SvelteKit (skeleton, TS, SPA) — `npm create svelte@latest`
- [x] **1.2** Créer `src/app.css` avec tokens CSS (thèmes clair/crème/contraste/sombre)
- [x] **1.3** Créer `+layout.svelte` FALC (nav, mode pause stub, skip link)
- [x] **1.4** Créer `+page.svelte` accueil avec texte obligatoire
- [x] **1.5** Vérifier `npm run dev` fonctionne

**Test :** App démarre, accueil visible, thème crème par défaut, focus clavier OK.

---

## Phase 2 — Types et config ✅

- [x] **2.1** `src/lib/types/profile.ts` — types complets
- [x] **2.2** `src/lib/config/medical-profiles.ts` — liste déclarative
- [x] **2.3** `src/lib/config/functional-needs.ts`
- [x] **2.4** `src/lib/config/setting-presets.ts` — medical → réglages de départ
- [x] **2.5** `src/lib/config/specialists.ts` — recommandations prudentes
- [x] **2.6** `src/lib/config/accommodations.ts`
- [x] **2.7** `src/lib/config/fonts-catalog.ts` — métadonnées polices

**Test :** Import config sans erreur TS ; listes médicales complètes.

---

## Phase 3 — Storage ✅

- [x] **3.1** `src/lib/services/storage/local.ts` — load/save JSON
- [x] **3.2** Profil par défaut factory
- [x] **3.3** Store Svelte `profile` + `settings`
- [x] **3.4** Persistance auto au changement

**Test :** Recharger page → réglages conservés (localStorage MVP, puis FS Tauri).

---

## Phase 4 — Onboarding ✅

- [x] **4.1** Route `/onboarding` — choix 3 entrées
- [x] **4.2** Parcours « Je connais déjà mes besoins » — sélection outils
- [x] **4.3** Parcours « J'ai déjà une reconnaissance » — multi-select profils médicaux + disclaimer
- [x] **4.4** Parcours « Je ne sais pas » — stub étapes (progression)
- [x] **4.5** Étape confort interface (taille boutons, thème, animations)
- [x] **4.6** Appliquer presets médicaux avec validation utilisateur
- [x] **4.7** Enregistrer `rejectedSettings` si rejet

**Test :** 3 parcours navigables ; profils médicaux sauvegardés ; disclaimer visible.

---

## Phase 5 — Lecture ✅

- [x] **5.1** Route `/lire` — zone texte collé/importé
- [x] **5.2** Composant `FontComparator` — même texte, variantes
- [x] **5.3** Panneau réglages lecture (police, taille, interligne, fond, guide-ligne)
- [x] **5.4** Enregistrer préférences dans profil fonctionnel
- [x] **5.5** Mode lecture sans distraction (stub)

**Test :** Coller texte, changer police/taille, préférence sauvegardée.

---

## Phase 6 — TTS ✅

- [x] **6.1** `src/lib/services/tts/index.ts` — Web Speech API
- [x] **6.2** Stub propre si API indisponible
- [x] **6.3** Bouton « Lire à voix haute » sur accueil et module Lire
- [x] **6.4** Réglages vitesse (basique)

**Test :** Lecture d'un paragraphe si voix système dispo ; message clair sinon.

---

## Phase 7 — Navigation et tableau de bord ✅

- [x] **7.1** Routes : Lire, Écrire, Organiser, Comprendre, Communiquer, Profil, Paramètres
- [x] **7.2** Tableau de bord — gros boutons actions rapides
- [x] **7.3** Pages stub pour modules non implémentés (message « bientôt »)

**Test :** Navigation clavier complète ; 6 zones accessibles.

---

## Phase 8 — Export ✅

- [x] **8.1** Export JSON profil (téléchargement)
- [x] **8.2** Export PDF synthèse simple (jsPDF)
- [x] **8.3** Mention légale obligatoire dans PDF
- [x] **8.4** Option masquer profils médicaux dans export

**Test :** JSON valide ; PDF contient disclaimer et réglages utiles.

---

## Phase 9 — Vie privée et mode pause ✅

- [x] **9.1** Bouton « Supprimer toutes les données »
- [x] **9.2** Mode invité (pas de persistance)
- [x] **9.3** Mode pause / crise — overlay minimal
- [x] **9.4** Export/import manuel profil

**Test :** Suppression efface données ; mode pause réduit interface.

---

## Phase 10 — Tauri ✅

- [x] **10.1** `tauri init` + config Windows
- [x] **10.2** Persistance FS via `%APPDATA%/Accessible/`
- [x] **10.3** Mode portable `./data/`
- [x] **10.4** Build `.exe`

**Test :** App installable démarre hors ligne ; profil persiste après fermeture.

---

## Phases 11–36 — V2 core & i18n ✅

## Phase 11 — OCR (fondation) ✅

- [x] **11.1** `src/lib/services/ocr/` — interface + stub explicite
- [x] **11.2** Composant `OcrImportPanel` — import image/PDF
- [x] **11.3** Intégration `/lire` — aperçu image + pipeline vers zone texte

**Test :** Importer une image → aperçu visible ; message clair si OCR indisponible ; PDF refusé proprement.

---

## Phase 12 — Correcteur (fondation) ✅

- [x] **12.1** `src/lib/services/correcteur/` — interface + stub explicite
- [x] **12.2** Module `/ecrire` — éditeur, réglages, relecture TTS
- [x] **12.3** `CorrecteurPanel` — phrases longues + stub Grammalecte/Hunspell
- [x] **12.4** Dashboard — actions Écrire / Corriger activées

**Test :** Écrire un texte ; repérage phrases longues ; message clair si correction auto indisponible.

---

## Phase 13 — OCR Tesseract (Tauri) ✅

- [x] **13.1** Commandes Rust `is_tesseract_available` + `ocr_extract_text`
- [x] **13.2** Pont Tauri frontend (`ocr/tauri.ts`) + `TauriOcrService`
- [x] **13.3** UI `/lire` — détection Tesseract + extraction vers zone texte

**Test :** Avec Tesseract+fra installés : image → texte extrait. Sans Tesseract : message d'installation clair.

---

## Phase 14 — Hunspell (Tauri) ✅

- [x] **14.1** Commandes Rust `is_hunspell_available` + `spellcheck_text`
- [x] **14.2** Pont Tauri frontend + `TauriCorrecteurService`
- [x] **14.3** UI `/ecrire` — liste erreurs, suggestions, mode étape par étape

**Test :** Avec Hunspell+fr_FR : fautes détectées + suggestion. Sans Hunspell : message d'installation clair.

---

## Phase 15 — Prédiction de mots ✅

- [x] **15.1** `word-prediction-fr.ts` — liste locale + bigrammes FR
- [x] **15.2** `word-prediction.ts` — complétion + mot suivant
- [x] **15.3** `WordPredictionBar` + réglage profil + intégration éditeur

**Test :** Activer prédiction → taper « je » → suggestions ; « je suis » + espace → mots suivants.

---

## Phase 16 — Organiser (checklists) ✅

- [x] **16.1** Types `organizer` + migration profil
- [x] **16.2** Module checklist + modèles FALC
- [x] **16.3** Route `/organiser` — CRUD listes, cocher étapes, persistance

**Test :** Créer liste (modèle ou vide) → cocher étapes → recharger → données conservées.

---

## Phase 17 — Comprendre (consignes) ✅

- [x] **17.1** `instruction-breakdown.ts` — découpage lignes/phrases + date repérée
- [x] **17.2** `InstructionAnalyzer` — FALC, phrases longues, TTS
- [x] **17.3** Route `/comprendre` + export checklist vers Organiser

**Test :** Coller consigne → étapes visibles ; créer checklist → visible dans Organiser.

---

## Phase 18 — Communiquer (CAA) ✅

- [x] **18.1** `communication-cards.ts` — cartes intégrées + scénarios
- [x] **18.2** Cartes personnelles persistantes (`communicator` profil)
- [x] **18.3** Route `/communiquer` — affichage, TTS, copier texte

**Test :** Choisir carte → message grand format ; ajouter carte perso ; TTS + copier.

---

## Phase 19 — Minuteur Organiser ✅

- [x] **19.1** `timer-presets.ts` — pauses et focus (5–25 min)
- [x] **19.2** Composant `FocusTimer` — démarrer, pause, reset
- [x] **19.3** Intégration `/organiser`

**Test :** Choisir 5 min → démarrer → compte à rebours ; fin → message clair ; pause/reprendre OK.

---

## Phase 20 — Kanban Organiser ✅

- [x] **20.1** Types `kanbanTasks` + migration profil
- [x] **20.2** `KanbanBoard` — 3 colonnes, déplacer, supprimer
- [x] **20.3** Onglets Kanban / Checklists sur `/organiser`

**Test :** Ajouter tâche → déplacer En cours → Terminé → recharger → persistance OK.

---

## Phase 21 — Notes ✅

- [x] **21.1** Types `notes` + migration profil
- [x] **21.2** Route `/notes` — créer, modifier, supprimer
- [x] **21.3** Export Markdown par note + action tableau de bord

**Test :** Créer note → modifier → export .md → recharger → note conservée.

---

## Phase 22 — Flashcards ✅

- [x] **22.1** Types `memorization.decks` + migration profil
- [x] **22.2** Route `/memoriser` — decks, cartes, modèles
- [x] **22.3** `FlashcardStudy` — session mélange, recto/verso

**Test :** Créer deck → ajouter cartes → réviser → session terminée → persistance OK.

---

## Phase 23 — Pictogrammes ARASAAC ✅

- [x] **23.1** Config + service recherche API ARASAAC (en ligne)
- [x] **23.2** `ArasaacPanel` — bibliothèque locale, création carte
- [x] **23.3** Affichage picto sur cartes personnelles + disclaimer licence NC

**Test :** Chercher « pause » → ajouter bibliothèque → créer carte → picto visible → persistance OK.

---

## Phase 24 — Répétition espacée ✅

- [x] **24.1** Types `FlashcardSchedule` + algorithme local simplifié
- [x] **24.2** `FlashcardStudy` — cartes du jour, évaluation Difficile / Correct / Facile
- [x] **24.3** Persistance planning + affichage prochaine révision

**Test :** Réviser → noter une carte → recharger → « Demain » ou « Dans N jours » visible.

---

## Phase 25 — Grammalecte ✅

- [x] **25.1** Module Rust `grammar.rs` — CLI Grammalecte, JSON
- [x] **25.2** Service `analyzeGrammar` + réglage `writing.grammarCheck`
- [x] **25.3** `CorrecteurPanel` — section grammaire séparée

**Test :** Activer grammaire → analyser texte avec faute → suggestion affichée (Tauri + Grammalecte).

---

## Phase 26 — SQLite foundation ✅

- [x] **26.1** `tauri-plugin-sql` + migrations (profile, storage_meta)
- [x] **26.2** Service `sqlite.ts` — load/save, migration JSON → SQLite
- [x] **26.3** Paramètres — affichage backend SQLite + sauvegarde JSON

**Test :** Tauri avec profil JSON → relancer → « SQLite » + données conservées.

---

## Phase 27 — Tables normalisées ✅

- [x] **27.1** Migration v2 — `notes`, `flashcard_decks`, `flashcard_cards`
- [x] **27.2** `syncNormalizedModules` — sync à chaque sauvegarde profil
- [x] **27.3** Backfill au démarrage + compteurs dans Paramètres

**Test :** Créer note + deck → Paramètres affiche compteurs → recharger → compteurs OK.

---

## Phase 28 — Tables organizer / communicator ✅

- [x] **28.1** Migration v3 — checklists, kanban, cartes CAA, pictogrammes
- [x] **28.2** Sync étendu dans `syncNormalizedModules`
- [x] **28.3** Backfill + compteurs Paramètres mis à jour

**Test :** Checklist + carte CAA → compteurs SQLite OK après rechargement.

---

## Phase 29 — Multi-profils ✅

- [x] **29.1** Migration v4 — table `user_profiles`, `active_profile_id`
- [x] **29.2** API create/switch/delete profils SQLite
- [x] **29.3** `ProfileSwitcher` sur `/parametres`

**Test :** Créer 2 profils → réglages distincts → bascule → persistance OK.

---

## Phase 30 — Mode enseignant ✅

- [x] **30.1** Config `app-modes.ts` + presets UI par mode
- [x] **30.2** `AppModePanel` + bannière layout + `TeacherHomePanel`
- [x] **30.3** Actions enseignant (export, import, profil)

**Test :** Mode enseignant → bannière + espace accueil → export PDF → persistance OK.

---

## Phase 31 — TTS Piper ✅

- [x] **31.1** Module Rust `piper.rs` — CLI Piper, `PIPER_MODEL`, synthèse WAV
- [x] **31.2** Service `TauriTTSService` — Piper + fallback Web Speech
- [x] **31.3** Réglage `reading.ttsEngine` + sélecteur dans `ReadingControls`

**Test :** Tauri sans Piper → Web Speech OK ; avec `PIPER_MODEL` → lecture locale ; moteur « Piper » affiche erreur explicite si absent.

---

## Phase 32 — Mode expert ✅

- [x] **32.1** Mode `expert` dans `AppMode` + `applyAppMode` (`detailLevel: expert`)
- [x] **32.2** `ExpertSettingsPanel` — typographie, moteur, motricité, communication
- [x] **32.3** Stockage détaillé + moteur TTS Piper réservés au mode expert

**Test :** Activer mode expert → bannière + réglages avancés visibles ; repasser en étudiant → panneau verrouillé + chemins masqués.

---

## Phase 33 — Chiffrement profil ✅

- [x] **33.1** Service chiffrement AES-GCM + PBKDF2 (Web Crypto)
- [x] **33.2** `UnlockOverlay` au démarrage + `EncryptionPanel` dans Paramètres
- [x] **33.3** Persistance chiffrée (profil JSON / SQLite blob)

**Test :** Activer chiffrement → redémarrer → mot de passe requis ; mauvais mot de passe → erreur ; désactiver → profil en clair.

---

## Phase 34 — Interface bilingue (app entière) ✅

- [x] **34.1** Catalogue i18n étendu (`ui-extended.ts`, ~90 clés FR + EN)
- [x] **34.2** Composants `BiText`, `BiHeading` + helper `bilingualDashboardAction`
- [x] **34.3** Câblage pages modules, accueil, onboarding, layout (nav, bannières, footer)
- [x] **34.4** Mode pause, déverrouillage chiffrement, page erreur

**Test :** Paramètres → activer bilingue (ex. arabe) → titres accueil + chaque module + actions rapides affichent FR + langue secondaire.

---

## Phase 35 — Interface bilingue (panneaux internes) ✅

- [x] **35.1** Catalogue `ui-panels.ts` (~110 clés FR + EN)
- [x] **35.2** Helper `bilingualLabel()` pour selects et boutons
- [x] **35.3** Panneaux Paramètres : AppMode, Expert, Encryption, Language, Theme, Export, Storage, Privacy, ProfileSwitcher
- [x] **35.4** ComfortPanel onboarding + page Profil

**Test :** Bilingue EN → Paramètres : modes d'utilisation, réglages expert, chiffrement, thème, export affichent FR + EN.

---

## Phase 36 — Interface bilingue (modules) ✅

- [x] **36.1** Catalogue `ui-modules.ts` (~130 clés FR + EN)
- [x] **36.2** Lire : ReadingControls, OcrImportPanel, FontComparator
- [x] **36.3** Écrire : WritingControls, CorrecteurPanel, WritingEditor
- [x] **36.4** Communiquer : PersonalCardsPanel, ArasaacPanel
- [x] **36.5** Comprendre, Organiser, Mémoriser : InstructionAnalyzer, FocusTimer, KanbanBoard, ChecklistCard, FlashcardStudy, pages routes

**Test :** Bilingue EN → Lire (réglages), Écrire (correction), Organiser (Kanban/minuteur), Communiquer (cartes perso) affichent FR + EN.

---

## Phase 37 — Réglages expert fonctionnels & modules enrichis ✅

- [x] **37.1** `AccessibilityShell` — sons UI, confirmation actions, clic unique, maintien 450 ms (temps de clic augmenté)
- [x] **37.2** `InterfaceTTS` — lecture vocale au focus ; `GlobalDictation` — dictée sur champs actifs
- [x] **37.3** `AppToast` + service notifications — retours visuels/sonores accessibles
- [x] **37.4** Lecture — syllabes FR, lettres muettes, masque de lecture, surlignages, navigation flèches
- [x] **37.5** Écriture — relecture auto TTS + dictée dans l'éditeur
- [x] **37.6** `MediaReaderPanel` — lecteur audio/vidéo, vitesse, transcription manuelle + TTS
- [x] **37.7** Comprendre — `falc-simplify.ts`, glossaire personnel, `PersonalGlossaryPanel`, `InstructionAnalyzer` enrichi
- [x] **37.8** Notes Cornell — types `NoteFormat`, UI `/notes`, export Markdown
- [x] **37.9** Routines visuelles — `visual-routine.ts`, `VisualRoutinesPanel`, onglet Organiser
- [x] **37.10** Parcours discovery — étapes implémentées, textes à jour, panneaux intégrés
- [x] **37.11** Réglages expert — toggles actifs (retrait gating « Bientôt »), taille boutons via `motor.largeButtons`
- [x] **37.12** UI accueil — style « Lire un texte » aligné sur les autres actions rapides

**Test :** Activer mode expert → sons, TTS focus, dictée, maintien clic OK ; `/lire` onglet média ; glossaire + FALC ; notes Cornell ; routines visuelles ; discovery sans message « prochainement » obsolète.

---

## Phase 38 — Consolidation qualité & release readiness ✅

Objectif : aligner doc, i18n et dette technique avant nouveaux moteurs lourds.

- [x] **38.1** i18n — messages dynamiques (toasts, Kanban, formulaires, statuts OCR/TTS/correcteur)
- [x] **38.2** i18n — catalogues config (presets, outils onboarding, cartes CAA, colonnes Kanban, scénarios)
- [x] **38.3** Nettoyage legacy — `MODULE_STUBS`, clés i18n obsolètes (`mod.understand.note`), `ModuleStub.svelte` si inutilisé
- [x] **38.4** Exécuter `TEST_PLAN.md` intégralement ; cocher critères release V1 dans `ROADMAP.md`
- [x] **38.5** Documenter dépendances externes (Tesseract, Hunspell, Grammalecte, Piper) dans README ou guide install

**Test :** Bilingue EN → aucun message FR hardcodé sur parcours principal ; TEST_PLAN sans bloquant ; build Tauri OK.

---

## Phase 39 — Moteurs médias & OCR ✅

- [x] **39.1** OCR PDF scanné — pipeline Tauri (Tesseract direct + fallback pdftoppm)
- [x] **39.2** Transcription locale audio/vidéo (whisper.cpp + `WHISPER_MODEL`)
- [x] **39.3** Sous-titres synchronisés sur `MediaReaderPanel`
- [x] **39.4** Export sous-titres / transcription (TXT, SRT)

**Test :** PDF scanné → texte dans zone lecture ; fichier audio → transcription locale ; lecture avec sous-titres.

---

## Phase 40 — Exports & modules manquants ✅

- [x] **40.1** Export Anki (decks flashcards) — CSV importable Anki
- [x] **40.2** Export ODT / DOCX (notes, synthèse)
- [x] **40.3** Module cartes mentales (besoin fonctionnel `besoin_cartes_mentales`)
- [x] **40.4** Bouton « Expliquer autrement » (FALC alternatif, ≥ 1 écran)
- [x] **40.5** Comparateur polices avancé (caractères confus, tableaux — V1.1)

**Test :** Deck → CSV Anki ; note → ODT ; carte mentale créable et exportable.

---

## Phase 41 — Plateforme & TTS ✅

- [x] **41.1** TTS eSpeak NG (alternative Piper, Tauri)
- [x] **41.2** Polices redistribuables embarquées (bundle @fontsource, hors Google Fonts)
- [x] **41.3** Builds macOS + Linux (cibles Tauri + BUILD.md)
- [x] **41.4** Version portable officielle (SQLite `./data/` + PORTABLE.md)

**Test :** eSpeak sélectionnable ; app sans réseau avec polices embarquées ; builds documentés par OS.

---

## Phase 42 — V3 avancé ✅

- [x] **42.1** CAA avancée — scénarios sociaux multi-étapes, routines CAA importables
- [x] **42.2** Mode enseignant / accompagnant — parcours guidé `/enseignant`
- [x] **42.3** FLE / glossaire étendu — moteur FALC unifié + lexique FLE
- [x] **42.4** Accessibilité motrice avancée — navigation clavier + mode balayage
- [x] **42.5** Export PDF enrichi (glossaire, CAA, notes, routines, FLE)
- [x] **42.6** Plugins / extensions — registre + plugin démo

**Test :** Scénario CAA multi-étapes ; parcours enseignant guidé ; export PDF sections enrichies.

---

## Phase 43 — Consolidation finale V1.1 ✅

- [x] **43.1** A11y masque de lecture — `ReadingPane` sans warning tabindex (focus programmatique)
- [x] **43.2** Mode « interface très simple » — actions réduites, onglets Lire simplifiés, réglages essentiels
- [x] **43.3** i18n page Lire — textes restants (aperçu, exemple, distraction)
- [x] **43.4** Sync docs ROADMAP / TEST_PLAN (KNOWN-2, V1.1)

**Test :** Mode très simple → 5 actions accueil, Lire sans comparateur/OCR ; masque lecture sans warning `npm run check`.

---

## Phase 44 — Crédits & pictogrammes navigation ✅

- [x] **44.1** Panneau « À propos » — polices embarquées, bibliothèques OSS, version, disclaimer
- [x] **44.2** Config `open-source-credits.ts` + section `#about` dans Paramètres
- [x] **44.3** Pictogrammes navigation — `showPictograms` ou mode très simple (nav + zones accueil)
- [x] **44.4** Nav épurée en mode très simple (sans lien Profil)

**Test :** Paramètres → À propos liste polices ; mode très simple → pictogrammes visibles ; `#about` accessible.

---

## Phase 45 — Quitter, parcours personnalisé, i18n étendu ✅

- [x] **45.1** Bouton **Quitter** + fermeture fenêtre (Tauri) avec sauvegarde profil
- [x] **45.2** Parcours personnalisé — nav/accueil/routes filtrés selon outils + besoins fonctionnels
- [x] **45.3** Panneau **Mon parcours personnalisé** (Paramètres `#personalization`)
- [x] **45.4** i18n — fusion EN pour langues secondaires (couverture application)

**Test :** Onboarding outils limités → nav réduite ; Quitter (Tauri) ferme l'app ; bilingue sur menus + modules.

---

## Phase 46 — Lecture interface à la demande ✅

- [x] **46.1** `InterfaceTTS` — double-clic droit lit l'élément ; glisser clic droit lit la zone (sans lecture auto au focus)
- [x] **46.2** Module `interface-tts-read.ts` — extraction texte élément / rectangle
- [x] **46.3** Indication d'usage dans Confort + Réglages expert
- [x] **46.4** Onglets Lire Comparer / Média filtrés selon parcours personnalisé
- [x] **46.5** `BiHeading` niveau 4 (comparateur avancé)

**Test :** Cocher lecture interface → navigation normale ; double-clic droit sur bouton → TTS ; sélection zone → lecture zone ; profil « écoute audio » seul → onglet Média sans Comparer.

---

## Phase 47 — i18n Paramètres ✅

- [x] **47.1** Messages statut Paramètres (`dyn.settings.*`) — save, export, import, suppression, portable
- [x] **47.2** Confirmations dialogues Paramètres (suppression, import profil)
- [x] **47.3** Stockage expert — chemins SQLite/JSON + compteurs tables i18n
- [x] **47.4** Import profil — codes d'erreur typés + messages bilingues

**Test :** Bilingue EN → messages Paramètres en FR / EN ; import JSON invalide → message traduit.

---

## Phase 48 — i18n confirmations + smoke CI ✅

- [x] **48.1** Confirmations i18n — checklist, deck flashcards, reset carte CAA
- [x] **48.2** Packs dynamiques ES/DE (`ui-dynamic-locales.ts`) — Paramètres + confirmations
- [x] **48.3** `dynamicMessage` — langue secondaire ES/DE/IT/PT (fallback EN)
- [x] **48.4** Script `npm run smoke` — check + build + validation artefacts

**Test :** Bilingue ES → suppression deck affiche FR / ES ; `npm run smoke` passe.

---

## Phase 49 — FeatureGuard routes + i18n dictée/CAA ✅

- [x] **49.1** `RouteFeatureGuard` — message explicite au lieu de redirect Paramètres
- [x] **49.2** i18n `WritingEditor` — dictée, compteur mots, relire
- [x] **49.3** i18n `GlobalDictation` + `CommunicationCardDisplay`
- [x] **49.4** Clés `mod.dictation.*`, `mod.comm.copyText`, `dyn.dictation.stopped`

**Test :** URL directe `/memoriser` masquée → écran « zone non activée » ; dictée bilingue ES.

---

## Phase 50 — Déverrouillage + ReadAloud i18n ✅

- [x] **50.1** `UnlockOverlay` — textes bilingues + erreurs chiffrement traduites
- [x] **50.2** `ReadAloudButton` — libellés par défaut bilingues (`common.readAloud` / `stopReading`)
- [x] **50.3** Packs ES/DE — dictation, copie, déverrouillage
- [x] **50.4** Média — « Lire la transcription » i18n

**Test :** Profil chiffré → overlay bilingue ; accueil → Lire à voix haute FR/EN.

---

## Phase 51 — Packs langue installateur + voix bilingues ✅

- [x] **51.1** 9 langues prioritaires — packs complets (632 clés UI + 157 dyn.) + CAA 14/14
- [x] **51.2** NSIS — pages mode complet / packs seuls + sélection langues ; libellés FR/EN (`LangString`)
- [x] **51.3** `voice-alignment.ts` — Web Speech, dictée Windows, Piper selon `secondaryLanguage`
- [x] **51.4** `npm run validate:lang-packs` + intégration `npm run smoke`
- [x] **51.5** Relire auto écriture (`WritingEditor`) alignée sur locale bilingue
- [x] **51.6** `Accessible-Setup.ps1` — mode packs : fusion sans supprimer l'existant ; refresh liste dans Paramètres
- [x] **51.7** Tauri `lang_packs.rs` — seed depuis bundle si dossier absent (sans écraser choix installateur) ; refresh au focus fenêtre
- [x] **51.8** Hunspell aligné sur langue secondaire (en/es/de/it/pt) ; NSIS `displayLanguageSelector` activé

**Test :** Installateur NSIS (2 langues → ajout pack) ; `npm run tauri:dev` bilingue ES → dictée + TTS ; `npm run smoke`.

---

## Backlog restant — au 2026-06-02

| Domaine | Statut |
|---------|--------|
| OCR image (Tesseract Tauri) | ✅ |
| OCR PDF scanné | ✅ Phase 39 |
| Correcteur Hunspell + Grammalecte | ✅ (binaires externes) |
| Écriture, prédiction, dictée | ✅ |
| FALC / glossaire | ✅ heuristique — Phase 42 pour moteur complet |
| Organiser (checklists, Kanban, minuteur, routines visuelles) | ✅ |
| Notes Cornell | ✅ |
| Flashcards + spaced repetition | ✅ |
| ARASAAC | ✅ |
| Lecteur média | ✅ transcription auto + sous-titres (Phase 39) |
| Réglages expert fonctionnels | ✅ Phase 37 |
| Multi-profils, chiffrement, mode enseignant base | ✅ |
| Piper TTS | ✅ (modèle externe) |
| Export Anki CSV, ODT/DOCX, cartes mentales | ✅ Phase 40 |
| eSpeak NG, polices embarquées, macOS/Linux, portable | ✅ Phase 41 |
| Packs langue installateur + voix bilingues | ✅ Phase 51 |
| Tests manuels TEST_PLAN (smoke distribution) | ⏳ ~40 % cases manuelles |
| Traductions natives 70+ langues (hors FR/EN) | ⏳ ES/DE dynamiques partiels (48) ; reste fallback EN |
| Script smoke automatisé | ✅ `npm run smoke` |
| i18n Paramètres (messages save, confirmations) | ✅ Phase 47 |
| FeatureGuard par route (vs redirect layout) | ✅ Phase 49 |
| FALC moteur linguistique professionnel | ⏳ heuristique |
| OCR / correcteur / Piper sans binaires externes | ⏳ stubs propres (by design) |
