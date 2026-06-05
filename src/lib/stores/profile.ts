import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';
import type { AccessibleProfile, AppSettings, DeepPartial } from '$lib/types/profile';
import { createDefaultProfile } from '$lib/services/storage/default-profile';
import {
	activateStoredProfile,
	clearStoredProfile,
	loadProfile,
	saveProfile,
	saveProfileAsync
} from '$lib/services/storage/local';
import { isTauriRuntime } from '$lib/services/storage/tauri';
import { activeProfileId, refreshProfileSummaries } from '$lib/stores/profile-profiles';
import { canAutoPersistProfile } from '$lib/stores/profile-persistence';

function deepMergeSettings(base: AppSettings, partial: DeepPartial<AppSettings>): AppSettings {
	return {
		ui: { ...base.ui, ...partial.ui },
		reading: { ...base.reading, ...partial.reading },
		writing: { ...base.writing, ...partial.writing },
		sensory: { ...base.sensory, ...partial.sensory },
		motor: { ...base.motor, ...partial.motor },
		communication: { ...base.communication, ...partial.communication }
	};
}

function touchProfile(profile: AccessibleProfile): AccessibleProfile {
	return {
		...profile,
		meta: { ...profile.meta, updatedAt: new Date().toISOString() }
	};
}

function createProfileStore() {
	const { subscribe, set, update } = writable<AccessibleProfile>(
		browser ? loadProfile() : createDefaultProfile()
	);

	let persistEnabled = true;
	let storageHydrated = !browser || !isTauriRuntime();

	if (browser) {
		subscribe((profile) => {
			if (
				!canAutoPersistProfile({
					persistEnabled,
					storageHydrated,
					guestMode: profile.privacy.guestMode
				})
			) {
				return;
			}
			saveProfile(profile);
		});
	}

	return {
		subscribe,
		set: (profile: AccessibleProfile) => set(touchProfile(profile)),
		update,
		patch: (fn: (profile: AccessibleProfile) => AccessibleProfile) =>
			update((profile) => touchProfile(fn(profile))),
		updateSettings: (partial: DeepPartial<AppSettings>) =>
			update((profile) =>
				touchProfile({
					...profile,
					settings: deepMergeSettings(profile.settings, partial)
				})
			),
		resetToDefault: () => {
			const fresh = createDefaultProfile();
			persistEnabled = false;
			set(fresh);
			persistEnabled = true;
			if (browser) saveProfile(fresh);
		},
		deleteAllData: () => {
			clearStoredProfile();
			persistEnabled = false;
			set(createDefaultProfile());
			persistEnabled = true;
		},
		reloadFromStorage: () => {
			persistEnabled = false;
			set(loadProfile());
			persistEnabled = true;
			storageHydrated = true;
		},
		importProfile: (profile: AccessibleProfile) => {
			persistEnabled = false;
			set(profile);
			persistEnabled = true;
			storageHydrated = true;
			if (browser && !profile.privacy.guestMode) saveProfile(profile);
		},
		switchProfile: async (profileId: string) => {
			const current = get({ subscribe });
			if (!current.privacy.guestMode) {
				await saveProfileAsync(current);
			}
			const profile = await activateStoredProfile(profileId);
			persistEnabled = false;
			set(profile);
			persistEnabled = true;
			activeProfileId.set(profileId);
			await refreshProfileSummaries();
		},
		exportJson: (): string => JSON.stringify(get({ subscribe }), null, 2)
	};
}

export const profileStore = createProfileStore();

export const settings = derived(profileStore, ($profile) => $profile.settings);

export const privacy = derived(profileStore, ($profile) => $profile.privacy);
