<script lang="ts">
	// R?le : Composant Svelte de profil et personnalisation : encapsule l?affichage et les interactions r?utilisables.

	import { page } from '$app/stores';
	import FeatureGuard from '$lib/components/profile/FeatureGuard.svelte';
	import {
		featureFromPath,
		isFeatureVisible,
		type AppFeature
	} from '$lib/modules/profile/feature-visibility';
	import { profileStore } from '$lib/stores/profile';

	let { children }: { children: import('svelte').Snippet } = $props();

	const routeFeature = $derived(featureFromPath($page.url.pathname));
	const discoveryTestMode = $derived($page.url.searchParams.get('from') === 'discovery');
	const routeAllowed = $derived(
		routeFeature === null || discoveryTestMode || isFeatureVisible($profileStore, routeFeature)
	);
</script>

{#if routeAllowed}
	{@render children()}
{:else if routeFeature}
	<FeatureGuard feature={routeFeature as AppFeature} />
{/if}
