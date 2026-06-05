<script lang="ts">
	import { onMount } from 'svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		bilingualLabel,
		dynamicMessage,
		pickPiperModelPath,
		resolveWebSpeechLocale,
		translateServiceMessage,
		type UiKey
	} from '$lib/i18n';
	import { READ_BG_I18N_KEYS } from '$lib/i18n/ui-modules';
	import { settings, profileStore } from '$lib/stores/profile';
	import { isExpertDetail, isVerySimpleDetail } from '$lib/utils/detail-level';
	import { FONTS_BY_ID } from '$lib/config/fonts-catalog';
	import { READING_FONT_OPTIONS } from '$lib/modules/reading/font-stacks';
	import { saveReadingPreferences } from '$lib/modules/reading/preferences';
	import { notifyUserI18n } from '$lib/i18n';
	import { tts, TauriTTSService } from '$lib/services/tts';
	import { tauriListPiperVoices, type PiperVoice } from '$lib/services/tts/tauri';
	import { ensureVoicesLoaded, type SpeechVoiceOption } from '$lib/services/tts/voices';
	import { isTauriRuntime } from '$lib/services/storage/tauri';
	import type { ReadingSettings } from '$lib/types/profile';

	let { ondistractionChange }: { ondistractionChange?: (value: boolean) => void } = $props();

	let ttsHint = $state('');
	let speechVoices = $state<SpeechVoiceOption[]>([]);
	let piperVoices = $state<PiperVoice[]>([]);

	const expert = $derived(isExpertDetail($profileStore));
	const verySimple = $derived(isVerySimpleDetail($profileStore));

	const ttsLang = $derived(
		resolveWebSpeechLocale($settings.ui.secondaryLanguage, $settings.ui.bilingualUi)
	);

	const showVoicePicker = $derived(
		$settings.reading.tts && speechVoices.length > 0 && (tts.isAvailable() || expert)
	);

	const showPiperVoicePicker = $derived(
		isTauriRuntime() && $settings.reading.tts && piperVoices.some((v) => v.available)
	);

	const backgrounds: { value: ReadingSettings['background']; fr: string; key: UiKey }[] = [
		{ value: 'cream', fr: 'Crème', key: 'mod.read.bg.cream' },
		{ value: 'light', fr: 'Clair', key: 'mod.read.bg.light' },
		{ value: 'dark', fr: 'Sombre', key: 'mod.read.bg.dark' },
		{ value: 'highContrast', fr: 'Contraste élevé', key: 'mod.read.bg.highContrast' }
	];

	const fontOptions = $derived(
		verySimple && !expert
			? (['system', 'atkinson-hyperlegible', 'opendyslexic'] as const)
			: READING_FONT_OPTIONS
	);

	const backgroundOptions = $derived(
		verySimple && !expert
			? backgrounds.filter((bg) => bg.value === 'cream' || bg.value === 'light')
			: backgrounds
	);

	async function loadSpeechVoices() {
		speechVoices = await ensureVoicesLoaded(ttsLang);
		if (!speechVoices.length) return;
		const langPrefix = ttsLang.split('-')[0];
		const match =
			speechVoices.find((v) => v.lang === ttsLang) ??
			speechVoices.find((v) => v.lang.startsWith(langPrefix));
		const uri = match?.uri ?? speechVoices[0]?.uri;
		if (uri && (!$settings.reading.ttsVoiceUri || $settings.ui.bilingualUi)) {
			patchReading({ ttsVoiceUri: uri });
		}
	}

	async function loadPiperVoices() {
		if (!isTauriRuntime()) return;
		try {
			piperVoices = await tauriListPiperVoices();
			const path = pickPiperModelPath(
				piperVoices,
				$settings.ui.secondaryLanguage,
				$settings.ui.bilingualUi,
				$settings.reading.piperModelPath
			);
			if (path) patchReading({ piperModelPath: path });
		} catch {
			piperVoices = [];
		}
	}

	$effect(() => {
		ttsLang;
		$settings.ui.secondaryLanguage;
		$settings.ui.bilingualUi;
		void loadSpeechVoices();
		void loadPiperVoices();
	});

	onMount(async () => {
		if (!isTauriRuntime() || !(tts instanceof TauriTTSService)) return;
		await tts.refreshEngineStatus();
		const status = tts.getEngineStatus();
		const engine = $settings.reading.ttsEngine;
		if (engine === 'piper' && status?.piper) {
			ttsHint = dynamicMessage('dyn.read.piperReady', $settings.ui);
		} else if (engine === 'espeak' && status?.espeak) {
			ttsHint = dynamicMessage('dyn.read.espeakReady', $settings.ui);
		} else if (engine === 'auto') {
			if (status?.piper) {
				ttsHint = dynamicMessage('dyn.read.piperReady', $settings.ui);
			} else if (status?.espeak) {
				ttsHint = dynamicMessage('dyn.read.espeakReady', $settings.ui);
			} else if (status?.piperReason) {
				ttsHint = translateServiceMessage(status.piperReason, $settings.ui);
			}
		} else if (engine === 'piper' && status?.piperReason) {
			ttsHint = translateServiceMessage(status.piperReason, $settings.ui);
		} else if (engine === 'espeak' && status?.espeakReason) {
			ttsHint = translateServiceMessage(status.espeakReason, $settings.ui);
		}
	});

	function patchReading(partial: Partial<ReadingSettings>) {
		profileStore.updateSettings({ reading: partial });
	}

	function save() {
		saveReadingPreferences();
		notifyUserI18n('dyn.read.prefsSaved', 'minimal');
	}
