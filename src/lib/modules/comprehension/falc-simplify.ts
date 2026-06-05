import type { GlossaryEntry } from '$lib/types/profile';

const SIMPLE_REPLACEMENTS: Record<string, string> = {
	cependant: 'mais',
	néanmoins: 'mais',
	toutefois: 'mais',
	également: 'aussi',
	actuellement: 'maintenant',
	préalablement: 'avant',
	ultérieurement: 'après',
	démontrer: 'montrer',
	réaliser: 'faire',
	effectuer: 'faire',
	communiquer: 'dire',
	obtenir: 'avoir',
	nécessiter: 'demander',
	considérable: 'grand',
	suffisamment: 'assez',
	approximativement: 'environ'
};

const MAX_WORDS_PER_SENTENCE = 14;

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function applyGlossary(text: string, glossary: GlossaryEntry[]): string {
	let result = text;
	for (const entry of glossary) {
		if (!entry.term.trim()) continue;
		const re = new RegExp(`\\b${entry.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
		result = result.replace(re, entry.definition);
	}
	return result;
}

function simplifyWords(text: string): string {
	let result = text;
	for (const [complex, simple] of Object.entries(SIMPLE_REPLACEMENTS)) {
		const re = new RegExp(`\\b${complex}\\b`, 'gi');
		result = result.replace(re, simple);
	}
	return result;
}

/** Découpe une phrase longue en plusieurs phrases courtes (sans tronquer avec « … »). */
function splitLongSentence(sentence: string, maxWords = MAX_WORDS_PER_SENTENCE): string[] {
	const trimmed = sentence.trim();
	if (!trimmed) return [];

	const words = trimmed.split(/\s+/);
	if (words.length <= maxWords) return [trimmed];

	const chunks: string[] = [];
	for (let i = 0; i < words.length; i += maxWords) {
		const slice = words.slice(i, i + maxWords).join(' ');
		const isLast = i + maxWords >= words.length;
		chunks.push(isLast ? `${slice}.` : `${slice},`);
	}
	return chunks;
}

/** Simplification FALC : phrases courtes, mots courants, glossaire personnel. */
export function simplifyToFalcLegacy(
	text: string,
	glossary: GlossaryEntry[] = [],
	maxWordsPerSentence = 14
): string {
	const normalized = text.replace(/\s+/g, ' ').trim();
	if (!normalized) return '';

	let simplified = applyGlossary(normalized, glossary);
	simplified = simplifyWords(simplified);
	simplified = simplified.replace(/\([^)]*\)/g, ' ');
	simplified = simplified.replace(/\[[^\]]*\]/g, ' ');

	const sentences = simplified.split(/(?<=[.!?])\s+/).filter(Boolean);
	const parts = sentences.flatMap((sentence) => splitLongSentence(sentence, maxWordsPerSentence));
	return parts.join('\n\n');
}

/** @deprecated use simplifyWithFalcEngine from falc-engine.ts */
export function simplifyToFalc(text: string, glossary: GlossaryEntry[] = []): string {
	return simplifyToFalcLegacy(text, glossary);
}

export function falcToHtml(text: string, glossary: GlossaryEntry[] = []): string {
	return simplifyToFalc(text, glossary)
		.split('\n\n')
		.filter(Boolean)
		.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
		.join('');
}
