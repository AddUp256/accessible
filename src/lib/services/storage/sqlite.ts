import type { AccessibleProfile } from '$lib/types/profile';

import { migrateProfile } from './migrate';
import { parseProfileContent, wrapProfileForStorage, isEncryptedEnvelope } from './encryption';
import { tauriLoadProfileFile, tauriSaveProfileFile } from './tauri';
import { getDatabase, resolveSqliteDbUri, SQLITE_DB_URI } from './sqlite/db';
import {
	clearAllUserProfiles,
	createUserProfile,
	deleteUserProfile,
	getActiveProfileId,
	listUserProfiles,
	loadLegacyProfile,
	loadUserProfile,
	resolveActiveProfileId,
	saveUserProfile,
	setActiveProfileId,
	DEFAULT_PROFILE_ID,
	type StoredProfileSummary
} from './sqlite/profiles';
import {
	clearNormalizedModules,
	getModuleStorageStats,
	profileNeedsNormalizedSync,
	syncNormalizedModules,
	type ModuleStorageStats
} from './sqlite/sync-modules';

export type StorageBackend = 'json' | 'sqlite';

export interface StorageInitResult {
	backend: StorageBackend;
	migratedFromJson: boolean;
	normalizedSynced: boolean;
}

export type { ModuleStorageStats, StoredProfileSummary };

let initPromise: Promise<StorageInitResult> | null = null;
let storageReady = false;
let cachedActiveProfileId: string | null = null;

export { getDatabase, resolveSqliteDbUri, SQLITE_DB_URI };

export function getCachedActiveProfileId(): string | null {
	return cachedActiveProfileId;
}

export async function loadActiveProfileId(): Promise<string | null> {
	if (!storageReady) return cachedActiveProfileId;
	const db = await getDatabase();
	cachedActiveProfileId = await getActiveProfileId(db);
	return cachedActiveProfileId;
}

export async function loadProfileFromSqlite(profileId?: string): Promise<AccessibleProfile | null> {
	const db = await getDatabase();
	const id = profileId ?? (await resolveActiveProfileId(db));
	cachedActiveProfileId = id;

	const fromUserProfiles = await loadUserProfile(db, id);
	if (fromUserProfiles) return fromUserProfiles;

	return loadLegacyProfile(db);
}

export async function loadProfileById(profileId: string): Promise<AccessibleProfile | null> {
	const db = await getDatabase();
	return loadUserProfile(db, profileId);
}

export async function saveProfileToSqlite(
	profile: AccessibleProfile,
	profileId?: string
): Promise<void> {
	const db = await getDatabase();
	const id = profileId ?? (await resolveActiveProfileId(db));
	cachedActiveProfileId = id;

	await saveUserProfile(db, id, profile);
	await setActiveProfileId(db, id);
	await syncNormalizedModules(db, profile);
	await db.execute(
		`INSERT INTO storage_meta (key, value) VALUES ('backend', 'sqlite')
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value`
	);

	// Legacy backup row for export compatibility
	const now = new Date().toISOString();
	const content = await wrapProfileForStorage(profile);
	await db.execute(
		`INSERT INTO profile (id, content, updated_at) VALUES (1, $1, $2)
		 ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at`,
		[content, now]
	);
}

export async function clearSqliteProfile(): Promise<void> {
	const db = await getDatabase();
	await clearNormalizedModules(db);
	await clearAllUserProfiles(db);
	await db.execute('DELETE FROM profile WHERE id = 1');
	await db.execute("DELETE FROM storage_meta WHERE key = 'backend'");
	cachedActiveProfileId = null;
}

export async function fetchModuleStorageStats(): Promise<ModuleStorageStats | null> {
	if (!storageReady) return null;
	const db = await getDatabase();
	return getModuleStorageStats(db);
}

export async function getStorageBackend(): Promise<StorageBackend> {
	const db = await getDatabase();
	const rows = await db.select<Array<{ value: string }>>(
		"SELECT value FROM storage_meta WHERE key = 'backend'"
	);
	return rows[0]?.value === 'sqlite' ? 'sqlite' : 'json';
}

export async function listStoredProfiles(): Promise<StoredProfileSummary[]> {
	await ensureStorageReady();
	const db = await getDatabase();
	return listUserProfiles(db);
}

export async function createStoredProfile(name: string): Promise<StoredProfileSummary> {
	const db = await getDatabase();
	return createUserProfile(db, name);
}

export async function deleteStoredProfile(profileId: string): Promise<void> {
	const db = await getDatabase();
	await deleteUserProfile(db, profileId);
	if (cachedActiveProfileId === profileId) {
		cachedActiveProfileId = await getActiveProfileId(db);
	}
}

export async function switchStoredProfile(profileId: string): Promise<AccessibleProfile> {
	const db = await getDatabase();
	const profile = await loadUserProfile(db, profileId);
	if (!profile) {
		throw new Error('Profil introuvable.');
	}
	await setActiveProfileId(db, profileId);
	cachedActiveProfileId = profileId;
	await syncNormalizedModules(db, profile);
	return profile;
}

export async function initSqliteStorage(): Promise<StorageInitResult> {
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const db = await getDatabase();
		cachedActiveProfileId = await resolveActiveProfileId(db);

		const existing = await loadProfileFromSqlite();
		if (existing) {
			const stats = await getModuleStorageStats(db);
			const needsSync = profileNeedsNormalizedSync(existing, stats);
			if (needsSync) {
				await syncNormalizedModules(db, existing);
			}
			return {
				backend: 'sqlite' as const,
				migratedFromJson: false,
				normalizedSynced: needsSync
			};
		}

		const raw = await tauriLoadProfileFile();
		if (raw) {
			try {
				const parsed = JSON.parse(raw) as unknown;
				if (isEncryptedEnvelope(parsed)) {
					return { backend: 'json' as const, migratedFromJson: false, normalizedSynced: false };
				}
				const profile = migrateProfile(parsed);
				await saveUserProfile(db, DEFAULT_PROFILE_ID, profile, 'Profil principal');
				await setActiveProfileId(db, DEFAULT_PROFILE_ID);
				cachedActiveProfileId = DEFAULT_PROFILE_ID;
				await syncNormalizedModules(db, profile);
				await tauriSaveProfileFile(JSON.stringify(profile));
				return {
					backend: 'sqlite' as const,
					migratedFromJson: true,
					normalizedSynced: true
				};
			} catch {
				return { backend: 'json' as const, migratedFromJson: false, normalizedSynced: false };
			}
		}

		return { backend: 'json' as const, migratedFromJson: false, normalizedSynced: false };
	})();

	return initPromise;
}

export async function ensureStorageReady(): Promise<StorageInitResult> {
	if (storageReady && initPromise) {
		return initPromise;
	}

	const result = await initSqliteStorage();
	storageReady = true;
	return result;
}

export function isStorageReady(): boolean {
	return storageReady;
}
