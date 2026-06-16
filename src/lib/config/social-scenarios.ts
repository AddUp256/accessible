/** R?le : Configuration d?clarative Social Scenarios : donn?es m?tier sans effet de bord. */
/** Scénarios sociaux CAA multi-étapes (Phase 42). */

export interface SocialScenarioStep {
	id: string;
	title: string;
	hint: string;
	cardIds: string[];
}

export interface SocialScenario {
	id: string;
	title: string;
	description: string;
	steps: SocialScenarioStep[];
}

export const SOCIAL_SCENARIOS: SocialScenario[] = [
	{
		id: 'exam',
		title: 'Avant un contrôle ou un oral',
		description: 'Préparer, demander de l’aide pendant, puis récupérer après.',
		steps: [
			{
				id: 'exam-before',
				title: 'Avant',
				hint: 'Demandez la consigne par écrit et du temps si besoin.',
				cardIds: ['clarify', 'more_time', 'repeat']
			},
			{
				id: 'exam-during',
				title: 'Pendant',
				hint: 'Utilisez une carte si vous bloquez ou si c’est trop.',
				cardIds: ['pause', 'help', 'not_understand', 'overwhelmed']
			},
			{
				id: 'exam-after',
				title: 'Après',
				hint: 'Indiquez comment vous allez et remerciez si vous le souhaitez.',
				cardIds: ['tired', 'ok', 'thanks']
			}
		]
	},
	{
		id: 'group-work',
		title: 'Travail en groupe',
		description: 'Entrer dans le groupe, participer, puis conclure.',
		steps: [
			{
				id: 'group-before',
				title: 'Arriver',
				hint: 'Saluer et demander la consigne si elle n’est pas claire.',
				cardIds: ['hello', 'clarify', 'wait']
			},
			{
				id: 'group-during',
				title: 'Pendant',
				hint: 'Demandez une pause ou préférez l’écrit si nécessaire.',
				cardIds: ['write', 'pause', 'help', 'quiet']
			},
			{
				id: 'group-after',
				title: 'Finir',
				hint: 'Remercier et indiquer si vous avez besoin de repos.',
				cardIds: ['thanks', 'tired', 'ok']
			}
		]
	},
	{
		id: 'appointment',
		title: 'Rendez-vous (médecin, administration)',
		description: 'Se préparer, communiquer pendant, repartir sereinement.',
		steps: [
			{
				id: 'appt-before',
				title: 'Avant',
				hint: 'Demandez qu’on répète ou qu’on écrive les informations importantes.',
				cardIds: ['repeat', 'clarify', 'write']
			},
			{
				id: 'appt-during',
				title: 'Pendant',
				hint: 'Pause ou aide si l’attente ou le bruit est difficile.',
				cardIds: ['wait', 'quiet', 'help', 'overwhelmed']
			},
			{
				id: 'appt-after',
				title: 'Après',
				hint: 'Indiquez votre état et remerciez.',
				cardIds: ['thanks', 'tired', 'ok']
			}
		]
	}
];

/** Modèles de routines visuelles liées à la CAA. */
export const CAA_ROUTINE_TEMPLATES = [
	{
		id: 'caa-morning',
		title: 'Routine CAA — matin à l’école',
		steps: [
			{ label: 'Dire bonjour', icon: '👋' },
			{ label: 'Demander la consigne écrite', icon: '📝' },
			{ label: 'Demander plus de temps si besoin', icon: '⏳' },
			{ label: 'Pause si c’est trop', icon: '⏸️' }
		]
	},
	{
		id: 'caa-conflict',
		title: 'Routine CAA — gérer une tension',
		steps: [
			{ label: 'Lever la main / attendre', icon: '✋' },
			{ label: 'Carte « pause »', icon: '⏸️' },
			{ label: 'Carte « trop pour moi »', icon: '😵‍💫' },
			{ label: 'Carte « merci » quand c’est fini', icon: '🙏' }
		]
	}
] as const;
