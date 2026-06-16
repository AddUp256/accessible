/** R?le : Aide i18n Bilingual : s?lection, repli et chargement des textes bilingues. */
import type { UISettings } from '$lib/types/profile';

import { getBilingualSecondaryTranslation, getUiTranslation, type UiKey } from './ui-translations';

export type { UiKey };

export function bilingualUi(
	french: string,
	key: UiKey,
	settings: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): { primary: string; secondary?: string } {
	if (!settings.bilingualUi || settings.secondaryLanguage === 'fr') {
		return { primary: french };
	}
	const translated = getBilingualSecondaryTranslation(key, settings.secondaryLanguage);
	if (!translated || translated === french) {
		return { primary: french };
	}
	return { primary: french, secondary: translated };
}

/** Libell? sur une ligne pour selects, options et boutons qui ne peuvent pas contenir BilingualText. */
export function bilingualLabel(
	french: string,
	key: UiKey,
	settings: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): string {
	const bi = bilingualUi(french, key, settings);
	return bi.secondary ? `${bi.primary} / ${bi.secondary}` : bi.primary;
}

/** Traduction UI pour affichage monolingue (avec repli anglais). */
export { getUiTranslation };

export function bilingualPair(
	french: string,
	other: string | undefined,
	enabled: boolean
): { primary: string; secondary?: string } {
	if (!enabled || !other || other.trim() === french.trim()) {
		return { primary: french };
	}
	return { primary: french, secondary: other.trim() };
}
