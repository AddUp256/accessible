import { browser } from '$app/environment';
import { writable } from 'svelte/store';

import { isTauriRuntime } from '$lib/services/storage/tauri';
import {
	tauriListInstalledLanguagePacks,
	tauriReadLanguagePack
} from '$lib/services/lang-packs/tauri';

import type { DynamicKey } from './ui-dynamic';
import { DYNAMIC_LOCALE_PACKS } from './ui-dynamic-locales';
import type { LanguagePackPayload } from './language-pack-types';
import { isPriorityLanguage, PRIORITY_LANGUAGE_CODES } from './priority-languages';
import type { UiKey } from './ui-translations';

/** Langues dont le pack est présent sur le disque (hors fr). */
export const installedLanguageCodes = writable<string[]>(['en']);

const packCache = new Map<string, LanguagePackPayload>();

let initPromise: Promise<void> | null = null;

/** Lecture synchrone (après init). */
export function getInstalledLanguageCodes(): string[] {
	let codes: string[] = ['en'];
	installedLanguageCodes.subscribe((v) => {
		codes = v;
	})();
	return codes;
}

export function isLanguagePackInstalled(code: string): boolean {
	if (code === 'fr') return true;
	return getInstalledLanguageCodes().includes(code);
}

export async function initLanguagePackRuntime(): Promise<void> {
	if (initPromise) return initPromise;
	initPromise = (async () => {
		installedLanguageCodes.set(['en']);
		if (!browser) return;

		if (isTauriRuntime()) {
			try {
				const codes = await tauriListInstalledLanguagePacks();
				installedLanguageCodes.set(mergeInstalled(codes));
				for (const code of mergeInstalled(codes)) {
					if (code !== 'en') await loadLanguagePack(code);
				}
			} catch {
				installedLanguageCodes.set(['en']);
			}
			return;
		}

		// Navigateur / dev : packs servis depuis static/lang-packs/
		try {
			const res = await fetch('/lang-packs/catalog.json');
			if (res.ok) {
				const catalog = (await res.json()) as { packs: { code: string }[] };
				const codes = catalog.packs.map((p) => p.code);
				installedLanguageCodes.set(mergeInstalled(codes));
				await Promise.all(codes.map((code) => loadLanguagePack(code)));
			} else {
				await loadEmbeddedDevFallback();
			}
		} catch {
			await loadEmbeddedDevFallback();
		}
	})();
	return initPromise;
}

function mergeInstalled(codes: string[]): string[] {
	const set = new Set<string>(['en', ...codes.filter((c) => c !== 'fr')]);
	return [...set];
}

async function loadEmbeddedDevFallback(): Promise<void> {
	const { getExplicitUiPack } = await import('./locale-packs/index');
	const { LANGUAGE_BY_CODE } = await import('./languages');

	for (const code of PRIORITY_LANGUAGE_CODES) {
		const ui = getExplicitUiPack(code) ?? {};
		const dynamic = DYNAMIC_LOCALE_PACKS[code] ?? {};
		const meta = LANGUAGE_BY_CODE[code];
		registerPack({
			manifest: {
				code,
				version: 1,
				labelFr: meta?.nameFr ?? code,
				nativeName: meta?.nativeName ?? code
			},
			ui,
			dynamic
		});
		installedLanguageCodes.update((list) => mergeInstalled([...list, code]));
	}
}

export async function loadLanguagePack(code: string): Promise<boolean> {
	if (packCache.has(code)) return true;
	if (!browser) return false;

	if (isTauriRuntime()) {
		try {
			const payload = await tauriReadLanguagePack(code);
			registerPack(payload);
			if (!getInstalledLanguageCodes().includes(code)) {
				installedLanguageCodes.update((list) => mergeInstalled([...list, code]));
			}
			return true;
		} catch {
			return false;
		}
	}

	try {
		const res = await fetch(`/lang-packs/${code}.json`);
		if (!res.ok) return false;
		const payload = (await res.json()) as LanguagePackPayload;
		registerPack(payload);
		if (!getInstalledLanguageCodes().includes(code)) {
			installedLanguageCodes.update((list) => mergeInstalled([...list, code]));
		}
		return true;
	} catch {
		return false;
	}
}

export function registerPack(payload: LanguagePackPayload): void {
	packCache.set(payload.manifest.code, payload);
}

export function getRuntimeUiTranslation(key: UiKey, lang: string): string | undefined {
	return packCache.get(lang)?.ui[key];
}

export function getRuntimeDynamicMessage(key: DynamicKey, lang: string): string | undefined {
	return packCache.get(lang)?.dynamic[key];
}

/** Précharge le pack de la langue secondaire si nécessaire. */
export async function ensureSecondaryLanguagePack(
	code: string,
	bilingualUi: boolean
): Promise<void> {
	if (!bilingualUi || code === 'fr' || code === 'en') return;
	if (!isPriorityLanguage(code)) return;
	await loadLanguagePack(code);
}

export function refreshInstalledLanguageCodes(codes: string[]): void {
	installedLanguageCodes.set(mergeInstalled(codes));
}

/** Re-scanne les packs sur disque (après installateur « packs seuls »). */
export async function refreshLanguagePackRuntime(): Promise<void> {
	if (!browser) return;

	if (isTauriRuntime()) {
		try {
			const codes = await tauriListInstalledLanguagePacks();
			refreshInstalledLanguageCodes(codes);
			for (const code of mergeInstalled(codes)) {
				if (code !== 'en') await loadLanguagePack(code);
			}
		} catch {
			/* garde la liste en cache */
		}
		return;
	}

	try {
		const res = await fetch('/lang-packs/catalog.json');
		if (!res.ok) return;
		const catalog = (await res.json()) as { packs: { code: string }[] };
		const codes = catalog.packs.map((p) => p.code);
		refreshInstalledLanguageCodes(codes);
		await Promise.all(codes.map((code) => loadLanguagePack(code)));
	} catch {
		/* ignore */
	}
}
