/** R?le : Configuration d?clarative App Modes : donn?es m?tier sans effet de bord. */
import type { AppMode, AccessibleProfile } from '$lib/types/profile';

export interface AppModeInfo {
	id: AppMode;
	label: string;
	description: string;
}

export const APP_MODES: AppModeInfo[] = [
	{
		id: 'student',
		label: 'Étudiant / utilisateur',
		description: 'Parcours complet pour adapter votre environnement.'
	},
	{
		id: 'teacher',
		label: 'Enseignant / référent',
		description: 'Consulter ou préparer une synthèse d\'aménagements.'
	},
	{
		id: 'companion',
		label: 'Accompagnant',
		description: 'Aider à préparer un rendez-vous ou un entretien.'
	},
	{
		id: 'verySimple',
		label: 'Interface très simple',
		description: 'Gros boutons, textes courts, pictogrammes visibles.'
	},
	{
		id: 'expert',
		label: 'Mode expert',
		description: 'Tous les réglages avancés visibles (typographie fine, moteur TTS, stockage).'
	}
];

export function applyAppMode(profile: AccessibleProfile, mode: AppMode): AccessibleProfile {
	const next: AccessibleProfile = {
		...profile,
		meta: { ...profile.meta, appMode: mode }
	};

	switch (mode) {
		case 'teacher':
		case 'companion':
			return {
				...next,
				settings: {
					...next.settings,
					ui: {
						...next.settings.ui,
						buttonSize: 'large',
						detailLevel: 'standard',
						showPictograms: true
					},
					motor: {
						...next.settings.motor,
						largeButtons: true
					}
				}
			};
		case 'verySimple':
			return {
				...next,
				settings: {
					...next.settings,
					ui: {
						...next.settings.ui,
						buttonSize: 'veryLarge',
						detailLevel: 'verySimple',
						showPictograms: true
					},
					motor: {
						...next.settings.motor,
						largeButtons: true
					}
				}
			};
		case 'expert':
			return {
				...next,
				settings: {
					...next.settings,
					ui: {
						...next.settings.ui,
						detailLevel: 'expert',
						keyboardNavigation: true
					}
				}
			};
		default:
			return {
				...next,
				settings: {
					...next.settings,
					ui: {
						...next.settings.ui,
						detailLevel:
							next.settings.ui.detailLevel === 'expert' ? 'standard' : next.settings.ui.detailLevel
					}
				}
			};
	}
}
