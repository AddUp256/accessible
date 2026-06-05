/** Espace de démarrage pour éviter que la synthèse coupe le premier mot. */
const TTS_LEAD_IN = '\u00A0\u00A0\u00A0';

export function prepareTextForSpeech(text: string): string {
	const trimmed = text.trim();
	if (!trimmed) return '';
	return `${TTS_LEAD_IN}${trimmed}`;
}
