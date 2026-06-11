/** Ponctuation de démarrage pour laisser le moteur vocal amorcer le son avant le premier mot. */
const TTS_LEAD_IN = ', ';

export function prepareTextForSpeech(text: string): string {
	const trimmed = text.trim();
	if (!trimmed) return '';
	return `${TTS_LEAD_IN}${trimmed}`;
}
