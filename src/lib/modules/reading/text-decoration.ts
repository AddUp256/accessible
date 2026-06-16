/** R?le : Logique m?tier de lecture adapt?e : fonctions pures ou r?gles locales testables hors interface. */
import type { ReadingSettings } from '$lib/types/profile';
import { syllabifyFrenchText } from '$lib/modules/reading/syllabify-fr';
import { markSilentLetters } from '$lib/modules/reading/silent-letters-fr';

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function highlightSyllables(text: string): string {
	return syllabifyFrenchText(text)
		.map((part) => {
			if (/^\s+$/.test(part) || /^[.,!?;:—–-]$/.test(part)) return escapeHtml(part);
			return `<span class="reading-syllable">${escapeHtml(part)}</span>`;
		})
		.join('');
}

function highlightGraphemes(text: string): string {
	return [...text]
		.map((char) => `<span class="reading-grapheme">${escapeHtml(char)}</span>`)
		.join('');
}

export function decorateReadingLine(
	line: string,
	settings: Pick<ReadingSettings, 'syllableHighlight' | 'graphemeHighlight' | 'mutedLetters'>
): string {
	if (!line.trim()) return '\u00A0';

	let html: string;

	if (settings.graphemeHighlight) {
		html = highlightGraphemes(line);
	} else if (settings.syllableHighlight) {
		html = highlightSyllables(line);
	} else {
		html = escapeHtml(line);
	}

	if (settings.mutedLetters) {
		html = markSilentLetters(html);
	}

	return html;
}

export function usesReadingDecoration(
	settings: Pick<ReadingSettings, 'syllableHighlight' | 'graphemeHighlight' | 'mutedLetters'>
): boolean {
	return settings.syllableHighlight || settings.graphemeHighlight || settings.mutedLetters;
}
