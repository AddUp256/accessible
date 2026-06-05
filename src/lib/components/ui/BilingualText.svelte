<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		primary,
		secondary,
		inline = false,
		class: className = ''
	}: {
		primary: string;
		secondary?: string;
		inline?: boolean;
		class?: string;
	} = $props();
</script>

<span class="bilingual-text {className}" class:bilingual-text--inline={inline}>
	<span class="bilingual-primary">{primary}</span>
	{#if secondary}
		<span class="bilingual-secondary" lang="auto">{secondary}</span>
	{/if}
</span>

<style>
	.bilingual-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.bilingual-text--inline {
		flex-direction: row;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
	}

	.bilingual-secondary {
		font-size: 0.92em;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.bilingual-text--inline .bilingual-secondary::before {
		content: '·';
		margin-right: 0.35rem;
		color: var(--color-text-muted);
	}
</style>
