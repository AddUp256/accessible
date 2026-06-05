import type { PanelUiKey } from '../../ui-panels';
import type { ModuleLocaleCode } from '../modules';

/** Clés Paramètres → interface bilingue (installateur / packs) pour les langues prioritaires hors packs complets. */
export const BILINGUAL_PANEL_PRIORITY: Partial<
	Record<ModuleLocaleCode, Partial<Record<PanelUiKey, string>>>
> = {};
