/** Service de verification des releases GitHub d'Accessible. */
import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

import { APP_VERSION } from '$lib/config/open-source-credits';
import { notifyUser } from '$lib/services/notifications';
import { settings } from '$lib/stores/profile';

const RELEASE_API_URL = 'https://api.github.com/repos/AddUp256/accessible/releases/latest';
const RELEASES_URL = 'https://github.com/AddUp256/accessible/releases';

export type ReleaseCheckStatus =
	| 'idle'
	| 'checking'
	| 'up_to_date'
	| 'update_available'
	| 'disabled'
	| 'not_found'
	| 'error';

export interface ReleaseCheckState {
	status: ReleaseCheckStatus;
	checkedAt?: string;
	currentVersion: string;
	latestVersion?: string;
	latestTag?: string;
	htmlUrl?: string;
	message: string;
}

export const releaseCheckState = writable<ReleaseCheckState>({
	status: 'idle',
	currentVersion: APP_VERSION,
	message: 'Aucune vérification effectuée.'
});

let startupCheckDone = false;

function normalizeVersion(version: string): string {
	return version.trim().replace(/^v/i, '');
}

function compareVersion(a: string, b: string): number {
	const left = normalizeVersion(a).split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0);
	const right = normalizeVersion(b).split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0);
	const length = Math.max(left.length, right.length);
	for (let index = 0; index < length; index += 1) {
		const delta = (left[index] ?? 0) - (right[index] ?? 0);
		if (delta !== 0) return delta;
	}
	return 0;
}

function updateState(partial: Partial<ReleaseCheckState>): ReleaseCheckState {
	const next = {
		status: 'idle' as ReleaseCheckStatus,
		currentVersion: APP_VERSION,
		message: '',
		...partial
	};
	releaseCheckState.set(next);
	return next;
}

export async function checkGitHubRelease(manual = false): Promise<ReleaseCheckState> {
	if (!browser) return releaseCheckStateValue();

	if (!get(settings).ui.internetEnabled) {
		const state = updateState({
			status: 'disabled',
			checkedAt: new Date().toISOString(),
			message: 'Internet est désactivé : la vérification GitHub est ignorée.'
		});
		if (manual) notifyUser(state.message, 'minimal');
		return state;
	}

	updateState({
		status: 'checking',
		checkedAt: new Date().toISOString(),
		message: 'Vérification des releases GitHub en cours...'
	});

	try {
		const response = await fetch(RELEASE_API_URL, {
			headers: { Accept: 'application/vnd.github+json' }
		});

		if (response.status === 404) {
			const state = updateState({
				status: 'not_found',
				checkedAt: new Date().toISOString(),
				htmlUrl: RELEASES_URL,
				message: "Aucune release GitHub publiée n'a été trouvée pour ce dépôt."
			});
			if (manual) notifyUser(state.message, 'minimal');
			return state;
		}

		if (!response.ok) {
			throw new Error(`GitHub a repondu ${response.status}`);
		}

		const payload = (await response.json()) as {
			tag_name?: string;
			name?: string;
			html_url?: string;
			published_at?: string;
		};
		const latestTag = payload.tag_name || payload.name || '';
		const latestVersion = normalizeVersion(latestTag);
		const updateAvailable = latestVersion
			? compareVersion(latestVersion, APP_VERSION) > 0
			: false;
		const state = updateState({
			status: updateAvailable ? 'update_available' : 'up_to_date',
			checkedAt: new Date().toISOString(),
			latestVersion,
			latestTag,
			htmlUrl: payload.html_url || RELEASES_URL,
			message: updateAvailable
				? `Nouvelle release disponible : ${latestTag}.`
				: `Accessible est à jour (${APP_VERSION}).`
		});

		if (updateAvailable || manual) {
			notifyUser(state.message, updateAvailable ? 'normal' : 'minimal');
		}
		return state;
	} catch (error) {
		const state = updateState({
			status: 'error',
			checkedAt: new Date().toISOString(),
			htmlUrl: RELEASES_URL,
			message:
				error instanceof Error
					? `Vérification GitHub impossible : ${error.message}.`
					: 'Vérification GitHub impossible.'
		});
		if (manual) notifyUser(state.message, 'minimal');
		return state;
	}
}

export async function checkReleaseAtStartup(): Promise<void> {
	if (startupCheckDone) return;
	startupCheckDone = true;
	if (!get(settings).ui.internetEnabled) return;
	await checkGitHubRelease(false);
}

function releaseCheckStateValue(): ReleaseCheckState {
	let value: ReleaseCheckState = {
		status: 'idle',
		currentVersion: APP_VERSION,
		message: 'Aucune vérification effectuée.'
	};
	releaseCheckState.subscribe((state) => {
		value = state;
	})();
	return value;
}
