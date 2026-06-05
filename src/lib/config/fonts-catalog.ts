import type { FontId, FontMeta } from '$lib/types/profile';

function font(
	id: FontId,
	name: string,
	license: string,
	licenseUrl: string,
	category: FontMeta['category'],
	recommendedFor: string[],
	officialSource: string,
	redistributable = true,
	installed = false
): FontMeta {
	return {
		id,
		name,
		license,
		licenseUrl,
		redistributable,
		installed,
		category,
		recommendedFor,
		languageCoverage: ['fr', 'en'],
		officialSource
	};
}

/** Catalogue polices accessibles — voir LICENSES_AND_FONTS.md */
export const FONTS_CATALOG: FontMeta[] = [
	font(
		'atkinson-hyperlegible',
		'Atkinson Hyperlegible',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'lowVision',
		['lecture longue', 'basse vision', 'caractères distincts'],
		'https://brailleinstitute.org/freefont',
		true,
		true
	),
	font(
		'luciole',
		'Luciole',
		'Licence Luciole',
		'https://www.luciole-vision.com/',
		'lowVision',
		['malvoyance', 'lecture prolongée'],
		'https://www.luciole-vision.com/'
	),
	font(
		'lexend',
		'Lexend',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'dys',
		['lecture fluide', 'DYS'],
		'https://fonts.google.com/specimen/Lexend',
		true,
		true
	),
	font(
		'readex-pro',
		'Readex Pro',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'dys',
		['lecture arabe/latin', 'DYS'],
		'https://fonts.google.com/specimen/Readex+Pro',
		true,
		true
	),
	font(
		'opendyslexic',
		'OpenDyslexic',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'dys',
		['DYS', 'lecture'],
		'https://opendyslexic.org/',
		false,
		false
	),
	font(
		'andika',
		'Andika',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'dys',
		['apprentissage lecture', 'DYS'],
		'https://software.sil.org/andika/',
		true,
		true
	),
	font('b612', 'B612', 'SIL OFL 1.1', 'https://scripts.sil.org/OFL', 'general', ['interface', 'lecture'], 'https://fonts.google.com/specimen/B612'),
	font(
		'b612-mono',
		'B612 Mono',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'mono',
		['code', 'chiffres'],
		'https://fonts.google.com/specimen/B612+Mono'
	),
	font(
		'inclusive-sans',
		'Inclusive Sans',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'lowVision',
		['accessibilité', 'lecture'],
		'https://fonts.google.com/specimen/Inclusive+Sans',
		true,
		true
	),
	font(
		'noto-sans',
		'Noto Sans',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'general',
		['multilingue', 'interface'],
		'https://fonts.google.com/noto/specimen/Noto+Sans'
	),
	font(
		'noto-serif',
		'Noto Serif',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'general',
		['textes longs', 'serif'],
		'https://fonts.google.com/noto/specimen/Noto+Serif'
	),
	font(
		'noto-mono',
		'Noto Mono',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'mono',
		['code', 'chiffres'],
		'https://fonts.google.com/noto/specimen/Noto+Mono'
	),
	font('inter', 'Inter', 'SIL OFL 1.1', 'https://scripts.sil.org/OFL', 'general', ['interface', 'écran'], 'https://rsms.me/inter/'),
	font(
		'source-sans-3',
		'Source Sans 3',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'general',
		['interface', 'documents'],
		'https://fonts.google.com/specimen/Source+Sans+3'
	),
	font(
		'source-serif-4',
		'Source Serif 4',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'general',
		['textes longs'],
		'https://fonts.google.com/specimen/Source+Serif+4'
	),
	font(
		'source-code-pro',
		'Source Code Pro',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'mono',
		['code'],
		'https://fonts.google.com/specimen/Source+Code+Pro'
	),
	font(
		'ibm-plex-sans',
		'IBM Plex Sans',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'general',
		['interface', 'documents'],
		'https://fonts.google.com/specimen/IBM+Plex+Sans'
	),
	font(
		'ibm-plex-serif',
		'IBM Plex Serif',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'general',
		['textes longs'],
		'https://fonts.google.com/specimen/IBM+Plex+Serif'
	),
	font(
		'ibm-plex-mono',
		'IBM Plex Mono',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'mono',
		['code', 'chiffres'],
		'https://fonts.google.com/specimen/IBM+Plex+Mono'
	),
	font(
		'fira-sans',
		'Fira Sans',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'general',
		['interface', 'écran'],
		'https://fonts.google.com/specimen/Fira+Sans'
	),
	font(
		'fira-code',
		'Fira Code',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'mono',
		['code'],
		'https://fonts.google.com/specimen/Fira+Code'
	),
	font(
		'ubuntu',
		'Ubuntu',
		'Ubuntu Font Licence 1.0',
		'https://ubuntu.com/legal/font-licence',
		'general',
		['interface'],
		'https://fonts.google.com/specimen/Ubuntu'
	),
	font(
		'ubuntu-mono',
		'Ubuntu Mono',
		'Ubuntu Font Licence 1.0',
		'https://ubuntu.com/legal/font-licence',
		'mono',
		['code'],
		'https://fonts.google.com/specimen/Ubuntu+Mono'
	),
	font(
		'roboto',
		'Roboto',
		'Apache 2.0',
		'https://www.apache.org/licenses/LICENSE-2.0',
		'general',
		['interface'],
		'https://fonts.google.com/specimen/Roboto'
	),
	font(
		'roboto-slab',
		'Roboto Slab',
		'Apache 2.0',
		'https://www.apache.org/licenses/LICENSE-2.0',
		'general',
		['titres', 'textes'],
		'https://fonts.google.com/specimen/Roboto+Slab'
	),
	font(
		'roboto-mono',
		'Roboto Mono',
		'Apache 2.0',
		'https://www.apache.org/licenses/LICENSE-2.0',
		'mono',
		['code'],
		'https://fonts.google.com/specimen/Roboto+Mono'
	),
	font(
		'comic-neue',
		'Comic Neue',
		'SIL OFL 1.1',
		'https://scripts.sil.org/OFL',
		'dys',
		['lecture informelle', 'DYS'],
		'https://fonts.google.com/specimen/Comic+Neue',
		true,
		true
	),
	font(
		'system',
		'Police système',
		'—',
		'',
		'general',
		['défaut', 'fallback'],
		'',
		false,
		true
	)
];

