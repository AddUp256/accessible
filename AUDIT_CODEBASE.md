# Audit du code - Accessible

Date : 2026-06-14

## Périmètre audité

- Code applicatif : `src/`, `scripts/`, `src-tauri/src/`, `src-tauri/nsis/`, lanceurs Windows et configuration Svelte/Vite.
- Graphe d'import Svelte/TypeScript : 275 fichiers analysés dans `src/` et `scripts/`.
- Pont Tauri : commandes Rust comparées aux appels `invoke(...)` côté frontend.
- Dossiers exclus comme artefacts ou dépendances : `node_modules/`, `.svelte-kit/`, `build/`, fichiers lock et binaires d'icônes.

## Résultat rapide

- Aucun fichier actif sous `src/lib/` ne ressort comme isolé par absence d'import.
- Toutes les commandes Tauri déclarées sont appelées côté frontend.
- Les packs de langue présents dans `static/lang-packs/`, `installer/lang-packs/` et `src-tauri/resources/lang-packs/` sont des duplications volontaires générées par `scripts/export-lang-packs.ts`.
- Les commentaires de rôle en français ont été ajoutés aux fichiers source éditables. Les fichiers JSON, lockfiles et ressources binaires ne sont pas commentés pour ne pas casser leur format.

## Fichiers isolés ou à clarifier

| Fichier | État | Recommandation |
| --- | --- | --- |
| `src/lib/assets/favicon.svg` | Aucun import ou usage direct trouvé. L'application utilise `static/favicon.svg` via `src/app.html`. | Supprimer si `static/favicon.svg` est la source officielle, ou documenter ce fichier comme source graphique. |
| `src-tauri/app-icon.svg` | Aucun usage direct dans `tauri.conf.json`, qui référence les icônes PNG/ICO/ICNS générées. | Garder uniquement si c'est la source de génération des icônes ; sinon supprimer pour éviter une source concurrente. |
| `Accessible.lnk` | Fichier local ignoré par Git (`*.lnk`), cohérent avec un raccourci machine. | Ne pas versionner ; recréer avec `scripts/Creer-Raccourci.ps1` si besoin. |

## Duplications volontaires

- `static/lang-packs/` : packs servis par la version navigateur/dev.
- `installer/lang-packs/` : packs utilisés par l'installateur PowerShell/NSIS.
- `src-tauri/resources/lang-packs/` : packs embarqués dans l'application Tauri.
- `src-tauri/icons/` : variantes générées pour les plateformes Tauri ; ne pas les traiter comme des doublons simples.

## Fonctionnalités partiellement réalisées

| Zone | Constat | Impact |
| --- | --- | --- |
| Plugins | Le registre charge `demo-word-count`, mais `getPluginActions()` n'est pas consommé par l'accueil ou une page dédiée. | Le système de plugins existe, mais l'action de démonstration n'est pas visible pour l'utilisateur. |
| Version navigateur | Multi-profils, mode portable, OCR PDF, transcription Whisper, Hunspell, Grammalecte, Piper et eSpeak sont limités ou absents hors Tauri. | La version web reste lisible et utile, mais certaines fonctions affichent des messages de repli explicites. |
| Moteurs externes | OCR local, correction complète, TTS local et transcription dépendent de binaires/modèles installés séparément. | Fonctionnel si l'environnement est préparé ; sinon fonctionnement dégradé prévu. |
| Chiffrement | Le profil peut être chiffré, mais les tables SQLite normalisées restent indiquées comme en clair dans cette version. | À traiter si l'objectif devient chiffrement complet des données dérivées. |
| i18n | Les 9 langues prioritaires ont des packs complets ; les autres langues de la liste restent en aperçu partiel/repli. | Ne pas annoncer une couverture 70+ langues complète. |
| FALC et lecture linguistique | Simplification FALC, syllabes et lettres muettes sont heuristiques. | Suffisant pour aide locale, pas équivalent à un moteur linguistique professionnel. |
| ARASAAC | Recherche en ligne nécessaire pour importer de nouveaux pictogrammes. | Le mode hors ligne dépend des pictogrammes déjà ajoutés en bibliothèque locale. |
| Tests de distribution | La documentation indique encore des tests manuels d'installateur/parcours à finir. | Avant release, rejouer `TEST_PLAN.md` sur installateur NSIS et parcours bilingues. |

## Norme de commentaire appliquée

- Commentaire de rôle au début de chaque fichier éditable pour comprendre sa responsabilité avant modification.
- Commentaires français, courts, orientés intention : rôle, contrat, limite ou raison d'un choix.
- Pas de commentaire ligne par ligne sur du code évident.
- Pas de commentaire dans JSON, lockfiles ou ressources binaires.

## Vérifications

- `npm run check` : OK, 0 erreur, 0 avertissement.
- `npm run smoke` : OK, inclut check, régressions, build, validation des packs langue et validation des artefacts critiques.
- `cargo check` dans `src-tauri/` : OK.
