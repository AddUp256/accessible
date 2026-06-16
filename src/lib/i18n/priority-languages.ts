/** R?le : Aide i18n Priority Languages : s?lection, repli et chargement des textes bilingues. */
/**
 * Langues prioritaires pour l'interface bilingue (ligne secondaire sans repli anglais).
 * Ordre : espagnol d'abord (à maintenir complet), puis les autres langues cibles.
 */
export const PRIORITY_LANGUAGE_CODES = [
	'es',
	'ar',
	'zh',
	'it',
	'pt',
	'de',
	'hi',
	'uk',
	'tr'
] as const;

export type PriorityLanguageCode = (typeof PRIORITY_LANGUAGE_CODES)[number];

export function isPriorityLanguage(code: string): code is PriorityLanguageCode {
	return (PRIORITY_LANGUAGE_CODES as readonly string[]).includes(code);
}

/** Codes affichés en tête du sélecteur « Ma langue ». */
export const PRIORITY_LANGUAGE_SET = new Set<string>(PRIORITY_LANGUAGE_CODES);
