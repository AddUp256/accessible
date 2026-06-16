/** R?le : Service de packs de langue : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { invoke } from '@tauri-apps/api/core';

import type { LanguagePackPayload } from '$lib/i18n/language-pack-types';

export async function tauriListInstalledLanguagePacks(): Promise<string[]> {
	return invoke<string[]>('list_installed_language_packs');
}

export async function tauriReadLanguagePack(code: string): Promise<LanguagePackPayload> {
	return invoke<LanguagePackPayload>('read_language_pack', { code });
}

export async function tauriGetLanguagePacksDirectory(): Promise<string> {
	return invoke<string>('get_language_packs_directory');
}
