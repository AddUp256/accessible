/** R?le : Configuration d?clarative Communication Cards : donn?es m?tier sans effet de bord. */
/** Cartes de communication augmentée (CAA) — texte + emoji, pas de diagnostic. */

export type CommunicationCardCategory = 'besoin' | 'emotion' | 'ecole' | 'social';

export interface BuiltInCommunicationCard {
	id: string;
	label: string;
	message: string;
	emoji: string;
	category: CommunicationCardCategory;
}

export const COMMUNICATION_CARD_CATEGORIES: Record<
	CommunicationCardCategory,
	{ label: string }
> = {
	besoin: { label: 'Besoins' },
	emotion: { label: 'Émotions' },
	ecole: { label: 'École / travail' },
	social: { label: 'Social' }
};

export const BUILT_IN_COMMUNICATION_CARDS: BuiltInCommunicationCard[] = [
	{
		id: 'help',
		label: 'J\'ai besoin d\'aide',
		message: 'J\'ai besoin d\'aide, s\'il vous plaît.',
		emoji: '🙋',
		category: 'besoin'
	},
	{
		id: 'pause',
		label: 'Pause',
		message: 'J\'ai besoin d\'une pause.',
		emoji: '⏸️',
		category: 'besoin'
	},
	{
		id: 'quiet',
		label: 'Trop de bruit',
		message: 'Il y a trop de bruit pour moi.',
		emoji: '🔇',
		category: 'besoin'
	},
	{
		id: 'repeat',
		label: 'Répéter',
		message: 'Pouvez-vous répéter autrement, s\'il vous plaît ?',
		emoji: '🔁',
		category: 'besoin'
	},
	{
		id: 'write',
		label: 'Je préfère écrire',
		message: 'Je préfère répondre par écrit.',
		emoji: '✍️',
		category: 'besoin'
	},
	{
		id: 'tired',
		label: 'Je suis fatigué(e)',
		message: 'Je suis fatigué(e). J\'ai besoin de me reposer.',
		emoji: '😴',
		category: 'emotion'
	},
	{
		id: 'overwhelmed',
		label: 'C\'est trop pour moi',
		message: 'C\'est trop pour moi en ce moment. J\'ai besoin de ralentir.',
		emoji: '😵‍💫',
		category: 'emotion'
	},
	{
		id: 'ok',
		label: 'Ça va',
		message: 'Ça va, merci.',
		emoji: '👍',
		category: 'emotion'
	},
	{
		id: 'not_understand',
		label: 'Je ne comprends pas',
		message: 'Je ne comprends pas. Pouvez-vous expliquer autrement ?',
		emoji: '❓',
		category: 'ecole'
	},
	{
		id: 'more_time',
		label: 'Plus de temps',
		message: 'J\'ai besoin de plus de temps pour finir.',
		emoji: '⏳',
		category: 'ecole'
	},
	{
		id: 'clarify',
		label: 'Consigne écrite',
		message: 'Pouvez-vous me donner la consigne par écrit ?',
		emoji: '📝',
		category: 'ecole'
	},
	{
		id: 'hello',
		label: 'Bonjour',
		message: 'Bonjour.',
		emoji: '👋',
		category: 'social'
	},
	{
		id: 'thanks',
		label: 'Merci',
		message: 'Merci beaucoup.',
		emoji: '🙏',
		category: 'social'
	},
	{
		id: 'wait',
		label: 'Un instant',
		message: 'Un instant, s\'il vous plaît.',
		emoji: '✋',
		category: 'social'
	}
];

export const COMMUNICATION_SCENARIOS = [
	{
		id: 'before',
		title: 'Avant une situation difficile',
		cardIds: ['clarify', 'more_time', 'repeat']
	},
	{
		id: 'during',
		title: 'Pendant',
		cardIds: ['pause', 'help', 'quiet', 'overwhelmed']
	},
	{
		id: 'after',
		title: 'Après',
		cardIds: ['tired', 'thanks', 'ok']
	}
] as const;
