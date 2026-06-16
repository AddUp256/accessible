/** R?le : Service de service applicatif : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { get } from 'svelte/store';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import type { AccessibleProfile } from '$lib/types/profile';
import { profileStore } from '$lib/stores/profile';
import { saveProfileAsync } from '$lib/services/storage/local';
import { isTauriRuntime } from '$lib/services/storage/tauri';

let quitting = false;
const QUIT_FLUSH_TIMEOUT_MS = 5000;

/** Enregistre le profil actif avant fermeture. */
export async function flushProfileState(profile?: AccessibleProfile): Promise<void> {
	if (!profile) {
		await profileStore.flushPendingSaves();
		return;
	}
	if (profile.privacy.guestMode) return;
	await saveProfileAsync(profile);
}

async function flushProfileStateBeforeQuit(): Promise<void> {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	try {
		await Promise.race([
			flushProfileState(),
			new Promise<void>((resolve) => {
				timeoutId = setTimeout(resolve, QUIT_FLUSH_TIMEOUT_MS);
			})
		]);
	} catch (error) {
		console.warn('Profile save before quit failed.', error);
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
}

/** Quitte l'application (Tauri) ou tente de fermer l'onglet (web). */
export async function quitApplication(): Promise<void> {
	if (quitting) return;
	quitting = true;

	try {
		await flushProfileStateBeforeQuit();
		if (isTauriRuntime()) {
			try {
				await invoke('quit_application');
			} catch (error) {
				await getCurrentWindow().close();
				throw error;
			}
			return;
		}
		window.close();
	} catch (error) {
		quitting = false;
		throw error;
	}

	if (!isTauriRuntime()) {
		quitting = false;
	}
}

/** Écouteurs fermeture fenêtre / onglet — à brancher dans le layout racine. */
export async function bindAppLifecycle(): Promise<() => void> {
	const cleanups: Array<() => void> = [];

	if (isTauriRuntime()) {
		const win = getCurrentWindow();
		const unlisten = await win.onCloseRequested(async (event) => {
			if (quitting) return;
			event.preventDefault();
			await quitApplication();
		});
		cleanups.push(unlisten);
	}

	const flushCurrentProfileSoon = () => {
		const profile = get(profileStore);
		if (!profile.privacy.guestMode) {
			void profileStore.flushPendingSaves();
		}
	};
	const onVisibilityChange = () => {
		if (document.visibilityState === 'hidden') {
			flushCurrentProfileSoon();
		}
	};
	window.addEventListener('beforeunload', flushCurrentProfileSoon);
	window.addEventListener('pagehide', flushCurrentProfileSoon);
	document.addEventListener('visibilitychange', onVisibilityChange);
	cleanups.push(() => {
		window.removeEventListener('beforeunload', flushCurrentProfileSoon);
		window.removeEventListener('pagehide', flushCurrentProfileSoon);
		document.removeEventListener('visibilitychange', onVisibilityChange);
	});

	return () => {
		for (const fn of cleanups) fn();
	};
}
