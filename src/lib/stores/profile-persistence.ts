/** R?le : Store Svelte Profile Persistence : centralise l??tat partag? et sa persistance. */
export interface ProfilePersistenceState {
	persistEnabled: boolean;
	storageHydrated: boolean;
	guestMode: boolean;
}

export function canAutoPersistProfile(state: ProfilePersistenceState): boolean {
	return state.persistEnabled && state.storageHydrated && !state.guestMode;
}
