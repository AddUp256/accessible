/** R?le : Pack i18n typ? Index : traductions explicites pour l?interface bilingue. */
import type { ConfigKey } from '../../ui-config';
import { CONFIG_AR } from './ar';
import { CONFIG_DE } from './de';
import { CONFIG_ES } from './es';
import { CONFIG_ZH } from './zh';
import { CONFIG_IT } from './it';
import { CONFIG_PT } from './pt';
import { CONFIG_UK } from './uk';
import { CONFIG_TR } from './tr';
import { CONFIG_HI } from './hi';

import type { ModuleLocaleCode } from '../modules';

export const CONFIG_LOCALES: Partial<Record<ModuleLocaleCode, Record<ConfigKey, string>>> = {
	es: CONFIG_ES,
	de: CONFIG_DE,
	ar: CONFIG_AR,
	zh: CONFIG_ZH,
	it: CONFIG_IT,
	pt: CONFIG_PT,
	hi: CONFIG_HI,
	uk: CONFIG_UK,
	tr: CONFIG_TR
};
