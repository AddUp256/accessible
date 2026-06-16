/** R?le : Logique m?tier de profil et personnalisation : fonctions pures ou r?gles locales testables hors interface. */
import type { DashboardAction } from '$lib/config/dashboard-actions';
import { NAV_ZONES } from '$lib/config/dashboard-actions';
import type {
	AccessibleProfile,
	FunctionalNeedId,
	ToolId
} from '$lib/types/profile';
import { isExpertDetail, isVerySimpleDetail } from '$lib/utils/detail-level';

export type AppFeature =
	| 'lire'
	| 'ecrire'
	| 'organiser'
	| 'comprendre'
	| 'communiquer'
	| 'profil'
	| 'notes'
	| 'memoriser'
	| 'enseignant';

const ZONE_HREF: Record<AppFeature, string | null> = {
	lire: '/lire',
	ecrire: '/ecrire',
	organiser: '/organiser',
	comprendre: '/comprendre',
	communiquer: '/communiquer',
	profil: '/profil',
	notes: '/notes',
	memoriser: '/memoriser',
	enseignant: '/enseignant'
};

const TOOL_FEATURES: Record<ToolId, AppFeature[]> = {
	read_adapted: ['lire'],
	listen_text: ['lire'],
	work_on_pdf: ['lire'],
	reduce_distractions: ['lire'],
	subtitles: ['lire'],
	correct_text: ['ecrire'],
	write_easier: ['ecrire'],
	reduce_typing: ['ecrire'],
	organize_work: ['organiser', 'notes', 'memoriser'],
	pictograms: ['communiquer'],
	prepare_appointment: ['profil'],
	adapt_interface: []
};

const NEED_FEATURES: Partial<Record<FunctionalNeedId, AppFeature[]>> = {
	lecture_visuelle_difficile: ['lire'],
	lecture_longue_fatigante: ['lire'],
	besoin_ecoute_audio: ['lire'],
	perte_de_ligne: ['lire'],
	gene_couleurs: ['lire'],
	besoin_police_agrandie: ['lire'],
	besoin_contraste_fort: ['lire'],
	besoin_fond_doux: ['lire'],
	besoin_documents_ocerises: ['lire'],
	difficulte_ecrire_longtemps: ['ecrire'],
	difficulte_orthographique: ['ecrire'],
	besoin_prediction_mots: ['ecrire'],
	besoin_correction_etape_par_etape: ['ecrire'],
	difficulte_commencer_tache: ['organiser'],
	besoin_consignes_decoupees: ['comprendre'],
	besoin_une_etape_a_la_fois: ['comprendre'],
	besoin_routines: ['organiser'],
	besoin_sous_titres: ['lire'],
	difficulte_prise_notes: ['notes'],
	besoin_cartes_mentales: ['organiser'],
	besoin_pictogrammes: ['communiquer'],
	besoin_reduire_frappe: ['ecrire'],
	besoin_consignes_ecrites: ['comprendre'],
	besoin_environnement_faible_distraction: ['lire']
};

const ACTION_FEATURES: Record<string, AppFeature[]> = {
	read_text: ['lire'],
	adapt_document: ['lire'],
	write_text: ['ecrire'],
	correct_text: ['ecrire'],
	organize_work: ['organiser'],
	take_notes: ['notes'],
	study_flashcards: ['memoriser'],
	mind_maps: ['organiser'],
	understand_instruction: ['comprendre'],
	arasaac_pictograms: ['communiquer'],
	prepare_appointment: ['profil'],
	export_synthesis: []
};

function hasFunctionalNeeds(profile: AccessibleProfile): boolean {
	return Object.values(profile.functionalProfiles).some((entries) => entries.length > 0);
}

function hasCompletedPersonalizationPath(profile: AccessibleProfile): boolean {
	return (
		profile.onboarding.path !== null &&
		profile.onboarding.completedSteps.some((step) => step !== 'comfort')
	);
}

/** Personnalisation active : outils ou besoins fonctionnels renseignés. */
export function isPersonalizationActive(profile: AccessibleProfile): boolean {
	return (
		profile.activatedTools.length > 0 ||
		hasFunctionalNeeds(profile) ||
		profile.declaredProfiles.medicalOrAdministrative.length > 0 ||
		hasCompletedPersonalizationPath(profile)
	);
}

export function isFullAccessMode(profile: AccessibleProfile): boolean {
	if (isExpertDetail(profile)) return true;
	if (profile.meta.appMode === 'teacher' || profile.meta.appMode === 'companion') return true;
	return false;
}

export function needsPersonalization(profile: AccessibleProfile): boolean {
	return !isFullAccessMode(profile) && !isPersonalizationActive(profile);
}

