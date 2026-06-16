<script lang="ts">
	// R?le : Composant Svelte de interface partag?e : encapsule l?affichage et les interactions r?utilisables.

	import { onMount } from 'svelte';
	import { resolveWebSpeechLocale } from '$lib/i18n';
	import {
		listAudioOutputDevices,
		requestAudioDeviceLabels,
		supportsAudioOutputSelection,
		type AudioOutputDevice
	} from '$lib/services/audio-output';
	import { tts } from '$lib/services/tts';
	import { ensureVoicesLoaded, type SpeechVoiceOption } from '$lib/services/tts/voices';
	import { profileStore, settings } from '$lib/stores/profile';

	let devices = $state<AudioOutputDevice[]>([{ deviceId: '', label: 'Haut-parleur système' }]);
	let speechVoices = $state<SpeechVoiceOption[]>([]);
	let loading = $state(false);
	let voicesLoading = $state(false);
	let permissionTried = $state(false);
	let voiceStatus = $state('');

	const selectionSupported = $derived(supportsAudioOutputSelection());
	const toggleLabel = $derived($settings.ui.audioEnabled ? 'Audio activé' : 'Audio désactivé');
	const toggleAria = $derived($settings.ui.audioEnabled ? "Désactiver l'audio" : "Activer l'audio");
	const ttsLang = $derived(
		resolveWebSpeechLocale($settings.ui.secondaryLanguage, $settings.ui.bilingualUi)
	);
	const selectHelp = $derived(
		selectionSupported
			? 'Choisir le haut-parleur pour les sons compatibles.'
			: "La sélection du haut-parleur n'est pas disponible ici. Accessible utilise la sortie système."
	);

	onMount(() => {
		void refreshDevices(false);
		void refreshVoices();

		const mediaDevices = navigator.mediaDevices;
		if (!mediaDevices?.addEventListener) return;

		const onDeviceChange = () => void refreshDevices(false);
		mediaDevices.addEventListener('devicechange', onDeviceChange);
		return () => mediaDevices.removeEventListener('devicechange', onDeviceChange);
	});

	$effect(() => {
		ttsLang;
		void refreshVoices();
	});

	async function refreshDevices(requestLabels: boolean) {
		loading = true;
		try {
			if (requestLabels) {
				permissionTried = true;
				await requestAudioDeviceLabels();
			}
			devices = await listAudioOutputDevices();
			if (!devices.some((device) => device.deviceId === $settings.ui.audioOutputDeviceId)) {
				profileStore.updateSettings({ ui: { audioOutputDeviceId: '' } });
			}
		} finally {
			loading = false;
		}
	}

	async function refreshVoices() {
		voicesLoading = true;
		try {
			speechVoices = await ensureVoicesLoaded(ttsLang);
		} finally {
			voicesLoading = false;
		}
	}

	function toggleAudio() {
		const audioEnabled = !$settings.ui.audioEnabled;
		profileStore.updateSettings({ ui: { audioEnabled } });
		if (audioEnabled) {
			void refreshDevices(false);
			void refreshVoices();
		}
	}

	function selectOutput(event: Event) {
		const select = event.currentTarget as HTMLSelectElement;
		profileStore.updateSettings({ ui: { audioOutputDeviceId: select.value } });
	}

	function selectVoice(event: Event) {
		const select = event.currentTarget as HTMLSelectElement;
		profileStore.updateSettings({ reading: { ttsVoiceUri: select.value } });
		voiceStatus = '';
	}

	function testVoice() {
		voiceStatus = '';
		const ok = tts.speak('Voix de lecture sélectionnée. Vous pouvez la changer à tout moment.', {
			lang: ttsLang,
			rate: $settings.reading.ttsRate || 1,
			voiceUri: $settings.reading.ttsVoiceUri || undefined,
			onStart: () => {
				voiceStatus = 'Test audio lancé.';
			},
			onEnd: () => {
				voiceStatus = 'Test audio terminé.';
			},
			onError: (message) => {
				voiceStatus = message || 'Impossible de tester cette voix.';
			}
		});
		if (!ok) voiceStatus = 'Lecture vocale indisponible sur cet appareil.';
	}
