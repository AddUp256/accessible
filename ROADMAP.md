# ROADMAP — Accessible

---

## V1 — MVP (objectif : app utile et propre)

**Critère de succès :** Un étudiant peut installer/lancer l'app, faire l'onboarding, tester des réglages de lecture, exporter une synthèse PDF, le tout hors ligne.

| # | Fonctionnalité | Priorité |
|---|----------------|----------|
| 1 | Application locale démarrable (web puis Tauri) | P0 |
| 2 | Interface FALC, texte d'accueil obligatoire | P0 |
| 3 | Onboarding minimal (3 entrées) | P0 |
| 4 | Profils médicaux déclarés (multi-select + disclaimer) | P0 |
| 5 | Profils fonctionnels (construction progressive) | P0 |
| 6 | Comparateur affichage / polices | P0 |
| 7 | Module lecture adaptée (texte collé) | P0 |
| 8 | TTS système ou stub propre | P0 |
| 9 | Réglages persistants locaux | P0 |
| 10 | Export JSON profil | P0 |
| 11 | Export PDF synthèse simple | P0 |
| 12 | Tableau de bord (6 zones + actions rapides) | P0 |
| 13 | Mode vie privée (suppression données, invité) | P0 |
| 14 | Mode pause / crise | P1 |
| 15 | Documentation et tests manuels | P0 |
| 16 | Packaging Tauri Windows | P0 |

**Hors V1 à l'origine :** Écrire, Organiser, Comprendre, Communiquer — **implémentés** (Phases 12–37).

---

## V1.1 — Consolidation

| Fonctionnalité | Statut |
|----------------|--------|
| Migration SQLite | ✅ |
| i18n structure FR + EN (titres, nav, modules) | ✅ |
| Import profil JSON | ✅ |
| Onboarding complet (discovery) | ✅ |
| Polices redistribuables embarquées (bundle) | ✅ Phase 41 |
| Comparateur polices avancé (caractères confus, tableaux) | ✅ Phase 40.5 |
| Mode très simple polish | ✅ Phase 43 |
| i18n messages dynamiques + catalogues config | ✅ Phase 38 |

---

## V2 — Outils de travail

| Module | Fonctionnalités | Statut |
|--------|-----------------|--------|
| **OCR** | Tesseract, import image/PDF → lecture | ✅ Phase 39 |
| **Correction** | Grammalecte / Hunspell, étape par étape | ✅ (binaires externes) |
| **Écriture** | Éditeur, prédiction, dictée | ✅ |
| **FALC** | Règles, consignes, glossaire, simplification heuristique | ✅ moteur unifié Phase 42 |
| **Organisation** | Checklists, Kanban, minuteur, routines visuelles, cartes mentales | ✅ Phase 40 |
| **Notes** | Cornell, export Markdown + ODT/DOCX | ✅ Phase 40 |
| **Mémorisation** | Flashcards, répétition espacée, export Anki CSV | ✅ Phase 40 |
| **Pictogrammes** | ARASAAC, cartes perso | ✅ |
| **Vidéo/audio** | Lecteur, vitesse, transcription Whisper + sous-titres | ✅ Phase 39 |
| **Réglages expert** | TTS focus, dictée, motricité, sensoriel | ✅ Phase 37 |

---

## V3 — Avancé

| Fonctionnalité | Statut |
|----------------|--------|
| TTS Piper | ✅ |
| TTS eSpeak NG optionnel | ✅ Phase 41 |
| Transcription locale audio/vidéo | ✅ Phase 39 |
| CAA avancée (scénarios multi-étapes) | ✅ Phase 42 |
| Mode enseignant parcours guidé | ✅ Phase 42 (`/enseignant`) |
| FALC moteur unifié + lexique FLE | ✅ Phase 42 |
| Accessibilité motrice (balayage) | ✅ Phase 42 |
| Export PDF enrichi | ✅ Phase 42 |
| Plugins / extensions | ✅ Phase 42 (`PLUGINS.md`) |
| Mode expert (tous réglages fonctionnels) | ✅ Phase 37 |
| Plugins / extensions | ✅ Phase 42 |
| CAA avancée (scénarios sociaux enrichis) | ✅ Phase 42 |
| Accessibilité motrice avancée | 🟡 balayage clavier ✅ ; intégration OS hors scope |
| Export Anki CSV, ODT/DOCX | ✅ Phase 40 |
| Multi-profils | ✅ |
| Chiffrement profil + mot de passe | ✅ |
| Builds macOS / Linux | ✅ Phase 41 (BUILD.md) |
| Version portable officielle | ✅ Phase 41 (PORTABLE.md) |
| Cartes mentales | ✅ Phase 40 |

---

## Jalons (indicatifs)

```
2026 Q2  Phase 0 docs ✅  →  Phase 1 squelette  →  Phase 2–5 core MVP
2026 Q3  Export PDF/JSON  →  Tauri  →  V1 release
2026 Q4  V1.1 polish  →  début V2 OCR/correcteur
2027     V2 modules travail  →  V3
```

*(Dates indicatives, ajuster selon rythme de développement.)*

---

## Modules — maturité actuelle (2026-06-02)

| Module | Actuel | Prochaine étape |
|--------|--------|-----------------|
| A. Lecture adaptée | V2 (syllabes, masque, média, OCR PDF) | — |
| B. Polices | V1 comparateur + embarquées | Avancé ✅ (40.5) |
| C. TTS | V2 Piper + Web Speech + eSpeak | — |
| D. OCR | V2 image + PDF scanné | — |
| E. Écriture | V2 | — |
| F. Correction | V2 | — |
| G. FALC | V2 heuristique | Moteur pro (42) |
| H. Organisation | V2 (+ routines visuelles, cartes mentales) | — |
| I. Notes | V2 Cornell + ODT/DOCX | — |
| J. Mémorisation | V2 + export Anki CSV | — |
| K. Vidéo/audio | V2 lecteur + transcription | — |
| L. A11y visuelle | V2 thèmes + réglages expert | — |
| M. A11y motrice | V2 réglages base | Avancé OS (42) |
| N. CAA/pictogrammes | V2 | Scénarios enrichis (42) |
| O. FLE | V2 glossaire perso | Complet (42) |
| P. Export PDF | V1 synthèse | Enrichi (42) |

---

## Critères de release V1

- [x] Démarre hors ligne sur Windows 10/11 (`tauri:build` OK — smoke manuel recommandé)
- [x] Aucune télémétrie, aucune connexion (revue code 38.4)
- [x] Onboarding 3 parcours fonctionnels (implémentés — smoke manuel recommandé)
- [x] Comparateur + module Lire opérationnels
- [x] Export JSON + PDF avec disclaimer
- [x] Mode pause accessible
- [x] Suppression données fonctionne
- [x] TEST_PLAN.md exécuté sans bloquant (KNOWN-2 résolu en 43.1)
- [x] Aucun texte ne pose de diagnostic
