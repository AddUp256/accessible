import { get, writable } from 'svelte/store';
import { settings } from '$lib/stores/profile';

export type ToastLevel = 'minimal' | 'normal';

export const toastMessage = writable<string | null>(null);

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function notifyUser(message: string, level: ToastLevel = 'minimal') {
	const sensory = get(settings).sensory;
	if (sensory.notifications === 'off') return;

	if (
		level === 'normal' &&
		typeof Notification !== 'undefined' &&
		Notification.permission === 'granted'
	) {
		new Notification('Accessible', { body: message, tag: 'accessible-app' });
	}

	toastMessage.set(message);
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toastMessage.set(null), 4000);
}
