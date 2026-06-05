import { browser } from '$app/environment';

import { getDatabase } from '../sqlite/db';
import { isTauriRuntime } from '../tauri';

const META_KEY = 'profile_encryption';
const BROWSER_META_KEY = 'accessible-profile-encrypted';

export async function readEncryptionFlag(): Promise<boolean> {
	if (!browser) return false;

	if (isTauriRuntime()) {
		try {
			const db = await getDatabase();
			const rows = await db.select<Array<{ value: string }>>(
				'SELECT value FROM storage_meta WHERE key = $1',
				[META_KEY]
			);
			return rows[0]?.value === 'true';
		} catch {
			return false;
		}
	}

	return localStorage.getItem(BROWSER_META_KEY) === 'true';
}

export async function writeEncryptionFlag(enabled: boolean): Promise<void> {
	if (!browser) return;

	if (isTauriRuntime()) {
		const db = await getDatabase();
		if (enabled) {
			await db.execute(
				`INSERT INTO storage_meta (key, value) VALUES ($1, 'true')
				 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
				[META_KEY]
			);
		} else {
			await db.execute('DELETE FROM storage_meta WHERE key = $1', [META_KEY]);
		}
		return;
	}

	if (enabled) {
		localStorage.setItem(BROWSER_META_KEY, 'true');
	} else {
		localStorage.removeItem(BROWSER_META_KEY);
	}
}
