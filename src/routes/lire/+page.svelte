<script lang="ts">
	// R?le : Page SvelteKit /routes/lire : assemble l?interface utilisateur et les actions de cette zone.

	import FontComparator from '$lib/components/reading/FontComparator.svelte';
	import MediaReaderPanel from '$lib/components/reading/MediaReaderPanel.svelte';
	import ReadingControls from '$lib/components/reading/ReadingControls.svelte';
	import ReadingPane from '$lib/components/reading/ReadingPane.svelte';
	import OcrImportPanel from '$lib/components/reading/OcrImportPanel.svelte';
	import OnboardingTestReturn from '$lib/components/onboarding/OnboardingTestReturn.svelte';
	import ExplainAgainPanel from '$lib/components/comprehension/ExplainAgainPanel.svelte';
	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { FONT_COMPARE_SAMPLES } from '$lib/config/fonts-catalog';
	import { configLabel } from '$lib/i18n';
	import { saveReadingPreferences } from '$lib/modules/reading/preferences';
	import { profileStore, settings } from '$lib/stores/profile';
	import { isVerySimpleDetail } from '$lib/utils/detail-level';
	import { isLireSubTabVisible } from '$lib/modules/profile/feature-visibility';

	type LireTab = 'read' | 'compare' | 'media';

	const tabButtonIds: Record<LireTab, string> = {
		read: 'lire-tab-read',
		compare: 'lire-tab-compare',
		media: 'lire-tab-media'
	};

	const tabPanelIds: Record<LireTab, string> = {
		read: 'lire-panel-read',
		compare: 'lire-panel-compare',
		media: 'lire-panel-media'
	};

	const defaultSample = FONT_COMPARE_SAMPLES.long;
	const verySimple = $derived(isVerySimpleDetail($profileStore));
	const showCompareTab = $derived(isLireSubTabVisible($profileStore, 'compare'));
	const showMediaTab = $derived(isLireSubTabVisible($profileStore, 'media'));
	const visibleTabs = $derived(
		[
			'read',
			...(!verySimple && showCompareTab ? (['compare'] as const) : []),
			...(!verySimple && showMediaTab ? (['media'] as const) : [])
		] as LireTab[]
	);

	let text = $state<string>(defaultSample);
	let activeTab = $state<LireTab>('read');
	let distractionMode = $state(false);

	$effect(() => {
		if (verySimple && activeTab !== 'read') activeTab = 'read';
		if (activeTab === 'compare' && !showCompareTab) activeTab = 'read';
		if (activeTab === 'media' && !showMediaTab) activeTab = 'read';
	});

	function handleDistractionChange(value: boolean) {
		distractionMode = value;
	}

	function loadSample() {
		text = defaultSample;
	}

	function handleOcrImport(imported: string) {
		text = imported;
		activeTab = 'read';
	}

	function focusTab(tab: LireTab) {
		const button = document.getElementById(tabButtonIds[tab]);
		if (button instanceof HTMLButtonElement) button.focus();
	}

	function selectTab(tab: LireTab, focus = false) {
		activeTab = tab;
		if (focus) queueMicrotask(() => focusTab(tab));
	}

	function handleTabKey(event: KeyboardEvent) {
		if (!(event.target instanceof HTMLButtonElement)) return;

		const currentIndex = visibleTabs.indexOf(activeTab);
		const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
		let nextIndex = fallbackIndex;

		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			nextIndex = (fallbackIndex + 1) % visibleTabs.length;
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			nextIndex = (fallbackIndex - 1 + visibleTabs.length) % visibleTabs.length;
		} else if (event.key === 'Home') {
			nextIndex = 0;
		} else if (event.key === 'End') {
			nextIndex = visibleTabs.length - 1;
		} else {
			return;
		}

		event.preventDefault();
		selectTab(visibleTabs[nextIndex], true);
	}
</script>

<svelte:head>
	<title>Lire — Accessible</title>
</svelte:head>

<BiHeading fr="Lire un texte" key="page.read.title" />
<p><BiText fr="Collez un texte ou utilisez l'exemple. Changez les réglages et enregistrez vos préférences." key="page.read.intro" /></p>

<OnboardingTestReturn moduleLabel="Lire" onSave={() => saveReadingPreferences()} />

