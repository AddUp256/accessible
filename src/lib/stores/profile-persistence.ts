export interface ProfilePersistenceState {
	persistEnabled: boolean;
	storageHydrated: boolean;
	guestMode: boolean;
}

export function canAutoPersistProfile(state: ProfilePersistenceState): boolean {
	return state.persistEnabled && state.storageHydrated && !state.guestMode;
}
