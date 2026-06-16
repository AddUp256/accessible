/** R?le : Configuration d?clarative Crisis Cards : donn?es m?tier sans effet de bord. */
/** Cartes de besoin — mode pause / crise (affichage FALC). */
export interface CrisisCard {
	id: string;
	label: string;
	message: string;
}

export const CRISIS_CARDS: CrisisCard[] = [
	{
		id: 'pause',
		label: 'Pause',
		message: 'J\'ai besoin d\'une pause.'
	},
	{
		id: 'help',
		label: 'J\'ai besoin d\'aide',
		message: 'J\'ai besoin d\'aide.'
	},
	{
		id: 'noise',
		label: 'Trop de bruit',
		message: 'Il y a trop de bruit pour moi.'
	},
	{
		id: 'not_understand',
		label: 'Je ne comprends pas',
		message: 'Je ne comprends pas. Pouvez-vous expliquer autrement ?'
	},
	{
		id: 'write',
		label: 'Je préfère écrire',
		message: 'Je préfère répondre par écrit.'
	}
];