export const FONTS_BY_ID = Object.fromEntries(FONTS_CATALOG.map((f) => [f.id, f])) as Record<
	FontId,
	FontMeta
>;

export const REDISTRIBUTABLE_FONTS = FONTS_CATALOG.filter((f) => f.redistributable);

/** Textes pour le comparateur de polices (phase 5). */
export const FONT_COMPARE_SAMPLES = {
	short: 'Accessible vous aide à tester des réglages.',
	long: 'La lecture longue peut fatiguer les yeux. Changer la police, la taille du texte ou le fond peut aider. Testez plusieurs versions et gardez celle qui vous convient le mieux.',
	admin: 'Déposez votre dossier avant la date limite. Joignez une pièce d\'identité et un justificatif de domicile.',
	scientific: 'La photosynthèse transforme l\'énergie lumineuse en énergie chimique.',
	confusables: 'I l 1 | O 0 | rn m | b d p q | a o e c | 5 S | 2 Z',
	accents_fr: 'Éléphant à côté naïf cœur œuf français.',
	numbers: '0123456789 — 3,14 — 1 000 000 — 24/06/2026',
	table:
		'Tableau de devoirs — Matière, Devoir, Pour le. Exemple : Français, Résumé chapitre 3, 15/06.'
} as const;

/** Paires de caractères souvent confondus — comparateur avancé (40.5). */
export const FONT_CONFUSABLE_GROUPS = [
	{ id: 'il1', label: 'I / l / 1', sample: 'I l 1 | Il li | 11' },
	{ id: 'o0', label: 'O / 0', sample: 'O 0 | COO | 2026' },
	{ id: 'rnm', label: 'rn / m', sample: 'rn m | learn calm | modern' },
	{ id: 'bdpq', label: 'b / d / p / q', sample: 'b d p q | bed pad' },
	{ id: 'aoec', label: 'a / o / e / c', sample: 'a o e c | ace ocean' },
	{ id: '5s2z', label: '5 / S / 2 / Z', sample: '5 S 2 Z | 52 sizes' }
] as const;

/** Tableau d'exemple pour le comparateur (devoirs scolaires). */
export const FONT_COMPARE_TABLE = {
	headers: ['Matière', 'Devoir', 'Pour le'],
	rows: [
		['Français', 'Résumé chapitre 3', '15/06'],
		['Maths', 'Exercices 12–15', '18/06'],
		['Histoire', 'Fiche personnage', '22/06']
	]
} as const;

/** Polices mises en regard pour les caractères confus. */
export const FONT_CONFUSABLE_COMPARE = [
	{ id: 'system', label: 'Police système', fontId: 'system' as FontId },
	{ id: 'atkinson', label: 'Atkinson Hyperlegible', fontId: 'atkinson-hyperlegible' as FontId },
	{ id: 'opendyslexic', label: 'OpenDyslexic', fontId: 'opendyslexic' as FontId }
] as const;

export const FONT_COMPARE_VARIANTS = [
	{ id: 'standard', label: 'Standard', fontId: 'system' as FontId, fontSize: 16, lineHeight: 1.5, background: 'light' as const },
	{ id: 'large', label: 'Texte agrandi', fontId: 'system' as FontId, fontSize: 20, lineHeight: 1.6, background: 'light' as const },
	{ id: 'spacing', label: 'Interligne augmenté', fontId: 'system' as FontId, fontSize: 18, lineHeight: 2, background: 'light' as const },
	{ id: 'atkinson', label: 'Atkinson Hyperlegible', fontId: 'atkinson-hyperlegible' as FontId, fontSize: 18, lineHeight: 1.6, background: 'light' as const },
	{ id: 'opendyslexic', label: 'OpenDyslexic', fontId: 'opendyslexic' as FontId, fontSize: 18, lineHeight: 1.8, background: 'light' as const },
	{ id: 'cream', label: 'Fond crème', fontId: 'atkinson-hyperlegible' as FontId, fontSize: 18, lineHeight: 1.6, background: 'cream' as const },
	{ id: 'highContrast', label: 'Fort contraste', fontId: 'atkinson-hyperlegible' as FontId, fontSize: 18, lineHeight: 1.6, background: 'highContrast' as const },
	{ id: 'lexend', label: 'Lexend', fontId: 'lexend' as FontId, fontSize: 18, lineHeight: 1.6, background: 'light' as const },
	{ id: 'luciole', label: 'Luciole', fontId: 'luciole' as FontId, fontSize: 18, lineHeight: 1.6, background: 'light' as const },
	{ id: 'lineGuide', label: 'Guide-ligne', fontId: 'atkinson-hyperlegible' as FontId, fontSize: 18, lineHeight: 2, background: 'cream' as const, lineGuide: true },
	{ id: 'alternating', label: 'Alternance de lignes', fontId: 'atkinson-hyperlegible' as FontId, fontSize: 18, lineHeight: 1.8, background: 'cream' as const, alternatingLines: true },
	{ id: 'falc', label: 'Version FALC', fontId: 'atkinson-hyperlegible' as FontId, fontSize: 20, lineHeight: 1.8, background: 'cream' as const, falcSample: true }
] as const;
