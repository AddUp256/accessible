/** R?le : Service de stockage local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { browser } from '$app/environment';

import type { AccessibleProfile } from '$lib/types/profile';

import { STORAGE_KEY } from './constants';
import { getDatabase } from './sqlite/db';
import { syncNormalizedModules } from './sqlite/sync-modules';
import { isTauriRuntime, tauriSaveProfileFile } from './tauri';

const DEFAULT_PROFILE_ID = 'profile-default';

async function resolveActiveProfileId(
	db: Awaited<ReturnType<typeof getDatabase>>,
	profileId?: string
): Promise<string> {
	if (profileId) return profileId;
	const rows = await db.select<Array<{ value: string }>>(
		"SELECT value FROM storage_meta WHERE key = 'active_profile_id'"
	);
	return rows[0]?.value ?? DEFAULT_PROFILE_ID;
}

async function saveProfileContent(
	db: Awaited<ReturnType<typeof getDatabase>>,
	profileId: string,
	profile: AccessibleProfile,
	content: string
): Promise<void> {
	const now = new Date().toISOString();
	const existing = await db.select<Array<{ name: string; created_at: string }>>(
		'SELECT name, created_at FROM user_profiles WHERE id = $1',
		[profileId]
	);
	const profileName = existing[0]?.name ?? 'Profil principal';
	const createdAt = existing[0]?.created_at ?? profile.meta.createdAt ?? now;

	await db.execute(
		`INSERT INTO user_profiles (id, name, content, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT(id) DO UPDATE SET
		   name = excluded.name,
		   content = excluded.content,
		   updated_at = excluded.updated_at`,
		[profileId, profileName, content, createdAt, now]
	);
}

export async function persistWrappedProfile(
	profile: AccessibleProfile,
	content: string,
	profileId?: string
): Promise<void> {
	if (!browser) return;

	if (!isTauriRuntime()) {
		localStorage.setItem(STORAGE_KEY, content);
		return;
	}

	const db = await getDatabase();
	const id = await resolveActiveProfileId(db, profileId);

	await saveProfileContent(db, id, profile, content);
	await db.execute(
		`INSERT INTO storage_meta (key, value) VALUES ('active_profile_id', $1)
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
		[id]
	);
	await syncNormalizedModules(db, profile);
	await db.execute(
		`INSERT INTO storage_meta (key, value) VALUES ('backend', 'sqlite')
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value`
	);

	const now = new Date().toISOString();
	await db.execute(
		`INSERT INTO profile (id, content, updated_at) VALUES (1, $1, $2)
		 ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at`,
		[content, now]
	);
	await tauriSaveProfileFile(content);
}
