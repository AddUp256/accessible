import type { FlashcardDeck } from '$lib/types/profile';

function escapeCsvField(value: string): string {
	const normalized = value.replace(/\r?\n/g, ' ').trim();
	if (/[",\n;]/.test(normalized)) {
		return `"${normalized.replace(/"/g, '""')}"`;
	}
	return normalized;
}

/** CSV compatible with Anki import (Front / Back fields). */
export function buildAnkiCsv(deck: FlashcardDeck): string {
	const rows = deck.cards.map((card) => `${escapeCsvField(card.front)},${escapeCsvField(card.back)}`);
	return ['front,back', ...rows].join('\n');
}

/** UTF-8 BOM helps Excel and Anki detect encoding on Windows. */
export function buildAnkiCsvBytes(deck: FlashcardDeck): Uint8Array {
	const content = `\uFEFF${buildAnkiCsv(deck)}`;
	return new TextEncoder().encode(content);
}

export function buildAnkiTsv(deck: FlashcardDeck): string {
	const rows = deck.cards.map((card) => `${card.front.replace(/\t|\n/g, ' ')}\t${card.back.replace(/\t|\n/g, ' ')}`);
	return ['#separator:tab', 'front\tback', ...rows].join('\n');
}
