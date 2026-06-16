/** R?le : Logique m?tier de communication CAA : fonctions pures ou r?gles locales testables hors interface. */
import type {
	CommunicationCardOverride,
	CommunicatorData,
	PersonalCommunicationCard
} from '$lib/types/profile';
import type { BuiltInCommunicationCard } from '$lib/config/communication-cards';

export function cardDisplayText(
	card: BuiltInCommunicationCard,
	overrides: Record<string, CommunicationCardOverride>
): { label: string; message: string } {
	const override = overrides[card.id];
	return {
		label: override?.label ?? card.label,
		message: override?.message ?? card.message
	};
}

export function createId(prefix: string): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return `${prefix}-${crypto.randomUUID()}`;
	}
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createPersonalCard(label: string, message: string): PersonalCommunicationCard {
	return {
		id: createId('card'),
		label: label.trim(),
		message: message.trim(),
		createdAt: new Date().toISOString()
	};
}

export function addPersonalCard(
	data: CommunicatorData,
	card: PersonalCommunicationCard
): CommunicatorData {
	return { ...data, personalCards: [card, ...data.personalCards] };
}

export function removePersonalCard(data: CommunicatorData, cardId: string): CommunicatorData {
	return { ...data, personalCards: data.personalCards.filter((card) => card.id !== cardId) };
}

export function updatePersonalCard(
	data: CommunicatorData,
	cardId: string,
	patch: { label?: string; message?: string }
): CommunicatorData {
	return {
		...data,
		personalCards: data.personalCards.map((card) =>
			card.id === cardId
				? {
						...card,
						label: patch.label !== undefined ? patch.label.trim() : card.label,
						message: patch.message !== undefined ? patch.message.trim() : card.message
					}
				: card
		)
	};
}
