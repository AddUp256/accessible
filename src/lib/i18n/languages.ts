import { PRIORITY_LANGUAGE_CODES, PRIORITY_LANGUAGE_SET } from './priority-languages';

/** Langues disponibles pour l'interface bilingue (français + langue choisie). */
export interface LanguageOption {
	code: string;
	/** Nom dans la langue elle-même */
	nativeName: string;
	/** Nom en français */
	nameFr: string;
}

export const INTERFACE_LANGUAGES: LanguageOption[] = [
	{ code: 'en', nativeName: 'English', nameFr: 'Anglais' },
	{ code: 'ar', nativeName: 'العربية', nameFr: 'Arabe' },
	{ code: 'es', nativeName: 'Español', nameFr: 'Espagnol' },
	{ code: 'pt', nativeName: 'Português', nameFr: 'Portugais' },
	{ code: 'de', nativeName: 'Deutsch', nameFr: 'Allemand' },
	{ code: 'it', nativeName: 'Italiano', nameFr: 'Italien' },
	{ code: 'nl', nativeName: 'Nederlands', nameFr: 'Néerlandais' },
	{ code: 'pl', nativeName: 'Polski', nameFr: 'Polonais' },
	{ code: 'ro', nativeName: 'Română', nameFr: 'Roumain' },
	{ code: 'ru', nativeName: 'Русский', nameFr: 'Russe' },
	{ code: 'uk', nativeName: 'Українська', nameFr: 'Ukrainien' },
	{ code: 'tr', nativeName: 'Türkçe', nameFr: 'Turc' },
	{ code: 'zh', nativeName: '中文', nameFr: 'Chinois' },
	{ code: 'ja', nativeName: '日本語', nameFr: 'Japonais' },
	{ code: 'ko', nativeName: '한국어', nameFr: 'Coréen' },
	{ code: 'vi', nativeName: 'Tiếng Việt', nameFr: 'Vietnamien' },
	{ code: 'th', nativeName: 'ไทย', nameFr: 'Thaï' },
	{ code: 'hi', nativeName: 'हिन्दी', nameFr: 'Hindi' },
	{ code: 'bn', nativeName: 'বাংলা', nameFr: 'Bengali' },
	{ code: 'ur', nativeName: 'اردو', nameFr: 'Ourdou' },
	{ code: 'fa', nativeName: 'فارسی', nameFr: 'Persan' },
	{ code: 'he', nativeName: 'עברית', nameFr: 'Hébreu' },
	{ code: 'el', nativeName: 'Ελληνικά', nameFr: 'Grec' },
	{ code: 'hu', nativeName: 'Magyar', nameFr: 'Hongrois' },
	{ code: 'cs', nativeName: 'Čeština', nameFr: 'Tchèque' },
	{ code: 'sk', nativeName: 'Slovenčina', nameFr: 'Slovaque' },
	{ code: 'sv', nativeName: 'Svenska', nameFr: 'Suédois' },
	{ code: 'da', nativeName: 'Dansk', nameFr: 'Danois' },
	{ code: 'no', nativeName: 'Norsk', nameFr: 'Norvégien' },
	{ code: 'fi', nativeName: 'Suomi', nameFr: 'Finnois' },
	{ code: 'sq', nativeName: 'Shqip', nameFr: 'Albanais' },
	{ code: 'sr', nativeName: 'Srpski', nameFr: 'Serbe' },
	{ code: 'hr', nativeName: 'Hrvatski', nameFr: 'Croate' },
	{ code: 'bs', nativeName: 'Bosanski', nameFr: 'Bosniaque' },
	{ code: 'bg', nativeName: 'Български', nameFr: 'Bulgare' },
	{ code: 'mk', nativeName: 'Македонски', nameFr: 'Macédonien' },
	{ code: 'lt', nativeName: 'Lietuvių', nameFr: 'Lituanien' },
	{ code: 'lv', nativeName: 'Latviešu', nameFr: 'Letton' },
	{ code: 'et', nativeName: 'Eesti', nameFr: 'Estonien' },
	{ code: 'ka', nativeName: 'ქართული', nameFr: 'Géorgien' },
	{ code: 'hy', nativeName: 'Հայերեն', nameFr: 'Arménien' },
	{ code: 'am', nativeName: 'አማርኛ', nameFr: 'Amharique' },
	{ code: 'ti', nativeName: 'ትግርኛ', nameFr: 'Tigrigna' },
	{ code: 'so', nativeName: 'Soomaali', nameFr: 'Somali' },
	{ code: 'sw', nativeName: 'Kiswahili', nameFr: 'Swahili' },
	{ code: 'ha', nativeName: 'Hausa', nameFr: 'Haoussa' },
	{ code: 'yo', nativeName: 'Yorùbá', nameFr: 'Yoruba' },
	{ code: 'ig', nativeName: 'Igbo', nameFr: 'Igbo' },
	{ code: 'wo', nativeName: 'Wolof', nameFr: 'Wolof' },
	{ code: 'ff', nativeName: 'Fulfulde', nameFr: 'Peul' },
	{ code: 'bm', nativeName: 'Bamanankan', nameFr: 'Bambara' },
	{ code: 'mg', nativeName: 'Malagasy', nameFr: 'Malgache' },
	{ code: 'km', nativeName: 'ភាសាខ្មែរ', nameFr: 'Khmer' },
	{ code: 'lo', nativeName: 'ລາວ', nameFr: 'Laotien' },
	{ code: 'my', nativeName: 'မြန်မာ', nameFr: 'Birman' },
	{ code: 'ne', nativeName: 'नेपाली', nameFr: 'Népalais' },
	{ code: 'pa', nativeName: 'ਪੰਜਾਬੀ', nameFr: 'Pendjabi' },
	{ code: 'ta', nativeName: 'தமிழ்', nameFr: 'Tamoul' },
	{ code: 'te', nativeName: 'తెలుగు', nameFr: 'Télougou' },
	{ code: 'ml', nativeName: 'മലയാളം', nameFr: 'Malayalam' },
	{ code: 'gu', nativeName: 'ગુજરાતી', nameFr: 'Gujarati' },
	{ code: 'mr', nativeName: 'मराठी', nameFr: 'Marathi' },
	{ code: 'id', nativeName: 'Bahasa Indonesia', nameFr: 'Indonésien' },
	{ code: 'ms', nativeName: 'Bahasa Melayu', nameFr: 'Malais' },
	{ code: 'tl', nativeName: 'Filipino', nameFr: 'Filipino' },
	{ code: 'ku', nativeName: 'Kurdî', nameFr: 'Kurde' },
	{ code: 'ps', nativeName: 'پښتو', nameFr: 'Pachto' },
	{ code: 'az', nativeName: 'Azərbaycan', nameFr: 'Azéri' },
	{ code: 'kk', nativeName: 'Қазақ', nameFr: 'Kazakh' },
	{ code: 'uz', nativeName: 'Oʻzbek', nameFr: 'Ouzbek' },
	{ code: 'mn', nativeName: 'Монгол', nameFr: 'Mongol' }
];

export const LANGUAGE_BY_CODE = Object.fromEntries(
	INTERFACE_LANGUAGES.map((language) => [language.code, language])
) as Record<string, LanguageOption>;

/** Langues prioritaires en tête de liste (espagnol en premier). */
export const PRIORITY_INTERFACE_LANGUAGES: LanguageOption[] = PRIORITY_LANGUAGE_CODES.map(
	(code) => LANGUAGE_BY_CODE[code]
).filter((lang): lang is LanguageOption => Boolean(lang));

export const OTHER_INTERFACE_LANGUAGES: LanguageOption[] = INTERFACE_LANGUAGES.filter(
	(lang) => !PRIORITY_LANGUAGE_SET.has(lang.code)
);

export function isSupportedLanguage(code: string): boolean {
	return code in LANGUAGE_BY_CODE;
}
