import { PROFILE_VERSION, type AccessibleProfile } from '$lib/types/profile';
import { migrateProfile } from './migrate';

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export type ImportErrorCode = 'invalid' | 'not_app' | 'bad_version' | 'json';

export type ImportResult =
	| { ok: true; profile: AccessibleProfile }
	| { ok: false; error: string; code: ImportErrorCode; version?: string };

/** Valide un fichier JSON importé avant remplacement du profil local. */
export function parseImportedProfile(raw: unknown): ImportResult {
	if (!isObject(raw)) {
		return { ok: false, code: 'invalid', error: 'Le fichier n\'est pas un profil valide.' };
	}

	if (raw.app !== 'Accessible') {
		return { ok: false, code: 'not_app', error: 'Ce fichier n\'est pas un profil Accessible.' };
	}

	if (raw.profileVersion !== PROFILE_VERSION) {
		return {
			ok: false,
			code: 'bad_version',
			version: String(raw.profileVersion),
			error: `Version de profil non supportée (${String(raw.profileVersion)}). Version attendue : ${PROFILE_VERSION}.`
		};
	}

	return { ok: true, profile: migrateProfile(raw) };
}

export function parseImportedProfileText(text: string): ImportResult {
	try {
		return parseImportedProfile(JSON.parse(text) as unknown);
	} catch {
		return { ok: false, code: 'json', error: 'Le fichier JSON est illisible.' };
	}
}
