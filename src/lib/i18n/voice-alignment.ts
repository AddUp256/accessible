/** R?le : Aide i18n Voice Alignment : s?lection, repli et chargement des textes bilingues. */
import { isPriorityLanguage, type PriorityLanguageCode } from './priority-languages';

/** Codes passés à la dictée Windows / Web Speech (hors français = langue secondaire bilingue). */
export type DictationLangCode = 'fr' | PriorityLanguageCode | 'en';

const SUPPORTED_DICTATION = new Set<string>([
	'fr',
	'en',
	'es',
	'ar',
	'zh',
	'it',
	'pt',
	'de',
	'hi',
	'uk',
	'tr'
]);

/** Locales BCP-47 pour Web Speech API et chargement des voix système. */
const WEB_SPEECH_LOCALE: Record<string, string> = {
	fr: 'fr-FR',
	en: 'en-US',
	es: 'es-ES',
	de: 'de-DE',
	ar: 'ar-SA',
	zh: 'zh-CN',
	it: 'it-IT',
	pt: 'pt-PT',
	hi: 'hi-IN',
	uk: 'uk-UA',
	tr: 'tr-TR'
};

/** Identifiant voix Piper (fichier list_piper_voices) aligné sur PIPER_MODEL_XX. */
const PIPER_VOICE_IDS = new Set(['fr', 'en', 'es', 'de', 'ar', 'zh', 'it', 'pt', 'hi', 'uk', 'tr']);

export function resolveWebSpeechLocale(
	secondaryLanguage: string,
	bilingualUi: boolean
): string {
	if (!bilingualUi || secondaryLanguage === 'fr') {
		return WEB_SPEECH_LOCALE.fr;
	}
	return WEB_SPEECH_LOCALE[secondaryLanguage] ?? WEB_SPEECH_LOCALE.fr;
}

export function webSpeechLocaleForDictation(lang: DictationLangCode): string {
	return WEB_SPEECH_LOCALE[lang] ?? WEB_SPEECH_LOCALE.fr;
}

/** Langues avec dictionnaires Hunspell courants (installation séparée). */
const HUNSPELL_LANG_CODES = new Set(['en', 'es', 'de', 'it', 'pt']);

/** Langue pour Hunspell (orthographe). Grammalecte reste français uniquement. */
export function resolveSpellcheckLang(
	secondaryLanguage: string,
	bilingualUi: boolean
): string {
	if (!bilingualUi || secondaryLanguage === 'fr') return 'fr';
	if (HUNSPELL_LANG_CODES.has(secondaryLanguage)) return secondaryLanguage;
	return 'fr';
}

/** Langue pour dictation_recognize_once (Tauri) et Web Speech. */
export function resolveDictationLang(
	secondaryLanguage: string,
	bilingualUi: boolean
): DictationLangCode {
	if (!bilingualUi || secondaryLanguage === 'fr') return 'fr';
	if (SUPPORTED_DICTATION.has(secondaryLanguage)) {
		return secondaryLanguage as DictationLangCode;
	}
	return 'fr';
}

export function preferredPiperVoiceId(
	secondaryLanguage: string,
	bilingualUi: boolean
): string | null {
	if (!bilingualUi || secondaryLanguage === 'fr') return 'fr';
	if (PIPER_VOICE_IDS.has(secondaryLanguage)) return secondaryLanguage;
	if (isPriorityLanguage(secondaryLanguage)) return secondaryLanguage;
	return null;
}

export type PiperVoiceOption = {
	id: string;
	lang: string;
	path: string;
	available: boolean;
};

/** Choisit un modèle Piper selon la langue secondaire, sinon conserve le chemin actuel ou le premier disponible. */
export function pickPiperModelPath(
	voices: PiperVoiceOption[],
	secondaryLanguage: string,
	bilingualUi: boolean,
	currentPath: string
): string | undefined {
	const available = voices.filter((v) => v.available);
	if (available.length === 0) return undefined;

	if (currentPath && available.some((v) => v.path === currentPath)) {
		const current = available.find((v) => v.path === currentPath)!;
		const preferredId = preferredPiperVoiceId(secondaryLanguage, bilingualUi);
		if (!preferredId || current.id === preferredId || current.lang === preferredId) {
			return undefined;
		}
	}

	const preferredId = preferredPiperVoiceId(secondaryLanguage, bilingualUi);
	if (preferredId) {
		const match =
			available.find((v) => v.id === preferredId) ??
			available.find((v) => v.lang === preferredId);
		if (match) return match.path;
	}

	if (currentPath && available.some((v) => v.path === currentPath)) {
		return undefined;
	}

	return available[0]?.path;
}
