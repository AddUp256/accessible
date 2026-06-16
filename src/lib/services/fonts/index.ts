/** Rôle : service de détection des polices locales et du dossier de polices Accessible. */
import { browser } from '$app/environment';
import { invoke } from '@tauri-apps/api/core';

import { isTauriRuntime } from '$lib/services/storage/tauri';

export interface DetectedFont {
	name: string;
	source: string;
	path?: string;
}

type LocalFontData = {
	family?: string;
	fullName?: string;
	postscriptName?: string;
};

declare global {
	interface Window {
		queryLocalFonts?: () => Promise<LocalFontData[]>;
	}
}

export async function getAccessibleFontsDirectory(): Promise<string | null> {
	if (!isTauriRuntime()) return null;
	return invoke<string>('get_custom_fonts_directory');
}

export async function openAccessibleFontsDirectory(): Promise<string | null> {
	if (!isTauriRuntime()) return null;
	return invoke<string>('open_custom_fonts_directory');
}

export async function detectInstalledFonts(): Promise<DetectedFont[]> {
	if (!browser) return [];

	if (isTauriRuntime()) {
		return invoke<DetectedFont[]>('list_installed_fonts');
	}

	if (!window.queryLocalFonts) {
		return [];
	}

	const fonts = await window.queryLocalFonts();
	const unique = new Map<string, DetectedFont>();
	for (const font of fonts) {
		const name = font.family || font.fullName || font.postscriptName;
		if (!name) continue;
		unique.set(name.toLocaleLowerCase(), {
			name,
			source: 'Ordinateur'
		});
	}
	return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}
