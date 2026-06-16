/** R?le : Service de stockage local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { invoke } from '@tauri-apps/api/core';

export function isTauriRuntime(): boolean {
	return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function tauriDetectPortableMode(): Promise<boolean> {
	return invoke<boolean>('detect_portable_mode');
}

export async function tauriGetStoragePath(): Promise<string> {
	return invoke<string>('get_storage_path');
}

export async function tauriLoadProfileFile(): Promise<string | null> {
	return invoke<string | null>('load_profile_file');
}

export async function tauriSaveProfileFile(content: string): Promise<void> {
	await invoke('save_profile_file', { content });
}

export async function tauriDeleteProfileFile(): Promise<void> {
	await invoke('delete_profile_file');
}

export async function tauriEnablePortableMode(): Promise<string> {
	return invoke<string>('enable_portable_mode');
}

export async function tauriGetSqliteDbPath(): Promise<string> {
	return invoke<string>('get_sqlite_db_path');
}

export async function tauriGetSqliteDbUri(): Promise<string> {
	return invoke<string>('get_sqlite_db_uri');
}
