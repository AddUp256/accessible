/** R?le : Configuration d?clarative Arasaac : donn?es m?tier sans effet de bord. */
/** Métadonnées ARASAAC — pictogrammes non bundlés (licence NC). */

export const ARASAAC_LICENSE_NOTICE =
	'Les pictogrammes ARASAAC sont sous licence Creative Commons BY-NC-SA. ' +
	'Accessible ne les inclut pas dans l\'application : vous les importez vous-même depuis ARASAAC. ' +
	'Vérifiez la compatibilité avec votre usage (licence non commerciale).';

export const ARASAAC_WEBSITE = 'https://arasaac.org/';
export const ARASAAC_API_BASE = 'https://api.arasaac.org/v1';
export const ARASAAC_LOCALE = 'fr';

/** URL publique d'un pictogramme (taille 500 px). */
export function arasaacPictogramImageUrl(pictogramId: number): string {
	return `https://static.arasaac.org/pictograms/${pictogramId}/${pictogramId}_500.png`;
}
