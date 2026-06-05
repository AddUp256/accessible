# TEST_PLAN — Accessible

Tests manuels par phase. Cocher après exécution.  
**Environnement cible MVP :** Windows 10/11, Chrome/Edge ou app Tauri.

**Légende session 38.4 (2026-06-02) :** `[x]` = validé par build automatisé et/ou revue code ; cases restantes = smoke test manuel recommandé avant distribution.

---

## Phase 0 — Documentation

- [x] 11 fichiers MD présents et cohérents
- [x] TASKS.md liste les prochaines étapes

---

## Phase 1 — Squelette

### Démarrage
- [x] `npm install` sans erreur
- [ ] `npm run dev` démarre sur localhost
- [ ] Page accueil s'affiche

### Accueil FALC
- [x] Texte obligatoire visible (4 lignes « Accessible ne pose pas… »)
- [x] Premier lancement : message explicatif affiché, lisible, avec « Commencer le parcours » et « Ne plus afficher » (validé navigateur 2026-06-05)
- [x] « Ne plus afficher » persiste après rechargement ; réaffichage possible depuis Paramètres → À propos
- [x] Profil vierge : les zones métier sont masquées, l'accueil propose la personnalisation du parcours (validé navigateur 2026-06-05)
- [x] Langue française (par défaut)
- [x] Un seul titre principal (`h1` — logo « Accessible » dans l'en-tête)

### Accessibilité base
- [ ] Tab atteint tous les boutons/liens
- [ ] Focus visible sur chaque élément
- [x] Skip link « Aller au contenu » fonctionne (si présent)
- [x] Onglets Lire et Organiser : flèches, Home/End, `aria-controls` et `tabpanel` validés navigateur (2026-06-04)

### Thème
- [x] Thème crème par défaut
- [ ] Texte lisible, contraste suffisant

---

## Phase 2 — Types et config

- [x] `npm run check` (ou `tsc`) sans erreur
- [x] Liste profils médicaux complète (20 entrées)
- [x] Liste besoins fonctionnels complète (30 entrées)

---

## Phase 3 — Storage

- [ ] Premier lancement : profil par défaut créé
- [x] Migration profil ancien : champ `firstLaunchIntroDismissed` ajouté sans casser les profils existants
- [ ] Modifier un réglage → recharger page → réglage conservé
- [ ] Mode invité : recharger → pas de persistance

---

## Phase 4 — Onboarding

### Parcours 1 — « Je connais déjà mes besoins »
- [x] Sélection outils possible (multi)
- [x] Bouton « Continuer » réellement désactivé sans sélection ; « Passer cette étape » avance vers le confort
- [ ] Retour accueil sans blocage

### Parcours 2 — « J'ai déjà une reconnaissance »
- [ ] Multi-select profils médicaux
- [ ] Disclaimer visible (3 lignes)
- [ ] Profils sauvegardés dans profil
- [x] « Je ne sais pas » sauvegarde un choix vide et avance vers le confort

### Parcours 3 — « Je ne sais pas »
- [x] Progression visible
- [x] « Passer cette étape » fonctionne et ne compte pas aussi l'étape comme complétée
- [x] « Je ne sais pas » enregistre sans erreur

### Presets médicaux
- [ ] Réglages proposés, pas imposés
- [ ] Rejet → entrée dans `rejectedSettings`
- [ ] Rejet non réactivé au rechargement

---

## Phase 5 — Lecture

- [ ] Coller un texte → affichage correct
- [ ] Changer police → effet immédiat
- [ ] Changer taille / interligne / fond
- [ ] Guide-ligne activable
- [ ] Préférence enregistrée dans profil

### Comparateur
- [x] Même texte en ≥ 4 variantes (12 variantes dans `FONT_COMPARE_VARIANTS`)
- [ ] Question « plus confortable » enregistrée
- [ ] Question « fatigue le plus » enregistrée

---

## Phase 6 — TTS

- [x] Bouton « Lire à voix haute » présent
- [ ] Si voix système : lecture audible
- [ ] Si pas de voix : message clair, pas d'erreur console bloquante
- [ ] Bouton arrêter fonctionne

---

## Phase 7 — Navigation

- [x] Après personnalisation ou mode expert/accompagnant : zones utiles accessibles selon le parcours, Profil/Paramètres restent accessibles
- [x] Toutes les zones navigables sans crash (modules implémentés ; stubs retirés en 38.3)
- [x] Accès direct à une zone non active : garde-route avec bouton vers le parcours ou les paramètres
- [ ] Navigation clavier complète
- [x] Onglets internes Lire / Organiser navigables au clavier avec un seul onglet actif dans la tabulation
- [x] Gros boutons tableau de bord (cible ≥ 44 px — `--btn-min-height: 2.75rem`)

---

## Phase 8 — Export

### JSON
- [x] Téléchargement fichier `.json` (implémenté)
- [x] Fichier parseable, contient `profileVersion`
- [x] Import restaure profil (Paramètres → import JSON)

### PDF
- [x] Titre : « Synthèse de besoins fonctionnels — document préparatoire »
- [x] Mention : « Ce document ne constitue pas un diagnostic. »
- [x] Réglages utiles listés
- [x] Profils médicaux absents si `visibleInExports: false`
- [x] Profils médicaux présents si opt-in
- [ ] Aucune formulation diagnostique dans le PDF (revue manuelle du rendu recommandée)

---

## Phase 9 — Vie privée et crise

- [x] « Supprimer toutes les données » → confirmation → profil reset (implémenté)
- [x] Mode invité activable
- [x] Mode pause : interface réduite, animations off (implémenté)
- [ ] Reprendre depuis mode pause

---

## Phase 10 — Tauri

- [ ] `npm run tauri dev` démarre
- [ ] Fenêtre native, pas de barre navigateur
- [ ] Fermer / rouvrir → profil persiste (`%APPDATA%/Accessible/`)
- [x] Bouton « Quitter » : sauvegarde le profil puis demande une fermeture Tauri propre (build validé 2026-06-05)
- [x] Croix de fenêtre : intercepte la fermeture, sauvegarde le profil puis demande une fermeture Tauri propre (validé natif 2026-06-05)
- [ ] Mode portable `./data/` fonctionne si flag activé
- [x] `npm run tauri build` produit `.exe` (+ MSI + NSIS setup)
- [ ] App fonctionne **sans connexion Internet**

---

## Tests éthiques / contenu (toutes phases)

- [x] Aucun texte « vous êtes [condition] »
- [x] Recommandations spécialistes : « Il peut être pertinent… »
- [ ] Pas de jargon médical sans explication (revue manuelle)
- [x] Bouton « Expliquer autrement » testé sur ≥ 1 écran — **Comprendre + Lire (40.4)**

---

## Tests non régressifs rapides (avant release V1)

Exécuter en ~15 min :

1. Lancer app → accueil OK
2. Onboarding parcours 2 → sélectionner dyslexie → disclaimer vu
3. Lire → coller texte → changer police → OK
4. TTS → lire ou message stub
5. Export PDF → ouvrir → disclaimer présent
6. Supprimer données → profil reset
7. Tab navigation accueil → tous focus visibles

---

## Phase 46 — Lecture interface

- [ ] Activer lecture interface → Tab/clic gauche sans lecture auto
- [ ] Double-clic droit sur bouton nav → TTS lit le libellé
- [ ] Clic droit + glisser sur paragraphe → lit le texte de la zone
- [ ] Champs texte exclus (pas de blocage édition)

---

## Phase 47 — i18n Paramètres

- [ ] Changer thème → message « Réglages enregistrés » (bilingue si EN actif)
- [ ] Supprimer données → confirmations traduites
- [ ] Import JSON invalide → message d'erreur clair

---

## Phase 48 — Smoke automatisé

- [x] `npm run smoke` — check + build + validation (2026-06-02)
- [x] `npm run validate:lang-packs` — 9 packs × 3 répertoires + NSIS LangString (2026-06-02)

---

## Phase 51 — Installateur langues + voix bilingues

### Installateur NSIS
- [ ] Setup : page « Installation complète » vs « Packs de langue uniquement » (FR ou EN selon langue installateur)
- [ ] Cocher es + de → seuls ces JSON dans `{Install}\lang-packs\`
- [ ] Mode packs seuls sur install existante : ajouter `ar` sans supprimer `es` déjà présent
- [ ] `installed-languages.json` reflète les fichiers présents

### Script PowerShell (`Accessible-Setup.ps1`)
- [ ] Mode 2 (packs seuls) : ajouter `ar` garde `es` déjà installé
- [ ] Mode 1 (complet) : décocher une langue supprime son `.json`

### Application (Tauri)
- [ ] Paramètres → Interface bilingue : liste = langues installées (+ en) après ajout pack (sans redémarrer)
- [ ] Bilingue ES : dictée et relire auto écriture en espagnol (si voix Windows / Web Speech)
- [ ] Bilingue EN + Hunspell `en_US` installé : orthographe `/ecrire` en anglais ; grammaire reste française (Grammalecte)
- [ ] `/lire` : voix Piper bascule sur `PIPER_MODEL_ES` si défini et langue secondaire es

---

## Bugs connus

| ID | Description | Phase | Statut |
|----|-------------|-------|--------|
| KNOWN-1 | Bouton « Expliquer autrement » absent (TEST_PLAN éthique) | toutes | **Résolu (40.4)** — Comprendre + Lire |
| KNOWN-2 | `ReadingPane.svelte` : warning a11y `tabindex` sur masque lecture | 5 | **Résolu (43.1)** — `<section tabindex="-1">` + focus programmatique |

---

## Historique exécutions

| Date | Phase | Résultat | Testeur |
|------|-------|----------|---------|
| 2026-06-02 | 0 | ✅ Docs OK | — |
| 2026-06-02 | 1–10 | 🟡 Build + revue code OK ; smoke manuel partiel | IA session 38.4 |

**Détails session 38.4 :** `npm install`, `npm run check` (0 erreur, 1 warning a11y), `npm run build`, `npm run tauri:build` → `Accessible_0.0.1_x64-setup.exe` + MSI. Revue code : 20 profils médicaux, 30 besoins fonctionnels, PDF disclaimer, pas de télémétrie, skip link, mode invité/pause, import/export JSON.
