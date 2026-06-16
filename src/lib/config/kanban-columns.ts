/** R?le : Configuration d?clarative Kanban Columns : donn?es m?tier sans effet de bord. */
/** Colonnes Kanban simples — FALC. */

import type { KanbanColumnId } from '$lib/types/profile';

export interface KanbanColumnMeta {
	id: KanbanColumnId;
	label: string;
	hint: string;
}

export const KANBAN_COLUMNS: KanbanColumnMeta[] = [
	{
		id: 'todo',
		label: 'À faire',
		hint: 'Tâches pas encore commencées.'
	},
	{
		id: 'doing',
		label: 'En cours',
		hint: 'Ce sur quoi vous travaillez maintenant.'
	},
	{
		id: 'done',
		label: 'Terminé',
		hint: 'Tâches accomplies.'
	}
];

export const KANBAN_COLUMN_LABELS: Record<KanbanColumnId, string> = {
	todo: 'À faire',
	doing: 'En cours',
	done: 'Terminé'
};