export function collectActiveFeatures(profile: AccessibleProfile): Set<AppFeature> {
	const features = new Set<AppFeature>();

	for (const tool of profile.activatedTools) {
		for (const f of TOOL_FEATURES[tool] ?? []) features.add(f);
	}

	for (const entries of Object.values(profile.functionalProfiles)) {
		for (const entry of entries) {
			const needId = entry.id as FunctionalNeedId;
			for (const f of NEED_FEATURES[needId] ?? []) features.add(f);
		}
	}

	return features;
}

export function isFeatureVisible(profile: AccessibleProfile, feature: AppFeature): boolean {
	if (feature === 'profil') return true;
	if (isFullAccessMode(profile)) return true;
	if (!isPersonalizationActive(profile)) return false;

	return collectActiveFeatures(profile).has(feature);
}

export function isRouteVisible(profile: AccessibleProfile, pathname: string): boolean {
	if (pathname === '/' || pathname.startsWith('/onboarding') || pathname.startsWith('/parametres')) {
		return true;
	}

	for (const [feature, href] of Object.entries(ZONE_HREF) as [AppFeature, string | null][]) {
		if (!href) continue;
		if (pathname === href || pathname.startsWith(`${href}/`)) {
			return isFeatureVisible(profile, feature);
		}
	}

	return true;
}

export function featureFromPath(pathname: string): AppFeature | null {
	if (pathname === '/' || pathname.startsWith('/onboarding') || pathname.startsWith('/parametres')) {
		return null;
	}

	for (const [feature, href] of Object.entries(ZONE_HREF) as [AppFeature, string | null][]) {
		if (!href) continue;
		if (pathname === href || pathname.startsWith(`${href}/`)) {
			return feature;
		}
	}

	return null;
}

export function filterNavZones(profile: AccessibleProfile) {
	return NAV_ZONES.filter((zone) => {
		const feature = zone.href.replace('/', '') as AppFeature;
		return isFeatureVisible(profile, feature);
	});
}

export function filterDashboardActions(profile: AccessibleProfile, actions: DashboardAction[]): DashboardAction[] {
	if (isFullAccessMode(profile)) return actions;
	if (!isPersonalizationActive(profile)) return [];

	const active = collectActiveFeatures(profile);
	return actions.filter((action) => {
		const feats = ACTION_FEATURES[action.id];
		if (!feats || feats.length === 0) return true;
		return feats.some((f) => active.has(f));
	});
}

export function listHiddenFeatures(profile: AccessibleProfile): AppFeature[] {
	if (isFullAccessMode(profile)) return [];

	const all: AppFeature[] = [
		'lire',
		'ecrire',
		'organiser',
		'comprendre',
		'communiquer',
		'profil',
		'notes',
		'memoriser'
	];
	return all.filter((f) => !isFeatureVisible(profile, f));
}

export function featureLabelFr(feature: AppFeature): string {
	const labels: Record<AppFeature, string> = {
		lire: 'Lire',
		ecrire: 'Écrire',
		organiser: 'Organiser',
		comprendre: 'Comprendre',
		communiquer: 'Communiquer',
		profil: 'Mon profil',
		notes: 'Notes',
		memoriser: 'Mémoriser',
		enseignant: 'Parcours enseignant'
	};
	return labels[feature];
}

export function shouldSimplifyNav(profile: AccessibleProfile): boolean {
	return isVerySimpleDetail(profile) && !isFullAccessMode(profile);
}

export type LireSubTab = 'compare' | 'media';

const LIRE_TAB_TOOLS: Record<LireSubTab, ToolId[]> = {
	compare: ['read_adapted', 'work_on_pdf', 'reduce_distractions'],
	media: ['listen_text', 'subtitles']
};

const LIRE_TAB_NEEDS: Record<LireSubTab, FunctionalNeedId[]> = {
	compare: [
		'lecture_visuelle_difficile',
		'besoin_police_agrandie',
		'gene_couleurs',
		'besoin_contraste_fort',
		'besoin_fond_doux',
		'besoin_environnement_faible_distraction'
	],
	media: ['besoin_ecoute_audio', 'besoin_sous_titres']
};

export function isLireSubTabVisible(profile: AccessibleProfile, tab: LireSubTab): boolean {
	if (isFullAccessMode(profile)) return true;
	if (!isPersonalizationActive(profile)) return false;
	if (!isFeatureVisible(profile, 'lire')) return false;

	if (profile.activatedTools.some((tool) => LIRE_TAB_TOOLS[tab].includes(tool))) {
		return true;
	}

	for (const entries of Object.values(profile.functionalProfiles)) {
		for (const entry of entries) {
			const needId = entry.id as FunctionalNeedId;
			if (LIRE_TAB_NEEDS[tab].includes(needId)) return true;
		}
	}

	return false;
}