</script>

<div class="audio-control" data-interface-tts-skip>
	<button
		type="button"
		class="btn btn-secondary audio-toggle"
		class:audio-toggle--off={!$settings.ui.audioEnabled}
		onclick={toggleAudio}
		aria-pressed={$settings.ui.audioEnabled}
		aria-label={toggleAria}
		title={toggleAria}
	>
		{toggleLabel}
	</button>

	{#if $settings.ui.audioEnabled}
		<div class="audio-output" title={selectHelp}>
			<label for="audio-output-device">Sortie</label>
			<select
				id="audio-output-device"
				value={$settings.ui.audioOutputDeviceId}
				onchange={selectOutput}
				disabled={!selectionSupported || loading}
				aria-describedby="audio-output-help"
			>
				{#each devices as device}
					<option value={device.deviceId}>{device.label}</option>
				{/each}
			</select>
			<button
				type="button"
				class="btn btn-secondary audio-refresh"
				onclick={() => refreshDevices(true)}
				disabled={loading}
				aria-label="Actualiser la liste des haut-parleurs"
				title="Actualiser la liste des haut-parleurs"
			>
				↻
			</button>
			<span id="audio-output-help" class="audio-help">
				{#if !selectionSupported}
					Sortie système.
				{:else if !permissionTried && devices.length === 1}
					Actualiser peut afficher les noms.
				{:else}
					{selectHelp}
				{/if}
			</span>
		</div>

		{#if speechVoices.length > 0}
			<div class="audio-voice" title="Choisir la voix de lecture">
				<label for="audio-voice">Voix</label>
				<select
					id="audio-voice"
					value={$settings.reading.ttsVoiceUri}
					onchange={selectVoice}
					disabled={voicesLoading}
				>
					<option value="">Automatique</option>
					{#each speechVoices as voice (voice.uri)}
						<option value={voice.uri}>
							{voice.name} ({voice.lang}){voice.local ? ' · local' : ''}
						</option>
					{/each}
				</select>
				<button
					type="button"
					class="btn btn-secondary audio-test"
					onclick={testVoice}
					disabled={voicesLoading}
				>
					Tester
				</button>
				{#if voiceStatus}
					<span class="audio-help" role="status">{voiceStatus}</span>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.audio-control {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		flex-wrap: wrap;
		max-width: 100%;
		min-width: 0;
	}

	.audio-toggle {
		font-size: var(--font-size-sm);
	}

	.audio-toggle--off {
		opacity: 0.75;
		border-style: dashed;
	}

	.audio-output,
	.audio-voice {
		display: inline-grid;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-sm);
		max-width: 100%;
		min-width: 0;
	}

	.audio-output {
		grid-template-columns: auto minmax(0, 13rem) auto;
	}

	.audio-voice {
		grid-template-columns: auto minmax(0, 18rem) auto;
	}

	.audio-output label,
	.audio-voice label {
		font-weight: 600;
	}

	.audio-output select,
	.audio-voice select {
		min-height: var(--btn-min-height);
		border-radius: var(--radius);
		padding: 0 var(--space-sm);
		font: inherit;
		max-width: 100%;
		min-width: 0;
		width: 100%;
		text-overflow: ellipsis;
	}

	.audio-refresh {
		min-width: var(--btn-min-height);
		width: var(--btn-min-height);
		padding: 0;
		font-size: var(--font-size-lg);
	}

	.audio-test {
		font-size: var(--font-size-sm);
	}

	.audio-help {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 48rem) {
		.audio-control {
			width: 100%;
		}

		.audio-output,
		.audio-voice {
			grid-template-columns: minmax(0, 1fr) auto;
			width: 100%;
		}

		.audio-output label,
		.audio-voice label {
			grid-column: 1 / -1;
		}
	}
</style>
