<script lang="ts">
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
	const routeAllowed = $derived(
		routeFeature === null || isFeatureVisible($profileStore, routeFeature)
	);
</script>

{#if routeAllowed}
	{@render children()}
{:else if routeFeature}
	<FeatureGuard feature={routeFeature as AppFeature} />
{/if}
