<script lang="ts">
	// R?le : Composant Svelte de interface partag?e : encapsule l?affichage et les interactions r?utilisables.

	import { settings } from '$lib/stores/profile';
	import { bilingualUi, type UiKey } from '$lib/i18n';
	import BilingualText from './BilingualText.svelte';

	let {
		fr,
		key,
		inline = false,
		class: className = ''
	}: {
		fr: string;
		key: UiKey;
		inline?: boolean;
		class?: string;
	} = $props();

	const text = $derived(bilingualUi(fr, key, $settings.ui));
</script>

<BilingualText primary={text.primary} secondary={text.secondary} {inline} class={className} />
