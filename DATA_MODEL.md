# DATA_MODEL — Accessible

Schéma de données v1.0. Types TypeScript cibles dans `src/lib/types/profile.ts`.

---

## Fichier profil principal

Nom : `profile.json`  
Version : `profileVersion: "1.0"`

```json
{
  "app": "Accessible",
  "profileVersion": "1.0",
  "meta": {
    "createdAt": "2026-06-02T10:00:00.000Z",
    "updatedAt": "2026-06-02T10:00:00.000Z",
    "locale": "fr",
    "appMode": "student"
  },
  "declaredProfiles": {
    "medicalOrAdministrative": [],
    "visibleInExports": false
  },
  "functionalProfiles": {
    "reading": [],
    "writing": [],
    "organization": [],
    "sensory": [],
    "motor": [],
    "communication": [],
    "language": []
  },
  "settings": {},
  "rejectedSettings": [],
  "onboarding": {
    "path": null,
    "completedSteps": [],
    "comparisons": []
  },
  "activatedTools": [],
  "privacy": {
    "guestMode": false,
    "historyEnabled": true
  }
}
```

---

## Types TypeScript (référence)

### Racine

```typescript
interface AccessibleProfile {
  app: "Accessible";
  profileVersion: "1.0";
  meta: ProfileMeta;
  declaredProfiles: DeclaredProfiles;
  functionalProfiles: FunctionalProfiles;
  settings: AppSettings;
  rejectedSettings: RejectedSetting[];
  onboarding: OnboardingState;
  activatedTools: ToolId[];
  privacy: PrivacySettings;
}
```

### Meta

```typescript
interface ProfileMeta {
  createdAt: string;       // ISO 8601
  updatedAt: string;
  locale: "fr";
  appMode: "student" | "companion" | "teacher" | "verySimple";
}
```

### Profils médicaux / administratifs déclarés

```typescript
interface DeclaredProfiles {
  medicalOrAdministrative: DeclaredMedicalProfile[];
  visibleInExports: boolean;
}

interface DeclaredMedicalProfile {
  id: MedicalProfileId;
  declaredAt: string;
  source: "user_selection";
}

type MedicalProfileId =
  | "dys_troubles"
  | "dyslexie"
  | "dysorthographie"
  | "dysgraphie"
  | "dyspraxie"
  | "dyscalculie"
  | "dysphasie_tdl"
  | "tsa"
  | "tdah"
  | "malvoyance"
  | "surdite_malentendance"
  | "handicap_moteur"
  | "trouble_parole_communication"
  | "trouble_cognitif"
  | "trouble_psychique_anxiete_surcharge"
  | "maladie_chronique_fatigabilite"
  | "allophonie_fle"
  | "difficultes_sans_diagnostic"
  | "je_ne_sais_pas"
  | "prefere_ne_pas_repondre";
```

### Profils fonctionnels

```typescript
interface FunctionalProfiles {
  reading: FunctionalNeedEntry[];
  writing: FunctionalNeedEntry[];
  organization: FunctionalNeedEntry[];
  sensory: FunctionalNeedEntry[];
  motor: FunctionalNeedEntry[];
  communication: FunctionalNeedEntry[];
  language: FunctionalNeedEntry[];
}

interface FunctionalNeedEntry {
  id: FunctionalNeedId;
  source: "onboarding" | "test" | "manual" | "inferred";
  confirmedAt: string;
  confidence: "declared" | "tested" | "validated";
}

type FunctionalNeedId =
  | "lecture_visuelle_difficile"
  | "lecture_longue_fatigante"
  | "besoin_ecoute_audio"
  | "perte_de_ligne"
  | "gene_couleurs"
  | "besoin_police_agrandie"
  | "besoin_contraste_fort"
  | "besoin_fond_doux"
  | "besoin_documents_ocerises"
  | "difficulte_ecrire_longtemps"
  | "difficulte_orthographique"
  | "besoin_prediction_mots"
  | "besoin_correction_etape_par_etape"
  | "difficulte_commencer_tache"
  | "besoin_consignes_decoupees"
  | "besoin_une_etape_a_la_fois"
  | "besoin_routines"
  | "gene_animations"
  | "gene_bruit"
  | "besoin_sous_titres"
  | "difficulte_prise_notes"
  | "besoin_cartes_mentales"
  | "besoin_pictogrammes"
  | "besoin_reduire_frappe"
  | "besoin_navigation_clavier"
  | "besoin_pauses"
  | "besoin_previsibilite"
  | "besoin_supports_avance"
  | "besoin_consignes_ecrites"
  | "besoin_environnement_faible_distraction";
```

### Réglages actifs

```typescript
interface AppSettings {
  ui: UISettings;
  reading: ReadingSettings;
  writing: WritingSettings;
  sensory: SensorySettings;
  motor: MotorSettings;
  communication: CommunicationSettings;
}

interface UISettings {
  theme: "cream" | "light" | "dark" | "highContrast";
  buttonSize: "normal" | "large" | "veryLarge";
  showPictograms: boolean;
  detailLevel: "verySimple" | "standard" | "expert";
  interfaceTTS: boolean;
  animations: boolean;
  keyboardNavigation: boolean;
}

interface ReadingSettings {
  font: FontId;
  fontSize: number;           // px, ex. 18
  lineHeight: number;         // ex. 1.6
  letterSpacing: number;      // em
  wordSpacing: number;
  maxColumnWidth: number;     // ch or px
  background: "cream" | "light" | "dark" | "highContrast" | "custom";
  textColor?: string;
  backgroundColor?: string;
  lineGuide: boolean;
  readingMask: boolean;
  alternatingLines: boolean;
  syllableHighlight: boolean;
  graphemeHighlight: boolean;
  mutedLetters: boolean;
  tts: boolean;
  falcMode: boolean;
  distractionFree: boolean;
}

interface WritingSettings {
  spellcheck: "off" | "global" | "step_by_step";
  wordPrediction: boolean;
  readBack: boolean;
  distractionFree: boolean;
  shortSentenceHint: boolean;
}

interface SensorySettings {
  animations: boolean;
  sounds: boolean;
  notifications: "off" | "minimal" | "normal";
  reducedMotion: boolean;
}

interface MotorSettings {
  largeButtons: boolean;
  extendedClickTime: boolean;
  confirmBeforeAction: boolean;
  singleClickMode: boolean;
  dictationEnabled: boolean;
}

interface CommunicationSettings {
  pictogramsEnabled: boolean;
  communicationCardsEnabled: boolean;
}
```

