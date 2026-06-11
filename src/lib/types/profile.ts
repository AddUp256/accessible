/** Types de données Accessible v1.0 — voir DATA_MODEL.md */

export type AppMode = 'student' | 'companion' | 'teacher' | 'verySimple' | 'expert';

export type MedicalProfileId =
	| 'dys_troubles'
	| 'dyslexie'
	| 'dysorthographie'
	| 'dysgraphie'
	| 'dyspraxie'
	| 'dyscalculie'
	| 'dysphasie_tdl'
	| 'tsa'
	| 'tdah'
	| 'malvoyance'
	| 'surdite_malentendance'
	| 'handicap_moteur'
	| 'trouble_parole_communication'
	| 'trouble_cognitif'
	| 'trouble_psychique_anxiete_surcharge'
	| 'maladie_chronique_fatigabilite'
	| 'allophonie_fle'
	| 'difficultes_sans_diagnostic'
	| 'je_ne_sais_pas'
	| 'prefere_ne_pas_repondre';

export type FunctionalNeedId =
	| 'lecture_visuelle_difficile'
	| 'lecture_longue_fatigante'
	| 'besoin_ecoute_audio'
	| 'perte_de_ligne'
	| 'gene_couleurs'
	| 'besoin_police_agrandie'
	| 'besoin_contraste_fort'
	| 'besoin_fond_doux'
	| 'besoin_documents_ocerises'
	| 'difficulte_ecrire_longtemps'
	| 'difficulte_orthographique'
	| 'besoin_prediction_mots'
	| 'besoin_correction_etape_par_etape'
	| 'difficulte_commencer_tache'
	| 'besoin_consignes_decoupees'
	| 'besoin_une_etape_a_la_fois'
	| 'besoin_routines'
	| 'gene_animations'
	| 'gene_bruit'
	| 'besoin_sous_titres'
	| 'difficulte_prise_notes'
	| 'besoin_cartes_mentales'
	| 'besoin_pictogrammes'
	| 'besoin_reduire_frappe'
	| 'besoin_navigation_clavier'
	| 'besoin_pauses'
	| 'besoin_previsibilite'
	| 'besoin_supports_avance'
	| 'besoin_consignes_ecrites'
	| 'besoin_environnement_faible_distraction';

export type FunctionalCategory =
	| 'reading'
	| 'writing'
	| 'organization'
	| 'sensory'
	| 'motor'
	| 'communication'
	| 'language';

export type FontId =
	| 'custom'
	| 'atkinson-hyperlegible'
	| 'luciole'
	| 'lexend'
	| 'readex-pro'
	| 'opendyslexic'
	| 'andika'
	| 'b612'
	| 'b612-mono'
	| 'inclusive-sans'
	| 'noto-sans'
	| 'noto-serif'
	| 'noto-mono'
	| 'inter'
	| 'source-sans-3'
	| 'source-serif-4'
	| 'source-code-pro'
	| 'ibm-plex-sans'
	| 'ibm-plex-serif'
	| 'ibm-plex-mono'
	| 'fira-sans'
	| 'fira-code'
	| 'ubuntu'
	| 'ubuntu-mono'
	| 'roboto'
	| 'roboto-slab'
	| 'roboto-mono'
	| 'comic-neue'
	| 'system';

export type ToolId =
	| 'read_adapted'
	| 'listen_text'
	| 'correct_text'
	| 'write_easier'
	| 'organize_work'
	| 'reduce_distractions'
	| 'pictograms'
	| 'prepare_appointment'
	| 'work_on_pdf'
	| 'subtitles'
	| 'reduce_typing'
	| 'adapt_interface';

export type SpecialistId =
	| 'medecin_universitaire'
	| 'service_handicap'
	| 'orthophoniste'
	| 'neuropsychologue'
	| 'psychologue'
	| 'psychiatre'
	| 'professionnel_tsa'
	| 'cra'
	| 'ophtalmologiste'
	| 'orthoptiste'
	| 'orl'
	| 'audioprothesiste'
	| 'ergotherapeute'
	| 'psychomotricien'
	| 'service_fle'
	| 'tutorat_linguistique'
	| 'enseignant_referent'
	| 'bu_documentation';

export type SettingKey = string;

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ProfileMeta {
	createdAt: string;
	updatedAt: string;
	locale: 'fr';
	appMode: AppMode;
}

