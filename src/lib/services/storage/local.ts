import { browser } from '$app/environment';
import type { AccessibleProfile } from '$lib/types/profile';
import { STORAGE_KEY } from './constants';
import { createDefaultProfile } from './default-profile';
import { migrateProfile } from './migrate';
import {
	canPersistProfile,
	isEncryptedEnvelope,
	isSessionUnlocked,
	parseProfileContent,
	probeStorageEncryption,
	wrapProfileForStorage
} from './encryption';
import { writeEncryptionFlag } from './encryption/meta';
import { clearSessionKey } from './encryption/session';
import { persistWrappedProfile } from './persist';
import {
	clearSqliteProfile,
	createStoredProfile,
	deleteStoredProfile,
	ensureStorageReady,
	listStoredProfiles,
	loadActiveProfileId,
	loadProfileById,
	loadProfileFromSqlite,
	switchStoredProfile,
	type StorageInitResult,
	type StoredProfileSummary
} from './sqlite';
import {
	isTauriRuntime,
	tauriDeleteProfileFile,
	tauriLoadProfileFile
} from './tauri';

export { STORAGE_KEY };

export type { StorageInitResult, StoredProfileSummary };

export interface ProfileInitResult {
	locked: boolean;
	initResult: StorageInitResult | null;
}

export function loadProfile(): AccessibleProfile {
	if (!browser) return createDefaultProfile();

	if (isTauriRuntime()) return createDefaultProfile();

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return createDefaultProfile();
		const parsed = JSON.parse(raw) as unknown;
		if (isEncryptedEnvelope(parsed)) return createDefaultProfile();
		return migrateProfile(parsed);
	} catch {
		return createDefaultProfile();
	}
}

export async function initProfileStorage(): Promise<StorageInitResult | null> {
	if (!browser || !isTauriRuntime()) return null;
	return ensureStorageReady();
}

export async function loadProfileAsync(): Promise<AccessibleProfile> {
	if (!browser) return createDefaultProfile();

	if (isTauriRuntime()) {
		await ensureStorageReady();
		try {
			const fromSqlite = await loadProfileFromSqlite();
			if (fromSqlite) return fromSqlite;

			const raw = await tauriLoadProfileFile();
			if (!raw) return createDefaultProfile();
			return parseProfileContent(raw);
		} catch {
			return createDefaultProfile();
		}
	}

	return loadProfile();
}

export function saveProfile(profile: AccessibleProfile): void {
	if (!browser) return;

	void saveProfileAsync(profile);
}

export async function saveProfileAsync(profile: AccessibleProfile): Promise<void> {
	if (!browser) return;
	if (!(await canPersistProfile())) return;

	if (isTauriRuntime()) {
		await ensureStorageReady();
	}

	const content = await wrapProfileForStorage(profile);
	await persistWrappedProfile(profile, content);
}

export async function clearStoredProfileAsync(): Promise<void> {
	if (!browser) return;

	clearSessionKey();
	await writeEncryptionFlag(false);

	if (isTauriRuntime()) {
		await ensureStorageReady();
		await clearSqliteProfile();
		await tauriDeleteProfileFile();
		return;
	}

	localStorage.removeItem(STORAGE_KEY);
}

export function clearStoredProfile(): void {
	if (!browser) return;
	void clearStoredProfileAsync();
}

export async function fetchStoredProfiles(): Promise<StoredProfileSummary[]> {
	if (!browser || !isTauriRuntime()) {
		return [{ id: 'browser', name: 'Profil navigateur', updatedAt: new Date().toISOString() }];
	}
	return listStoredProfiles();
}

export async function fetchActiveProfileId(): Promise<string | null> {
	if (!browser || !isTauriRuntime()) return null;
	await ensureStorageReady();
	return loadActiveProfileId();
}

export async function createNamedProfile(name: string): Promise<StoredProfileSummary> {
	if (!isTauriRuntime()) {
		throw new Error('Multi-profils disponible dans l\'application installée.');
	}
	await ensureStorageReady();
	return createStoredProfile(name);
}

export async function removeNamedProfile(profileId: string): Promise<void> {
	if (!isTauriRuntime()) return;
	await ensureStorageReady();
	await deleteStoredProfile(profileId);
}

export async function activateStoredProfile(profileId: string): Promise<AccessibleProfile> {
	if (!isTauriRuntime()) {
		throw new Error('Multi-profils disponible dans l\'application installée.');
	}
	await ensureStorageReady();
	return switchStoredProfile(profileId);
}

export function exportProfileJson(profile: AccessibleProfile): string {
	return JSON.stringify(profile, null, 2);
}

export async function initProfileFromStorage(
	onLoaded: (profile: AccessibleProfile) => void
): Promise<ProfileInitResult> {
	const initResult = await initProfileStorage();
	const state = await probeStorageEncryption();

	if (state === 'encrypted' && !isSessionUnlocked()) {
		return { locked: true, initResult };
	}

	const profile = await loadProfileAsync();
	onLoaded(profile);
	return { locked: false, initResult };
}

export { probeStorageEncryption, isSessionUnlocked } from './encryption';
