/** R?le : Aide i18n Dashboard I18n : s?lection, repli et chargement des textes bilingues. */
import type { DashboardAction } from '$lib/config/dashboard-actions';
import type { UISettings } from '$lib/types/profile';

import { bilingualUi } from './bilingual';
import type { UiKey } from './ui-translations';

export type DashboardVariant = 'default' | 'teacher' | 'expert';

function dashKeys(
	action: DashboardAction,
	variant: DashboardVariant
): { labelKey: UiKey; descKey: UiKey } {
	if (variant === 'teacher') {
		return {
			labelKey: `dash.teacher.${action.id}.label` as UiKey,
			descKey: `dash.teacher.${action.id}.desc` as UiKey
		};
	}
	if (variant === 'expert') {
		return {
			labelKey: `dash.expert.${action.id}.label` as UiKey,
			descKey: `dash.expert.${action.id}.desc` as UiKey
		};
	}
	return {
		labelKey: `dash.${action.id}.label` as UiKey,
		descKey: `dash.${action.id}.desc` as UiKey
	};
}

export function bilingualDashboardAction(
	action: DashboardAction,
	settings: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>,
	variant: DashboardVariant = 'default'
) {
	const { labelKey, descKey } = dashKeys(action, variant);
	return {
		label: bilingualUi(action.label, labelKey, settings),
		description: bilingualUi(action.description, descKey, settings)
	};
}
