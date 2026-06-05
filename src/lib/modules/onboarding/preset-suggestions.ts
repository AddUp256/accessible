import { SETTING_PRESETS_BY_MEDICAL_ID } from '$lib/config/setting-presets';
import type {
	AppSettings,
	DeepPartial,
	FunctionalNeedId,
	MedicalProfileId,
	SettingKey,
	ToolId
} from '$lib/types/profile';

export interface PresetReviewItem {
	key: SettingKey;
	label: string;
	partial: DeepPartial<AppSettings>;
	sources: MedicalProfileId[];
}

const SETTING_LABELS: Record<string, string> = {
	'ui.theme': 'Thème de l\'interface',
	'ui.buttonSize': 'Taille des boutons',
	'ui.showPictograms': 'Afficher des pictogrammes',
	'ui.animations': 'Animations de l\'interface',
	'ui.keyboardNavigation': 'Navigation clavier',
	'reading.font': 'Police de lecture',
	'reading.fontSize': 'Taille du texte',
	'reading.lineHeight': 'Interligne',
	'reading.lineGuide': 'Guide-ligne',
	'reading.alternatingLines': 'Alternance de lignes',
	'reading.background': 'Fond de lecture',
	'reading.tts': 'Lecture vocale',
	'reading.falcMode': 'Mode facile à lire',
	'reading.distractionFree': 'Lecture sans distraction',
	'writing.spellcheck': 'Correction orthographique',
	'writing.wordPrediction': 'Prédiction de mots',
	'writing.readBack': 'Relire le texte écrit',
	'sensory.animations': 'Animations',
	'sensory.sounds': 'Sons',
	'sensory.notifications': 'Notifications',
	'sensory.reducedMotion': 'Réduire les mouvements',
	'motor.largeButtons': 'Gros boutons',
	'motor.extendedClickTime': 'Temps de clic augmenté',
	'motor.dictationEnabled': 'Dictée vocale',
	'communication.pictogramsEnabled': 'Pictogrammes',
	'communication.communicationCardsEnabled': 'Cartes de communication'
};

function formatValue(value: unknown): string {
	if (typeof value === 'boolean') return value ? 'activé' : 'désactivé';
	return String(value);
}

function flattenSection(
	section: keyof AppSettings,
	data: Record<string, unknown>,
	sources: MedicalProfileId[]
): PresetReviewItem[] {
	const items: PresetReviewItem[] = [];

	for (const [key, value] of Object.entries(data)) {
		if (value === undefined || typeof value === 'object') continue;
		const path = `${section}.${key}`;
		items.push({
			key: `${path}:${JSON.stringify(value)}`,
			label: `${SETTING_LABELS[path] ?? path} → ${formatValue(value)}`,
			partial: { [section]: { [key]: value } } as DeepPartial<AppSettings>,
			sources
		});
	}

	return items;
}

export function collectPresetReviewItems(
	medicalIds: MedicalProfileId[]
): PresetReviewItem[] {
	const byKey = new Map<string, PresetReviewItem>();

	for (const id of medicalIds) {
		const preset = SETTING_PRESETS_BY_MEDICAL_ID[id];
		if (!preset?.suggestedSettings) continue;

		const { ui, reading, writing, sensory, motor, communication } = preset.suggestedSettings;

		const sections: [keyof AppSettings, Record<string, unknown> | undefined][] = [
			['ui', ui as Record<string, unknown> | undefined],
			['reading', reading as Record<string, unknown> | undefined],
			['writing', writing as Record<string, unknown> | undefined],
			['sensory', sensory as Record<string, unknown> | undefined],
			['motor', motor as Record<string, unknown> | undefined],
			['communication', communication as Record<string, unknown> | undefined]
		];

		for (const [section, data] of sections) {
			if (!data) continue;
			for (const item of flattenSection(section, data, [id])) {
				const existing = byKey.get(item.key);
				if (existing) {
					if (!existing.sources.includes(id)) existing.sources.push(id);
				} else {
					byKey.set(item.key, item);
				}
			}
		}
	}

	return [...byKey.values()];
}

export function collectPresetExtras(medicalIds: MedicalProfileId[]): {
	functionalNeeds: FunctionalNeedId[];
	tools: ToolId[];
	notes: string[];
} {
	const functionalNeeds = new Set<FunctionalNeedId>();
	const tools = new Set<ToolId>();
	const notes: string[] = [];

	for (const id of medicalIds) {
		const preset = SETTING_PRESETS_BY_MEDICAL_ID[id];
		if (!preset) continue;
		preset.suggestedFunctionalNeeds.forEach((n) => functionalNeeds.add(n));
		preset.suggestedTools.forEach((t) => tools.add(t));
		if (preset.note && !notes.includes(preset.note)) notes.push(preset.note);
	}

	return {
		functionalNeeds: [...functionalNeeds],
		tools: [...tools],
		notes
	};
}

export function mergeAcceptedSettings(
	items: PresetReviewItem[]
): DeepPartial<AppSettings> {
	const merged: DeepPartial<AppSettings> = {};

	for (const item of items) {
		for (const section of Object.keys(item.partial) as (keyof AppSettings)[]) {
			const partialSection = item.partial[section];
			if (!partialSection) continue;
			merged[section] = { ...merged[section], ...partialSection } as DeepPartial<AppSettings>[typeof section];
		}
	}

	return merged;
}
