/** R?le : Service de stockage local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import {
	PROFILE_VERSION,
	type AccessibleProfile,
	type AppSettings,
	type CommunicationCardOverride
} from '$lib/types/profile';
import { createDefaultProfile } from './default-profile';

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeSettings(stored: unknown, defaults: AppSettings): AppSettings {
	if (!isObject(stored)) return defaults;

	return {
		ui: { ...defaults.ui, ...(isObject(stored.ui) ? stored.ui : {}) },
		reading: { ...defaults.reading, ...(isObject(stored.reading) ? stored.reading : {}) },
		writing: { ...defaults.writing, ...(isObject(stored.writing) ? stored.writing : {}) },
		sensory: { ...defaults.sensory, ...(isObject(stored.sensory) ? stored.sensory : {}) },
		motor: { ...defaults.motor, ...(isObject(stored.motor) ? stored.motor : {}) },
		communication: {
			...defaults.communication,
			...(isObject(stored.communication) ? stored.communication : {})
		}
	} as AppSettings;
}

/** Valide et normalise un profil chargé ; retourne un profil par défaut si invalide. */
export function migrateProfile(raw: unknown): AccessibleProfile {
	const defaults = createDefaultProfile();

	if (!isObject(raw)) return defaults;
	if (raw.app !== 'Accessible') return defaults;

	const version = raw.profileVersion;
	if (version !== PROFILE_VERSION) {
		// Futures migrations par version
		return defaults;
	}

	const meta = isObject(raw.meta) ? raw.meta : {};
	const declared = isObject(raw.declaredProfiles) ? raw.declaredProfiles : {};
	const functional = isObject(raw.functionalProfiles) ? raw.functionalProfiles : {};
	const onboarding = isObject(raw.onboarding) ? raw.onboarding : {};
	const privacy = isObject(raw.privacy) ? raw.privacy : {};
	const organizerRaw = isObject(raw.organizer) ? raw.organizer : {};
	const communicatorRaw = isObject(raw.communicator) ? raw.communicator : {};
	const notesRaw = isObject(raw.notes) ? raw.notes : {};
	const memorizationRaw = isObject(raw.memorization) ? raw.memorization : {};
	const comprehensionRaw = isObject(raw.comprehension) ? raw.comprehension : {};

	return {
		app: 'Accessible',
		profileVersion: PROFILE_VERSION,
		meta: {
			createdAt: typeof meta.createdAt === 'string' ? meta.createdAt : defaults.meta.createdAt,
			updatedAt: typeof meta.updatedAt === 'string' ? meta.updatedAt : defaults.meta.updatedAt,
			locale: 'fr',
			appMode:
				meta.appMode === 'student' ||
				meta.appMode === 'companion' ||
				meta.appMode === 'teacher' ||
				meta.appMode === 'verySimple' ||
				meta.appMode === 'expert'
					? meta.appMode
					: defaults.meta.appMode
		},
		declaredProfiles: {
			medicalOrAdministrative: Array.isArray(declared.medicalOrAdministrative)
				? declared.medicalOrAdministrative
				: [],
			visibleInExports: declared.visibleInExports === true
		},
		functionalProfiles: {
			reading: Array.isArray(functional.reading) ? functional.reading : [],
			writing: Array.isArray(functional.writing) ? functional.writing : [],
			organization: Array.isArray(functional.organization) ? functional.organization : [],
			sensory: Array.isArray(functional.sensory) ? functional.sensory : [],
			motor: Array.isArray(functional.motor) ? functional.motor : [],
			communication: Array.isArray(functional.communication) ? functional.communication : [],
			language: Array.isArray(functional.language) ? functional.language : []
		},
		settings: mergeSettings(raw.settings, defaults.settings),
		rejectedSettings: Array.isArray(raw.rejectedSettings) ? raw.rejectedSettings : [],
		onboarding: {
			path:
				raw.onboarding &&
				isObject(raw.onboarding) &&
				(raw.onboarding.path === 'known' ||
					raw.onboarding.path === 'declared' ||
					raw.onboarding.path === 'discovery')
					? raw.onboarding.path
					: null,
			completedSteps: Array.isArray(onboarding.completedSteps) ? onboarding.completedSteps : [],
			comparisons: Array.isArray(onboarding.comparisons) ? onboarding.comparisons : [],
			diagnosticAnswers: Array.isArray(onboarding.diagnosticAnswers)
				? onboarding.diagnosticAnswers.filter((value): value is string => typeof value === 'string')
				: []
		},
		activatedTools: Array.isArray(raw.activatedTools) ? raw.activatedTools : [],
		privacy: {
			guestMode: privacy.guestMode === true,
			historyEnabled: privacy.historyEnabled !== false
		},
		organizer: {
			checklists: Array.isArray(organizerRaw.checklists) ? organizerRaw.checklists : [],
			kanbanTasks: Array.isArray(organizerRaw.kanbanTasks) ? organizerRaw.kanbanTasks : [],
			visualRoutines: Array.isArray(organizerRaw.visualRoutines) ? organizerRaw.visualRoutines : [],
			mindMaps: Array.isArray(organizerRaw.mindMaps) ? organizerRaw.mindMaps : []
		},
		communicator: {
			personalCards: Array.isArray(communicatorRaw.personalCards)
				? communicatorRaw.personalCards
				: [],
			savedPictograms: Array.isArray(communicatorRaw.savedPictograms)
				? communicatorRaw.savedPictograms
				: [],
			builtInCardOverrides:
				isObject(communicatorRaw.builtInCardOverrides) &&
				!Array.isArray(communicatorRaw.builtInCardOverrides)
					? (communicatorRaw.builtInCardOverrides as Record<string, CommunicationCardOverride>)
					: {}
		},
		notes: {
			notes: Array.isArray(notesRaw.notes) ? notesRaw.notes : []
		},
		memorization: {
			decks: Array.isArray(memorizationRaw.decks) ? memorizationRaw.decks : []
		},
		comprehension: {
			glossary: Array.isArray(comprehensionRaw.glossary) ? comprehensionRaw.glossary : []
		}
	};
}
