import type { AccommodationSuggestion, FunctionalNeedId } from '$lib/types/profile';

/** Aménagements à discuter — formulations neutres, jamais prescriptives. */
export const ACCOMMODATION_SUGGESTIONS: AccommodationSuggestion[] = [
	{
		triggerNeed: 'lecture_longue_fatigante',
		accommodations: [
			'Supports accessibles (PDF OCRisés, version numérique)',
			'Temps majoré pour la lecture',
			'Version audio du document',
			'Police agrandie sur les documents'
		]
	},
	{
		triggerNeed: 'besoin_ecoute_audio',
		accommodations: [
			'Version audio des cours ou documents',
			'Autorisation d\'écouter le texte à l\'examen (à discuter)',
			'Supports numériques compatibles lecture vocale'
		]
	},
	{
		triggerNeed: 'perte_de_ligne',
		accommodations: [
			'Documents avec interligne augmenté',
			'Guide-ligne ou règle de lecture autorisée',
			'Supports numériques adaptables'
		]
	},
	{
		triggerNeed: 'besoin_contraste_fort',
		accommodations: [
			'Documents en contraste élevé',
			'Éclairage adapté en salle d\'examen',
			'Version numérique modifiable'
		]
	},
	{
		triggerNeed: 'besoin_documents_ocerises',
		accommodations: [
			'PDF OCRisés fournis à l\'avance',
			'Délai pour obtenir des supports accessibles',
			'Prêt de matériel de numérisation'
		]
	},
	{
		triggerNeed: 'difficulte_orthographique',
		accommodations: [
			'Correcteur autorisé (modalités à définir)',
			'Correction étape par étape plutôt que globale',
			'Temps majoré pour la relecture'
		]
	},
	{
		triggerNeed: 'difficulte_ecrire_longtemps',
		accommodations: [
			'Dictée vocale autorisée (à discuter)',
			'Réduction du volume à écrire',
			'Modalité orale ou enregistrée alternative'
		]
	},
	{
		triggerNeed: 'besoin_correction_etape_par_etape',
		accommodations: [
			'Utilisation d\'un correcteur en mode guidé',
			'Temps majoré pour la correction'
		]
	},
	{
		triggerNeed: 'difficulte_commencer_tache',
		accommodations: [
			'Consignes découpées par étapes',
			'Accompagnement pour démarrer la tâche',
			'Supports visuels ou checklists'
		]
	},
	{
		triggerNeed: 'besoin_consignes_decoupees',
		accommodations: [
			'Consignes écrites étape par étape',
			'Version FALC des consignes',
			'Supports remis à l\'avance'
		]
	},
	{
		triggerNeed: 'besoin_une_etape_a_la_fois',
		accommodations: [
			'Affichage d\'une seule question ou étape à la fois',
			'Feuille de route visuelle',
			'Temps de familiarisation avec l\'outil'
		]
	},
	{
		triggerNeed: 'besoin_routines',
		accommodations: [
			'Planning visible à l\'avance',
			'Annonce des changements avant qu\'ils arrivent',
			'Supports de routine visuelle'
		]
	},
	{
		triggerNeed: 'gene_animations',
		accommodations: [
			'Réduction des animations sur les supports numériques',
			'Salle à faible distraction',
			'Préavis avant tout changement visuel'
		]
	},
	{
		triggerNeed: 'besoin_sous_titres',
		accommodations: [
			'Sous-titres sur toutes les vidéos',
			'Transcription écrite des enregistrements',
			'Accès aux supports avant la séance'
		]
	},
	{
		triggerNeed: 'besoin_pauses',
		accommodations: [
			'Pauses prévues pendant les examens',
			'Temps majoré incluant les pauses',
			'Salle calme pour les pauses'
		]
	},
	{
		triggerNeed: 'besoin_previsibilite',
		accommodations: [
			'Supports et consignes remis à l\'avance',
			'Déroulé de la séance connu à l\'avance',
			'Modalités d\'examen fixées clairement'
		]
	},
	{
		triggerNeed: 'besoin_supports_avance',
		accommodations: [
			'Documents remis plusieurs jours avant',
			'Accès anticipé aux plateformes',
			'Liste de vocabulaire ou glossaire fourni'
		]
	},
	{
		triggerNeed: 'besoin_consignes_ecrites',
		accommodations: [
			'Consignes toujours écrites en plus de l\'oral',
			'Consignes disponibles pendant toute la séance',
			'Version FALC si besoin'
		]
	},
	{
		triggerNeed: 'besoin_environnement_faible_distraction',
		accommodations: [
			'Salle individuelle ou à faible distraction',
			'Réduction des éléments visuels superflus',
			'Casque anti-bruit (à discuter)'
		]
	},
	{
		triggerNeed: 'besoin_navigation_clavier',
		accommodations: [
			'Logiciels utilisables entièrement au clavier',
			'Ordinateur avec raccourcis adaptés',
			'Temps de prise en main de l\'outil'
		]
	},
	{
		triggerNeed: 'besoin_reduire_frappe',
		accommodations: [
			'Prédiction de mots autorisée',
			'Modèles de texte ou formulaires',
			'Dictée vocale (modalités à définir)'
		]
	},
	{
		triggerNeed: 'besoin_pictogrammes',
		accommodations: [
			'Supports avec pictogrammes',
			'Fiche de communication personnelle',
			'Temps supplémentaire pour les consignes visuelles'
		]
	},
	{
		triggerNeed: 'difficulte_prise_notes',
		accommodations: [
			'Support de cours fourni (PDF, slides)',
			'Enregistrement autorisé (à discuter)',
			'Prise de notes accompagnée ou partagée'
		]
	},
	{
		triggerNeed: 'besoin_cartes_mentales',
		accommodations: [
			'Autorisation d\'utiliser un outil d\'organisation visuelle',
			'Supports pré-structurés fournis'
		]
	},
	{
		triggerNeed: 'besoin_police_agrandie',
		accommodations: [
			'Documents en police agrandie',
			'Affichage numérique adaptable',
			'Version papier avec taille de texte adaptée'
		]
	},
	{
		triggerNeed: 'besoin_fond_doux',
		accommodations: [
			'Fond clair ou crème sur les supports numériques',
			'Éclairage modéré en salle'
		]
	},
	{
		triggerNeed: 'gene_bruit',
		accommodations: [
			'Salle calme',
			'Casque anti-bruit autorisé',
			'Épreuve en dehors des périodes bruyantes'
		]
	},
	{
		triggerNeed: 'besoin_prediction_mots',
		accommodations: [
			'Prédiction de mots autorisée à l\'examen (à discuter)',
			'Logiciel de traitement de texte adapté'
		]
	}
];

export const ACCOMMODATIONS_BY_NEED = Object.fromEntries(
	ACCOMMODATION_SUGGESTIONS.map((a) => [a.triggerNeed, a.accommodations])
) as Partial<Record<FunctionalNeedId, string[]>>;

export function getAccommodationsForNeeds(needIds: FunctionalNeedId[]): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const id of needIds) {
		const items = ACCOMMODATIONS_BY_NEED[id] ?? [];
		for (const item of items) {
			if (!seen.has(item)) {
				seen.add(item);
				result.push(item);
			}
		}
	}
	return result;
}
