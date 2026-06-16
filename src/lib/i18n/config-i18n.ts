/** R?le : Aide i18n Config I18n : s?lection, repli et chargement des textes bilingues. */
import type { UISettings } from '$lib/types/profile';

import { bilingualLabel } from './bilingual';
import type { ConfigKey } from './ui-config';
import type { UiKey } from './ui-translations';

/** Libell? de configuration sur une ligne (selects, boutons, placeholders). */
export function configLabel(
	french: string,
	key: UiKey | ConfigKey,
	settings: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): string {
	return bilingualLabel(french, key as UiKey, settings);
}
