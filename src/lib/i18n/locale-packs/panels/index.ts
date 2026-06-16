/** R?le : Pack i18n typ? Index : traductions explicites pour l?interface bilingue. */
import type { PanelUiKey } from '../../ui-panels';
import type { ModuleLocaleCode } from '../modules';
import { BILINGUAL_PANEL_PRIORITY } from './bilingual-priority';
import { PANEL_AR } from './ar';
import { PANEL_DE } from './de';
import { PANEL_ES } from './es';
import { PANEL_ZH } from './zh';
import { PANEL_IT } from './it';
import { PANEL_PT } from './pt';
import { PANEL_UK } from './uk';
import { PANEL_TR } from './tr';
import { PANEL_HI } from './hi';

export const PANEL_LOCALES: Partial<Record<ModuleLocaleCode, Partial<Record<PanelUiKey, string>>>> = {
	es: PANEL_ES,
	de: PANEL_DE,
	ar: PANEL_AR,
	zh: PANEL_ZH,
	it: PANEL_IT,
	pt: PANEL_PT,
	hi: PANEL_HI,
	uk: PANEL_UK,
	tr: PANEL_TR,
	...BILINGUAL_PANEL_PRIORITY
};
