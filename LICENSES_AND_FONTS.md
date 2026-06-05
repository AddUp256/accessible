# LICENSES_AND_FONTS — Accessible

Gestion des polices accessibles et conformité licences.  
**Règle : ne jamais redistribuer une police si sa licence l'interdit.**

---

## Couche de gestion des polices

Fichier cible : `src/lib/config/fonts-catalog.ts`

Chaque entrée contient :

| Champ | Description |
|-------|-------------|
| `id` | Identifiant stable |
| `name` | Nom affiché |
| `license` | SPDX ou nom licence |
| `licenseUrl` | URL licence officielle |
| `redistributable` | `true` si inclusion dans le bundle autorisée |
| `installed` | `true` si fichiers présents dans `static/fonts/` |
| `category` | `dys` \| `lowVision` \| `general` \| `mono` |
| `recommendedFor` | Usages FALC (ex. « lecture longue », « DYS ») |
| `languageCoverage` | ex. `["fr", "en"]` |
| `officialSource` | URL téléchargement officiel |

### Comportement runtime

1. **Polices redistribuables** → `@font-face` depuis `static/fonts/`
2. **Polices non redistribuables** → proposer lien installation manuelle OU détection si déjà installée sur l'OS
3. **Fallback** → `system-ui`, sans-serif

---

## Polices prioritaires — statut licence

> ⚠️ Vérifier les URLs officielles avant release. Statuts indicatifs au 2026-06-02.

| Police | Licence probable | Redistribuable | Notes |
|--------|------------------|----------------|-------|
| **Atkinson Hyperlegible** | SIL OFL 1.1 | ✅ Oui | Braille Institute |
| **Luciole** | Licence Luciole (libre) | ✅ Oui | Fédération LV |
| **Lexend** | SIL OFL 1.1 | ✅ Oui | Google Fonts |
| **Readex Pro** | SIL OFL 1.1 | ✅ Oui | Google Fonts |
| **OpenDyslexic** | Bitstream Vera / OFL (variante) | ⚠️ Vérifier variante | Plusieurs versions ; utiliser source officielle |
| **Andika** | SIL OFL 1.1 | ✅ Oui | SIL International |
| **B612** | SIL OFL 1.1 | ✅ Oui | Polices.tv |
| **B612 Mono** | SIL OFL 1.1 | ✅ Oui | Polices.tv |
| **Inclusive Sans** | SIL OFL 1.1 | ✅ Oui | Google (derived) |
| **Noto Sans** | SIL OFL 1.1 | ✅ Oui | Google |
| **Noto Serif** | SIL OFL 1.1 | ✅ Oui | Google |
| **Noto Mono** | SIL OFL 1.1 | ✅ Oui | Google |
| **Inter** | SIL OFL 1.1 | ✅ Oui | rsms.me |
| **Source Sans 3** | SIL OFL 1.1 | ✅ Oui | Adobe |
| **Source Serif 4** | SIL OFL 1.1 | ✅ Oui | Adobe |
| **Source Code Pro** | SIL OFL 1.1 | ✅ Oui | Adobe |
| **IBM Plex Sans** | SIL OFL 1.1 | ✅ Oui | IBM |
| **IBM Plex Serif** | SIL OFL 1.1 | ✅ Oui | IBM |
| **IBM Plex Mono** | SIL OFL 1.1 | ✅ Oui | IBM |
| **Fira Sans** | SIL OFL 1.1 | ✅ Oui | Mozilla |
| **Fira Code** | SIL OFL 1.1 | ✅ Oui | Mozilla |
| **Ubuntu** | Ubuntu Font Licence 1.0 | ✅ Oui | Canonical |
| **Ubuntu Mono** | Ubuntu Font Licence 1.0 | ✅ Oui | Canonical |
| **Roboto** | Apache 2.0 | ✅ Oui | Google |
| **Roboto Slab** | Apache 2.0 | ✅ Oui | Google |
| **Roboto Mono** | Apache 2.0 | ✅ Oui | Google |
| **Comic Neue** | SIL OFL 1.1 | ✅ Oui | Google Fonts |

### Actions avant release V1

- [ ] Télécharger chaque police depuis la source officielle
- [ ] Copier fichier licence (`OFL.txt`, etc.) dans `static/fonts/<id>/`
- [ ] Créditer dans « À propos » / README
- [ ] Vérifier OpenDyslexic (variante exacte)

---

## Structure dossier polices

```
static/fonts/
├── atkinson-hyperlegible/
│   ├── AtkinsonHyperlegible-Regular.woff2
│   └── OFL.txt
├── lexend/
│   ├── Lexend-Regular.woff2
│   └── OFL.txt
└── ...
```

Format privilégié : **woff2** (taille, performance).

---

## Comparateur de polices

Écrans de test prévus (textes embarqués en config) :

| Id échantillon | Contenu |
|----------------|---------|
| `short` | Phrase courte FALC |
| `long` | Paragraphe ~150 mots |
| `admin` | Consigne administrative type examen |
| `scientific` | Passage avec termes techniques |
| `table` | Petit tableau chiffres/texte |
| `numbers` | Suite de nombres et dates |
| `confusables` | `I l 1 O 0 rn m b d p q a o e c 5 S 2 Z` |
| `accents_fr` | « Éléphant à côté naïf coeur œuf » |
| `bilingual` | FR + EN mélangé |
| `punctuation` | Ponctuation dense |
| `ui_buttons` | Labels boutons interface |

---

## Pictogrammes ARASAAC (V2)

- Source : [ARASAAC](https://arasaac.org/)
- Licence : Creative Commons BY-NC-SA (vérifier version exacte)
- **Usage NC** (non commercial) — vérifier compatibilité avec licence du projet Accessible
- Ne pas bundler avant validation juridique
- Prévoir import manuel par l'utilisateur

---

## Autres dépendances logicielles (V2+)

| Composant | Licence | Usage |
|-----------|---------|-------|
| Tesseract OCR | Apache 2.0 | OCR local |
| Grammalecte | LGPL / spécifique | Correction FR |
| Hunspell | LGPL / MPL / GPL selon dict | Orthographe |
| eSpeak NG | GPL v3 | TTS (V3) |
| Piper TTS | MIT | TTS (V3) |
| jsPDF | MIT | Export PDF MVP |

Vérifier compatibilité GPL (eSpeak) avec distribution Tauri si lié statiquement.

---

## Crédits UI

Afficher dans Paramètres → À propos :

- Liste des polices embarquées + liens licences
- Liste des bibliothèques open source
- « Accessible ne pose pas de diagnostic. »

---

## Checklist conformité release

- [ ] Toutes les polices embarquées ont `redistributable: true` vérifié
- [ ] Fichiers licence copiés dans le bundle
- [x] Crédits visibles dans l'app (Paramètres → À propos, Phase 44)
- [ ] Aucune police propriétaire (Arial, Times…) redistribuée
- [ ] ARASAAC : import manuel uniquement si NC incompatible

---

## Historique

| Date | Action |
|------|--------|
| 2026-06-02 | Document initial, statuts licence indicatifs |
