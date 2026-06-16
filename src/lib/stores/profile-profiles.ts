/** R?le : Store Svelte Profile Profiles : centralise l??tat partag? et sa persistance. */
import { writable } from 'svelte/store';

import { fetchActiveProfileId, fetchStoredProfiles, type StoredProfileSummary } from '$lib/services/storage/local';

export const activeProfileId = writable<string | null>(null);
export const profileSummaries = writable<StoredProfileSummary[]>([]);

export async function refreshProfileSummaries(): Promise<void> {
	profileSummaries.set(await fetchStoredProfiles());
	const activeId = await fetchActiveProfileId();
	activeProfileId.set(activeId);
}
