<script lang="ts">
	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { explainAlternately } from '$lib/modules/comprehension/explain-alternately';
	import { bilingualLabel } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';

	let {
		text
	}: {
		text: string;
	} = $props();

	let open = $state(false);

	const result = $derived(
		explainAlternately(text, {
			glossary: $profileStore.comprehension?.glossary ?? [],
			useFleLexicon: true
		})
	);

	const readLabel = $derived(
		bilingualLabel('Lire la version simple', 'mod.understand.explainAgainRead', $settings.ui)
	);

	function toggle() {
		open = !open;
	}
</script>

{#if result}
	<div class="explain-again">
		<button
			type="button"
			class="btn btn-secondary"
			aria-expanded={open}
			aria-controls="explain-again-panel"
			onclick={toggle}
		>
			<BiText fr="Expliquer autrement" key="mod.understand.explainAgain" inline />
		</button>

		{#if open}
			<section id="explain-again-panel" class="explain-again-panel card" aria-labelledby="explain-again-heading">
				<div class="explain-again-header">
					<h4 id="explain-again-heading">
						<BiText fr="Autre façon de comprendre" key="mod.understand.explainAgainTitle" inline />
					</h4>
					<ReadAloudButton text={result.fullText} rate={$settings.reading.ttsRate} label={readLabel} />
				</div>
				<p class="explain-again-intro">
					<BiText
						fr="Voici la même consigne, découpée en petites étapes avec des mots plus simples."
						key="mod.understand.explainAgainIntro"
					/>
				</p>
				<ol class="explain-again-bullets">
					{#each result.bullets as bullet, index (index)}
						<li>{bullet}</li>
					{/each}
				</ol>
			</section>
		{/if}
	</div>
{/if}

<style>
	.explain-again {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.explain-again-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
	}

	.explain-again-header h4 {
		margin: 0;
	}

	.explain-again-intro {
		margin: 0 0 var(--space-md);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.explain-again-bullets {
		margin: 0;
		padding-left: var(--space-lg);
		line-height: 1.7;
	}

	.explain-again-bullets li {
		margin-bottom: var(--space-sm);
	}

	.explain-again-bullets li:last-child {
		margin-bottom: 0;
	}
</style>
