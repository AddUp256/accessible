/** Actions rapides du tableau de bord. */
export interface DashboardAction {
	id: string;
	href: string;
	label: string;
	description: string;
	zone: 'lire' | 'ecrire' | 'organiser' | 'comprendre' | 'communiquer' | 'profil' | 'parametres';
}

export const TEACHER_DASHBOARD_ACTIONS: DashboardAction[] = [
	{
		id: 'export_synthesis',
		href: '/parametres#export',
		label: 'Exporter une synthèse PDF',
		description: 'Télécharger une synthèse pour un rendez-vous ou un entretien.',
		zone: 'parametres'
	},
	{
		id: 'import_profile',
		href: '/parametres#import',
		label: 'Importer un profil JSON',
		description: 'Consulter les réglages exportés par un étudiant.',
		zone: 'parametres'
	},
	{
		id: 'view_profile',
		href: '/profil',
		label: 'Voir le profil actif',
		description: 'Besoins fonctionnels, outils activés et réglages.',
		zone: 'profil'
	}
];

export const EXPERT_DASHBOARD_ACTIONS: DashboardAction[] = [
	{
		id: 'expert_settings',
		href: '/parametres#expert',
		label: 'Réglages avancés',
		description: 'Typographie, accessibilité motrice, communication.',
		zone: 'parametres'
	},
	{
		id: 'expert_reading',
		href: '/lire',
		label: 'Lecture avancée',
		description: 'Moteur TTS Piper, masque de lecture, surlignages.',
		zone: 'lire'
	},
	{
		id: 'expert_storage',
		href: '/parametres#storage',
		label: 'Stockage détaillé',
		description: 'Chemins SQLite, compteurs de tables, mode portable.',
		zone: 'parametres'
	}
];

export const DASHBOARD_ACTIONS: DashboardAction[] = [
	{
		id: 'read_text',
		href: '/lire',
		label: 'Lire un texte',
		description: 'Coller un texte et adapter l\'affichage.',
		zone: 'lire'
	},
	{
		id: 'adapt_document',
		href: '/lire',
		label: 'Adapter un document',
		description: 'Changer police, taille et fond d\'un texte.',
		zone: 'lire'
	},
	{
		id: 'write_text',
		href: '/ecrire',
		label: 'Écrire un texte',
		description: 'Éditeur simple avec aide à l\'écriture.',
		zone: 'ecrire'
	},
	{
		id: 'correct_text',
		href: '/ecrire',
		label: 'Corriger mon texte',
		description: 'Correction orthographique pas à pas.',
		zone: 'ecrire'
	},
	{
		id: 'organize_work',
		href: '/organiser',
		label: 'Organiser mon travail',
		description: 'Checklists, étapes et planning.',
		zone: 'organiser'
	},
	{
		id: 'take_notes',
		href: '/notes',
		label: 'Prendre des notes',
		description: 'Notes locales avec export Markdown.',
		zone: 'organiser'
	},
	{
		id: 'study_flashcards',
		href: '/memoriser',
		label: 'Réviser avec des cartes',
		description: 'Flashcards question / réponse.',
		zone: 'organiser'
	},
	{
		id: 'arasaac_pictograms',
		href: '/communiquer#arasaac',
		label: 'Chercher un pictogramme',
		description: 'Import ARASAAC pour vos cartes CAA.',
		zone: 'communiquer'
	},
	{
		id: 'understand_instruction',
		href: '/comprendre',
		label: 'Comprendre une consigne',
		description: 'Découper et simplifier une consigne.',
		zone: 'comprendre'
	},
	{
		id: 'mind_maps',
		href: '/organiser',
		label: 'Cartes mentales',
		description: 'Organiser des idées en branches et exporter.',
		zone: 'organiser'
	},
	{
		id: 'prepare_appointment',
		href: '/profil',
		label: 'Préparer un rendez-vous',
		description: 'Voir votre profil et préparer une synthèse.',
		zone: 'profil'
	},
	{
		id: 'export_synthesis',
		href: '/parametres',
		label: 'Exporter ma synthèse',
		description: 'Télécharger JSON ou PDF sur votre appareil.',
		zone: 'parametres'
	}
];

export const NAV_ZONES = [
	{ href: '/lire', label: 'Lire' },
	{ href: '/ecrire', label: 'Écrire' },
	{ href: '/organiser', label: 'Organiser' },
	{ href: '/comprendre', label: 'Comprendre' },
	{ href: '/communiquer', label: 'Communiquer' }
] as const;

/** Actions rapides visibles en mode « interface très simple ». */
export const VERY_SIMPLE_DASHBOARD_ACTION_IDS = [
	'read_text',
	'write_text',
	'organize_work',
	'understand_instruction',
	'arasaac_pictograms'
] as const;

export function dashboardActionsForMode(verySimple: boolean): DashboardAction[] {
	if (!verySimple) return DASHBOARD_ACTIONS;
	return DASHBOARD_ACTIONS.filter((action) =>
		(VERY_SIMPLE_DASHBOARD_ACTION_IDS as readonly string[]).includes(action.id)
	);
}
