/** R?le : Aide i18n Index : s?lection, repli et chargement des textes bilingues. */
import { CARD_TRANSLATIONS } from './card-translations';
import { bilingualLabel, bilingualPair, bilingualUi, getUiTranslation } from './bilingual';

export type { UiKey } from './ui-translations';
export { bilingualUi, bilingualPair, bilingualLabel, getUiTranslation };
export { configLabel } from './config-i18n';
export {
	TOOL_I18N_KEYS,
	TIMER_I18N_KEYS,
	CHECKLIST_I18N_KEYS,
	FLASHCARD_I18N_KEYS,
	ROUTINE_I18N_KEYS,
	INSTRUCTION_I18N_KEYS,
	COMM_CATEGORY_I18N_KEYS,
	COMM_SCENARIO_I18N_KEYS,
	FONT_VARIANT_I18N_KEYS,
	FONT_SAMPLE_I18N_KEYS
} from './ui-config';
export {
	dynamicMessage,
	dynamicMessageFromStore,
	formatDynamicTemplate,
	translateServiceMessage,
	translateServiceMessageFromStore,
	notifyUserI18n,
	timerFinishedDynamicMessage,
	confirmDynamicMessage,
	type DynamicKey
} from './dynamic-message';
export { bilingualDashboardAction, type DashboardVariant } from './dashboard-i18n';
export {
	resolveWebSpeechLocale,
	resolveDictationLang,
	resolveSpellcheckLang,
	pickPiperModelPath,
	preferredPiperVoiceId,
	webSpeechLocaleForDictation,
	type DictationLangCode,
	type PiperVoiceOption
} from './voice-alignment';

export function getCardTranslation(
	cardId: string,
	lang: string
): { label?: string; message?: string } | undefined {
	if (lang === 'fr') return undefined;
	const pack = CARD_TRANSLATIONS[lang];
	if (!pack) return undefined;
	return pack[cardId];
}
