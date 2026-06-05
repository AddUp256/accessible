import type { UiKey } from '../ui-translations';
import { PRIORITY_LANGUAGE_CODES } from '../priority-languages';
import { UI_AR_PACK } from '../ui-ar-pack';
import { UI_DE_PACK } from '../ui-de-pack';
import { UI_ES_PACK } from '../ui-es-pack';
import { UI_ZH_PACK } from '../ui-zh-pack';
import { UI_IT_PACK } from '../ui-it-pack';
import { UI_PT_PACK } from '../ui-pt-pack';
import { UI_UK_PACK } from '../ui-uk-pack';
import { UI_TR_PACK } from '../ui-tr-pack';
import { UI_HI_PACK } from '../ui-hi-pack';
import { MODULE_LOCALES, type ModuleLocaleCode } from './modules';
import { EXTENDED_LOCALES } from './extended';
import { PANEL_LOCALES } from './panels';
import { CONFIG_LOCALES } from './config';

const NAV_UI_PACKS: Partial<Record<ModuleLocaleCode, Partial<Record<UiKey, string>>>> = {
	es: UI_ES_PACK,
	de: UI_DE_PACK,
	ar: UI_AR_PACK,
	zh: UI_ZH_PACK,
	it: UI_IT_PACK,
	pt: UI_PT_PACK,
	hi: UI_HI_PACK,
	uk: UI_UK_PACK,
	tr: UI_TR_PACK
};

function mergePriorityPack(lang: ModuleLocaleCode): Partial<Record<UiKey, string>> {
	const base = NAV_UI_PACKS[lang] ?? {};
	return {
		...base,
		...MODULE_LOCALES[lang],
		...EXTENDED_LOCALES[lang],
		...PANEL_LOCALES[lang],
		...CONFIG_LOCALES[lang]
	};
}

/** Packs explicites (sans repli anglais) pour la ligne secondaire bilingue. */
export const EXPLICIT_UI_PACKS: Record<string, Partial<Record<UiKey, string>>> = Object.fromEntries(
	PRIORITY_LANGUAGE_CODES.map((lang) => [lang, mergePriorityPack(lang)])
);

export function getExplicitUiPack(lang: string): Partial<Record<UiKey, string>> | undefined {
	return EXPLICIT_UI_PACKS[lang];
}
