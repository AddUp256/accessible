<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { dynamicMessage, translateServiceMessage } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import { ocr, OCR_ACCEPTED_EXTENSIONS } from '$lib/services/ocr';
	import TesseractInstallGuide from '$lib/components/reading/TesseractInstallGuide.svelte';
	import { isTauriRuntime } from '$lib/services/storage/tauri';
	import {
		tauriIsTesseractAvailable,
		tauriIsTesseractLanguageAvailable
	} from '$lib/services/ocr/tauri';

	let {
		ontextimported
	}: {
		ontextimported?: (text: string) => void;
	} = $props();

	let status = $state('');
	let busy = $state(false);
	let previewUrl = $state<string | null>(null);
	let tesseractInstalled = $state<boolean | null>(null);
	let tesseractReady = $state<boolean | null>(null);
	const browserOcrAvailable = $derived(!isTauriRuntime() && ocr.isAvailable());
	const tesseractLangByUi: Record<string, string> = {
		ar: 'ara',
		de: 'deu',
		en: 'eng',
		es: 'spa',
		hi: 'hin',
		it: 'ita',
		pt: 'por',
		tr: 'tur',
		uk: 'ukr',
		zh: 'chi_sim'
	};
	const ocrLang = $derived(
		$settings.ui.bilingualUi && tesseractLangByUi[$settings.ui.secondaryLanguage]
			? `fra+${tesseractLangByUi[$settings.ui.secondaryLanguage]}`
			: 'fra'
	);

	const unavailableReason = $derived(
		ocr.getUnavailableReason()
			? translateServiceMessage(ocr.getUnavailableReason()!, $settings.ui)
			: null
	);

	async function refreshTesseractStatus() {
		if (!isTauriRuntime()) return;
		tesseractInstalled = await tauriIsTesseractAvailable();
		if (!tesseractInstalled) {
			tesseractReady = false;
			return;
		}
		tesseractReady = await tauriIsTesseractLanguageAvailable(ocrLang);
	}

	$effect(() => {
		ocrLang;
		void refreshTesseractStatus();
	});

	function clearPreview() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
	}

	async function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';

		clearPreview();
		status = '';

		if (!file) return;

		if (file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|tiff?)$/i.test(file.name)) {
			previewUrl = URL.createObjectURL(file);
		}

		busy = true;
		status = dynamicMessage('dyn.read.ocrAnalyzing', $settings.ui);

		try {
			const result = await ocr.extractText(file, { lang: ocrLang });
			if (result.ok) {
				status = dynamicMessage('dyn.read.ocrExtracted', $settings.ui);
				ontextimported?.(result.text);
			} else {
				status = translateServiceMessage(result.error, $settings.ui);
			}
		} catch {
			status = dynamicMessage('dyn.read.ocrProcessFailed', $settings.ui);
		} finally {
			busy = false;
		}
	}
</script>

<section class="ocr-import card" aria-labelledby="ocr-heading">
	<BiHeading fr="Importer une image ou un PDF" key="mod.read.ocr.title" level={3} id="ocr-heading" />
	<p class="ocr-hint">
		<BiText
			fr="Photographiez ou scannez un document, puis importez-le ici. Le texte sera envoyé dans la zone de lecture."
			key="mod.read.ocr.hint"
		/>
		{#if isTauriRuntime() && tesseractReady === true}
			{' '}
			<BiText fr="Tesseract est prêt sur cet appareil." key="mod.read.ocr.tesseractReady" inline />
		{:else if isTauriRuntime() && tesseractReady === false}
			{' '}
			{#if tesseractInstalled === true}
				<span class="ocr-inline-note">
					Tesseract est installé, mais le pack français (fra) manque pour lire le texte.
				</span>
			{:else}
				<BiText
					fr="Installez Tesseract OCR et le pack français (fra) pour activer l'OCR."
					key="mod.read.ocr.tesseractMissing"
					inline
				/>
			{/if}
		{:else if browserOcrAvailable}
			{' '}
			<span class="ocr-inline-note">
				OCR image disponible dans le navigateur. Le premier lancement peut prendre un moment.
			</span>
		{/if}
	</p>
	<label class="ocr-label" for="ocr-file-input">
		<BiText fr="Choisir un fichier" key="mod.read.ocr.chooseFile" inline />
	</label>
	<input
		id="ocr-file-input"
		type="file"
		accept={OCR_ACCEPTED_EXTENSIONS}
		disabled={busy}
		onchange={handleFileChange}
	/>

	<p class="ocr-formats">
		<BiText fr="Formats acceptés :" key="mod.read.ocr.formatsLabel" inline />
		{OCR_ACCEPTED_EXTENSIONS.replace(/\./g, ' ').trim()}
		<BiText
			fr=" (images : JPG, PNG, WebP, GIF, BMP, TIFF — PDF dans l'app installée avec Tesseract)"
			key="mod.read.ocr.formatsHint"
			inline
		/>
	</p>

	{#if isTauriRuntime() && tesseractReady === false}
		<p class="ocr-status ocr-status--info" role="status">
			{#if tesseractInstalled === true}
				Tesseract est détecté. Il manque le pack français <code>fra</code>. Vérifiez avec
				<code>tesseract --list-langs</code>, puis relancez Accessible.
			{:else}
				Installez Tesseract OCR et le pack français <code>fra</code>, puis relancez Accessible.
			{/if}
		</p>
		<TesseractInstallGuide show />
	{:else if !ocr.isAvailable() && unavailableReason}
		<p class="ocr-status ocr-status--info" role="status">{unavailableReason}</p>
		<TesseractInstallGuide show={isTauriRuntime() && tesseractReady === false} />
	{/if}

	{#if previewUrl}
		<figure class="ocr-preview">
			<img src={previewUrl} alt="Aperçu du document importé" />
			<figcaption>
				{#if tesseractReady === true || browserOcrAvailable}
					{dynamicMessage('dyn.read.ocrPreviewTesseract', $settings.ui)}
				{:else}
					{dynamicMessage('dyn.read.ocrPreviewManual', $settings.ui)}
				{/if}
			</figcaption>		</figure>
	{/if}

	{#if status && (ocr.isAvailable() || !unavailableReason || status !== unavailableReason)}
		<p class="ocr-status" role="status">{status}</p>
	{/if}
</section>

<style>
	.ocr-hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--space-md);
	}

	.ocr-label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	#ocr-file-input {
		min-height: var(--btn-min-height);
		width: 100%;
		max-width: 28rem;
	}

	.ocr-preview {
		margin: var(--space-md) 0 0;
	}

	.ocr-preview img {
		max-width: 100%;
		max-height: 12rem;
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
		object-fit: contain;
		background: var(--color-bg-elevated);
	}

	.ocr-preview figcaption {
		margin-top: var(--space-xs);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.ocr-status {
		margin: var(--space-md) 0 0;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		font-size: var(--font-size-sm);
	}

	.ocr-status--info {
		color: var(--color-text-muted);
	}

	.ocr-inline-note {
		color: var(--color-text);
		font-weight: 600;
	}
</style>
