<script lang="ts">
	import BiText from '$lib/components/ui/BiText.svelte';
	import { isTauriRuntime } from '$lib/services/storage/tauri';

	let { show = false }: { show?: boolean } = $props();
</script>

{#if show && isTauriRuntime()}
	<details class="tesseract-guide card">
		<summary>
			<BiText fr="Installer Tesseract OCR (Windows)" key="mod.read.ocr.installGuideTitle" inline />
		</summary>
		<ol class="tesseract-guide-steps">
			<li>
				<BiText
					fr="Ouvrez PowerShell en tant qu'administrateur."
					key="mod.read.ocr.installStep1"
					inline
				/>
			</li>
			<li>
				<BiText
					fr="Installez Tesseract : winget install -e --id UB-Mannheim.TesseractOCR"
					key="mod.read.ocr.installStep2"
					inline
				/>
			</li>
			<li>
				<BiText
					fr="Ajoutez le pack français (fra) si proposé pendant l'installation."
					key="mod.read.ocr.installStep3"
					inline
				/>
			</li>
			<li>
				<BiText fr="Fermez puis relancez Accessible." key="mod.read.ocr.installStep4" inline />
			</li>
		</ol>
		<p class="tesseract-guide-alt">
			<BiText
				fr="Sans winget : téléchargez l'installateur depuis github.com/UB-Mannheim/tesseract/wiki"
				key="mod.read.ocr.installAlt"
				inline
			/>
		</p>
	</details>
{/if}

<style>
	.tesseract-guide {
		margin-top: var(--space-md);
		padding: var(--space-md);
	}

	.tesseract-guide summary {
		cursor: pointer;
		font-weight: 600;
	}

	.tesseract-guide-steps {
		margin: var(--space-md) 0 0;
		padding-left: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.tesseract-guide-alt {
		margin: var(--space-md) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
