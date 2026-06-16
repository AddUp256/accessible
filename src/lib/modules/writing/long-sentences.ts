/** R?le : Logique m?tier de ?criture assist?e : fonctions pures ou r?gles locales testables hors interface. */
/** Repère les phrases longues — aide locale, pas une correction orthographique. */

export interface LongSentenceHint {
	index: number;
	text: string;
	wordCount: number;
}

const DEFAULT_MAX_WORDS = 20;

export function findLongSentences(text: string, maxWords = DEFAULT_MAX_WORDS): LongSentenceHint[] {
	const trimmed = text.trim();
	if (!trimmed) return [];

	const sentences = trimmed.split(/(?<=[.!?…])\s+|\n+/);
	const hints: LongSentenceHint[] = [];

	for (let i = 0; i < sentences.length; i++) {
		const sentence = sentences[i]?.trim();
		if (!sentence) continue;

		const words = sentence.split(/\s+/).filter(Boolean);
		if (words.length > maxWords) {
			hints.push({
				index: i + 1,
				text: sentence.length > 120 ? `${sentence.slice(0, 117)}…` : sentence,
				wordCount: words.length
			});
		}
	}

	return hints;
}
