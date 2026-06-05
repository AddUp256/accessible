/** Durées prédéfinies — minuteur local, sans notification système. */

export type TimerKind = 'pause' | 'focus' | 'custom';

export interface TimerPreset {
	id: string;
	label: string;
	seconds: number;
	kind: TimerKind;
	hint: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
	{
		id: 'pause5',
		label: 'Pause 5 min',
		seconds: 5 * 60,
		kind: 'pause',
		hint: 'Courte pause pour souffler.'
	},
	{
		id: 'pause10',
		label: 'Pause 10 min',
		seconds: 10 * 60,
		kind: 'pause',
		hint: 'Pause plus longue entre deux tâches.'
	},
	{
		id: 'focus15',
		label: 'Focus 15 min',
		seconds: 15 * 60,
		kind: 'focus',
		hint: 'Travailler sur une seule étape.'
	},
	{
		id: 'focus25',
		label: 'Focus 25 min',
		seconds: 25 * 60,
		kind: 'focus',
		hint: 'Session de travail concentré.'
	}
];

export const DEFAULT_CUSTOM_MINUTES = 10;
