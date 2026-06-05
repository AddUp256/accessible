/** Fichier pack de langue installé localement (`lang-packs/{code}.json`). */
export interface LanguagePackManifest {
	code: string;
	version: number;
	labelFr: string;
	nativeName: string;
	sizeBytes?: number;
}

export interface LanguagePackPayload {
	manifest: LanguagePackManifest;
	/** Clés UI (nav.*, mod.*, page.*, …). */
	ui: Record<string, string>;
	/** Clés dyn.* */
	dynamic: Record<string, string>;
}

export const LANGUAGE_PACK_FORMAT_VERSION = 1;
