/** R?le : Configuration d?clarative Medical Profiles : donn?es m?tier sans effet de bord. */
import type { MedicalProfileMeta } from '$lib/types/profile';

/** Profils médicaux / administratifs déclarés — sélection libre, jamais interprétés comme diagnostic. */
export const MEDICAL_PROFILES: MedicalProfileMeta[] = [
	{
		id: 'dys_troubles',
		label: 'Troubles DYS (ensemble)',
		description: 'Difficultés souvent liées à la lecture, l\'écriture ou le calcul.',
		group: 'dys'
	},
	{
		id: 'dyslexie',
		label: 'Dyslexie',
		description: 'Difficultés déclarées dans la lecture.',
		group: 'dys'
	},
	{
		id: 'dysorthographie',
		label: 'Dysorthographie',
		description: 'Difficultés déclarées dans l\'orthographe.',
		group: 'dys'
	},
	{
		id: 'dysgraphie',
		label: 'Dysgraphie',
		description: 'Difficultés déclarées dans l\'écriture manuscrite ou au clavier.',
		group: 'dys'
	},
	{
		id: 'dyspraxie',
		label: 'Dyspraxie',
		description: 'Difficultés déclarées dans les gestes ou la coordination.',
		group: 'dys'
	},
	{
		id: 'dyscalculie',
		label: 'Dyscalculie',
		description: 'Difficultés déclarées avec les nombres et le calcul.',
		group: 'dys'
	},
	{
		id: 'dysphasie_tdl',
		label: 'Dysphasie / trouble du langage',
		description: 'Difficultés déclarées avec le langage oral ou écrit.',
		group: 'language'
	},
	{
		id: 'tsa',
		label: 'TSA (trouble du spectre de l\'autisme)',
		description: 'Besoins parfois liés à la prévisibilité, aux sens ou à la communication.',
		group: 'neurodevelopment'
	},
	{
		id: 'tdah',
		label: 'TDA/H',
		description: 'Besoins parfois liés à l\'attention, l\'organisation ou la surcharge.',
		group: 'neurodevelopment'
	},
	{
		id: 'malvoyance',
		label: 'Malvoyance / basse vision',
		description: 'Besoin de texte plus grand, de contraste ou de lecture vocale.',
		group: 'sensory'
	},
	{
		id: 'surdite_malentendance',
		label: 'Surdité / malentendance',
		description: 'Besoin de sous-titres, de transcription ou de supports écrits.',
		group: 'sensory'
	},
	{
		id: 'handicap_moteur',
		label: 'Handicap moteur',
		description: 'Besoin de navigation clavier, de gros boutons ou de moins de frappe.',
		group: 'motor'
	},
	{
		id: 'trouble_parole_communication',
		label: 'Trouble de la parole / communication',
		description: 'Besoin de pictogrammes, de cartes ou d\'écrire plutôt que parler.',
		group: 'communication'
	},
	{
		id: 'trouble_cognitif',
		label: 'Trouble cognitif',
		description: 'Besoin de consignes simples, découpées ou répétées.',
		group: 'cognitive'
	},
	{
		id: 'trouble_psychique_anxiete_surcharge',
		label: 'Trouble psychique / anxiété / surcharge',
		description: 'Besoin de calme, de pauses ou d\'un environnement prévisible.',
		group: 'cognitive'
	},
	{
		id: 'maladie_chronique_fatigabilite',
		label: 'Maladie chronique / fatigabilité',
		description: 'Besoin de pauses, de moins d\'efforts visuels ou moteurs.',
		group: 'other'
	},
	{
		id: 'allophonie_fle',
		label: 'Allophonie / FLE',
		description: 'Le français n\'est pas votre langue principale.',
		group: 'language'
	},
	{
		id: 'difficultes_sans_diagnostic',
		label: 'Difficultés sans diagnostic',
		description: 'Vous avez des difficultés mais pas de diagnostic ou de reconnaissance.',
		group: 'other'
	},
	{
		id: 'je_ne_sais_pas',
		label: 'Je ne sais pas',
		description: 'Vous n\'êtes pas sûr de quoi choisir.',
		group: 'other'
	},
	{
		id: 'prefere_ne_pas_repondre',
		label: 'Je préfère ne pas répondre',
		description: 'Vous ne souhaitez pas indiquer cette information.',
		group: 'other'
	}
];

export const MEDICAL_PROFILES_BY_ID = Object.fromEntries(
	MEDICAL_PROFILES.map((p) => [p.id, p])
) as Record<(typeof MEDICAL_PROFILES)[number]['id'], MedicalProfileMeta>;

export const MEDICAL_PROFILE_DISCLAIMER =
	'Ce choix permet de proposer des réglages fréquents. Vous pourrez tout modifier ensuite. Accessible ne vérifie pas et ne pose pas de diagnostic.';
