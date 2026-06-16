<script lang="ts">
	// R?le : Composant Svelte de interface partag?e : encapsule l?affichage et les interactions r?utilisables.

	import type { UiKey } from '$lib/i18n';
	import BiText from './BiText.svelte';

	let {
		fr,
		key,
		level = 2,
		id,
		class: className = ''
	}: {
		fr: string;
		key: UiKey;
		level?: 1 | 2 | 3 | 4;
		id?: string;
		class?: string;
	} = $props();
</script>

{#if level === 1}
	<h1 {id} class={className}><BiText {fr} {key} /></h1>
{:else if level === 3}
	<h3 {id} class={className}><BiText {fr} {key} /></h3>
{:else if level === 4}
	<h4 {id} class={className}><BiText {fr} {key} /></h4>
{:else}
	<h2 {id} class={className}><BiText {fr} {key} /></h2>
{/if}
