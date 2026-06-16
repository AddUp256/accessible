/** R?le : Configuration d?clarative Teacher Journey : donn?es m?tier sans effet de bord. */
/** Parcours guidé enseignant / accompagnant (Phase 42). */

export interface TeacherJourneyStep {
	id: string;
	title: string;
	description: string;
	href: string;
	actionLabel: string;
}

export const TEACHER_JOURNEY_STEPS: TeacherJourneyStep[] = [
	{
		id: 'profile',
		title: 'Consulter le profil actif',
		description:
			'Vérifiez les besoins fonctionnels déclarés, les outils activés et les réglages de confort.',
		href: '/profil',
		actionLabel: 'Ouvrir le profil'
	},
	{
		id: 'settings',
		title: 'Parcourir les réglages',
		description:
			'Consultez typographie, accessibilité motrice et export. Le mode expert affiche tous les détails.',
		href: '/parametres',
		actionLabel: 'Ouvrir les paramètres'
	},
	{
		id: 'export',
		title: 'Exporter une synthèse',
		description:
			'Téléchargez une synthèse PDF, ODT ou DOCX pour un rendez-vous ou un entretien. Les données restent locales.',
		href: '/parametres#export',
		actionLabel: 'Aller à l’export'
	},
	{
		id: 'import',
		title: 'Importer un profil élève (optionnel)',
		description:
			'Importez un fichier JSON exporté par un élève pour consulter ses réglages sur cet appareil.',
		href: '/parametres#import',
		actionLabel: 'Aller à l’import'
	},
	{
		id: 'communicate',
		title: 'Vérifier la communication (CAA)',
		description:
			'Parcourez les cartes et scénarios sociaux utilisés par la personne pour anticiper les besoins.',
		href: '/communiquer',
		actionLabel: 'Module Communiquer'
	}
];
