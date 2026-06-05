import type Database from '@tauri-apps/plugin-sql';

import type { AccessibleProfile } from '$lib/types/profile';
import { createDefaultProfile } from '../default-profile';
import { parseProfileContent, wrapProfileForStorage } from '../encryption';

export const DEFAULT_PROFILE_ID = 'profile-default';

export interface StoredProfileSummary {
	id: string;
	name: string;
	updatedAt: string;
}

function createProfileId(): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return `profile-${crypto.randomUUID()}`;
	}
	return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getActiveProfileId(db: Database): Promise<string | null> {
	const rows = await db.select<Array<{ value: string }>>(
		"SELECT value FROM storage_meta WHERE key = 'active_profile_id'"
	);
	return rows[0]?.value ?? null;
}

export async function setActiveProfileId(db: Database, profileId: string): Promise<void> {
	await db.execute(
		`INSERT INTO storage_meta (key, value) VALUES ('active_profile_id', $1)
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
		[profileId]
	);
}

export async function resolveActiveProfileId(db: Database): Promise<string> {
	const activeId = await getActiveProfileId(db);
	if (activeId) return activeId;
	return DEFAULT_PROFILE_ID;
}

export async function loadUserProfile(
	db: Database,
	profileId: string
): Promise<AccessibleProfile | null> {
	const rows = await db.select<Array<{ content: string }>>(
		'SELECT content FROM user_profiles WHERE id = $1',
		[profileId]
	);
	if (!rows[0]?.content) return null;
	return parseProfileContent(rows[0].content);
}

export async function loadLegacyProfile(db: Database): Promise<AccessibleProfile | null> {
	const rows = await db.select<Array<{ content: string }>>(
		'SELECT content FROM profile WHERE id = 1'
	);
	if (!rows[0]?.content) return null;
	return parseProfileContent(rows[0].content);
}

export async function saveUserProfile(
	db: Database,
	profileId: string,
	profile: AccessibleProfile,
	name?: string
): Promise<void> {
	const content = await wrapProfileForStorage(profile);
	await saveUserProfileContent(db, profileId, content, name, profile.meta.createdAt);
}

export async function saveUserProfileContent(
	db: Database,
	profileId: string,
	content: string,
	name?: string,
	createdAtFallback?: string
): Promise<void> {
	const now = new Date().toISOString();
	const existing = await db.select<Array<{ name: string; created_at: string }>>(
		'SELECT name, created_at FROM user_profiles WHERE id = $1',
		[profileId]
	);
	const profileName = name ?? existing[0]?.name ?? 'Profil principal';
	const createdAt = existing[0]?.created_at ?? createdAtFallback ?? now;

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

export async function listUserProfiles(db: Database): Promise<StoredProfileSummary[]> {
	const rows = await db.select<Array<{ id: string; name: string; updated_at: string }>>(
		'SELECT id, name, updated_at FROM user_profiles ORDER BY name COLLATE NOCASE'
	);
	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		updatedAt: row.updated_at
	}));
}

export async function createUserProfile(
	db: Database,
	name: string
): Promise<StoredProfileSummary> {
	const id = createProfileId();
	const profile = createDefaultProfile();
	const trimmedName = name.trim() || 'Nouveau profil';
	const now = new Date().toISOString();

	await db.execute(
		`INSERT INTO user_profiles (id, name, content, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5)`,
		[id, trimmedName, JSON.stringify(profile), now, now]
	);

	return { id, name: trimmedName, updatedAt: now };
}

export async function deleteUserProfile(db: Database, profileId: string): Promise<void> {
	const countRows = await db.select<Array<{ count: number }>>(
		'SELECT COUNT(*) as count FROM user_profiles'
	);
	if ((countRows[0]?.count ?? 0) <= 1) {
		throw new Error('Impossible de supprimer le dernier profil.');
	}

	await db.execute('DELETE FROM user_profiles WHERE id = $1', [profileId]);

	const activeId = await getActiveProfileId(db);
	if (activeId === profileId) {
		const remaining = await listUserProfiles(db);
		if (remaining[0]) {
			await setActiveProfileId(db, remaining[0].id);
		}
	}
}

export async function clearAllUserProfiles(db: Database): Promise<void> {
	await db.execute('DELETE FROM user_profiles');
	await db.execute("DELETE FROM storage_meta WHERE key = 'active_profile_id'");
}
