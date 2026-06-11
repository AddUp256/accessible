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
		min-width: 0;
		max-width: 100%;
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
		overflow-wrap: anywhere;
	}

	.bilingual-primary {
		overflow-wrap: anywhere;
	}

	.bilingual-text--inline .bilingual-secondary::before {
		content: '·';
		margin-right: 0.35rem;
		color: var(--color-text-muted);
	}

	:global(.btn-primary) .bilingual-secondary,
	:global(.btn-primary) .bilingual-secondary::before {
		color: currentColor;
		opacity: 0.92;
	}
</style>
