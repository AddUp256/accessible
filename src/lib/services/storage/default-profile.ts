import {
	DEFAULT_APP_SETTINGS,
	DEFAULT_COMMUNICATOR_DATA,
	DEFAULT_COMPREHENSION_DATA,
	DEFAULT_MEMORIZATION_DATA,
	DEFAULT_NOTES_DATA,
	DEFAULT_ORGANIZER_DATA,
	PROFILE_VERSION,
	createEmptyFunctionalProfiles,
	type AccessibleProfile
} from '$lib/types/profile';

export function createDefaultProfile(): AccessibleProfile {
	const now = new Date().toISOString();

	return {
		app: 'Accessible',
		profileVersion: PROFILE_VERSION,
		meta: {
			createdAt: now,
			updatedAt: now,
			locale: 'fr',
			appMode: 'student'
		},
		declaredProfiles: {
			medicalOrAdministrative: [],
			visibleInExports: false
		},
		functionalProfiles: createEmptyFunctionalProfiles(),
		settings: structuredClone(DEFAULT_APP_SETTINGS),
		rejectedSettings: [],
		onboarding: {
			path: null,
			completedSteps: [],
			comparisons: []
		},
		activatedTools: [],
		privacy: {
			guestMode: false,
			historyEnabled: true
		},
		organizer: structuredClone(DEFAULT_ORGANIZER_DATA),
		communicator: structuredClone(DEFAULT_COMMUNICATOR_DATA),
		notes: structuredClone(DEFAULT_NOTES_DATA),
		memorization: structuredClone(DEFAULT_MEMORIZATION_DATA),
		comprehension: structuredClone(DEFAULT_COMPREHENSION_DATA)
	};
}
