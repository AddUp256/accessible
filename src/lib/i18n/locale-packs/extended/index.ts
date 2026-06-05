import type { ExtendedUiKey } from '../../ui-extended';
import type { ModuleLocaleCode } from '../modules';
import { EXTENDED_AR } from './ar';
import { EXTENDED_DE } from './de';
import { EXTENDED_ES } from './es';
import { EXTENDED_ZH } from './zh';
import { EXTENDED_IT } from './it';
import { EXTENDED_PT } from './pt';
import { EXTENDED_UK } from './uk';
import { EXTENDED_TR } from './tr';
import { EXTENDED_HI } from './hi';

export const EXTENDED_LOCALES: Partial<
	Record<ModuleLocaleCode, Partial<Record<ExtendedUiKey, string>>>
> = {
	es: EXTENDED_ES,
	de: EXTENDED_DE,
	ar: EXTENDED_AR,
	zh: EXTENDED_ZH,
	it: EXTENDED_IT,
	pt: EXTENDED_PT,
	hi: EXTENDED_HI,
	uk: EXTENDED_UK,
	tr: EXTENDED_TR
};
