<script lang="ts">
	// R?le : Composant Svelte de lecture adapt?e : encapsule l?affichage et les interactions r?utilisables.

	import { onMount } from 'svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import { dynamicMessage, translateServiceMessage, configLabel, bilingualLabel } from '$lib/i18n';
	import { exportFilename, downloadTextFile } from '$lib/services/export/download';
	import { isTauriRuntime } from '$lib/services/storage/tauri';
	import {
		findActiveSegment,
		importTranscriptContent,
		segmentsToPlainText,
		segmentsToSrt,
		transcription,
		type TranscriptSegment
	} from '$lib/services/transcription';
	import { settings } from '$lib/stores/profile';

	let mediaUrl = $state('');
	let mediaType = $state<'audio' | 'video' | null>(null);
	let loadedFileName = $state('');
	let loadedFile = $state<File | null>(null);
	let transcript = $state('');
	let segments = $state<TranscriptSegment[]>([]);
	let playbackRate = $state(1);
	let status = $state('');
	let busy = $state(false);
	let subtitlesEnabled = $state(true);
	let currentSubtitle = $state('');
	let audioEl = $state<HTMLAudioElement | null>(null);
	let videoEl = $state<HTMLVideoElement | null>(null);

	const mediaEl = $derived(mediaType === 'audio' ? audioEl : videoEl);

	const transcriptionUnavailable = $derived(
		transcription.getUnavailableReason()
			? translateServiceMessage(transcription.getUnavailableReason()!, $settings.ui)
			: null
	);

	const readTranscriptLabel = $derived(
		bilingualLabel('Lire la transcription', 'mod.read.media.readTranscript', $settings.ui)
	);

	function detectType(file: File): 'audio' | 'video' | null {
		if (file.type.startsWith('audio/')) return 'audio';
		if (file.type.startsWith('video/')) return 'video';
		const ext = file.name.split('.').pop()?.toLowerCase();
		if (ext && ['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
		if (ext && ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v'].includes(ext)) return 'video';
		return null;
	}

	function resetMediaState() {
		segments = [];
		currentSubtitle = '';
		transcript = '';
	}

	function onFileSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const type = detectType(file);
		if (!type) {
			status = dynamicMessage('dyn.read.mediaBadFormat', $settings.ui);
			return;
		}

		if (mediaUrl.startsWith('blob:')) URL.revokeObjectURL(mediaUrl);
		resetMediaState();
		loadedFile = file;
		mediaUrl = URL.createObjectURL(file);
		mediaType = type;
		loadedFileName = file.name;
		status = dynamicMessage('dyn.read.mediaLoaded', $settings.ui, { name: file.name });
	}

	function updateRate() {
		if (mediaEl) mediaEl.playbackRate = playbackRate;
	}

	function onTimeUpdate() {
		if (!mediaEl || !subtitlesEnabled || segments.length === 0) {
			currentSubtitle = '';
			return;
		}

		const active = findActiveSegment(segments, Math.floor(mediaEl.currentTime * 1000));
		currentSubtitle = active?.text ?? '';
	}

	function applyTranscriptContent(text: string, nextSegments: TranscriptSegment[]) {
		transcript = text;
		segments = nextSegments;
		currentSubtitle = '';
	}

	async function transcribeLoadedFile() {
		if (!loadedFile) {
			status = dynamicMessage('dyn.read.mediaBadFormat', $settings.ui);
			return;
		}

		busy = true;
		status = dynamicMessage('dyn.read.mediaTranscribing', $settings.ui);

		try {
			const result = await transcription.transcribe(loadedFile);
			if (result.ok) {
				applyTranscriptContent(result.text, result.segments);
				status = dynamicMessage('dyn.read.mediaTranscribed', $settings.ui);
			} else {
				status = translateServiceMessage(result.error, $settings.ui);
			}
		} catch {
			status = dynamicMessage('dyn.read.mediaTranscribeFailed', $settings.ui);
		} finally {
			busy = false;
		}
	}

	function onTranscriptInput() {
		const imported = importTranscriptContent(transcript);
		segments = imported.segments;
		if (imported.segments.length > 0) {
			transcript = imported.text;
		}
		currentSubtitle = '';
	}

	function onSrtImport(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;

		void file.text().then((content) => {
			const imported = importTranscriptContent(content);
			applyTranscriptContent(imported.text, imported.segments);
			status = dynamicMessage('dyn.read.mediaSubtitlesOn', $settings.ui);
		});
	}

	function exportTranscript(format: 'txt' | 'srt') {
		const content =
			format === 'srt'
				? segments.length > 0
					? segmentsToSrt(segments)
					: ''
				: segments.length > 0
					? segmentsToPlainText(segments)
					: transcript.trim();

		if (!content) {
			status = dynamicMessage('dyn.read.mediaExportEmpty', $settings.ui);
			return;
		}

		const baseName = loadedFileName.replace(/\.[^.]+$/, '') || 'media';
		const extension = format;
		const mimeType = format === 'srt' ? 'text/plain;charset=utf-8' : 'text/plain;charset=utf-8';
		downloadTextFile(content, exportFilename(baseName, extension), mimeType);
	}

	onMount(() => {
		return () => {
			if (mediaUrl.startsWith('blob:')) URL.revokeObjectURL(mediaUrl);
		};
	});

	$effect(() => {
		updateRate();
	});
</script>

<section class="card media-reader" aria-labelledby="media-heading">
	<BiHeading fr="Audio / vidéo adaptés" key="mod.read.media.title" level={3} id="media-heading" />
	<p class="media-hint">
		<BiText
			fr="Importez un fichier audio ou vidéo. Réglez la vitesse et lisez la transcription à voix haute."
			key="mod.read.media.hint"
		/>
	</p>

	<label class="media-upload btn btn-secondary">
		<BiText fr="Choisir un fichier audio ou vidéo" key="mod.read.media.choose" inline />
		<input
			id="media-file-input"
			type="file"
			accept="audio/*,video/*,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.mov,.mkv,.avi,.m4v"
			onchange={onFileSelected}
		/>
	</label>

	<div class="media-actions">
		<button
			type="button"
			class="btn btn-secondary"
			disabled={busy || !mediaUrl || !transcription.isAvailable()}
			onclick={transcribeLoadedFile}
		>
			<BiText fr="Transcrire automatiquement" key="mod.read.media.transcribe" inline />
		</button>
		{#if isTauriRuntime()}
			<label class="btn btn-secondary media-import-srt">
				<BiText fr="Importer SRT" key="mod.read.media.importSrt" inline />
				<input type="file" accept=".srt,text/plain" onchange={onSrtImport} />
			</label>
		{/if}
	</div>
	{#if transcriptionUnavailable}
		<p class="media-status media-status--info" role="status">{transcriptionUnavailable}</p>
	{:else if isTauriRuntime()}
		<p class="media-status media-status--info">
			La transcription automatique utilise Whisper local. Si le bouton signale un module manquant,
			installez FFmpeg, whisper.cpp et le modèle depuis Paramètres > Modules optionnels.
		</p>
	{/if}

	{#if status}
		<p class="media-status" role="status">{status}</p>
	{/if}

	{#if mediaUrl && mediaType}
		<div class="media-player">
			{#if mediaType === 'audio'}
				<audio
					bind:this={audioEl}
					src={mediaUrl}
					controls
					class="media-element"
					ontimeupdate={onTimeUpdate}
				></audio>
			{:else}
				<video
					bind:this={videoEl}
					src={mediaUrl}
					controls
					class="media-element"
					aria-label="Vidéo importée"
					ontimeupdate={onTimeUpdate}
				>
					<track kind="captions" srclang="fr" label="Français" />
				</video>
			{/if}

			{#if subtitlesEnabled && currentSubtitle}
				<p class="media-subtitle" aria-live="polite">{currentSubtitle}</p>
			{/if}

			<label class="media-rate">
				<BiText fr="Vitesse de lecture" key="mod.read.media.rate" inline />
				({playbackRate.toFixed(1)}×)
				<input type="range" min="0.5" max="2" step="0.1" bind:value={playbackRate} oninput={updateRate} />
			</label>

			{#if segments.length > 0}
				<label class="media-subtitles-toggle">
					<input type="checkbox" bind:checked={subtitlesEnabled} />
					<BiText fr="Sous-titres synchronisés" key="mod.read.media.subtitles" inline />
				</label>
			{/if}
		</div>
	{/if}

	<label for="media-transcript">
		<BiText fr="Transcription ou notes de cours" key="mod.read.media.transcript" inline />
	</label>
	<textarea
		id="media-transcript"
		rows="6"
		bind:value={transcript}
		oninput={onTranscriptInput}
		placeholder={configLabel(
			'Collez ici la transcription, les sous-titres ou vos notes…',
			'cfg.ph.mediaTranscript',
			$settings.ui
		)}
	></textarea>

	<div class="media-export">
		<button type="button" class="btn btn-secondary" onclick={() => exportTranscript('txt')}>
			<BiText fr="Exporter TXT" key="mod.read.media.exportTxt" inline />
		</button>
		<button type="button" class="btn btn-secondary" onclick={() => exportTranscript('srt')}>
			<BiText fr="Exporter SRT" key="mod.read.media.exportSrt" inline />
		</button>
		<ReadAloudButton text={transcript} rate={$settings.reading.ttsRate} label={readTranscriptLabel} />
	</div>
</section>

<style>
	.media-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.media-upload,
	.media-import-srt {
		position: relative;
		overflow: hidden;
		display: inline-flex;
		margin: var(--space-md) var(--space-md) var(--space-md) 0;
		cursor: pointer;
	}

	.media-upload input,
	.media-import-srt input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.media-actions,
	.media-export {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		align-items: center;
		margin-bottom: var(--space-md);
	}

	.media-status {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.media-player {
		display: grid;
		gap: var(--space-md);
		margin: var(--space-md) 0;
	}

	.media-element {
		width: 100%;
		max-height: 24rem;
		border-radius: var(--radius);
		background: #000;
	}

	.media-subtitle {
		margin: 0;
		padding: var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		font-size: var(--font-size-lg);
		line-height: 1.6;
		text-align: center;
	}

	.media-rate,
	.media-subtitles-toggle {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		font-weight: 600;
	}

	.media-subtitles-toggle {
		flex-direction: row;
		align-items: center;
		gap: var(--space-sm);
		font-weight: 500;
	}

	.media-rate input {
		width: 100%;
	}

	textarea {
		width: 100%;
		font: inherit;
		line-height: 1.6;
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin: var(--space-sm) 0 var(--space-md);
	}
</style>
