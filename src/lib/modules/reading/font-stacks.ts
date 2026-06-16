/** R?le : Logique m?tier de lecture adapt?e : fonctions pures ou r?gles locales testables hors interface. */
import type { FontId, GlossaryEntry, ReadingSettings } from '$lib/types/profile';
import { simplifyWithFalcEngine } from '$lib/modules/comprehension/falc-engine';
import { customFontFamily } from '$lib/modules/reading/custom-font';

/** Piles font-family — polices embarquées via @fontsource (Phase 41). */
export const FONT_FAMILY_STACK: Record<FontId, string> = {
	custom: 'system-ui, "Segoe UI", Roboto, sans-serif',
	'atkinson-hyperlegible': '"Atkinson Hyperlegible", system-ui, sans-serif',
	luciole: 'Luciole, system-ui, sans-serif',
	lexend: 'Lexend, system-ui, sans-serif',
	'readex-pro': '"Readex Pro", system-ui, sans-serif',
	opendyslexic: 'OpenDyslexic, Arial, sans-serif',
	andika: 'Andika, system-ui, sans-serif',
	b612: 'B612, system-ui, sans-serif',
	'b612-mono': '"B612 Mono", monospace',
	'inclusive-sans': '"Inclusive Sans", system-ui, sans-serif',
	'noto-sans': '"Noto Sans", system-ui, sans-serif',
	'noto-serif': '"Noto Serif", Georgia, serif',
	'noto-mono': '"Noto Mono", monospace',
	inter: 'Inter, system-ui, sans-serif',
	'source-sans-3': '"Source Sans 3", system-ui, sans-serif',
	'source-serif-4': '"Source Serif 4", Georgia, serif',
	'source-code-pro': '"Source Code Pro", monospace',
	'ibm-plex-sans': '"IBM Plex Sans", system-ui, sans-serif',
	'ibm-plex-serif': '"IBM Plex Serif", Georgia, serif',
	'ibm-plex-mono': '"IBM Plex Mono", monospace',
	'fira-sans': '"Fira Sans", system-ui, sans-serif',
	'fira-code': '"Fira Code", monospace',
	ubuntu: 'Ubuntu, system-ui, sans-serif',
	'ubuntu-mono': '"Ubuntu Mono", monospace',
	roboto: 'Roboto, system-ui, sans-serif',
	'roboto-slab': '"Roboto Slab", Georgia, serif',
	'roboto-mono': '"Roboto Mono", monospace',
	'comic-neue': '"Comic Neue", system-ui, sans-serif',
	system: 'system-ui, "Segoe UI", Roboto, sans-serif'
};

export const READING_BACKGROUND_COLORS: Record<
	ReadingSettings['background'],
	{ bg: string; text: string }
> = {
	light: { bg: '#ffffff', text: '#1a1a1a' },
	cream: { bg: '#f5f0e6', text: '#1a1a1a' },
	dark: { bg: '#1a1a1a', text: '#f0f0f0' },
	highContrast: { bg: '#000000', text: '#ffffff' },
	custom: { bg: '#f5f0e6', text: '#1a1a1a' }
};

/** Polices prioritaires affichées dans le sélecteur (MVP). */
export const READING_FONT_OPTIONS: FontId[] = [
	'system',
	'atkinson-hyperlegible',
	'lexend',
	'opendyslexic',
	'luciole',
	'andika',
	'readex-pro',
	'inclusive-sans',
	'comic-neue',
	'noto-sans',
	'inter'
];

function quoteFontFamily(familyName: string): string {
	return `"${familyName.replace(/["\\]/g, '')}", system-ui, "Segoe UI", Roboto, sans-serif`;
}

function resolveFontFamily(settings: ReadingSettings): string {
	const familyName = customFontFamily(settings);
	if (familyName) return quoteFontFamily(familyName);
	return FONT_FAMILY_STACK[settings.font] ?? FONT_FAMILY_STACK.system;
}

export function readingSettingsToStyle(settings: ReadingSettings): string {
	const colors =
		settings.background === 'custom' && settings.backgroundColor && settings.textColor
			? { bg: settings.backgroundColor, text: settings.textColor }
			: READING_BACKGROUND_COLORS[settings.background];

	return `
		font-family: ${resolveFontFamily(settings)};
		font-size: ${settings.fontSize}px;
		line-height: ${settings.lineHeight};
		letter-spacing: ${settings.letterSpacing}em;
		word-spacing: ${settings.wordSpacing}px;
		max-width: ${settings.maxColumnWidth}ch;
		background-color: ${colors.bg};
		color: ${colors.text};
	`.trim();
}

export function toFalcText(text: string, glossary: GlossaryEntry[] = []): string {
	return simplifyWithFalcEngine(text, { glossary, level: 'standard' }).text;
}
