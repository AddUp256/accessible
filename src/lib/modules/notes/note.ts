/** R?le : Logique m?tier de notes : fonctions pures ou r?gles locales testables hors interface. */
import type { Note, NoteFormat, NotesData } from '$lib/types/profile';
import { createId } from '$lib/modules/organizer/checklist';

export function createNote(
	title: string,
	body: string,
	format: NoteFormat = 'simple',
	cornellCue = '',
	cornellSummary = ''
): Note {
	const now = new Date().toISOString();
	return {
		id: createId('note'),
		title: title.trim() || 'Sans titre',
		body: body.trim(),
		format,
		cornellCue: cornellCue.trim(),
		cornellSummary: cornellSummary.trim(),
		createdAt: now,
		updatedAt: now
	};
}

export function addNote(data: NotesData, note: Note): NotesData {
	return { notes: [note, ...data.notes] };
}

export function updateNote(
	data: NotesData,
	noteId: string,
	title: string,
	body: string,
	format: NoteFormat = 'simple',
	cornellCue = '',
	cornellSummary = ''
): NotesData {
	return {
		notes: data.notes.map((note) =>
			note.id === noteId
				? {
						...note,
						title: title.trim() || 'Sans titre',
						body: body.trim(),
						format,
						cornellCue: cornellCue.trim(),
						cornellSummary: cornellSummary.trim(),
						updatedAt: new Date().toISOString()
					}
				: note
		)
	};
}

export function removeNote(data: NotesData, noteId: string): NotesData {
	return { notes: data.notes.filter((note) => note.id !== noteId) };
}

export function noteToMarkdown(note: Note): string {
	const date = note.updatedAt.slice(0, 10);
	if (note.format === 'cornell') {
		return `# ${note.title}

## Mots-clés / questions
${note.cornellCue || '—'}

## Notes
${note.body || '—'}

## Résumé
${note.cornellSummary || '—'}

---

_Export Accessible (Cornell) — ${date}_
`;
	}
	return `# ${note.title}

${note.body}

---

_Export Accessible — ${date}_
`;
}

export function sanitizeFilename(title: string): string {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 48) || 'note';
}
