import type { CommunicatorData, SavedArasaacPictogram } from '$lib/types/profile';
import { createId } from './cards';

export function createSavedPictogram(id: number, label: string): SavedArasaacPictogram {
	return {
		id,
		label: label.trim(),
		importedAt: new Date().toISOString()
	};
}

export function addSavedPictogram(
	data: CommunicatorData,
	pictogram: SavedArasaacPictogram
): CommunicatorData {
	if (data.savedPictograms.some((item) => item.id === pictogram.id)) {
		return data;
	}
	return { ...data, savedPictograms: [pictogram, ...data.savedPictograms] };
}

export function removeSavedPictogram(data: CommunicatorData, pictogramId: number): CommunicatorData {
	return {
		...data,
		savedPictograms: data.savedPictograms.filter((item) => item.id !== pictogramId)
	};
}

export function attachPictogramToPersonalCard(
	data: CommunicatorData,
	cardId: string,
	pictogramId: number | undefined
): CommunicatorData {
	return {
		...data,
		personalCards: data.personalCards.map((card) =>
			card.id === cardId ? { ...card, pictogramId } : card
		)
	};
}

export function createPersonalCardWithPictogram(
	label: string,
	message: string,
	pictogramId?: number
) {
	return {
		id: createId('card'),
		label: label.trim(),
		message: message.trim(),
		pictogramId,
		createdAt: new Date().toISOString()
	};
}
