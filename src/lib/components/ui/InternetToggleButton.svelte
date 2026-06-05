<script lang="ts">
	import { bilingualLabel } from '$lib/i18n';
	import { settings, profileStore } from '$lib/stores/profile';

	const labelOn = $derived(
		bilingualLabel('Internet activé', 'common.internetOn', $settings.ui)
	);
	const labelOff = $derived(
		bilingualLabel('Internet désactivé', 'common.internetOff', $settings.ui)
	);
	const ariaLabel = $derived(
		$settings.ui.internetEnabled
			? bilingualLabel('Désactiver l\'accès à internet', 'common.internetDisable', $settings.ui)
			: bilingualLabel('Activer l\'accès à internet', 'common.internetEnable', $settings.ui)
	);

	function toggle() {
		profileStore.updateSettings({ ui: { internetEnabled: !$settings.ui.internetEnabled } });
	}
</script>

<button
	type="button"
	class="btn btn-secondary internet-toggle"
	class:internet-toggle--off={!$settings.ui.internetEnabled}
	onclick={toggle}
	aria-pressed={$settings.ui.internetEnabled}
	aria-label={ariaLabel}
	title={ariaLabel}
>
	{$settings.ui.internetEnabled ? labelOn : labelOff}
</button>

<style>
	.internet-toggle {
		font-size: var(--font-size-sm);
	}

	.internet-toggle--off {
		opacity: 0.75;
		border-style: dashed;
	}
</style>
