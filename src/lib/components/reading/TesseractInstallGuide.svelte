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
		<p>
			Si Tesseract est installé mais que l'OCR reste indisponible, le pack français
			<code>fra</code> est probablement absent.
		</p>
		<ol class="tesseract-guide-steps">
			<li>
				<BiText
					fr="Ouvrez PowerShell en tant qu'administrateur."
					key="mod.read.ocr.installStep1"
					inline
				/>
			</li>
			<li>
				Installez Tesseract :
				<code>winget install --id UB-Mannheim.TesseractOCR --exact --source winget</code>.
			</li>
			<li>
				Ajoutez le pack français <code>fra</code>. Si l'installateur ne le propose pas,
				téléchargez <code>fra.traineddata</code> depuis
				<a href="https://github.com/tesseract-ocr/tessdata" target="_blank" rel="noreferrer">
					tesseract-ocr/tessdata
				</a>
				et placez-le dans le dossier <code>tessdata</code> de Tesseract.
			</li>
			<li>
				Vérifiez dans PowerShell :
				<code>tesseract --list-langs</code>. La liste doit contenir <code>fra</code>.
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

	.tesseract-guide p {
		margin: var(--space-sm) 0 0;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
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

	.tesseract-guide code {
		display: inline-block;
		max-width: 100%;
		white-space: normal;
		overflow-wrap: anywhere;
	}
</style>