</script>

<aside class="reading-controls card" aria-label="Réglages de lecture">
	<BiHeading fr="Réglages" key="mod.common.settings" level={3} />

	<label class="control-field">
		<span><BiText fr="Police" key="mod.read.font" inline /></span>
		<select
			value={$settings.reading.font}
			onchange={(e) => patchReading({ font: e.currentTarget.value as ReadingSettings['font'] })}
		>
			{#each fontOptions as fontId}
				<option value={fontId}>{FONTS_BY_ID[fontId]?.name ?? fontId}</option>
			{/each}
		</select>
	</label>

	<label class="control-field">
		<span
			><BiText fr="Taille" key="mod.read.fontSize" inline />
			({Math.round($settings.reading.fontSize)} px)</span
		>
		<input
			type="range"
			min="14"
			max="32"
			step="1"
			value={$settings.reading.fontSize}
			oninput={(e) => patchReading({ fontSize: Number(e.currentTarget.value) })}
		/>
	</label>

	{#if !verySimple || expert}
	<label class="control-field">
		<span
			><BiText fr="Interligne" key="mod.read.lineHeight" inline />
			({$settings.reading.lineHeight})</span
		>
		<input
			type="range"
			min="1.2"
			max="2.5"
			step="0.1"
			value={$settings.reading.lineHeight}
			oninput={(e) => patchReading({ lineHeight: Number(e.currentTarget.value) })}
		/>
	</label>
	{/if}

	<label class="control-field">
		<span><BiText fr="Fond" key="mod.read.background" inline /></span>
		<select
			value={$settings.reading.background}
			onchange={(e) =>
				patchReading({ background: e.currentTarget.value as ReadingSettings['background'] })}
		>
			{#each backgroundOptions as bg}
				<option value={bg.value}>{bilingualLabel(bg.fr, bg.key, $settings.ui)}</option>
			{/each}
		</select>
	</label>

	<label class="control-check">
		<input
			type="checkbox"
			checked={$settings.reading.lineGuide}
			onchange={(e) => patchReading({ lineGuide: e.currentTarget.checked })}
		/>
		<BiText fr="Guide-ligne" key="mod.read.lineGuide" inline />
	</label>

	<label class="control-check">
		<input
			type="checkbox"
			checked={$settings.reading.tts}
			onchange={(e) => patchReading({ tts: e.currentTarget.checked })}
		/>
		<BiText fr="Lecture vocale activée" key="mod.read.ttsEnabled" inline />
	</label>

	{#if showPiperVoicePicker}
		<label class="control-field">
			<span><BiText fr="Voix Piper (hors-ligne)" key="mod.read.piperVoice" inline /></span>
			<select
				value={$settings.reading.piperModelPath || ''}
				onchange={(e) => patchReading({ piperModelPath: e.currentTarget.value })}
			>
				{#each piperVoices.filter((v) => v.available) as voice (voice.id)}
					<option value={voice.path}>{voice.label}</option>
				{/each}
			</select>
			<p class="control-hint">
				<BiText
					fr="Définissez PIPER_MODEL (fr) et PIPER_MODEL_XX pour chaque langue (EN, ES, DE, AR, ZH, IT, PT, HI, UK, TR) — chemins .onnx dans les variables d'environnement Windows."
					key="mod.read.piperVoiceHint"
				/>
			</p>
		</label>
	{/if}

	{#if showVoicePicker}
		<label class="control-field">
			<span><BiText fr="Voix de lecture" key="mod.read.ttsVoice" inline /></span>
			<select
				value={$settings.reading.ttsVoiceUri || ''}
				onchange={(e) => patchReading({ ttsVoiceUri: e.currentTarget.value })}
			>
				{#each speechVoices as voice (voice.uri)}
					<option value={voice.uri}>
						{voice.name} ({voice.lang}){voice.local ? ' · local' : ''}
					</option>
				{/each}
			</select>
			<p class="control-hint">
				<BiText
					fr="Voix du système (Web Speech). Les voix installées sur Windows apparaissent ici."
					key="mod.read.ttsVoiceHint"
				/>
			</p>
		</label>
	{/if}

	{#if expert && isTauriRuntime()}
		<label class="control-field">
			<span><BiText fr="Moteur de lecture vocale" key="mod.read.ttsEngine" inline /></span>
			<select
				value={$settings.reading.ttsEngine}
				onchange={(e) =>
					patchReading({ ttsEngine: e.currentTarget.value as ReadingSettings['ttsEngine'] })}
			>
				<option value="auto"
					>{bilingualLabel('Automatique (Piper si disponible)', 'mod.read.ttsAuto', $settings.ui)}</option
				>
				<option value="web"
					>{bilingualLabel('Voix du système (Web Speech)', 'mod.read.ttsWeb', $settings.ui)}</option
				>
				<option value="piper"
					>{bilingualLabel('Piper TTS (local)', 'mod.read.ttsPiper', $settings.ui)}</option
				>
				<option value="espeak"
					>{bilingualLabel('eSpeak NG (local)', 'mod.read.ttsEspeak', $settings.ui)}</option
				>
			</select>
		</label>

		{#if ttsHint}
			<p class="control-hint">{ttsHint}</p>
		{/if}
	{/if}

	{#if !verySimple || expert}
	<label class="control-field">
		<span
			><BiText fr="Vitesse de lecture" key="mod.read.ttsRate" inline />
			({$settings.reading.ttsRate.toFixed(1)})</span
		>
		<input
			type="range"
			min="0.5"
			max="2"
			step="0.1"
			value={$settings.reading.ttsRate}
			oninput={(e) => patchReading({ ttsRate: Number(e.currentTarget.value) })}
		/>
	</label>

	<label class="control-check">
		<input
			type="checkbox"
			checked={$settings.reading.alternatingLines}
			onchange={(e) => patchReading({ alternatingLines: e.currentTarget.checked })}
		/>
		<BiText fr="Alternance de lignes" key="mod.read.alternatingLines" inline />
	</label>

	<label class="control-check">
		<input
			type="checkbox"
			checked={$settings.reading.falcMode}
			onchange={(e) => patchReading({ falcMode: e.currentTarget.checked })}
		/>
		<BiText fr="Mode facile à lire (phrases courtes)" key="mod.read.falcMode" inline />
	</label>

	<label class="control-check">
		<input
			type="checkbox"
			checked={$settings.reading.distractionFree}
			onchange={(e) => {
				patchReading({ distractionFree: e.currentTarget.checked });
				ondistractionChange?.(e.currentTarget.checked);
			}}
		/>
		<BiText fr="Mode sans distraction (aperçu)" key="mod.read.distractionFree" inline />
	</label>
	{/if}

	{#if expert}
		<label class="control-check">
			<input
				type="checkbox"
				checked={$settings.reading.readingMask}
				onchange={(e) => patchReading({ readingMask: e.currentTarget.checked })}
			/>
			<BiText fr="Masque de lecture (ligne active)" key="mod.read.readingMask" inline />
		</label>

		<label class="control-check">
			<input
				type="checkbox"
				checked={$settings.reading.syllableHighlight}
				onchange={(e) => patchReading({ syllableHighlight: e.currentTarget.checked })}
			/>
			<BiText fr="Surlignage des syllabes" key="mod.read.syllableHighlight" inline />
		</label>

		<label class="control-check">
			<input
				type="checkbox"
				checked={$settings.reading.graphemeHighlight}
				onchange={(e) => patchReading({ graphemeHighlight: e.currentTarget.checked })}
			/>
			<BiText fr="Surlignage des graphèmes" key="mod.read.graphemeHighlight" inline />
		</label>

		<label class="control-check">
			<input
				type="checkbox"
				checked={$settings.reading.mutedLetters}
				onchange={(e) => patchReading({ mutedLetters: e.currentTarget.checked })}
			/>
			<BiText fr="Atténuer les lettres muettes" key="mod.read.mutedLetters" inline />
		</label>
	{/if}

	<button type="button" class="btn btn-primary" onclick={save}>
		<BiText fr="Enregistrer mes préférences" key="mod.read.savePrefs" inline />
	</button>
</aside>

<style>
	.reading-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.control-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.control-field select,
	.control-field input[type='range'] {
		min-height: var(--btn-min-height);
		font-size: var(--font-size-base);
	}

	.control-check {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: var(--btn-min-height);
		cursor: pointer;
	}

	.control-hint {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
