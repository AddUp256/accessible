<script lang="ts">
	import { onMount } from 'svelte';
	import {
		listAudioOutputDevices,
		requestAudioDeviceLabels,
		supportsAudioOutputSelection,
		type AudioOutputDevice
	} from '$lib/services/audio-output';
	import { profileStore, settings } from '$lib/stores/profile';

	let devices = $state<AudioOutputDevice[]>([
		{ deviceId: '', label: 'Haut-parleur système' }
	]);
	let loading = $state(false);
	let permissionTried = $state(false);

	const selectionSupported = $derived(supportsAudioOutputSelection());
	const toggleLabel = $derived($settings.ui.audioEnabled ? 'Audio activé' : 'Audio désactivé');
	const toggleAria = $derived($settings.ui.audioEnabled ? 'Désactiver l’audio' : 'Activer l’audio');
	const selectHelp = $derived(
		selectionSupported
			? 'Choisir le haut-parleur pour les sons compatibles.'
			: 'La sélection du haut-parleur n’est pas disponible ici. Accessible utilise la sortie système.'
	);

	onMount(() => {
		void refreshDevices(false);

		const mediaDevices = navigator.mediaDevices;
		if (!mediaDevices?.addEventListener) return;

		const onDeviceChange = () => void refreshDevices(false);
		mediaDevices.addEventListener('devicechange', onDeviceChange);
		return () => mediaDevices.removeEventListener('devicechange', onDeviceChange);
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

	function toggleAudio() {
		const audioEnabled = !$settings.ui.audioEnabled;
		profileStore.updateSettings({ ui: { audioEnabled } });
		if (audioEnabled) void refreshDevices(false);
	}

	function selectOutput(event: Event) {
		const select = event.currentTarget as HTMLSelectElement;
		profileStore.updateSettings({ ui: { audioOutputDeviceId: select.value } });
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
	{/if}
</div>

<style>
	.audio-control {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}

	.audio-toggle {
		font-size: var(--font-size-sm);
	}

	.audio-toggle--off {
		opacity: 0.75;
		border-style: dashed;
	}

	.audio-output {
		display: inline-grid;
		grid-template-columns: auto minmax(10rem, 13rem) auto;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-sm);
	}

	.audio-output label {
		font-weight: 600;
	}

	.audio-output select {
		min-height: var(--btn-min-height);
		border-radius: var(--radius);
		padding: 0 var(--space-sm);
		font: inherit;
		max-width: 100%;
	}

	.audio-refresh {
		min-width: var(--btn-min-height);
		width: var(--btn-min-height);
		padding: 0;
		font-size: var(--font-size-lg);
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
		.audio-output {
			grid-template-columns: 1fr auto;
		}

		.audio-output label {
			grid-column: 1 / -1;
		}
	}
</style>
