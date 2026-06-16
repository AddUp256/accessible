/** R?le : Service de stockage local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { browser } from '$app/environment';

import type { AccessibleProfile } from '$lib/types/profile';

import { migrateProfile } from '../migrate';
import {
	createSalt,
	decryptWithKey,
	deriveKey,
	deriveKeyFromEnvelope,
	encryptWithKey,
	getEnvelopeSalt,
	isEncryptedEnvelope,
	parseEnvelopeJson,
	verifyPassword
} from './crypto';
import { readEncryptionFlag, writeEncryptionFlag } from './meta';
import {
	clearSessionKey,
	getSessionKey,
	getSessionSalt,
	isSessionUnlocked,
	setSessionKey
} from './session';
import type { StorageEncryptionState } from './types';
import { isTauriRuntime, tauriLoadProfileFile } from '../tauri';
import { getDatabase } from '../sqlite/db';
import { STORAGE_KEY } from '../constants';
import { persistWrappedProfile } from '../persist';

export { isSessionUnlocked, clearSessionKey } from './session';
export { isEncryptedEnvelope } from './crypto';

export async function probeStorageEncryption(): Promise<StorageEncryptionState> {
	if (!browser) return 'empty';

	const flagged = await readEncryptionFlag();

	if (isTauriRuntime()) {
		const raw = await loadRawActiveContent();
		if (!raw) return flagged ? 'encrypted' : 'empty';
		return detectContentState(raw, flagged);
	}

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return flagged ? 'encrypted' : 'empty';
	return detectContentState(raw, flagged);
}

function detectContentState(raw: string, flagged: boolean): StorageEncryptionState {
	try {
		const parsed = parseEnvelopeJson(raw);
		if (isEncryptedEnvelope(parsed)) return 'encrypted';
		if (typeof parsed === 'object' && parsed !== null && (parsed as { app?: string }).app === 'Accessible') {
			return 'plain';
		}
	} catch {
		return flagged ? 'encrypted' : 'empty';
	}
	return flagged ? 'encrypted' : 'plain';
}

async function loadRawActiveContent(): Promise<string | null> {
	if (!isTauriRuntime()) return null;

	const db = await getDatabase();
	const activeRows = await db.select<Array<{ value: string }>>(
		"SELECT value FROM storage_meta WHERE key = 'active_profile_id'"
	);
	const profileId = activeRows[0]?.value ?? 'profile-default';
	const rows = await db.select<Array<{ content: string }>>(
		'SELECT content FROM user_profiles WHERE id = $1',
		[profileId]
	);
	if (rows[0]?.content) return rows[0].content;

	const legacy = await db.select<Array<{ content: string }>>(
		'SELECT content FROM profile WHERE id = 1'
	);
	if (legacy[0]?.content) return legacy[0].content;

	return tauriLoadProfileFile();
}

async function loadRawStoredContent(): Promise<string | null> {
	if (!browser) return null;

	if (isTauriRuntime()) {
		return loadRawActiveContent();
	}

	return localStorage.getItem(STORAGE_KEY);
}

export async function parseProfileContent(content: string): Promise<AccessibleProfile> {
	const parsed = parseEnvelopeJson(content);
	if (isEncryptedEnvelope(parsed)) {
		const key = getSessionKey();
		if (!key) {
			throw new Error('Profil chiffré — mot de passe requis.');
		}
		const plaintext = await decryptWithKey(parsed, key);
		return migrateProfile(JSON.parse(plaintext) as unknown);
	}
	return migrateProfile(parsed);
}

export async function wrapProfileForStorage(profile: AccessibleProfile): Promise<string> {
	const encrypted = await readEncryptionFlag();
	const key = getSessionKey();
	const salt = getSessionSalt();

	if (encrypted && key && salt) {
		const envelope = await encryptWithKey(JSON.stringify(profile), key, salt);
		return JSON.stringify(envelope);
	}

	if (encrypted && key && !salt) {
		throw new Error('Session de chiffrement incomplète. Verrouillez puis déverrouillez le profil.');
	}

	return JSON.stringify(profile);
}

export async function unlockWithPassword(password: string): Promise<AccessibleProfile> {
	const raw = await loadRawStoredContent();
	if (!raw) {
		throw new Error('Aucun profil à déverrouiller.');
	}

	const parsed = parseEnvelopeJson(raw);
	if (!isEncryptedEnvelope(parsed)) {
		throw new Error('Le profil n\'est pas chiffré.');
	}

	const valid = await verifyPassword(parsed, password);
	if (!valid) {
		throw new Error('Mot de passe incorrect.');
	}

	const key = await deriveKeyFromEnvelope(password, parsed);
	setSessionKey(key, getEnvelopeSalt(parsed));
	return parseProfileContent(raw);
}

export async function enableProfileEncryption(
	password: string,
	profile: AccessibleProfile
): Promise<void> {
	if (password.length < 8) {
		throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
	}

	const salt = createSalt();
	const key = await deriveKey(password, salt);
	setSessionKey(key, salt);
	await writeEncryptionFlag(true);

	const content = await wrapProfileForStorage(profile);
	await persistWrappedProfile(profile, content);
}

export async function disableProfileEncryption(
	password: string,
	profile: AccessibleProfile
): Promise<void> {
	const raw = await loadRawStoredContent();
	if (!raw) {
		throw new Error('Aucun profil chiffré trouvé.');
	}

	const parsed = parseEnvelopeJson(raw);
	if (!isEncryptedEnvelope(parsed)) {
		throw new Error('Le chiffrement n\'est pas actif.');
	}

	const valid = await verifyPassword(parsed, password);
	if (!valid) {
		throw new Error('Mot de passe incorrect.');
	}

	clearSessionKey();
	await writeEncryptionFlag(false);

	const content = await wrapProfileForStorage(profile);
	await persistWrappedProfile(profile, content);
}

export async function changeProfilePassword(
	currentPassword: string,
	newPassword: string,
	profile: AccessibleProfile
): Promise<void> {
	if (newPassword.length < 8) {
		throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
	}

	const raw = await loadRawStoredContent();
	if (!raw) throw new Error('Aucun profil chiffré trouvé.');

	const parsed = parseEnvelopeJson(raw);
	if (!isEncryptedEnvelope(parsed)) {
		throw new Error('Le chiffrement n\'est pas actif.');
	}

	const valid = await verifyPassword(parsed, currentPassword);
	if (!valid) {
		throw new Error('Mot de passe actuel incorrect.');
	}

	const salt = createSalt();
	const key = await deriveKey(newPassword, salt);
	setSessionKey(key, salt);

	const content = await wrapProfileForStorage(profile);
	await persistWrappedProfile(profile, content);
}

export async function canPersistProfile(): Promise<boolean> {
	const encrypted = await readEncryptionFlag();
	if (!encrypted) return true;
	return isSessionUnlocked();
}

export async function isProfileEncryptionEnabled(): Promise<boolean> {
	return readEncryptionFlag();
}

export function lockProfileSession(): void {
	clearSessionKey();
}
