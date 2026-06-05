import type { Flashcard, FlashcardDeck, FlashcardSchedule, MemorizationData } from '$lib/types/profile';
import { createId } from '$lib/modules/organizer/checklist';

export function createFlashcard(front: string, back: string): Flashcard {
	return {
		id: createId('card'),
		front: front.trim(),
		back: back.trim(),
		createdAt: new Date().toISOString()
	};
}

export function createDeck(title: string, cards: Flashcard[] = []): FlashcardDeck {
	const now = new Date().toISOString();
	return {
		id: createId('deck'),
		title: title.trim() || 'Mon deck',
		cards,
		createdAt: now,
		updatedAt: now
	};
}

export function addDeck(data: MemorizationData, deck: FlashcardDeck): MemorizationData {
	return { ...data, decks: [deck, ...data.decks] };
}

export function removeDeck(data: MemorizationData, deckId: string): MemorizationData {
	return { ...data, decks: data.decks.filter((deck) => deck.id !== deckId) };
}

export function updateDeck(
	data: MemorizationData,
	deckId: string,
	updater: (deck: FlashcardDeck) => FlashcardDeck
): MemorizationData {
	return {
		...data,
		decks: data.decks.map((deck) =>
			deck.id === deckId
				? { ...updater(deck), updatedAt: new Date().toISOString() }
				: deck
		)
	};
}

export function addCardToDeck(
	data: MemorizationData,
	deckId: string,
	card: Flashcard
): MemorizationData {
	return updateDeck(data, deckId, (deck) => ({
		...deck,
		cards: [card, ...deck.cards]
	}));
}

export function removeCardFromDeck(
	data: MemorizationData,
	deckId: string,
	cardId: string
): MemorizationData {
	return updateDeck(data, deckId, (deck) => ({
		...deck,
		cards: deck.cards.filter((card) => card.id !== cardId)
	}));
}

export function shuffleCards(cards: Flashcard[]): Flashcard[] {
	const copy = [...cards];
	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function updateCardSchedule(
	data: MemorizationData,
	deckId: string,
	cardId: string,
	schedule: FlashcardSchedule
): MemorizationData {
	return updateDeck(data, deckId, (deck) => ({
		...deck,
		cards: deck.cards.map((card) => (card.id === cardId ? { ...card, schedule } : card))
	}));
}
