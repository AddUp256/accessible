<script lang="ts">
	// R?le : Composant Svelte de ?criture assist?e : encapsule l?affichage et les interactions r?utilisables.


	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';

	import WordPredictionBar from '$lib/components/writing/WordPredictionBar.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import {
		bilingualLabel,
		dynamicMessage,
		formatDynamicTemplate,
		resolveWebSpeechLocale
	} from '$lib/i18n';

	import { tts } from '$lib/services/tts';
	import {
		getDictationCapabilities,
		recognizeOnce,
		resolveDictationLang,
		type DictationCapabilities
	} from '$lib/services/dictation';
	import { settings } from '$lib/stores/profile';
	import { onMount } from 'svelte';



	let {

		text = $bindable(''),

		distractionFree = false,

		wordPredictionEnabled = false

	}: {

		text?: string;

		distractionFree?: boolean;

		wordPredictionEnabled?: boolean;

	} = $props();



	let readBackTimer: ReturnType<typeof setTimeout> | undefined;

	let dictationActive = $state(false);

	let dictationStatus = $state('');

	let dictationCaps = $state<DictationCapabilities>({
		webSpeech: false,
		tauriNative: false,
		any: false
	});

	onMount(() => {
		void getDictationCapabilities().then((result) => {
			dictationCaps = result;
		});
	});



	const wordCount = $derived(text.trim() ? text.trim().split(/\s+/).length : 0);

	const placeholder = $derived(

		bilingualLabel('Écrivez ou collez votre texte ici…', 'mod.write.editorPlaceholder', $settings.ui)

	);

	const dictationStartLabel = $derived(

		bilingualLabel('Dictée vocale', 'mod.write.dictationStart', $settings.ui)

	);

	const dictationStopLabel = $derived(

		bilingualLabel('Arrêter la dictée', 'mod.write.dictationStop', $settings.ui)

	);

	const readAloudLabel = $derived(

		bilingualLabel('Relire à voix haute', 'mod.write.readAloud', $settings.ui)

	);

	const wordCountLabel = $derived(

		formatDynamicTemplate(

			bilingualLabel('{count} mot(s)', 'mod.write.wordCount', $settings.ui),

			{ count: wordCount }

		)

	);

	const dictationEnabled = $derived($settings.motor.dictationEnabled);

	const readBackLang = $derived(
		resolveWebSpeechLocale($settings.ui.secondaryLanguage, $settings.ui.bilingualUi)
	);

	function scheduleReadBack() {

		if (!$settings.writing.readBack || !text.trim()) return;

		clearTimeout(readBackTimer);

		readBackTimer = setTimeout(() => {

			if (tts.isAvailable()) {

				tts.speak(text, { rate: $settings.reading.ttsRate, lang: readBackLang });

			}

		}, 1200);

	}



	async function toggleDictation() {
		if (!dictationCaps.any) {
			dictationStatus = dynamicMessage('dyn.dictation.unavailable', $settings.ui);
			return;
		}

		if (dictationActive) {
			dictationActive = false;
			dictationStatus = dynamicMessage('dyn.dictation.stopped', $settings.ui);
			return;
		}

		dictationActive = true;
		dictationStatus = dynamicMessage(
			dictationCaps.tauriNative ? 'dyn.dictation.windowsListening' : 'dyn.dictation.listening',
			$settings.ui
		);

		try {
			const lang = resolveDictationLang($settings.ui.secondaryLanguage, $settings.ui.bilingualUi);
			const transcript = await recognizeOnce(lang);
			text = text.trim() ? `${text.trim()} ${transcript}` : transcript;
			scheduleReadBack();
			dictationStatus = dynamicMessage('dyn.dictation.done', $settings.ui);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (message === 'DICTATION_EMPTY') {
				dictationStatus = dynamicMessage('dyn.dictation.empty', $settings.ui);
			} else if (message === 'DICTATION_UNAVAILABLE') {
				dictationStatus = dynamicMessage('dyn.dictation.unavailable', $settings.ui);
			} else {
				dictationStatus = message;
			}
		} finally {
			dictationActive = false;
		}
	}

</script>



<section class="writing-editor card" aria-label="Votre texte">

	<label for="writing-text"><BiText fr="Votre texte" key="mod.write.editorLabel" inline /></label>

	<textarea

		id="writing-text"

		rows={distractionFree ? 16 : 10}

		bind:value={text}

		placeholder={placeholder}

		spellcheck="false"

		oninput={scheduleReadBack}

	></textarea>



	<WordPredictionBar bind:text enabled={wordPredictionEnabled} />



	<div class="writing-editor-footer">

		<p class="writing-meta" aria-live="polite">{wordCountLabel}</p>

		<div class="writing-editor-actions">

			{#if dictationEnabled}

				<button
					type="button"
					class="btn btn-secondary"
					class:writing-dictation--unavailable={!dictationCaps.any}
					onclick={toggleDictation}
				>

					{dictationActive ? dictationStopLabel : dictationStartLabel}

				</button>

			{/if}

			<ReadAloudButton text={text} rate={$settings.reading.ttsRate} label={readAloudLabel} />

		</div>

	</div>

	{#if dictationStatus}

		<p class="writing-dictation-status" role="status">{dictationStatus}</p>

	{/if}

</section>



<style>

	textarea {

		width: 100%;

		font-family: inherit;

		font-size: var(--font-size-base);

		line-height: 1.6;

		padding: var(--space-md);

		border: 1px solid var(--color-border);

		border-radius: var(--radius);

		margin: var(--space-sm) 0;

		resize: vertical;

		min-height: 12rem;

	}



	.writing-editor-footer {

		display: flex;

		flex-wrap: wrap;

		align-items: center;

		justify-content: space-between;

		gap: var(--space-md);

	}



	.writing-editor-actions {

		display: flex;

		flex-wrap: wrap;

		align-items: center;

		gap: var(--space-sm);

	}



	.writing-meta {

		margin: 0;

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.writing-dictation-status {

		margin: var(--space-sm) 0 0;

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}

</style>


