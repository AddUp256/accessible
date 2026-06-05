/** Polices redistribuables embarquées (SIL OFL) — hors ligne, sans Google Fonts. */
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource/andika/400.css';
import '@fontsource/comic-neue/400.css';
import '@fontsource/inclusive-sans/400.css';
import '@fontsource/lexend/400.css';
import '@fontsource/readex-pro/400.css';

/** Identifiants présents dans le bundle @fontsource (Phase 41). */
export const EMBEDDED_FONT_IDS = [
	'atkinson-hyperlegible',
	'andika',
	'comic-neue',
	'inclusive-sans',
	'lexend',
	'readex-pro'
] as const;

export type EmbeddedFontId = (typeof EMBEDDED_FONT_IDS)[number];

export function isEmbeddedFont(id: string): id is EmbeddedFontId {
	return (EMBEDDED_FONT_IDS as readonly string[]).includes(id);
}