<div class="lire-tabs" role="tablist" aria-label="Modes de lecture">
	<button
		id={tabButtonIds.read}
		type="button"
		role="tab"
		class="btn"
		class:btn-primary={activeTab === 'read'}
		class:btn-secondary={activeTab !== 'read'}
		aria-selected={activeTab === 'read'}
		aria-controls={tabPanelIds.read}
		tabindex={activeTab === 'read' ? 0 : -1}
		onclick={() => selectTab('read')}
		onkeydown={handleTabKey}
	>
		<BiText fr="Lire" key="page.read.tab.read" inline />
	</button>
	{#if !verySimple && showCompareTab}
	<button
		id={tabButtonIds.compare}
		type="button"
		role="tab"
		class="btn"
		class:btn-primary={activeTab === 'compare'}
		class:btn-secondary={activeTab !== 'compare'}
		aria-selected={activeTab === 'compare'}
		aria-controls={tabPanelIds.compare}
		tabindex={activeTab === 'compare' ? 0 : -1}
		onclick={() => selectTab('compare')}
		onkeydown={handleTabKey}
	>
		<BiText fr="Comparer" key="page.read.tab.compare" inline />
	</button>
	{/if}
	{#if !verySimple && showMediaTab}
	<button
		id={tabButtonIds.media}
		type="button"
		role="tab"
		class="btn"
		class:btn-primary={activeTab === 'media'}
		class:btn-secondary={activeTab !== 'media'}
		aria-selected={activeTab === 'media'}
		aria-controls={tabPanelIds.media}
		tabindex={activeTab === 'media' ? 0 : -1}
		onclick={() => selectTab('media')}
		onkeydown={handleTabKey}
	>
		<BiText fr="Audio / vidéo" key="page.read.tab.media" inline />
	</button>
	{/if}
</div>

{#if activeTab === 'media'}
	<div
		id={tabPanelIds.media}
		role="tabpanel"
		aria-labelledby={tabButtonIds.media}
		tabindex="0"
	>
		<MediaReaderPanel />
	</div>
{:else if activeTab === 'read'}
	<div
		id={tabPanelIds.read}
		role="tabpanel"
		aria-labelledby={tabButtonIds.read}
		tabindex="0"
	>
	<div class="lire-layout" class:lire-layout--distraction={distractionMode}>
		{#if distractionMode}
			<div class="distraction-banner card">
				<p>
					<BiText
						fr="Mode sans distraction. Seul le texte est affiché ci-dessous."
						key="page.read.distractionBanner"
					/>
				</p>
				<button
					type="button"
					class="btn btn-secondary"
					onclick={() => {
						distractionMode = false;
						handleDistractionChange(false);
					}}
				>
					<BiText fr="Quitter ce mode" key="page.read.distractionExit" inline />
				</button>
			</div>
		{/if}

		<section class="lire-preview card" aria-label="Aperçu">
			<div class="lire-preview-header">
				<h3><BiText fr="Aperçu" key="page.read.preview" inline /></h3>
				<div class="lire-preview-tools">
					<ExplainAgainPanel {text} />
					<ReadAloudButton text={text} rate={$settings.reading.ttsRate} />
				</div>
			</div>
			{#if text.trim()}
				<ReadingPane text={text} settings={$settings.reading} />
			{:else}
				<p class="hint">
					<BiText fr="Collez un texte pour voir l'aperçu." key="page.read.previewEmpty" />
				</p>
			{/if}
		</section>

		{#if !distractionMode}
			<div class="lire-body">
				<ReadingControls ondistractionChange={handleDistractionChange} />

				<div class="lire-editor">
					<section class="lire-input card" aria-label="Votre texte">
						<label for="reading-text">
							<BiText fr="Votre texte" key="page.read.inputLabel" inline />
						</label>
						<textarea
							id="reading-text"
							rows="6"
							bind:value={text}
							placeholder={configLabel('Collez votre texte ici…', 'cfg.ph.readText', $settings.ui)}
						></textarea>
						<button type="button" class="btn btn-secondary" onclick={loadSample}>
							<BiText fr="Utiliser l'exemple" key="page.read.useSample" inline />
						</button>
					</section>

					{#if !verySimple}
						<OcrImportPanel ontextimported={handleOcrImport} />
					{/if}
				</div>
			</div>
		{/if}
	</div>
	</div>
{:else}
	<div
		id={tabPanelIds.compare}
		role="tabpanel"
		aria-labelledby={tabButtonIds.compare}
		tabindex="0"
	>
		<FontComparator />
	</div>
{/if}

<style>
	.lire-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin: var(--space-lg) 0;
	}

	.lire-layout {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.lire-preview {
		order: -1;
	}

	.lire-body {
		display: grid;
		gap: var(--space-lg);
	}

	@media (min-width: 56rem) {
		.lire-body {
			grid-template-columns: minmax(16rem, 20rem) 1fr;
			align-items: start;
		}
	}

	.lire-editor {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		min-width: 0;
	}

	.lire-layout--distraction {
		grid-template-columns: 1fr;
	}

	.lire-input textarea {
		width: 100%;
		font-family: inherit;
		font-size: var(--font-size-base);
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin: var(--space-sm) 0;
		resize: vertical;
	}

	.distraction-banner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
	}

	.hint {
		color: var(--color-text-muted);
	}

	.lire-preview-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.lire-preview-header h3 {
		margin: 0;
	}

	.lire-preview-tools {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--space-sm);
	}
</style>
