/** R?le : Pack i18n typ? Index : traductions explicites pour l?interface bilingue. */
import type { ModuleUiKey } from '../../ui-modules';
import { MODULE_AR } from './ar';
import { MODULE_DE } from './de';
import { MODULE_ES } from './es';
import { MODULE_HI } from './hi';
import { MODULE_IT } from './it';
import { MODULE_PT } from './pt';
import { MODULE_TR } from './tr';
import { MODULE_UK } from './uk';
import { MODULE_ZH } from './zh';

export type ModuleLocaleCode =
	| 'es'
	| 'ar'
	| 'zh'
	| 'it'
	| 'pt'
	| 'de'
	| 'hi'
	| 'uk'
	| 'tr';

export const MODULE_LOCALES: Partial<Record<ModuleLocaleCode, Record<ModuleUiKey, string>>> = {
	es: MODULE_ES,
	de: MODULE_DE,
	ar: MODULE_AR,
	zh: MODULE_ZH,
	it: MODULE_IT,
	pt: MODULE_PT,
	hi: MODULE_HI,
	tr: MODULE_TR,
	uk: MODULE_UK
};
