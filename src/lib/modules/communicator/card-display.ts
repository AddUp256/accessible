import type { BuiltInCommunicationCard } from '$lib/config/communication-cards';
import { bilingualPair, getCardTranslation } from '$lib/i18n';
import type {
	CommunicationCardOverride,
	CommunicatorData,
	PersonalCommunicationCard,
	UISettings
} from '$lib/types/profile';

export function resolveBuiltInCard(
	card: BuiltInCommunicationCard,
	data: CommunicatorData,
	ui: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): {
	label: { primary: string; secondary?: string };
	message: { primary: string; secondary?: string };
} {
	const override = data.builtInCardOverrides[card.id];
	const frenchLabel = override?.label?.trim() || card.label;
	const frenchMessage = override?.message?.trim() || card.message;

	const translated = ui.bilingualUi ? getCardTranslation(card.id, ui.secondaryLanguage) : undefined;

	return {
		label: bilingualPair(frenchLabel, translated?.label, ui.bilingualUi),
		message: bilingualPair(frenchMessage, translated?.message, ui.bilingualUi)
	};
}

export function resolvePersonalCard(
	card: PersonalCommunicationCard,
	_ui: Pick<UISettings, 'bilingualUi' | 'secondaryLanguage'>
): {
	label: { primary: string; secondary?: string };
	message: { primary: string; secondary?: string };
} {
	return {
		label: { primary: card.label },
		message: { primary: card.message }
	};
}

export function setBuiltInCardOverride(
	data: CommunicatorData,
	cardId: string,
	override: CommunicationCardOverride
): CommunicatorData {
	return {
		...data,
		builtInCardOverrides: {
			...data.builtInCardOverrides,
			[cardId]: {
				...data.builtInCardOverrides[cardId],
				...override
			}
		}
	};
}

export function clearBuiltInCardOverride(data: CommunicatorData, cardId: string): CommunicatorData {
	const next = { ...data.builtInCardOverrides };
	delete next[cardId];
	return { ...data, builtInCardOverrides: next };
}
