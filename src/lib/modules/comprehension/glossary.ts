/** R?le : Logique m?tier de compr?hension des consignes : fonctions pures ou r?gles locales testables hors interface. */
import type { ComprehensionData, GlossaryEntry } from '$lib/types/profile';
import { createId } from '$lib/modules/organizer/checklist';

export function createGlossaryEntry(term: string, definition: string): GlossaryEntry {
	return {
		id: createId('gloss'),
		term: term.trim(),
		definition: definition.trim(),
		createdAt: new Date().toISOString()
	};
}

export function addGlossaryEntry(data: ComprehensionData, entry: GlossaryEntry): ComprehensionData {
	return { glossary: [entry, ...data.glossary] };
}

export function removeGlossaryEntry(data: ComprehensionData, entryId: string): ComprehensionData {
	return { glossary: data.glossary.filter((entry) => entry.id !== entryId) };
}

export function updateGlossaryEntry(
	data: ComprehensionData,
	entryId: string,
	term: string,
	definition: string
): ComprehensionData {
	return {
		glossary: data.glossary.map((entry) =>
			entry.id === entryId
				? { ...entry, term: term.trim(), definition: definition.trim() }
				: entry
		)
	};
}
