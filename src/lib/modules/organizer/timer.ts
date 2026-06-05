export function formatTimer(totalSeconds: number): string {
	const safe = Math.max(0, totalSeconds);
	const minutes = Math.floor(safe / 60);
	const seconds = safe % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function minutesToSeconds(minutes: number): number {
	return Math.max(1, Math.round(minutes)) * 60;
}

export function parseCustomMinutes(value: string): number | null {
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed) || parsed < 1 || parsed > 180) return null;
	return parsed;
}

export function timerFinishedMessage(kind: 'pause' | 'focus' | 'custom'): string {
	switch (kind) {
		case 'pause':
			return 'Pause terminée. Vous pouvez reprendre quand vous voulez.';
		case 'focus':
			return 'Temps de focus terminé. Félicitations — prenez une pause si besoin.';
		default:
			return 'Minuteur terminé.';
	}
}
