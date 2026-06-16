/** R?le : Logique m?tier de organisation : fonctions pures ou r?gles locales testables hors interface. */
import type { Checklist, ChecklistItem, OrganizerData } from '$lib/types/profile';

export function createId(prefix: string): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return `${prefix}-${crypto.randomUUID()}`;
	}
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createChecklist(title: string, itemLabels: string[] = []): Checklist {
	const now = new Date().toISOString();
	return {
		id: createId('checklist'),
		title: title.trim() || 'Ma liste',
		items: itemLabels.map((label) => createChecklistItem(label)),
		createdAt: now,
		updatedAt: now
	};
}

export function createChecklistItem(label: string): ChecklistItem {
	return {
		id: createId('item'),
		label: label.trim(),
		done: false,
		createdAt: new Date().toISOString()
	};
}

export function addChecklist(data: OrganizerData, checklist: Checklist): OrganizerData {
	return { ...data, checklists: [checklist, ...data.checklists] };
}

export function removeChecklist(data: OrganizerData, checklistId: string): OrganizerData {
	return { ...data, checklists: data.checklists.filter((c) => c.id !== checklistId) };
}

export function updateChecklist(
	data: OrganizerData,
	checklistId: string,
	updater: (checklist: Checklist) => Checklist
): OrganizerData {
	return {
		...data,
		checklists: data.checklists.map((c) =>
			c.id === checklistId ? touchChecklist(updater(c)) : c
		)
	};
}

function touchChecklist(checklist: Checklist): Checklist {
	return { ...checklist, updatedAt: new Date().toISOString() };
}

export function addChecklistItem(
	data: OrganizerData,
	checklistId: string,
	label: string
): OrganizerData {
	if (!label.trim()) return data;
	return updateChecklist(data, checklistId, (checklist) => ({
		...checklist,
		items: [...checklist.items, createChecklistItem(label)]
	}));
}

export function toggleChecklistItem(
	data: OrganizerData,
	checklistId: string,
	itemId: string
): OrganizerData {
	return updateChecklist(data, checklistId, (checklist) => ({
		...checklist,
		items: checklist.items.map((item) =>
			item.id === itemId ? { ...item, done: !item.done } : item
		)
	}));
}

export function removeChecklistItem(
	data: OrganizerData,
	checklistId: string,
	itemId: string
): OrganizerData {
	return updateChecklist(data, checklistId, (checklist) => ({
		...checklist,
		items: checklist.items.filter((item) => item.id !== itemId)
	}));
}

export function checklistProgress(checklist: Checklist): { done: number; total: number } {
	const total = checklist.items.length;
	const done = checklist.items.filter((item) => item.done).length;
	return { done, total };
}
