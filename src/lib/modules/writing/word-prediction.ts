/** R?le : Logique m?tier de ?criture assist?e : fonctions pures ou r?gles locales testables hors interface. */
import {
	COMMON_FRENCH_WORDS,
	NEXT_WORD_SUGGESTIONS,
	nextWordKey
} from '$lib/config/word-prediction-fr';

export interface PredictionContext {
	prefix: string;
	previousWord: string | null;
	wordBefore: string | null;
	mode: 'complete' | 'next';
}

export interface WordPredictionResult {
	suggestions: string[];
	mode: 'complete' | 'next';
	prefix: string;
}

const MAX_SUGGESTIONS = 6;
const MIN_PREFIX_LENGTH = 1;

export function getPredictionContext(text: string): PredictionContext {
	if (!text) {
		return { prefix: '', previousWord: null, wordBefore: null, mode: 'complete' };
	}

	const endsWithSpace = /\s$/.test(text);
	const trimmedEnd = text.trimEnd();
	const tokens = trimmedEnd.split(/\s+/).filter(Boolean);

	if (tokens.length === 0) {
		return { prefix: '', previousWord: null, wordBefore: null, mode: 'complete' };
	}

	if (endsWithSpace) {
		const previousWord = tokens[tokens.length - 1] ?? null;
		const wordBefore = tokens.length >= 2 ? (tokens[tokens.length - 2] ?? null) : null;
		return { prefix: '', previousWord, wordBefore, mode: 'next' };
	}

	const prefix = tokens[tokens.length - 1] ?? '';
	const previousWord = tokens.length >= 2 ? (tokens[tokens.length - 2] ?? null) : null;
	const wordBefore = tokens.length >= 3 ? (tokens[tokens.length - 3] ?? null) : null;

	return { prefix, previousWord, wordBefore, mode: 'complete' };
}

function normalizeForMatch(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '');
}

function matchesPrefix(word: string, prefix: string): boolean {
	return normalizeForMatch(word).startsWith(normalizeForMatch(prefix));
}

export function predictWords(text: string): WordPredictionResult {
	const context = getPredictionContext(text);

	if (context.mode === 'next' && context.previousWord) {
		const key = nextWordKey(context.previousWord, context.wordBefore);
		const nextWords = NEXT_WORD_SUGGESTIONS[key] ?? NEXT_WORD_SUGGESTIONS[context.previousWord] ?? [];
		const suggestions = [...nextWords].slice(0, MAX_SUGGESTIONS);

		if (suggestions.length === 0) {
			return {
				suggestions: ['et', 'mais', 'donc', 'aussi', 'puis', 'avec'].slice(0, MAX_SUGGESTIONS),
				mode: 'next',
				prefix: ''
			};
		}

		return { suggestions, mode: 'next', prefix: '' };
	}

	if (context.prefix.length < MIN_PREFIX_LENGTH) {
		return { suggestions: [], mode: 'complete', prefix: context.prefix };
	}

	const suggestions = COMMON_FRENCH_WORDS.filter((word) => matchesPrefix(word, context.prefix))
		.sort((a, b) => a.localeCompare(b, 'fr'))
		.slice(0, MAX_SUGGESTIONS);

	return { suggestions, mode: 'complete', prefix: context.prefix };
}

export function applySuggestion(text: string, suggestion: string): string {
	const context = getPredictionContext(text);

	if (context.mode === 'complete' && context.prefix) {
		const trimmedEnd = text.trimEnd();
		const withoutPrefix = trimmedEnd.slice(0, trimmedEnd.length - context.prefix.length);
		const separator = withoutPrefix.length === 0 || /\s$/.test(withoutPrefix) ? '' : '';
		return `${withoutPrefix}${separator}${suggestion} `;
	}

	const base = text.trimEnd();
	const spacer = base.length === 0 || /\s$/.test(text) ? '' : ' ';
	return `${base}${spacer}${suggestion} `;
}
