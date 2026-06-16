/** R?le : Logique m?tier de organisation : fonctions pures ou r?gles locales testables hors interface. */
import type { OrganizerData, VisualRoutine, VisualRoutineStep } from '$lib/types/profile';
import { createId } from '$lib/modules/organizer/checklist';

export function createVisualRoutine(title: string, stepLabels: string[] = []): VisualRoutine {
	const now = new Date().toISOString();
	return {
		id: createId('routine'),
		title: title.trim() || 'Ma routine',
		steps: stepLabels.map((label, index) => createRoutineStep(label, defaultIcon(index))),
		createdAt: now,
		updatedAt: now
	};
}

function defaultIcon(index: number): string {
	const icons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
	return icons[index] ?? '▶️';
}

export function createRoutineStep(label: string, icon = '▶️'): VisualRoutineStep {
	return {
		id: createId('rstep'),
		label: label.trim(),
		icon,
		done: false
	};
}

export function addVisualRoutine(data: OrganizerData, routine: VisualRoutine): OrganizerData {
	return { ...data, visualRoutines: [routine, ...data.visualRoutines] };
}

export function toggleRoutineStep(
	data: OrganizerData,
	routineId: string,
	stepId: string
): OrganizerData {
	return {
		...data,
		visualRoutines: data.visualRoutines.map((routine) =>
			routine.id !== routineId
				? routine
				: {
						...routine,
						updatedAt: new Date().toISOString(),
						steps: routine.steps.map((step) =>
							step.id === stepId ? { ...step, done: !step.done } : step
						)
					}
		)
	};
}

export function removeVisualRoutine(data: OrganizerData, routineId: string): OrganizerData {
	return {
		...data,
		visualRoutines: data.visualRoutines.filter((routine) => routine.id !== routineId)
	};
}

export const ROUTINE_TEMPLATES = [
	{
		id: 'morning',
		title: 'Routine du matin',
		steps: ['Se lever', 'Se laver', 'S’habiller', 'Prendre le petit-déjeuner', 'Préparer le sac']
	},
	{
		id: 'homework',
		title: 'Routine devoirs',
		steps: ['Lire la consigne', 'Préparer le matériel', 'Travailler 20 min', 'Pause', 'Relire']
	}
] as const;
