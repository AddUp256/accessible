import Database from '@tauri-apps/plugin-sql';

import { isTauriRuntime, tauriGetSqliteDbUri } from '../tauri';

export const SQLITE_DB_URI = 'sqlite:accessible.db';

let resolvedSqliteUri: string | null = null;

export async function resolveSqliteDbUri(): Promise<string> {
	if (resolvedSqliteUri) return resolvedSqliteUri;
	if (!isTauriRuntime()) {
		resolvedSqliteUri = SQLITE_DB_URI;
		return resolvedSqliteUri;
	}
	resolvedSqliteUri = await tauriGetSqliteDbUri();
	return resolvedSqliteUri;
}

export async function getDatabase(): Promise<Database> {
	const uri = await resolveSqliteDbUri();
	return Database.load(uri);
}
