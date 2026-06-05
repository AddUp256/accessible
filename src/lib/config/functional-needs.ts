import type { FunctionalNeedMeta } from '$lib/types/profile';

/** Besoins fonctionnels — construits par tests, préférences et usage. */
export const FUNCTIONAL_NEEDS: FunctionalNeedMeta[] = [
	{
		id: 'lecture_visuelle_difficile',
		label: 'Lecture visuelle difficile',
		description: 'Lire à l\'écran demande un effort.',
		category: 'reading'
	},
	{
		id: 'lecture_longue_fatigante',
		label: 'Lecture longue fatigante',
		description: 'Les textes longs fatiguent vite.',
		category: 'reading'
	},
	{
		id: 'besoin_ecoute_audio',
		label: 'Besoin d\'écoute audio',
		description: 'Écouter le texte aide à comprendre.',
		category: 'reading'
	},
	{
		id: 'perte_de_ligne',
		label: 'Perte de ligne',
		description: 'Je perds souvent ma place en lisant.',
		category: 'reading'
	},
	{
		id: 'gene_couleurs',
		label: 'Gêne avec certaines couleurs',
		description: 'Certaines couleurs gênent ou fatiguent.',
		category: 'reading'
	},
	{
		id: 'besoin_police_agrandie',
		label: 'Besoin de police agrandie',
		description: 'Un texte plus grand est plus confortable.',
		category: 'reading'
	},
	{
		id: 'besoin_contraste_fort',
		label: 'Besoin de contraste fort',
		description: 'Un fort contraste aide à lire.',
		category: 'reading'
	},
	{
		id: 'besoin_fond_doux',
		label: 'Besoin de fond doux',
		description: 'Un fond crème ou doux fatigue moins les yeux.',
		category: 'reading'
	},
	{
		id: 'besoin_documents_ocerises',
		label: 'Besoin de documents OCRisés',
		description: 'Les PDF scannés ou images sont difficiles à utiliser.',
		category: 'reading'
	},
	{
		id: 'difficulte_ecrire_longtemps',
		label: 'Difficulté à écrire longtemps',
		description: 'Écrire longtemps est fatigant.',
		category: 'writing'
	},
	{
		id: 'difficulte_orthographique',
		label: 'Difficulté orthographique',
		description: 'L\'orthographe demande beaucoup d\'effort.',
		category: 'writing'
	},
	{
		id: 'besoin_prediction_mots',
		label: 'Besoin de prédiction de mots',
		description: 'Proposer des mots pendant la frappe aide.',
		category: 'writing'
	},
	{
		id: 'besoin_correction_etape_par_etape',
		label: 'Besoin de correction étape par étape',
		description: 'Voir une erreur à la fois est plus confortable.',
		category: 'writing'
	},
	{
		id: 'difficulte_commencer_tache',
		label: 'Difficulté à commencer une tâche',
		description: 'Démarrer un travail est difficile.',
		category: 'organization'
	},
	{
		id: 'besoin_consignes_decoupees',
		label: 'Besoin de consignes découpées',
		description: 'Les consignes en petites étapes aident.',
		category: 'organization'
	},
	{
		id: 'besoin_une_etape_a_la_fois',
		label: 'Besoin de voir une seule étape à la fois',
		description: 'Une étape visible à la fois réduit la surcharge.',
		category: 'organization'
	},
	{
		id: 'besoin_routines',
		label: 'Besoin de routines',
		description: 'Des routines visuelles ou écrites rassurent.',
		category: 'organization'
	},
	{
		id: 'gene_animations',
		label: 'Gêne avec les animations',
		description: 'Les animations ou mouvements gênent.',
		category: 'sensory'
	},
	{
		id: 'gene_bruit',
		label: 'Gêne avec le bruit',
		description: 'Le bruit ou les sons gênent la concentration.',
		category: 'sensory'
	},
	{
		id: 'besoin_sous_titres',
		label: 'Besoin de sous-titres',
		description: 'Les vidéos sans sous-titres sont difficiles.',
		category: 'sensory'
	},
	{
		id: 'difficulte_prise_notes',
		label: 'Difficulté de prise de notes',
		description: 'Noter pendant un cours ou une réunion est difficile.',
		category: 'organization'
	},
	{
		id: 'besoin_cartes_mentales',
		label: 'Besoin de cartes mentales',
		description: 'Organiser les idées visuellement aide.',
		category: 'organization'
	},
	{
		id: 'besoin_pictogrammes',
		label: 'Besoin de pictogrammes',
		description: 'Les images ou pictogrammes aident à comprendre.',
		category: 'communication'
	},
	{
		id: 'besoin_reduire_frappe',
		label: 'Besoin de réduire la frappe',
		description: 'Moins taper au clavier serait utile.',
		category: 'motor'
	},
	{
		id: 'besoin_navigation_clavier',
		label: 'Besoin de navigation clavier',
		description: 'Utiliser le clavier plutôt que la souris.',
		category: 'motor'
	},
	{
		id: 'besoin_pauses',
		label: 'Besoin de pauses',
		description: 'Des pauses régulières sont nécessaires.',
		category: 'sensory'
	},
	{
		id: 'besoin_previsibilite',
		label: 'Besoin de prévisibilité',
		description: 'Savoir à l\'avance ce qui va se passer rassure.',
		category: 'sensory'
	},
	{
		id: 'besoin_supports_avance',
		label: 'Besoin de supports en avance',
		description: 'Recevoir les documents avant la séance aide.',
		category: 'organization'
	},
	{
		id: 'besoin_consignes_ecrites',
		label: 'Besoin de consignes écrites',
		description: 'Les consignes orales seules ne suffisent pas.',
		category: 'communication'
	},
	{
		id: 'besoin_environnement_faible_distraction',
		label: 'Besoin d\'un environnement à faible distraction',
		description: 'Moins d\'éléments à l\'écran ou autour aide à se concentrer.',
		category: 'sensory'
	}
];

export const FUNCTIONAL_NEEDS_BY_ID = Object.fromEntries(
	FUNCTIONAL_NEEDS.map((n) => [n.id, n])
) as Record<(typeof FUNCTIONAL_NEEDS)[number]['id'], FunctionalNeedMeta>;

export const FUNCTIONAL_NEEDS_BY_CATEGORY = FUNCTIONAL_NEEDS.reduce(
	(acc, need) => {
		(acc[need.category] ??= []).push(need);
		return acc;
	},
	{} as Record<FunctionalNeedMeta['category'], FunctionalNeedMeta[]>
);
