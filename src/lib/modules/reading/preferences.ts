/** R?le : Logique m?tier de lecture adapt?e : fonctions pures ou r?gles locales testables hors interface. */
import { get } from 'svelte/store';
import { profileStore } from '$lib/stores/profile';
import { addFunctionalNeeds } from '$lib/modules/onboarding/actions';
import type {
	ComparisonResult,
	FunctionalNeedId,
	ReadingSettings
} from '$lib/types/profile';

function inferFunctionalNeeds(settings: ReadingSettings): FunctionalNeedId[] {
	const needs: FunctionalNeedId[] = [];

	if (settings.fontSize >= 20) needs.push('besoin_police_agrandie');
	if (settings.background === 'highContrast') needs.push('besoin_contraste_fort');
	if (settings.background === 'cream') needs.push('besoin_fond_doux');
	if (settings.lineGuide || settings.readingMask) needs.push('perte_de_ligne');
	if (settings.tts) needs.push('besoin_ecoute_audio');
	if (settings.falcMode) needs.push('lecture_longue_fatigante');
	if (settings.distractionFree) needs.push('besoin_environnement_faible_distraction');
	if (settings.font !== 'system') needs.push('lecture_visuelle_difficile');

	return [...new Set(needs)];
}

export function saveReadingPreferences(settings?: ReadingSettings) {
	const current = settings ?? get(profileStore).settings.reading;

	profileStore.updateSettings({ reading: current });
	addFunctionalNeeds(inferFunctionalNeeds(current), 'test');

	profileStore.patch((p) => ({
		...p,
		activatedTools: p.activatedTools.includes('read_adapted')
			? p.activatedTools
			: [...p.activatedTools, 'read_adapted']
	}));
}

export function recordReadingComparison(result: Omit<ComparisonResult, 'answeredAt'>) {
	const entry: ComparisonResult = { ...result, answeredAt: new Date().toISOString() };
	profileStore.patch((p) => ({
		...p,
		onboarding: {
			...p.onboarding,
			comparisons: [...p.onboarding.comparisons.filter((c) => c.step !== result.step), entry]
		}
	}));
}

/** Applique la variante « plus confortable » enregistrée lors d'une comparaison. */
export function applyPreferredComparisonVariant(
	preferredId: string | null,
	variants: readonly {
		id: string;
		fontId: ReadingSettings['font'];
		fontSize: number;
		lineHeight: number;
		background: ReadingSettings['background'];
		lineGuide?: boolean;
		alternatingLines?: boolean;
		falcSample?: boolean;
	}[]
): boolean {
	if (!preferredId) return false;
	const variant = variants.find((v) => v.id === preferredId);
	if (!variant) return false;
	applyComparatorVariant({
		fontId: variant.fontId,
		fontSize: variant.fontSize,
		lineHeight: variant.lineHeight,
		background: variant.background,
		lineGuide: variant.lineGuide ?? false,
		alternatingLines: variant.alternatingLines ?? false,
		falcMode: variant.falcSample ?? false
	});
	return true;
}

export function applyComparatorVariant(variant: {
	fontId: ReadingSettings['font'];
	fontSize: number;
	lineHeight: number;
	background: ReadingSettings['background'];
	lineGuide?: boolean;
	alternatingLines?: boolean;
	falcMode?: boolean;
}) {
	profileStore.updateSettings({
		reading: {
			font: variant.fontId,
			fontSize: variant.fontSize,
			lineHeight: variant.lineHeight,
			background: variant.background,
			lineGuide: variant.lineGuide ?? false,
			alternatingLines: variant.alternatingLines ?? false,
			falcMode: variant.falcMode ?? false
		}
	});
	saveReadingPreferences();
}
