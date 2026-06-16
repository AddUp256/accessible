/** R?le : Logique m?tier de lecture adapt?e : fonctions pures ou r?gles locales testables hors interface. */
/** Lettres muettes fréquentes en français (heuristique sur HTML échappé). */
const MUTE_FINAL_E = /([a-zàâäéèêëïîôùûüç]+?)e\b/gi;
const MUTE_ENT = /([a-zàâäéèêëïîôùûüç]{2,})ent\b/gi;

export function markSilentLetters(html: string): string {
	let result = html;
	result = result.replace(MUTE_ENT, '$1<span class="reading-muted">ent</span>');
	result = result.replace(MUTE_FINAL_E, '$1<span class="reading-muted">e</span>');
	return result;
}