### Réglages rejetés

```typescript
interface RejectedSetting {
  key: SettingKey;
  rejectedAt: string;
  source: "medical_preset" | "onboarding_test" | "manual";
  reason?: "uncomfortable" | "fatiguing" | "not_needed" | "other";
}

type SettingKey = string; // ex. "reading.font:OpenDyslexic", "sensory.animations:true"
```

### Onboarding

```typescript
interface OnboardingState {
  path: "known" | "declared" | "discovery" | null;
  completedSteps: string[];
  comparisons: ComparisonResult[];
}

interface ComparisonResult {
  step: string;              // ex. "reading_font_compare"
  options: string[];         // ids des variantes montrées
  preferred: string | null;
  mostFatiguing: string | null;
  answeredAt: string;
}
```

### Outils activés

```typescript
type ToolId =
  | "read_adapted"
  | "listen_text"
  | "correct_text"
  | "write_easier"
  | "organize_work"
  | "reduce_distractions"
  | "pictograms"
  | "prepare_appointment"
  | "work_on_pdf"
  | "subtitles"
  | "reduce_typing"
  | "adapt_interface";
```

### Vie privée

```typescript
interface PrivacySettings {
  guestMode: boolean;
  historyEnabled: boolean;
}
```

---

## Catalogue polices (config séparée)

Fichier : `src/lib/config/fonts-catalog.ts` — pas dans le profil utilisateur.

```typescript
interface FontMeta {
  id: FontId;
  name: string;
  license: string;
  licenseUrl: string;
  redistributable: boolean;
  installed: boolean;
  category: "dys" | "lowVision" | "general" | "mono";
  recommendedFor: string[];
  languageCoverage: string[];
  officialSource: string;
}

type FontId =
  | "atkinson-hyperlegible"
  | "luciole"
  | "lexend"
  | "readex-pro"
  | "opendyslexic"
  | "andika"
  | "b612"
  | "b612-mono"
  | "inclusive-sans"
  | "noto-sans"
  | "inter"
  | "source-sans-3"
  | "ibm-plex-sans"
  | "fira-sans"
  | "comic-neue"
  | "system";  // police système
```

---

## Mapping config (hors profil)

### setting-presets.ts

```typescript
interface SettingPreset {
  medicalProfileId: MedicalProfileId;
  suggestedSettings: Partial<AppSettings>;
  suggestedFunctionalNeeds: FunctionalNeedId[];
  note: string; // explication FALC pour l'utilisateur
}
```

### specialists.ts

```typescript
interface SpecialistRecommendation {
  triggerNeed: FunctionalNeedId | MedicalProfileId;
  specialists: SpecialistId[];
  formulation: string; // « Il peut être pertinent de consulter… »
}

type SpecialistId =
  | "medecin_universitaire"
  | "service_handicap"
  | "orthophoniste"
  | "neuropsychologue"
  | "psychologue"
  | "psychiatre"
  | "professionnel_tsa"
  | "cra"
  | "ophtalmologiste"
  | "orthoptiste"
  | "orl"
  | "audioprothesiste"
  | "ergotherapeute"
  | "psychomotricien"
  | "service_fle"
  | "tutorat_linguistique"
  | "enseignant_referent"
  | "bu_documentation";
```

### accommodations.ts

```typescript
interface AccommodationSuggestion {
  triggerNeed: FunctionalNeedId;
  accommodations: string[];
}
```

---

## Export PDF (structure logique)

```typescript
interface PDFSynthesis {
  title: "Synthèse de besoins fonctionnels — document préparatoire";
  disclaimer: "Ce document ne constitue pas un diagnostic.";
  generalInfo: { date: string; appVersion: string };
  declaredMedicalProfiles?: MedicalProfileId[];  // si visibleInExports
  declaredDifficulties: string[];               // formulations FALC
  usefulSettings: SettingSummary[];
  rejectedSettings: SettingSummary[];
  activatedTools: ToolId[];
  specialistsToDiscuss: string[];
  accommodationsToDiscuss: string[];
  technicalExport?: AccessibleProfile;            // JSON embarqué ou fichier séparé
}
```

---

## Persistance

| Phase | Mécanisme | Emplacement |
|-------|-----------|-------------|
| Dev web | localStorage | `accessible-profile-v1` |
| Tauri | FS via command | `%APPDATA%/Accessible/profile.json` |
| Portable | FS relatif | `./data/profile.json` |

---

## Migration

Increment `profileVersion` à chaque breaking change.  
Fonction `migrateProfile(old: unknown): AccessibleProfile` dans `src/lib/services/storage/migrate.ts`.

---

## Profil par défaut

Factory `createDefaultProfile(): AccessibleProfile` :
- `appMode: "student"`
- Thème crème, boutons large en mode verySimple off
- Listes vides, `onboarding.path: null`
- `visibleInExports: false`
