# ARCHITECTURE — Accessible

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    Interface FALC                        │
│              SvelteKit routes + components               │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   Stores (Svelte)                        │
│         profile · settings · uiMode · crisis             │
└─────────────────────────┬───────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Modules    │  │   Config     │  │   Services   │
│  onboarding  │  │  medical-*   │  │   storage    │
│  reading     │  │  presets     │  │   tts        │
│  export      │  │  specialists │  │   pdf        │
│  crisis      │  │  fonts       │  │              │
└──────────────┘  └──────────────┘  └──────┬───────┘
                                           │
                          ┌────────────────▼────────────────┐
                          │  Persistance JSON → SQLite       │
                          │  (localStorage MVP / FS Tauri)   │
                          └─────────────────────────────────┘
```

## Stack technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Shell | Tauri 2 | App installable, FS, futures commandes Rust |
| UI | SvelteKit SPA | Pages, composants, routing |
| Langage | TypeScript strict | Types profil, configs |
| Styles | CSS custom properties | Thèmes, FALC, contrastes |
| Données utilisateur | JSON (MVP) | Profil, réglages, historique onboarding |
| Données utilisateur V1.1 | SQLite via plugin Tauri | Migration depuis JSON |
| TTS | Web Speech API | Voix système, sans binaire |
| PDF | jsPDF | Synthèse imprimable MVP |
| OCR V2 | Tesseract (Rust sidecar) | Hors MVP |
| Correction V2 | Grammalecte / Hunspell | Hors MVP |

## Approche progressive

### Phase A — Web local (navigateur)
- Développement rapide avec Vite HMR
- Persistance via `localStorage` ou fichier simulé
- Toute la logique métier en TypeScript

### Phase B — Tauri 2
- Même frontend compilé
- Rust minimal : FS, chemins `%APPDATA%`, build Windows
- Pas de logique métier en Rust

### Phase C — Extensions Rust (V2+)
- OCR, TTS Piper, export PDF avancé si jsPDF insuffisant

## Principes d'architecture

1. **Config déclarative** — Presets, spécialistes, aménagements, polices : fichiers TS/JSON lisibles, versionnés.
2. **Pas de logique médicale cachée** — Les arbres de recommandation sont explicites dans `src/lib/config/`.
3. **Séparation profils** — Médical (déclaratif) vs fonctionnel (validé par usage).
4. **Rejet persistant** — `rejectedSettings` empêche la réactivation automatique.
5. **Modules isolés** — Chaque domaine (lecture, export…) a son dossier ; pas de god-file.
6. **Stubs honnêtes** — Modules V2+ exposent une interface + message « bientôt disponible ».

## Flux : profils médicaux → réglages

```
Utilisateur sélectionne profil(s) médical(aux) déclaré(s)
        │
        ▼
setting-presets.ts propose réglages de départ
        │
        ▼
Onboarding / tests comparatifs
        │
   ┌────┴────┐
   ▼         ▼
Accepté   Rejeté
   │         │
   ▼         ▼
settings  rejectedSettings
   │
   ▼
functionalProfiles mis à jour
   │
   ▼
Expérience pilotée par settings + functionalProfiles
(pas par profils médicaux seuls)
```

## Structure des dossiers

```
src/
├── app.html, app.css
├── routes/                    # Pages SvelteKit
│   ├── +layout.svelte
│   ├── +page.svelte           # Accueil / dashboard
│   ├── onboarding/
│   ├── lire/
│   ├── ecrire/                # stub V1
│   ├── organiser/             # stub V1
│   ├── comprendre/            # stub V1
│   ├── communiquer/           # stub V1
│   ├── profil/
│   └── parametres/
└── lib/
    ├── components/ui/         # Button, Card, StepProgress, ModePause...
    ├── components/reading/    # FontComparator, ReadingPane...
    ├── stores/                # profile, settings, ui
    ├── types/                 # profile.ts, settings.ts
    ├── config/                # DONNÉES STATIQUES
    ├── modules/               # LOGIQUE MÉTIER
    ├── services/              # storage, tts, pdf
    └── utils/
```

## Modes applicatifs

Gérés par un store `uiMode` + classes CSS :

| Mode | Comportement |
|------|--------------|
| `student` | Défaut, tableau de bord complet |
| `companion` | Vue accompagnant (V2) |
| `teacher` | Vue enseignant (V3) |
| `verySimple` | Moins d'options, gros boutons, une idée par écran |
| `expert` | Plus de réglages visibles (V3) |
| `crisis` | Mode pause : interface minimale |

## Chemins de persistance

| Contexte | Chemin |
|----------|--------|
| Windows installé | `%APPDATA%/Accessible/profile.json` |
| Mode portable | `./data/profile.json` (à côté de l'exécutable) |
| Dev navigateur | `localStorage` clé `accessible-profile` |

## Intégrations futures (interfaces prévues)

```typescript
// src/lib/services/tts/types.ts
interface TTSService {
  isAvailable(): boolean;
  speak(text: string, options?: TTSOptions): void;
  stop(): void;
}

// src/lib/services/ocr/types.ts (V2)
interface OCRService {
  extractFromImage(file: File): Promise<string>;
  extractFromPDF(file: File): Promise<string>;
}
```

## Sécurité et Rust

Rust réservé à :
- Accès filesystem sécurisé
- Commandes Tauri (`save_profile`, `load_profile`, `delete_all_data`)
- Sidecars optionnels (OCR, TTS) en V2+

Aucune donnée utilisateur ne transite par un serveur distant.

## i18n

Interface **française en V1**. Structure préparée :
- Chaînes UI dans `src/lib/i18n/fr.ts` (à créer en V1.1)
- Clés stables pour traduction future

## Dépendances prévues (minimales)

**V1 :**
- `@sveltejs/kit`, `svelte`, `vite`, `typescript`
- `jspdf` (export PDF)

**V2+ :**
- `@tauri-apps/api`, `@tauri-apps/plugin-sql`
- Pas de lib UI lourde (MUI, etc.)

## Décisions reportées

| Sujet | Report | Raison |
|-------|--------|--------|
| SQLite vs JSON seul | V1.1 | JSON suffit pour MVP |
| Chiffrement profil | V2 | Complexité, mot de passe d'abord |
| Multi-profils | V2 | 1 profil + export/import suffit MVP |
| Piper TTS | V3 | Web Speech suffit MVP |
