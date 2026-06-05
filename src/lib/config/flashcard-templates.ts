/** Modèles de decks — vocabulaire, définitions, formules. */

export interface FlashcardTemplate {
	id: string;
	title: string;
	cards: { front: string; back: string }[];
}

export const FLASHCARD_TEMPLATES: FlashcardTemplate[] = [
	{
		id: 'consignes',
		title: 'Verbes de consigne',
		cards: [
			{ front: 'Analyser', back: 'Regarder en détail et expliquer.' },
			{ front: 'Comparer', back: 'Montrer les ressemblances et différences.' },
			{ front: 'Résumer', back: 'Dire l\'essentiel en peu de mots.' },
			{ front: 'Justifier', back: 'Donner des raisons pour votre réponse.' }
		]
	},
	{
		id: 'pauses',
		title: 'Stratégies de pause',
		cards: [
			{ front: 'Je suis fatigué(e)', back: 'Prendre 5 minutes, respirer, boire de l\'eau.' },
			{ front: 'Je suis bloqué(e)', back: 'Passer à une autre tâche ou demander de l\'aide.' },
			{ front: 'Trop d\'informations', back: 'Découper en 3 petites étapes.' }
		]
	}
];
