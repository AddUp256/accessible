/** R?le : Service de export local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import type { FlashcardDeck } from '$lib/types/profile';

function escapeCsvField(value: string): string {
	const normalized = value.replace(/\r?\n/g, ' ').trim();
	if (/[",\n;]/.test(normalized)) {
		return `"${normalized.replace(/"/g, '""')}"`;
	}
	return normalized;
}

/** CSV compatible avec l?import Anki (champs Front / Back). */
export function buildAnkiCsv(deck: FlashcardDeck): string {
	const rows = deck.cards.map((card) => `${escapeCsvField(card.front)},${escapeCsvField(card.back)}`);
	return ['front,back', ...rows].join('\n');
}

/** Le BOM UTF-8 aide Excel et Anki ? d?tecter l?encodage sous Windows. */
export function buildAnkiCsvBytes(deck: FlashcardDeck): Uint8Array {
	const content = `\uFEFF${buildAnkiCsv(deck)}`;
	return new TextEncoder().encode(content);
}

export function buildAnkiTsv(deck: FlashcardDeck): string {
	const rows = deck.cards.map((card) => `${card.front.replace(/\t|\n/g, ' ')}\t${card.back.replace(/\t|\n/g, ' ')}`);
	return ['#separator:tab', 'front\tback', ...rows].join('\n');
}
