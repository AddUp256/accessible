/** R?le : Configuration d?clarative Specialists : donn?es m?tier sans effet de bord. */
import type { SpecialistId, SpecialistRecommendation } from '$lib/types/profile';

/** Labels FALC pour affichage — pas de formulation diagnostique. */
export const SPECIALIST_LABELS: Record<SpecialistId, string> = {
	medecin_universitaire: 'Médecin universitaire',
	service_handicap: 'Service handicap de votre établissement',
	orthophoniste: 'Orthophoniste',
	neuropsychologue: 'Neuropsychologue',
	psychologue: 'Psychologue',
	psychiatre: 'Psychiatre',
	professionnel_tsa: 'Professionnel formé TSA',
	cra: 'Centre ressources autisme (CRA)',
	ophtalmologiste: 'Ophtalmologiste',
	orthoptiste: 'Orthoptiste',
	orl: 'ORL',
	audioprothesiste: 'Audioprothésiste',
	ergotherapeute: 'Ergothérapeute',
	psychomotricien: 'Psychomotricien',
	service_fle: 'Service FLE de votre établissement',
	tutorat_linguistique: 'Tutorat linguistique',
	enseignant_referent: 'Enseignant référent ou référent handicap',
	bu_documentation: 'BU / service documentation'
};

export const SPECIALIST_RECOMMENDATIONS: SpecialistRecommendation[] = [
	{
		trigger: 'dyslexie',
		specialists: ['orthophoniste', 'neuropsychologue', 'service_handicap', 'enseignant_referent'],
		formulation:
			'Il peut être pertinent d\'en parler avec un orthophoniste, le service handicap ou un enseignant référent.'
	},
	{
		trigger: 'dysorthographie',
		specialists: ['orthophoniste', 'service_handicap'],
		formulation: 'Il peut être pertinent d\'en parler avec un orthophoniste ou le service handicap.'
	},
	{
		trigger: 'tsa',
		specialists: ['professionnel_tsa', 'cra', 'service_handicap', 'ergotherapeute'],
		formulation:
			'Il peut être pertinent d\'en parler avec un professionnel formé TSA, le service handicap ou un ergothérapeute.'
	},
	{
		trigger: 'tdah',
		specialists: ['medecin_universitaire', 'psychiatre', 'psychologue', 'service_handicap'],
		formulation:
			'Il peut être pertinent d\'en parler avec le service handicap, un psychologue ou un médecin universitaire.'
	},
	{
		trigger: 'malvoyance',
		specialists: ['ophtalmologiste', 'orthoptiste', 'service_handicap', 'bu_documentation'],
		formulation:
			'Il peut être pertinent d\'en parler avec un ophtalmologiste, le service handicap ou la BU.'
	},
	{
		trigger: 'surdite_malentendance',
		specialists: ['orl', 'audioprothesiste', 'service_handicap'],
		formulation: 'Il peut être pertinent d\'en parler avec un ORL, un audioprothésiste ou le service handicap.'
	},
	{
		trigger: 'handicap_moteur',
		specialists: ['ergotherapeute', 'service_handicap', 'medecin_universitaire'],
		formulation:
			'Il peut être pertinent d\'en parler avec un ergothérapeute ou le service handicap.'
	},
	{
		trigger: 'allophonie_fle',
		specialists: ['service_fle', 'tutorat_linguistique', 'service_handicap'],
		formulation:
			'Il peut être pertinent d\'en parler avec le service FLE, un tutorat linguistique ou le service handicap.'
	},
	{
		trigger: 'lecture_longue_fatigante',
		specialists: ['orthophoniste', 'ophtalmologiste', 'service_handicap'],
		formulation:
			'Il peut être pertinent d\'en parler avec le service handicap, un orthophoniste ou un ophtalmologiste.'
	},
	{
		trigger: 'besoin_ecoute_audio',
		specialists: ['orthophoniste', 'service_handicap'],
		formulation: 'Il peut être pertinent d\'en parler avec un orthophoniste ou le service handicap.'
	},
	{
		trigger: 'difficulte_orthographique',
		specialists: ['orthophoniste', 'service_handicap'],
		formulation: 'Il peut être pertinent d\'en parler avec un orthophoniste ou le service handicap.'
	},
	{
		trigger: 'trouble_psychique_anxiete_surcharge',
		specialists: ['psychologue', 'psychiatre', 'medecin_universitaire', 'service_handicap'],
		formulation:
			'Il peut être pertinent d\'en parler avec un psychologue, le service handicap ou un médecin universitaire.'
	},
	{
		trigger: 'besoin_documents_ocerises',
		specialists: ['service_handicap', 'bu_documentation', 'enseignant_referent'],
		formulation:
			'Il peut être pertinent d\'en parler avec le service handicap, la BU ou un enseignant référent.'
	},
	{
		trigger: 'besoin_pictogrammes',
		specialists: ['orthophoniste', 'professionnel_tsa', 'service_handicap'],
		formulation:
			'Il peut être pertinent d\'en parler avec un orthophoniste, un professionnel formé TSA ou le service handicap.'
	},
	{
		trigger: 'difficultes_sans_diagnostic',
		specialists: ['service_handicap', 'medecin_universitaire', 'enseignant_referent'],
		formulation:
			'Il peut être pertinent d\'en parler avec le service handicap, un enseignant référent ou un médecin universitaire.'
	}
];

export function getSpecialistRecommendations(
	triggers: SpecialistRecommendation['trigger'][]
): SpecialistRecommendation[] {
	const seen = new Set<string>();
	return SPECIALIST_RECOMMENDATIONS.filter((rec) => {
		if (!triggers.includes(rec.trigger)) return false;
		const key = rec.formulation;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export function formatSpecialistList(ids: SpecialistId[]): string {
	return ids.map((id) => SPECIALIST_LABELS[id]).join(', ');
}
