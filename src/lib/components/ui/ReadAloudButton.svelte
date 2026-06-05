<script lang="ts">

	import { onMount } from 'svelte';

	import {
		dynamicMessage,
		translateServiceMessage,
		bilingualLabel,
		resolveWebSpeechLocale
	} from '$lib/i18n';

	import { tts, TTS_DEFAULT_RATE, TauriTTSService } from '$lib/services/tts';

	import { settings } from '$lib/stores/profile';

	import type { TTSEngine } from '$lib/services/tts/types';



	let {

		text,

		rate = TTS_DEFAULT_RATE,

		engine,

		label,

		stopLabel,

		class: className = ''

	}: {

		text: string;

		rate?: number;

		engine?: TTSEngine;

		label?: string;

		stopLabel?: string;

		class?: string;

	} = $props();

	const displayLabel = $derived(
		label ?? bilingualLabel('Lire à voix haute', 'common.readAloud', $settings.ui)
	);

	const displayStopLabel = $derived(
		stopLabel ?? bilingualLabel('Arrêter la lecture', 'common.stopReading', $settings.ui)
	);

	const ttsLang = $derived(
		resolveWebSpeechLocale($settings.ui.secondaryLanguage, $settings.ui.bilingualUi)
	);



	let speaking = $state(false);

	let status = $state('');



	const resolvedEngine = $derived(engine ?? $settings.reading.ttsEngine ?? 'auto');

	const available = $derived(tts.isAvailable());

	const unavailableReason = $derived(

		tts.getUnavailableReason()

			? translateServiceMessage(tts.getUnavailableReason()!, $settings.ui)

			: null

	);



	function speak() {

		status = '';

		const ok = tts.speak(text, {

			rate,

			lang: ttsLang,

			engine: resolvedEngine,

			voiceUri: $settings.reading.ttsVoiceUri || undefined,

			onStart: () => {

				speaking = true;

				status = dynamicMessage('dyn.tts.speaking', $settings.ui);

			},

			onEnd: () => {

				speaking = false;

				status = dynamicMessage('dyn.tts.finished', $settings.ui);

			},

			onError: (message) => {

				speaking = false;

				status = translateServiceMessage(message, $settings.ui);

			}

		});



		if (!ok && !status) {

			status =

				unavailableReason ?? dynamicMessage('dyn.tts.unavailable', $settings.ui);

		}

	}



	function stop() {

		tts.stop();

		speaking = false;

		status = dynamicMessage('dyn.tts.stopped', $settings.ui);

	}



	onMount(() => {

		if (tts instanceof TauriTTSService) {

			void tts.refreshPiperStatus();

		}

	});

</script>



<div class="read-aloud {className}">

	{#if available}

		{#if speaking}

			<button type="button" class="btn btn-secondary" onclick={stop}>{displayStopLabel}</button>

		{:else}

			<button type="button" class="btn btn-secondary" onclick={speak} disabled={!text.trim()}>

				{displayLabel}

			</button>

		{/if}

	{:else}

		<button type="button" class="btn btn-secondary" disabled title={unavailableReason ?? undefined}>

			{displayLabel}

		</button>

		<p class="read-aloud-hint" role="status">{unavailableReason}</p>

	{/if}



	{#if available && status && !unavailableReason}

		<p class="read-aloud-status" role="status">{status}</p>

	{/if}

</div>



<style>

	.read-aloud {

		display: flex;

		flex-direction: column;

		align-items: flex-start;

		gap: var(--space-xs);

	}



	.read-aloud-hint,

	.read-aloud-status {

		margin: 0;

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

		max-width: 32rem;

	}

</style>