export interface DeclaredMedicalProfile {
	id: MedicalProfileId;
	declaredAt: string;
	source: 'user_selection';
}

export interface DeclaredProfiles {
	medicalOrAdministrative: DeclaredMedicalProfile[];
	visibleInExports: boolean;
}

export interface FunctionalNeedEntry {
	id: FunctionalNeedId;
	source: 'onboarding' | 'test' | 'manual' | 'inferred';
	confirmedAt: string;
	confidence: 'declared' | 'tested' | 'validated';
}

export interface FunctionalProfiles {
	reading: FunctionalNeedEntry[];
	writing: FunctionalNeedEntry[];
	organization: FunctionalNeedEntry[];
	sensory: FunctionalNeedEntry[];
	motor: FunctionalNeedEntry[];
	communication: FunctionalNeedEntry[];
	language: FunctionalNeedEntry[];
}

export interface UISettings {
	theme: 'cream' | 'light' | 'dark' | 'highContrast';
	buttonSize: 'normal' | 'large' | 'veryLarge';
	textSize: 'normal' | 'large' | 'veryLarge';
	showPictograms: boolean;
	detailLevel: 'verySimple' | 'standard' | 'expert';
	interfaceTTS: boolean;
	animations: boolean;
	keyboardNavigation: boolean;
	/** Affiche le français + une autre langue (menus, cartes CAA). */
	bilingualUi: boolean;
	/** Code ISO 639-1 — voir `INTERFACE_LANGUAGES`. */
	secondaryLanguage: string;
	/** Autorise les fonctions en ligne (ARASAAC, etc.). */
	internetEnabled: boolean;
	/** Active ou coupe les lectures audio lancees par Accessible. */
	audioEnabled: boolean;
	/** Identifiant du haut-parleur choisi quand le moteur WebView le permet. */
	audioOutputDeviceId: string;
	/** Masque le message de bienvenue detaille apres le premier lancement. */
	firstLaunchIntroDismissed: boolean;
}

export interface ReadingSettings {
	font: FontId;
	customFontName: string;
	customFontFileName: string;
	customFontDataUrl: string;
	fontSize: number;
	lineHeight: number;
	letterSpacing: number;
	wordSpacing: number;
	maxColumnWidth: number;
	background: 'cream' | 'light' | 'dark' | 'highContrast' | 'custom';
	textColor?: string;
	backgroundColor?: string;
	lineGuide: boolean;
	readingMask: boolean;
	alternatingLines: boolean;
	syllableHighlight: boolean;
	graphemeHighlight: boolean;
	mutedLetters: boolean;
	tts: boolean;
	ttsRate: number;
	ttsEngine: 'auto' | 'web' | 'piper' | 'espeak';
	/** URI Web Speech (voix système) — vide = meilleure voix pour la langue. */
	ttsVoiceUri: string;
	/** Chemin .onnx Piper (souvent via PIPER_MODEL / PIPER_MODEL_EN…). */
	piperModelPath: string;
	falcMode: boolean;
	distractionFree: boolean;
}

export interface WritingSettings {
	spellcheck: 'off' | 'global' | 'step_by_step';
	grammarCheck: 'off' | 'global' | 'step_by_step';
	wordPrediction: boolean;
	readBack: boolean;
	distractionFree: boolean;
	shortSentenceHint: boolean;
}

export interface SensorySettings {
	animations: boolean;
	sounds: boolean;
	notifications: 'off' | 'minimal' | 'normal';
	reducedMotion: boolean;
	/** Son de fin de minuteur (data URL audio) — optionnel. */
	timerAlarmDataUrl: string | null;
}

export interface MotorSettings {
	largeButtons: boolean;
	extendedClickTime: boolean;
	confirmBeforeAction: boolean;
	singleClickMode: boolean;
	dictationEnabled: boolean;
	/** Balayage automatique des éléments focusables (accessibilité motrice). */
	scanMode: boolean;
}

export interface CommunicationSettings {
	pictogramsEnabled: boolean;
	communicationCardsEnabled: boolean;
}

export interface AppSettings {
	ui: UISettings;
	reading: ReadingSettings;
	writing: WritingSettings;
	sensory: SensorySettings;
	motor: MotorSettings;
	communication: CommunicationSettings;
}

export interface RejectedSetting {
	key: SettingKey;
	rejectedAt: string;
	source: 'medical_preset' | 'onboarding_test' | 'manual';
	reason?: 'uncomfortable' | 'fatiguing' | 'not_needed' | 'other';
}

