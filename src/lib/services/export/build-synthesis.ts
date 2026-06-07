import { getAccommodationsForNeeds } from '$lib/config/accommodations';
import { FLE_LEXICON } from '$lib/config/fle-lexicon';
import { BUILT_IN_COMMUNICATION_CARDS } from '$lib/config/communication-cards';
import { FUNCTIONAL_NEEDS_BY_ID } from '$lib/config/functional-needs';
import { MEDICAL_PROFILES_BY_ID } from '$lib/config/medical-profiles';
import { getSpecialistRecommendations } from '$lib/config/specialists';
import { FONTS_BY_ID } from '$lib/config/fonts-catalog';
import { TOOLS_BY_ID } from '$lib/config/tools-catalog';
import type {
	AccessibleProfile,
	FunctionalNeedId,
	MedicalProfileId,
	PDFSynthesis,
	SettingSummary
} from '$lib/types/profile';

export const PDF_TITLE = 'Synthèse de besoins fonctionnels — document préparatoire' as const;
export const PDF_DISCLAIMER = 'Ce document ne constitue pas un diagnostic.' as const;

export function profileForExport(profile: AccessibleProfile): AccessibleProfile {
	if (profile.declaredProfiles.visibleInExports) return profile;
	return {
		...profile,
		declaredProfiles: {
			...profile.declaredProfiles,
			medicalOrAdministrative: []
		}
	};
}

function collectFunctionalNeedIds(profile: AccessibleProfile): FunctionalNeedId[] {
	const ids = new Set<FunctionalNeedId>();
	for (const entries of Object.values(profile.functionalProfiles)) {
		for (const entry of entries) ids.add(entry.id);
	}
	return [...ids];
}

function formatSettingSummaries(profile: AccessibleProfile): SettingSummary[] {
	const { ui, reading, writing, sensory, motor, communication } = profile.settings;
	return [
		{ key: 'ui.theme', label: 'Thème interface', value: ui.theme },
		{ key: 'ui.buttonSize', label: 'Taille des boutons', value: ui.buttonSize },
		{ key: 'ui.textSize', label: "Taille du texte d'interface", value: ui.textSize },
		{
			key: 'reading.font',
			label: 'Police de lecture',
			value:
				reading.font === 'custom' && reading.customFontName
					? `${reading.customFontName} (importée)`
					: FONTS_BY_ID[reading.font]?.name ?? reading.font
		},
		{ key: 'reading.fontSize', label: 'Taille du texte', value: `${reading.fontSize} px` },
		{ key: 'reading.lineHeight', label: 'Interligne', value: String(reading.lineHeight) },
		{ key: 'reading.background', label: 'Fond de lecture', value: reading.background },
		{ key: 'reading.lineGuide', label: 'Guide-ligne', value: reading.lineGuide ? 'activé' : 'désactivé' },
		{ key: 'reading.tts', label: 'Lecture vocale', value: reading.tts ? 'activée' : 'désactivée' },
		{ key: 'reading.ttsRate', label: 'Vitesse lecture vocale', value: String(reading.ttsRate) },
		{ key: 'writing.spellcheck', label: 'Correction', value: writing.spellcheck },
		{ key: 'sensory.animations', label: 'Animations', value: sensory.animations ? 'activées' : 'désactivées' },
		{ key: 'motor.largeButtons', label: 'Gros boutons', value: motor.largeButtons ? 'activés' : 'désactivés' },
		{
			key: 'communication.pictogramsEnabled',
			label: 'Pictogrammes',
			value: communication.pictogramsEnabled ? 'activés' : 'désactivés'
		}
	];
}

function formatRejectedSummaries(profile: AccessibleProfile): SettingSummary[] {
	return profile.rejectedSettings.map((r) => ({
		key: r.key,
		label: 'Réglage refusé',
		value: r.key
	}));
}

export function buildPDFSynthesis(profile: AccessibleProfile, appVersion = '0.0.1'): PDFSynthesis {
	const exportProfile = profileForExport(profile);
	const needIds = collectFunctionalNeedIds(exportProfile);
	const medicalIds = exportProfile.declaredProfiles.medicalOrAdministrative.map((p) => p.id);

	const declaredDifficulties = needIds.map(
		(id) => FUNCTIONAL_NEEDS_BY_ID[id]?.label ?? `Besoin déclaré : ${id}`
	);

	const triggers = [...needIds, ...medicalIds];
	const specialistRecs = getSpecialistRecommendations(triggers);
	const accommodations = getAccommodationsForNeeds(needIds);

	return {
		title: PDF_TITLE,
		disclaimer: PDF_DISCLAIMER,
		generalInfo: {
			date: new Date().toLocaleDateString('fr-FR'),
			appVersion
		},
		declaredMedicalProfiles: exportProfile.declaredProfiles.visibleInExports
			? (medicalIds as MedicalProfileId[])
			: undefined,
		declaredDifficulties,
		usefulSettings: formatSettingSummaries(exportProfile),
		rejectedSettings: formatRejectedSummaries(exportProfile),
		activatedTools: exportProfile.activatedTools,
		specialistsToDiscuss: specialistRecs.map((r) => r.formulation),
		accommodationsToDiscuss: accommodations,
		enrichedSections: buildEnrichedSections(exportProfile),
		technicalExport: exportProfile
	};
}

function buildEnrichedSections(profile: AccessibleProfile) {
	const glossary = (profile.comprehension?.glossary ?? []).map(
		(entry) => `${entry.term} → ${entry.definition}`
	);

	const cardOverrides = profile.communicator?.builtInCardOverrides ?? {};
	const personalCards = profile.communicator?.personalCards ?? [];
	const communicationCards = [
		...BUILT_IN_COMMUNICATION_CARDS.slice(0, 6).map((card) => {
			const override = cardOverrides[card.id];
			return `${override?.label ?? card.label} : ${override?.message ?? card.message}`;
		}),
		...personalCards.slice(0, 6).map((card) => `${card.label} : ${card.message}`)
	];

	const notesSummary = (profile.notes?.notes ?? [])
		.slice(0, 5)
		.map((note) => `${note.title} (${new Date(note.updatedAt).toLocaleDateString('fr-FR')})`);

	const visualRoutines = (profile.organizer?.visualRoutines ?? [])
		.slice(0, 4)
		.map((routine) => `${routine.title} — ${routine.steps.length} étape(s)`);

	const fleLexiconSample = FLE_LEXICON.slice(0, 8).map(
		(entry) => `${entry.term} → ${entry.simple}`
	);

	return {
		glossary,
		communicationCards,
		notesSummary,
		visualRoutines,
		fleLexiconSample
	};
}

export function medicalLabelsForExport(profile: AccessibleProfile): string[] {
	if (!profile.declaredProfiles.visibleInExports) return [];
	return profile.declaredProfiles.medicalOrAdministrative.map(
		(p) => MEDICAL_PROFILES_BY_ID[p.id]?.label ?? p.id
	);
}

export function toolLabels(profile: AccessibleProfile): string[] {
	return profile.activatedTools.map((id) => TOOLS_BY_ID[id]?.label ?? id);
}
