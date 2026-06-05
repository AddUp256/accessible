import type { UISettings } from '$lib/types/profile';

import { bilingualLabel } from './bilingual';
import type { ConfigKey } from './ui-config';
import type { UiKey } from './ui-translations';

/** Single-line config label (selects, buttons, placeholders). */
export function configLabel(
	french: string,
	key: UiKey | ConfigKey,
	settings: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): string {
	return bilingualLabel(french, key as UiKey, settings);
}
