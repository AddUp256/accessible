<script lang="ts">
	import {
		decorateReadingLine,
		usesReadingDecoration
	} from '$lib/modules/reading/text-decoration';
	import { toFalcText, readingSettingsToStyle } from '$lib/modules/reading/font-stacks';
	import { bilingualLabel } from '$lib/i18n';
	import type { ReadingSettings } from '$lib/types/profile';
	import { profileStore, settings } from '$lib/stores/profile';

	let {
		text,
		settings: readingSettings,
		class: className = ''
	}: {
		text: string;
		settings: ReadingSettings;
		class?: string;
	} = $props();

	let activeLine = $state<number>(0);

	const displayText = $derived(
		readingSettings.falcMode
			? toFalcText(text, $profileStore.comprehension?.glossary ?? [])
			: text
	);
	const style = $derived(readingSettingsToStyle(readingSettings));
	const lines = $derived(displayText.split('\n'));
	const decorated = $derived(usesReadingDecoration(readingSettings));
	const maskLabel = $derived(
		bilingualLabel(
			'Texte avec masque de lecture. Flèches haut/bas pour changer de ligne.',
			'mod.read.maskAriaLabel',
			$settings.ui
		)
	);

	function moveLine(delta: number) {
		activeLine = Math.max(0, Math.min(lines.length - 1, activeLine + delta));
	}

	$effect(() => {
		if (activeLine >= lines.length) activeLine = Math.max(0, lines.length - 1);
	});

	$effect(() => {
		if (!readingSettings.readingMask) return;

		function handleMaskKey(event: KeyboardEvent) {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				moveLine(1);
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				moveLine(-1);
			}
		}

		window.addEventListener('keydown', handleMaskKey);
		return () => window.removeEventListener('keydown', handleMaskKey);
	});
</script>

<section
	class="reading-pane {className}"
	class:reading-pane--line-guide={readingSettings.lineGuide}
	class:reading-pane--alternating={readingSettings.alternatingLines}
	class:reading-pane--mask={readingSettings.readingMask}
	style={style}
	lang="fr"
	aria-label={readingSettings.readingMask ? maskLabel : undefined}
>
	{#each lines as line, i}
		<p
			class="reading-line"
			class:reading-line--alt={readingSettings.alternatingLines && i % 2 === 1}
			class:reading-line--active={readingSettings.readingMask && activeLine === i}
			onmouseenter={() => (activeLine = i)}
		>
			{#if decorated}
				{@html decorateReadingLine(line, readingSettings)}
			{:else}
				{line || '\u00A0'}
			{/if}
		</p>
	{/each}
</section>

<style>
	.reading-pane {
		padding: var(--space-lg);
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
		margin: 0 auto;
	}

	.reading-line {
		margin: 0 0 0.5em;
	}

	.reading-pane--line-guide .reading-line {
		border-bottom: 2px solid rgb(45 90 61 / 0.28);
		padding-bottom: 0.2em;
	}

	.reading-pane--alternating .reading-line--alt {
		background-color: rgb(0 0 0 / 0.04);
		padding: 0 0.25em;
		border-radius: 2px;
	}

	.reading-pane--mask .reading-line {
		opacity: 0.35;
		padding: 0 0.25em;
		border-radius: 2px;
		transition: opacity 0.15s ease;
	}

	.reading-pane--mask .reading-line--active {
		opacity: 1;
		background: rgb(45 90 61 / 0.08);
	}

	.reading-line :global(.reading-syllable:nth-child(odd)) {
		background: rgb(45 90 61 / 0.12);
		border-radius: 2px;
		padding: 0 0.05em;
	}

	.reading-line :global(.reading-grapheme:nth-child(odd)) {
		background: rgb(45 90 61 / 0.1);
		border-radius: 1px;
	}

	.reading-line :global(.reading-muted) {
		opacity: 0.35;
	}
</style>
