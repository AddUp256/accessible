import { browser } from '$app/environment';
import type { ReadingSettings } from '$lib/types/profile';

const loadedFonts = new Map<string, string>();

export const CUSTOM_FONT_MAX_BYTES = 2 * 1024 * 1024;
export const CUSTOM_FONT_ACCEPT = '.ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2';

export function sanitizeCustomFontName(fileName: string): string {
	const withoutExtension = fileName.replace(/\.[^.]+$/, '');
	const cleaned = withoutExtension.replace(/[^\p{L}\p{N} _-]/gu, ' ').replace(/\s+/g, ' ').trim();
	return cleaned.slice(0, 48) || 'Police importée';
}

export function customFontFamily(settings: ReadingSettings): string | null {
	if (settings.font !== 'custom' || !settings.customFontName || !settings.customFontDataUrl) {
		return null;
	}
	return settings.customFontName;
}

export async function loadCustomFont(familyName: string, dataUrl: string): Promise<boolean> {
	if (!browser || !('FontFace' in window) || !document.fonts) return false;

	const cacheKey = `${dataUrl.length}:${dataUrl.slice(0, 64)}`;
	if (loadedFonts.get(familyName) === cacheKey) return true;

	const face = new FontFace(familyName, `url("${dataUrl}")`);
	await face.load();
	document.fonts.add(face);
	loadedFonts.set(familyName, cacheKey);
	return true;
}

export async function ensureCustomFontLoaded(settings: ReadingSettings): Promise<boolean> {
	const familyName = customFontFamily(settings);
	if (!familyName) return false;
	return loadCustomFont(familyName, settings.customFontDataUrl);
}

export function readFontFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result);
				return;
			}
			reject(new Error('Police illisible.'));
		};
		reader.onerror = () => reject(new Error('Police illisible.'));
		reader.readAsDataURL(file);
	});
}
