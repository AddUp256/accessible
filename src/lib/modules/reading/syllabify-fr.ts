/** Découpage syllabique français simplifié (heuristique, pas lexicographique). */
const VOWELS = /[aeiouyàâäéèêëïîôùûüæœ]/i;
const VOWEL_CLUSTER = /[aeiouyàâäéèêëïîôùûüæœ]+/gi;

export function syllabifyFrenchWord(word: string): string[] {
	if (!word) return [];
	if (!VOWELS.test(word)) return [word];

	const parts: string[] = [];
	let buffer = '';
	const chars = [...word];

	for (let i = 0; i < chars.length; i++) {
		buffer += chars[i];
		const next = chars[i + 1];
		const prev = chars[i - 1];
		const isVowel = VOWELS.test(chars[i]);
		const nextIsVowel = next ? VOWELS.test(next) : false;
		const prevIsVowel = prev ? VOWELS.test(prev) : false;

		if (isVowel && !nextIsVowel && next) {
			const digraph = `${chars[i]}${next}`;
			if (/^(ai|au|ei|eu|oi|ou|ui)$/i.test(digraph) && i + 2 < chars.length && !VOWELS.test(chars[i + 2])) {
				buffer += next;
				i += 1;
			}
		}

		if (!isVowel && nextIsVowel && buffer.length > 1 && !prevIsVowel) {
			parts.push(buffer.slice(0, -1));
			buffer = chars[i];
		} else if (isVowel && !nextIsVowel && next) {
			parts.push(buffer);
			buffer = '';
		}
	}

	if (buffer) parts.push(buffer);
	return parts.length ? parts : [word];
}

export function syllabifyFrenchText(text: string): string[] {
	return text.split(/(\s+|[.,!?;:—–-])/g).flatMap((token) => {
		if (!token || /^\s+$/.test(token) || /^[.,!?;:—–-]$/.test(token)) return [token];
		return syllabifyFrenchWord(token);
	});
}
