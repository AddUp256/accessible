import type { GlossaryEntry } from '$lib/types/profile';
import { FLE_LEXICON, FLE_LEXICON_BY_TERM } from '$lib/config/fle-lexicon';
import { simplifyToFalcLegacy } from './falc-simplify';

export type FalcLevel = 'light' | 'standard' | 'strong';

export interface FalcOptions {
	level?: FalcLevel;
	glossary?: GlossaryEntry[];
	useFleLexicon?: boolean;
	maxWordsPerSentence?: number;
}

export interface FalcResult {
	text: string;
	readabilityScore: number;
	stats: {
		sentences: number;
		avgWordsPerSentence: number;
		replacements: number;
	};
}

const LEVEL_MAX_WORDS: Record<FalcLevel, number> = {
	light: 18,
	standard: 14,
	strong: 10
};

const PASSIVE_PATTERNS: [RegExp, string][] = [
	[/\bil est demandé de\b/gi, 'on demande de'],
	[/\bil faut\b/gi, 'vous devez'],
	[/\bafin de\b/gi, 'pour'],
	[/\bdu fait que\b/gi, 'parce que'],
	[/\bpar conséquent\b/gi, 'donc'],
	[/\ben revanche\b/gi, 'mais'],
	[/\bnotamment\b/gi, 'surtout'],
	[/\bconcernant\b/gi, 'sur']
];

function countReplacements(before: string, after: string): number {
	if (before === after) return 0;
	return Math.max(1, Math.floor((before.length - after.length) / 8));
}

function mergeGlossary(
	glossary: GlossaryEntry[],
	useFleLexicon: boolean
): GlossaryEntry[] {
	if (!useFleLexicon) return glossary;
	const fleEntries: GlossaryEntry[] = FLE_LEXICON.map((entry, index) => ({
		id: `fle-${index}`,
		term: entry.term,
		definition: entry.simple,
		createdAt: '1970-01-01T00:00:00.000Z'
	}));
	const seen = new Set(glossary.map((g) => g.term.toLowerCase()));
	const merged = [...glossary];
	for (const entry of fleEntries) {
		if (!seen.has(entry.term.toLowerCase())) merged.push(entry);
	}
	return merged;
}

function applyPassiveSimplification(text: string, level: FalcLevel): string {
	if (level === 'light') return text;
	let result = text;
	for (const [pattern, replacement] of PASSIVE_PATTERNS) {
		result = result.replace(pattern, replacement);
	}
	return result;
}

function computeReadability(avgWords: number, level: FalcLevel): number {
	const target = LEVEL_MAX_WORDS[level];
	const delta = Math.abs(avgWords - target * 0.7);
	return Math.max(0, Math.min(100, Math.round(100 - delta * 8)));
}

/** Moteur FALC unifié — lecture, compréhension, export. */
export function simplifyWithFalcEngine(text: string, options: FalcOptions = {}): FalcResult {
	const level = options.level ?? 'standard';
	const glossary = mergeGlossary(options.glossary ?? [], options.useFleLexicon ?? true);
	const maxWords = options.maxWordsPerSentence ?? LEVEL_MAX_WORDS[level];

	const before = text;
	let simplified = simplifyToFalcLegacy(text, glossary, maxWords);
	simplified = applyPassiveSimplification(simplified, level);

	if (level === 'strong') {
		simplified = simplified
			.replace(/[;:—–]/g, '.')
			.replace(/\s+/g, ' ')
			.trim();
	}

	const sentences = simplified.split(/\n\n+/).filter(Boolean);
	const wordCounts = sentences.map((s) => s.trim().split(/\s+/).filter(Boolean).length);
	const avgWords =
		wordCounts.length === 0
			? 0
			: wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;

	return {
		text: simplified,
		readabilityScore: computeReadability(avgWords, level),
		stats: {
			sentences: sentences.length,
			avgWordsPerSentence: Math.round(avgWords * 10) / 10,
			replacements: countReplacements(before, simplified)
		}
	};
}

/** Score indicatif 0–100 (100 = plus facile à lire). */
export function estimateReadability(text: string): number {
	return simplifyWithFalcEngine(text, { level: 'standard', useFleLexicon: false }).readabilityScore;
}

export function fleHintForTerm(term: string): string | null {
	return FLE_LEXICON_BY_TERM[term.toLowerCase()]?.simple ?? null;
}

export { FLE_LEXICON };