export interface ComparisonResult {
	step: string;
	options: string[];
	preferred: string | null;
	mostFatiguing: string | null;
	answeredAt: string;
}

export interface OnboardingState {
	path: 'known' | 'declared' | 'discovery' | null;
	completedSteps: string[];
	comparisons: ComparisonResult[];
}

export interface PrivacySettings {
	guestMode: boolean;
	historyEnabled: boolean;
}

export interface ChecklistItem {
	id: string;
	label: string;
	done: boolean;
	createdAt: string;
}

export interface Checklist {
	id: string;
	title: string;
	items: ChecklistItem[];
	createdAt: string;
	updatedAt: string;
}

export type KanbanColumnId = 'todo' | 'doing' | 'done';

export interface KanbanTask {
	id: string;
	title: string;
	column: KanbanColumnId;
	createdAt: string;
	updatedAt: string;
}

export interface VisualRoutineStep {
	id: string;
	label: string;
	/** Emoji ou pictogramme texte affiché à côté de l'étape. */
	icon: string;
	done: boolean;
}

export interface VisualRoutine {
	id: string;
	title: string;
	steps: VisualRoutineStep[];
	createdAt: string;
	updatedAt: string;
}

export interface MindMapNode {
	id: string;
	label: string;
	parentId: string | null;
}

export interface MindMap {
	id: string;
	title: string;
	nodes: MindMapNode[];
	createdAt: string;
	updatedAt: string;
}

export interface OrganizerData {
	checklists: Checklist[];
	kanbanTasks: KanbanTask[];
	visualRoutines: VisualRoutine[];
	mindMaps: MindMap[];
}

export const DEFAULT_ORGANIZER_DATA: OrganizerData = {
	checklists: [],
	kanbanTasks: [],
	visualRoutines: [],
	mindMaps: []
};

export interface CommunicationCardOverride {
	label?: string;
	message?: string;
}

export interface PersonalCommunicationCard {
	id: string;
	label: string;
	message: string;
	/** ID pictogramme ARASAAC importé par l'utilisateur (optionnel). */
	pictogramId?: number;
	createdAt: string;
}

export interface SavedArasaacPictogram {
	id: number;
	label: string;
	importedAt: string;
}

export interface CommunicatorData {
	personalCards: PersonalCommunicationCard[];
	savedPictograms: SavedArasaacPictogram[];
	/** Personnalisation des cartes intégrées (id → label/message). */
	builtInCardOverrides: Record<string, CommunicationCardOverride>;
}

export const DEFAULT_COMMUNICATOR_DATA: CommunicatorData = {
	personalCards: [],
	savedPictograms: [],
	builtInCardOverrides: {}
};

export interface GlossaryEntry {
	id: string;
	term: string;
	definition: string;
	createdAt: string;
}

export interface ComprehensionData {
	glossary: GlossaryEntry[];
}

export const DEFAULT_COMPREHENSION_DATA: ComprehensionData = {
	glossary: []
};

export type NoteFormat = 'simple' | 'cornell';

export interface Note {
	id: string;
	title: string;
	body: string;
	format?: NoteFormat;
	cornellCue?: string;
	cornellSummary?: string;
	createdAt: string;
	updatedAt: string;
}

export interface NotesData {
	notes: Note[];
}

export const DEFAULT_NOTES_DATA: NotesData = {
	notes: []
};

export interface FlashcardSchedule {
	nextReviewAt: string;
	intervalDays: number;
	repetitions: number;
}

export interface Flashcard {
	id: string;
	front: string;
	back: string;
	createdAt: string;
	schedule?: FlashcardSchedule;
}

export interface FlashcardDeck {
	id: string;
	title: string;
	cards: Flashcard[];
	createdAt: string;
	updatedAt: string;
}

export interface MemorizationData {
	decks: FlashcardDeck[];
}

export const DEFAULT_MEMORIZATION_DATA: MemorizationData = {
	decks: []
};

export interface AccessibleProfile {
	app: 'Accessible';
	profileVersion: '1.0';
	meta: ProfileMeta;
	declaredProfiles: DeclaredProfiles;
	functionalProfiles: FunctionalProfiles;
	settings: AppSettings;
	rejectedSettings: RejectedSetting[];
	onboarding: OnboardingState;
	activatedTools: ToolId[];
	privacy: PrivacySettings;
	organizer: OrganizerData;
	communicator: CommunicatorData;
	notes: NotesData;
	memorization: MemorizationData;
	comprehension: ComprehensionData;
}

