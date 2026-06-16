/** R?le : Aide i18n Dynamic Message : s?lection, repli et chargement des textes bilingues. */
import { get } from 'svelte/store';

import { settings } from '$lib/stores/profile';
import type { UISettings } from '$lib/types/profile';
import type { ToastLevel } from '$lib/services/notifications';
import { notifyUser } from '$lib/services/notifications';

import {
	DYNAMIC_EN,
	DYNAMIC_FR,
	SERVICE_MESSAGE_LOOKUP,
	type DynamicKey
} from './ui-dynamic';
import { getRuntimeDynamicMessage } from './language-pack-runtime';
import { isPriorityLanguage } from './priority-languages';
import { DYNAMIC_LOCALE_PACKS } from './ui-dynamic-locales';

export type { DynamicKey };

export function formatDynamicTemplate(
	template: string,
	params?: Record<string, string | number>
): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (_, key: string) =>
		key in params ? String(params[key]) : `{${key}}`
	);
}

export function dynamicMessage(
	key: DynamicKey,
	ui: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>,
	params?: Record<string, string | number>
): string {
	const french = formatDynamicTemplate(DYNAMIC_FR[key], params);
	if (!ui.bilingualUi || ui.secondaryLanguage === 'fr') return french;

	let secondary: string;
	if (ui.secondaryLanguage === 'en') {
		secondary = formatDynamicTemplate(DYNAMIC_EN[key], params);
	} else if (isPriorityLanguage(ui.secondaryLanguage)) {
		const localized =
			getRuntimeDynamicMessage(key, ui.secondaryLanguage) ??
			DYNAMIC_LOCALE_PACKS[ui.secondaryLanguage]?.[key];
		if (!localized) return french;
		secondary = formatDynamicTemplate(localized, params);
	} else {
		const localized = DYNAMIC_LOCALE_PACKS[ui.secondaryLanguage]?.[key];
		secondary = formatDynamicTemplate(localized ?? DYNAMIC_EN[key], params);
	}

	if (!secondary || secondary === french) return french;
	return `${french} / ${secondary}`;
}

export function dynamicMessageFromStore(
	key: DynamicKey,
	params?: Record<string, string | number>
): string {
	return dynamicMessage(key, get(settings).ui, params);
}

export function translateServiceMessage(
	message: string,
	ui: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): string {
	const key = SERVICE_MESSAGE_LOOKUP[message];
	if (key) return dynamicMessage(key, ui);
	return message;
}

export function translateServiceMessageFromStore(message: string): string {
	return translateServiceMessage(message, get(settings).ui);
}

export function notifyUserI18n(
	key: DynamicKey,
	level: ToastLevel = 'minimal',
	params?: Record<string, string | number>
): void {
	notifyUser(dynamicMessageFromStore(key, params), level);
}

export function timerFinishedDynamicMessage(
	kind: 'pause' | 'focus' | 'custom',
	ui: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): string {
	switch (kind) {
		case 'pause':
			return dynamicMessage('dyn.timer.finishedPause', ui);
		case 'focus':
			return dynamicMessage('dyn.timer.finishedFocus', ui);
		default:
			return dynamicMessage('dyn.timer.finishedCustom', ui);
	}
}

export function confirmDynamicMessage(
	key: DynamicKey,
	params?: Record<string, string | number>
): string {
	return dynamicMessageFromStore(key, params);
}
