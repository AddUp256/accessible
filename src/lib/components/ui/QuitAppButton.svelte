<script lang="ts">
	import BiText from '$lib/components/ui/BiText.svelte';
	import { bilingualLabel } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import { quitApplication } from '$lib/services/app-lifecycle';

	let busy = $state(false);

	const label = $derived(
		bilingualLabel('Quitter', 'nav.quit', $settings.ui)
	);

	async function handleQuit() {
		if (busy) return;
		busy = true;
		try {
			await quitApplication();
		} finally {
			busy = false;
		}
	}
</script>

<button
	type="button"
	class="btn btn-secondary quit-app-btn"
	disabled={busy}
	onclick={handleQuit}
	aria-label={label}
>
	<BiText fr="Quitter" key="nav.quit" inline />
</button>

<style>
	.quit-app-btn {
		min-height: var(--btn-min-height);
	}
</style>
