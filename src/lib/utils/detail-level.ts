/** R?le : Utilitaire Detail Level : r?gle transversale utilis?e par plusieurs zones. */
import type { AccessibleProfile, AppSettings } from '$lib/types/profile';

/** Réglages avancés visibles en mode expert uniquement. */
export function isExpertDetail(
	profileOrSettings: AccessibleProfile | Pick<AppSettings, 'ui'> | { meta: AccessibleProfile['meta']; settings: AppSettings }
): boolean {
	const meta = 'meta' in profileOrSettings ? profileOrSettings.meta : null;
	const ui =
		'settings' in profileOrSettings
			? profileOrSettings.settings.ui
			: 'ui' in profileOrSettings
				? profileOrSettings.ui
				: (profileOrSettings as AccessibleProfile).settings.ui;

	return meta?.appMode === 'expert' || ui.detailLevel === 'expert';
}

/** Interface épurée — gros boutons, moins d'options visibles. */
export function isVerySimpleDetail(
	profileOrSettings: AccessibleProfile | Pick<AppSettings, 'ui'> | { meta: AccessibleProfile['meta']; settings: AppSettings }
): boolean {
	const meta = 'meta' in profileOrSettings ? profileOrSettings.meta : null;
	const ui =
		'settings' in profileOrSettings
			? profileOrSettings.settings.ui
			: 'ui' in profileOrSettings
				? profileOrSettings.ui
				: (profileOrSettings as AccessibleProfile).settings.ui;

	return meta?.appMode === 'verySimple' || ui.detailLevel === 'verySimple';
}
