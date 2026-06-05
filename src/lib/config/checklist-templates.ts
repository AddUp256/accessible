/** Modèles de checklists FALC — point de départ rapide. */

export interface ChecklistTemplate {
	id: string;
	title: string;
	items: string[];
}

export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
	{
		id: 'devoir',
		title: 'Préparer mon devoir',
		items: [
			'Lire la consigne',
			'Repérer la date limite',
			'Rassembler mes documents',
			'Découper en petites étapes',
			'Commencer la première étape',
			'Relire avant de rendre'
		]
	},
	{
		id: 'rendez-vous',
		title: 'Avant un rendez-vous',
		items: [
			'Noter la date et l\'heure',
			'Préparer mes questions',
			'Prendre mon profil Accessible',
			'Prévoir le trajet',
			'Vérifier ce qu\'il faut apporter'
		]
	},
	{
		id: 'matin',
		title: 'Routine du matin',
		items: [
			'Me lever',
			'Prendre mon petit-déjeuner',
			'Préparer mon sac',
			'Vérifier mon emploi du temps',
			'Partir à l\'heure'
		]
	}
];