export interface SettingSummary {
	key: SettingKey;
	label: string;
	value: string;
}

export interface PDFSynthesis {
	title: 'Synthèse de besoins fonctionnels — document préparatoire';
	disclaimer: 'Ce document ne constitue pas un diagnostic.';
	generalInfo: { date: string; appVersion: string };
	declaredMedicalProfiles?: MedicalProfileId[];
	declaredDifficulties: string[];
	usefulSettings: SettingSummary[];
	rejectedSettings: SettingSummary[];
	activatedTools: ToolId[];
	specialistsToDiscuss: string[];
	accommodationsToDiscuss: string[];
	/** Phase 42 — annexes enrichies */
	enrichedSections?: {
		glossary: string[];
		communicationCards: string[];
		notesSummary: string[];
		visualRoutines: string[];
		fleLexiconSample: string[];
	};
	technicalExport?: AccessibleProfile;
}

export interface FontMeta {
	id: FontId;
	name: string;
	license: string;
	licenseUrl: string;
	redistributable: boolean;
	installed: boolean;
	category: 'dys' | 'lowVision' | 'general' | 'mono';
	recommendedFor: string[];
	languageCoverage: string[];
	officialSource: string;
}

export interface MedicalProfileMeta {
	id: MedicalProfileId;
	label: string;
	description: string;
	group: 'dys' | 'neurodevelopment' | 'sensory' | 'motor' | 'language' | 'cognitive' | 'communication' | 'other';
}

export interface FunctionalNeedMeta {
	id: FunctionalNeedId;
	label: string;
	description: string;
	category: FunctionalCategory;
}

export interface SettingPreset {
	medicalProfileId: MedicalProfileId;
	suggestedSettings: DeepPartial<AppSettings>;
	suggestedFunctionalNeeds: FunctionalNeedId[];
	suggestedTools: ToolId[];
	note: string;
}

export interface SpecialistRecommendation {
	trigger: FunctionalNeedId | MedicalProfileId;
	specialists: SpecialistId[];
	formulation: string;
}

export interface AccommodationSuggestion {
	triggerNeed: FunctionalNeedId;
	accommodations: string[];
}

export const PROFILE_VERSION = '1.0' as const;

export const DEFAULT_APP_SETTINGS: AppSettings = {
	ui: {
		theme: 'cream',
		buttonSize: 'large',
		textSize: 'normal',
		showPictograms: false,
		detailLevel: 'standard',
		interfaceTTS: false,
		animations: false,
		keyboardNavigation: true,
		bilingualUi: false,
		secondaryLanguage: 'en',
		internetEnabled: true,
		audioEnabled: true,
		audioOutputDeviceId: '',
		firstLaunchIntroDismissed: false
	},
	reading: {
		font: 'atkinson-hyperlegible',
		customFontName: '',
		customFontFileName: '',
		customFontDataUrl: '',
		fontSize: 18,
		lineHeight: 1.6,
		letterSpacing: 0,
		wordSpacing: 0,
		maxColumnWidth: 65,
		background: 'cream',
		lineGuide: false,
		readingMask: false,
		alternatingLines: false,
		syllableHighlight: false,
		graphemeHighlight: false,
		mutedLetters: false,
		tts: false,
		ttsRate: 1,
		ttsEngine: 'auto',
		ttsVoiceUri: '',
		piperModelPath: '',
		falcMode: false,
		distractionFree: false
	},
	writing: {
		spellcheck: 'step_by_step',
		grammarCheck: 'step_by_step',
		wordPrediction: false,
		readBack: false,
		distractionFree: false,
		shortSentenceHint: true
	},
	sensory: {
		animations: false,
		sounds: false,
		notifications: 'minimal',
		reducedMotion: true,
		timerAlarmDataUrl: null
	},
	motor: {
		largeButtons: true,
		extendedClickTime: false,
		confirmBeforeAction: false,
		singleClickMode: false,
		dictationEnabled: false,
		scanMode: false
	},
	communication: {
		pictogramsEnabled: false,
		communicationCardsEnabled: false
	}
};

export function createEmptyFunctionalProfiles(): FunctionalProfiles {
	return {
		reading: [],
		writing: [],
		organization: [],
		sensory: [],
		motor: [],
		communication: [],
		language: []
	};
}
