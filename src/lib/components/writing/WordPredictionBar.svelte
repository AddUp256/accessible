<script lang="ts">
	import { predictWords, applySuggestion } from '$lib/modules/writing/word-prediction';

	let {
		text = $bindable(''),
		enabled = false
	}: {
		text?: string;
		enabled?: boolean;
	} = $props();

	const prediction = $derived(enabled ? predictWords(text) : { suggestions: [], mode: 'complete' as const, prefix: '' });

	function selectWord(word: string) {
		text = applySuggestion(text, word);
	}
</script>

{#if enabled && prediction.suggestions.length > 0}
	<div class="word-prediction" role="region" aria-label="Suggestions de mots">
		<p class="word-prediction-label">
			{#if prediction.mode === 'next'}
				Mot suivant suggéré
			{:else}
				Compléter « {prediction.prefix} »
			{/if}
		</p>
		<div class="word-prediction-actions">
			{#each prediction.suggestions as word}
				<button
					type="button"
					class="btn btn-secondary word-prediction-btn"
					onclick={() => selectWord(word)}
				>
					{word}
				</button>
			{/each}
		</div>
		<p class="word-prediction-hint">Liste locale — pas de connexion internet.</p>
	</div>
{/if}

<style>
	.word-prediction {
		margin-top: var(--space-md);
		padding-top: var(--space-md);
		border-top: 1px solid var(--color-border);
	}

	.word-prediction-label {
		margin: 0 0 var(--space-sm);
		font-size: var(--font-size-sm);
		font-weight: 600;
	}

	.word-prediction-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.word-prediction-btn {
		min-height: var(--btn-min-height);
	}

	.word-prediction-hint {
		margin: var(--space-sm) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
