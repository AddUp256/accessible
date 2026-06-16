/** R?le : Logique m?tier de organisation : fonctions pures ou r?gles locales testables hors interface. */
import type { KanbanColumnId, KanbanTask, OrganizerData } from '$lib/types/profile';
import { createId } from '$lib/modules/organizer/checklist';

export function createKanbanTask(title: string, column: KanbanColumnId = 'todo'): KanbanTask {
	const now = new Date().toISOString();
	return {
		id: createId('kanban'),
		title: title.trim(),
		column,
		createdAt: now,
		updatedAt: now
	};
}

export function addKanbanTask(data: OrganizerData, task: KanbanTask): OrganizerData {
	return { ...data, kanbanTasks: [task, ...data.kanbanTasks] };
}

export function moveKanbanTask(
	data: OrganizerData,
	taskId: string,
	column: KanbanColumnId
): OrganizerData {
	return {
		...data,
		kanbanTasks: data.kanbanTasks.map((task) =>
			task.id === taskId
				? { ...task, column, updatedAt: new Date().toISOString() }
				: task
		)
	};
}

export function removeKanbanTask(data: OrganizerData, taskId: string): OrganizerData {
	return {
		...data,
		kanbanTasks: data.kanbanTasks.filter((task) => task.id !== taskId)
	};
}

export function tasksForColumn(tasks: KanbanTask[], column: KanbanColumnId): KanbanTask[] {
	return tasks.filter((task) => task.column === column);
}
