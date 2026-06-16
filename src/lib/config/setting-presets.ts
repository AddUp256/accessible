/** R?le : Configuration d?clarative Setting Presets : donn?es m?tier sans effet de bord. */
import type { SettingPreset } from '$lib/types/profile';

/**
 * Réglages de départ suggérés par profil médical déclaré.
 * Toujours rejetables — voir rejectedSettings.
 */
export const SETTING_PRESETS: SettingPreset[] = [
	{
		medicalProfileId: 'dyslexie',
		suggestedSettings: {
			reading: {
				font: 'opendyslexic',
				fontSize: 20,
				lineHeight: 1.8,
				lineGuide: true,
				alternatingLines: true,
				background: 'cream',
				tts: true
			},
			writing: { spellcheck: 'step_by_step', readBack: true }
		},
		suggestedFunctionalNeeds: [
			'lecture_longue_fatigante',
			'perte_de_ligne',
			'besoin_ecoute_audio',
			'difficulte_orthographique'
		],
		suggestedTools: ['read_adapted', 'listen_text', 'correct_text'],
		note: 'Ces réglages sont fréquents pour la lecture. Testez-les et gardez ce qui vous convient.'
	},
	{
		medicalProfileId: 'dysorthographie',
		suggestedSettings: {
			writing: {
				spellcheck: 'step_by_step',
				wordPrediction: true,
				readBack: true,
				shortSentenceHint: true
			}
		},
		suggestedFunctionalNeeds: ['difficulte_orthographique', 'besoin_correction_etape_par_etape'],
		suggestedTools: ['correct_text', 'write_easier'],
		note: 'La correction étape par étape évite d\'afficher trop d\'erreurs d\'un coup.'
	},
	{
		medicalProfileId: 'dysgraphie',
		suggestedSettings: {
			writing: { wordPrediction: true, readBack: true },
			motor: { dictationEnabled: true, largeButtons: true }
		},
		suggestedFunctionalNeeds: ['difficulte_ecrire_longtemps', 'besoin_reduire_frappe'],
		suggestedTools: ['write_easier', 'reduce_typing'],
		note: 'Réduire la frappe et la prédiction de mots peuvent aider à écrire.'
	},
	{
		medicalProfileId: 'dyspraxie',
		suggestedSettings: {
			motor: {
				largeButtons: true,
				extendedClickTime: true,
				singleClickMode: true
			},
			ui: { buttonSize: 'veryLarge', keyboardNavigation: true }
		},
		suggestedFunctionalNeeds: ['besoin_navigation_clavier', 'besoin_reduire_frappe'],
		suggestedTools: ['reduce_typing', 'adapt_interface'],
		note: 'Des boutons plus grands et le clavier peuvent faciliter l\'utilisation.'
	},
	{
		medicalProfileId: 'dyscalculie',
		suggestedSettings: {
			reading: { font: 'atkinson-hyperlegible', fontSize: 20 }
		},
		suggestedFunctionalNeeds: ['lecture_visuelle_difficile'],
		suggestedTools: ['read_adapted'],
		note: 'Une police claire et des chiffres lisibles peuvent aider avec les nombres.'
	},
	{
		medicalProfileId: 'dysphasie_tdl',
		suggestedSettings: {
			reading: { falcMode: true, tts: true },
			communication: { pictogramsEnabled: true }
		},
		suggestedFunctionalNeeds: ['besoin_ecoute_audio', 'besoin_pictogrammes', 'besoin_consignes_ecrites'],
		suggestedTools: ['listen_text', 'pictograms', 'adapt_interface'],
		note: 'Texte simple, lecture vocale et pictogrammes peuvent aider.'
	},
	{
		medicalProfileId: 'tsa',
		suggestedSettings: {
			sensory: { animations: false, sounds: false, reducedMotion: true, notifications: 'minimal' },
			ui: { animations: false, showPictograms: true },
			communication: { pictogramsEnabled: true, communicationCardsEnabled: true }
		},
		suggestedFunctionalNeeds: [
			'besoin_previsibilite',
			'besoin_routines',
			'gene_animations',
			'besoin_pictogrammes',
			'besoin_environnement_faible_distraction'
		],
		suggestedTools: ['reduce_distractions', 'pictograms', 'adapt_interface'],
		note: 'Moins d\'animations, plus de prévisibilité et des pictogrammes sont souvent utiles.'
	},
	{
		medicalProfileId: 'tdah',
		suggestedSettings: {
			sensory: { notifications: 'minimal', animations: false },
			reading: { distractionFree: true },
			writing: { distractionFree: true }
		},
		suggestedFunctionalNeeds: [
			'besoin_environnement_faible_distraction',
			'difficulte_commencer_tache',
			'besoin_pauses',
			'besoin_une_etape_a_la_fois'
		],
		suggestedTools: ['organize_work', 'reduce_distractions'],
		note: 'Réduire les distractions et découper les tâches peut aider.'
	},
	{
		medicalProfileId: 'malvoyance',
		suggestedSettings: {
			ui: { theme: 'highContrast', buttonSize: 'veryLarge' },
			reading: {
				font: 'atkinson-hyperlegible',
				fontSize: 22,
				lineHeight: 1.8,
				background: 'highContrast',
				tts: true
			}
		},
		suggestedFunctionalNeeds: [
			'besoin_police_agrandie',
			'besoin_contraste_fort',
			'besoin_ecoute_audio'
		],
		suggestedTools: ['read_adapted', 'listen_text', 'adapt_interface'],
		note: 'Texte agrandi, contraste élevé et lecture vocale sont des pistes fréquentes.'
	},
	{
		medicalProfileId: 'surdite_malentendance',
		suggestedSettings: {
			communication: { communicationCardsEnabled: true }
		},
		suggestedFunctionalNeeds: ['besoin_sous_titres', 'besoin_consignes_ecrites'],
		suggestedTools: ['subtitles', 'listen_text'],
		note: 'Sous-titres et consignes écrites peuvent compléter l\'audio.'
	},
	{
		medicalProfileId: 'handicap_moteur',
		suggestedSettings: {
			motor: {
				largeButtons: true,
				extendedClickTime: true,
				confirmBeforeAction: true,
				dictationEnabled: true
			},
			ui: { buttonSize: 'veryLarge', keyboardNavigation: true }
		},
		suggestedFunctionalNeeds: ['besoin_navigation_clavier', 'besoin_reduire_frappe'],
		suggestedTools: ['reduce_typing', 'adapt_interface'],
		note: 'Navigation clavier, gros boutons et dictée peuvent réduire l\'effort moteur.'
	},
	{
		medicalProfileId: 'trouble_parole_communication',
		suggestedSettings: {
			communication: { pictogramsEnabled: true, communicationCardsEnabled: true },
			writing: { readBack: true }
		},
		suggestedFunctionalNeeds: ['besoin_pictogrammes', 'besoin_consignes_ecrites'],
		suggestedTools: ['pictograms', 'write_easier'],
		note: 'Pictogrammes et cartes de communication peuvent faciliter les échanges.'
	},
	{
		medicalProfileId: 'trouble_cognitif',
		suggestedSettings: {
			reading: { falcMode: true },
			ui: { detailLevel: 'verySimple', showPictograms: true }
		},
		suggestedFunctionalNeeds: [
			'besoin_consignes_decoupees',
			'besoin_une_etape_a_la_fois',
			'besoin_consignes_ecrites'
		],
		suggestedTools: ['organize_work', 'adapt_interface'],
		note: 'Consignes courtes et une étape à la fois réduisent la charge.'
	},
	{
		medicalProfileId: 'trouble_psychique_anxiete_surcharge',
		suggestedSettings: {
			sensory: { animations: false, sounds: false, notifications: 'off', reducedMotion: true },
			ui: { animations: false, theme: 'cream' }
		},
		suggestedFunctionalNeeds: [
			'besoin_pauses',
			'besoin_previsibilite',
			'besoin_environnement_faible_distraction',
			'gene_animations'
		],
		suggestedTools: ['reduce_distractions'],
		note: 'Interface calme, pauses possibles et moins de stimuli peuvent aider.'
	},
	{
		medicalProfileId: 'maladie_chronique_fatigabilite',
		suggestedSettings: {
			sensory: { notifications: 'minimal' },
			reading: { fontSize: 18, background: 'cream' },
			motor: { largeButtons: true }
		},
		suggestedFunctionalNeeds: ['besoin_pauses', 'lecture_longue_fatigante'],
		suggestedTools: ['read_adapted', 'organize_work'],
		note: 'Pauses, confort visuel et organisation peuvent limiter la fatigue.'
	},
	{
		medicalProfileId: 'allophonie_fle',
		suggestedSettings: {
			reading: { falcMode: true, tts: true, fontSize: 18 },
			writing: { shortSentenceHint: true }
		},
		suggestedFunctionalNeeds: ['besoin_consignes_ecrites', 'besoin_ecoute_audio'],
		suggestedTools: ['listen_text', 'adapt_interface', 'write_easier'],
		note: 'Texte simple, lecture lente et glossaire personnel peuvent aider en FLE.'
	},
	{
		medicalProfileId: 'dys_troubles',
		suggestedSettings: {
			reading: {
				font: 'opendyslexic',
				fontSize: 20,
				lineHeight: 1.8,
				lineGuide: true,
				background: 'cream',
				tts: true
			},
			writing: { spellcheck: 'step_by_step', readBack: true }
		},
		suggestedFunctionalNeeds: [
			'lecture_longue_fatigante',
			'difficulte_orthographique',
			'perte_de_ligne'
		],
		suggestedTools: ['read_adapted', 'listen_text', 'correct_text'],
		note: 'Réglages fréquents pour lecture et écriture. Testez et ajustez.'
	},
	{
		medicalProfileId: 'difficultes_sans_diagnostic',
		suggestedSettings: {},
		suggestedFunctionalNeeds: [],
		suggestedTools: ['read_adapted', 'adapt_interface'],
		note: 'Le parcours « Je ne sais pas » peut aider à repérer vos besoins sans étiquette.'
	},
	{
		medicalProfileId: 'je_ne_sais_pas',
		suggestedSettings: {},
		suggestedFunctionalNeeds: [],
		suggestedTools: [],
		note: 'Le parcours guidé vous proposera des tests comparatifs.'
	},
	{
		medicalProfileId: 'prefere_ne_pas_repondre',
		suggestedSettings: {},
		suggestedFunctionalNeeds: [],
		suggestedTools: [],
		note: 'Aucun réglage de départ basé sur un profil déclaré.'
	}
];

export const SETTING_PRESETS_BY_MEDICAL_ID = Object.fromEntries(
	SETTING_PRESETS.map((p) => [p.medicalProfileId, p])
) as Record<(typeof SETTING_PRESETS)[number]['medicalProfileId'], SettingPreset>;
