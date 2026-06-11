import { profileStore } from '$lib/stores/profile';
import type {
	AccessibleProfile,
	DeclaredMedicalProfile,
	FunctionalCategory,
	FunctionalNeedEntry,
	FunctionalNeedId,
	MedicalProfileId,
	OnboardingState,
	RejectedSetting,
	SettingKey,
	ToolId
} from '$lib/types/profile';
import { createEmptyFunctionalProfiles } from '$lib/types/profile';
import { FUNCTIONAL_NEEDS_BY_ID } from '$lib/config/functional-needs';

/** Réinitialise outils et besoins fonctionnels avant un nouveau parcours d'onboarding. */
export function resetPersonalizationJourney() {
	profileStore.patch((p) => ({
		...p,
		activatedTools: [],
		functionalProfiles: createEmptyFunctionalProfiles(),
		declaredProfiles: {
			medicalOrAdministrative: [],
			visibleInExports: p.declaredProfiles.visibleInExports
		}
	}));
}

export function setOnboardingPath(
	path: NonNullable<OnboardingState['path']>,
	options: { reset?: boolean } = {}
) {
	const reset = options.reset ?? true;
	profileStore.patch((p) => {
		if (!reset && p.onboarding.path === path) return p;

		return {
			...p,
			activatedTools: reset ? [] : p.activatedTools,
			functionalProfiles: reset ? createEmptyFunctionalProfiles() : p.functionalProfiles,
			declaredProfiles: reset
				? {
						medicalOrAdministrative: [],
						visibleInExports: p.declaredProfiles.visibleInExports
					}
				: p.declaredProfiles,
			onboarding: reset
				? { ...p.onboarding, path, completedSteps: [], comparisons: [] }
				: { ...p.onboarding, path }
		};
	});
}

export function completeOnboardingStep(stepId: string) {
	profileStore.patch((p) => {
		const steps = p.onboarding.completedSteps.includes(stepId)
			? p.onboarding.completedSteps
			: [...p.onboarding.completedSteps, stepId];
		return { ...p, onboarding: { ...p.onboarding, completedSteps: steps } };
	});
}

export function setActivatedTools(tools: ToolId[]) {
	profileStore.patch((p) => ({ ...p, activatedTools: tools }));
}

export function setDeclaredMedicalProfiles(ids: MedicalProfileId[]) {
	const now = new Date().toISOString();
	const entries: DeclaredMedicalProfile[] = ids.map((id) => ({
		id,
		declaredAt: now,
		source: 'user_selection'
	}));

	profileStore.patch((p) => ({
		...p,
		declaredProfiles: {
			...p.declaredProfiles,
			medicalOrAdministrative: entries
		}
	}));
}

export function addFunctionalNeeds(needIds: FunctionalNeedId[], source: FunctionalNeedEntry['source'] = 'onboarding') {
	const now = new Date().toISOString();

	profileStore.patch((p) => {
		const functionalProfiles = { ...p.functionalProfiles };

		for (const id of needIds) {
			const meta = FUNCTIONAL_NEEDS_BY_ID[id];
			if (!meta) continue;
			const category = meta.category as FunctionalCategory;
			const exists = functionalProfiles[category].some((e) => e.id === id);
			if (exists) continue;

			functionalProfiles[category] = [
				...functionalProfiles[category],
				{ id, source, confirmedAt: now, confidence: 'declared' }
			];
		}

		return { ...p, functionalProfiles };
	});
}

export function recordRejectedSetting(
	key: SettingKey,
	source: RejectedSetting['source'] = 'medical_preset',
	reason?: RejectedSetting['reason']
) {
	const now = new Date().toISOString();

	profileStore.patch((p) => {
		const filtered = p.rejectedSettings.filter((r) => r.key !== key);
		return {
			...p,
			rejectedSettings: [...filtered, { key, rejectedAt: now, source, reason }]
		};
	});
}

export function isSettingRejected(profile: AccessibleProfile, key: SettingKey): boolean {
	return profile.rejectedSettings.some((r) => r.key === key);
}

export function filterOutRejectedItems<T extends { key: SettingKey }>(
	profile: AccessibleProfile,
	items: T[]
): T[] {
	return items.filter((item) => !isSettingRejected(profile, item.key));
}
