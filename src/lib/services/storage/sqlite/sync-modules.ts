import type Database from '@tauri-apps/plugin-sql';

import type { AccessibleProfile } from '$lib/types/profile';

export interface ModuleStorageStats {
	notes: number;
	flashcardDecks: number;
	flashcardCards: number;
	checklists: number;
	checklistItems: number;
	kanbanTasks: number;
	personalCards: number;
	savedPictograms: number;
}

export async function getModuleStorageStats(db: Database): Promise<ModuleStorageStats> {
	const [
		notesRows,
		deckRows,
		cardRows,
		checklistRows,
		itemRows,
		kanbanRows,
		personalCardRows,
		pictogramRows
	] = await Promise.all([
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM notes'),
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM flashcard_decks'),
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM flashcard_cards'),
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM checklists'),
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM checklist_items'),
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM kanban_tasks'),
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM personal_cards'),
		db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM saved_pictograms')
	]);

	return {
		notes: notesRows[0]?.count ?? 0,
		flashcardDecks: deckRows[0]?.count ?? 0,
		flashcardCards: cardRows[0]?.count ?? 0,
		checklists: checklistRows[0]?.count ?? 0,
		checklistItems: itemRows[0]?.count ?? 0,
		kanbanTasks: kanbanRows[0]?.count ?? 0,
		personalCards: personalCardRows[0]?.count ?? 0,
		savedPictograms: pictogramRows[0]?.count ?? 0
	};
}

export function profileNeedsNormalizedSync(
	profile: AccessibleProfile,
	stats: ModuleStorageStats
): boolean {
	return (
		(profile.notes.notes.length > 0 && stats.notes === 0) ||
		(profile.memorization.decks.length > 0 && stats.flashcardDecks === 0) ||
		(profile.organizer.checklists.length > 0 && stats.checklists === 0) ||
		(profile.organizer.kanbanTasks.length > 0 && stats.kanbanTasks === 0) ||
		(profile.communicator.personalCards.length > 0 && stats.personalCards === 0) ||
		(profile.communicator.savedPictograms.length > 0 && stats.savedPictograms === 0)
	);
}

async function clearModuleTables(db: Database): Promise<void> {
	await db.execute('DELETE FROM checklist_items');
	await db.execute('DELETE FROM checklists');
	await db.execute('DELETE FROM kanban_tasks');
	await db.execute('DELETE FROM personal_cards');
	await db.execute('DELETE FROM saved_pictograms');
	await db.execute('DELETE FROM flashcard_cards');
	await db.execute('DELETE FROM flashcard_decks');
	await db.execute('DELETE FROM notes');
}

export async function syncNormalizedModules(
	db: Database,
	profile: AccessibleProfile
): Promise<void> {
	await clearModuleTables(db);

	for (const note of profile.notes.notes) {
		await db.execute(
			`INSERT INTO notes (id, title, body, created_at, updated_at)
			 VALUES ($1, $2, $3, $4, $5)`,
			[note.id, note.title, note.body, note.createdAt, note.updatedAt]
		);
	}

	for (const deck of profile.memorization.decks) {
		await db.execute(
			`INSERT INTO flashcard_decks (id, title, created_at, updated_at)
			 VALUES ($1, $2, $3, $4)`,
			[deck.id, deck.title, deck.createdAt, deck.updatedAt]
		);

		for (const card of deck.cards) {
			await db.execute(
				`INSERT INTO flashcard_cards (id, deck_id, front, back, schedule_json, created_at)
				 VALUES ($1, $2, $3, $4, $5, $6)`,
				[
					card.id,
					deck.id,
					card.front,
					card.back,
					card.schedule ? JSON.stringify(card.schedule) : null,
					card.createdAt
				]
			);
		}
	}

	for (const checklist of profile.organizer.checklists) {
		await db.execute(
			`INSERT INTO checklists (id, title, created_at, updated_at)
			 VALUES ($1, $2, $3, $4)`,
			[checklist.id, checklist.title, checklist.createdAt, checklist.updatedAt]
		);

		for (const item of checklist.items) {
			await db.execute(
				`INSERT INTO checklist_items (id, checklist_id, label, done, created_at)
				 VALUES ($1, $2, $3, $4, $5)`,
				[item.id, checklist.id, item.label, item.done ? 1 : 0, item.createdAt]
			);
		}
	}

	for (const task of profile.organizer.kanbanTasks) {
		await db.execute(
			`INSERT INTO kanban_tasks (id, title, column_id, created_at, updated_at)
			 VALUES ($1, $2, $3, $4, $5)`,
			[task.id, task.title, task.column, task.createdAt, task.updatedAt]
		);
	}

	for (const card of profile.communicator.personalCards) {
		await db.execute(
			`INSERT INTO personal_cards (id, label, message, pictogram_id, created_at)
			 VALUES ($1, $2, $3, $4, $5)`,
			[card.id, card.label, card.message, card.pictogramId ?? null, card.createdAt]
		);
	}

	for (const pictogram of profile.communicator.savedPictograms) {
		await db.execute(
			`INSERT INTO saved_pictograms (id, label, imported_at)
			 VALUES ($1, $2, $3)`,
			[pictogram.id, pictogram.label, pictogram.importedAt]
		);
	}

	await db.execute(
		`INSERT INTO storage_meta (key, value) VALUES ('normalized_modules', 'notes,flashcards,organizer,communicator')
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value`
	);
}

export async function clearNormalizedModules(db: Database): Promise<void> {
	await clearModuleTables(db);
	await db.execute("DELETE FROM storage_meta WHERE key = 'normalized_modules'");
}
