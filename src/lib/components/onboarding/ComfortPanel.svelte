<script lang="ts">
	import BiText from '$lib/components/ui/BiText.svelte';
	import { bilingualLabel, type UiKey } from '$lib/i18n';
	import { settings, profileStore } from '$lib/stores/profile';
	import type { UISettings } from '$lib/types/profile';

	const themes: { value: UISettings['theme']; fr: string; key: UiKey }[] = [
		{ value: 'cream', fr: 'Crème', key: 'theme.cream' },
		{ value: 'light', fr: 'Clair', key: 'theme.light' },
		{ value: 'dark', fr: 'Sombre', key: 'theme.dark' },
		{ value: 'highContrast', fr: 'Contraste élevé', key: 'theme.highContrast' }
	];

	const buttonSizes: { value: UISettings['buttonSize']; fr: string; key: UiKey }[] = [
		{ value: 'normal', fr: 'Normal', key: 'size.normal' },
		{ value: 'large', fr: 'Grand', key: 'size.large' },
		{ value: 'veryLarge', fr: 'Très grand', key: 'size.veryLarge' }
	];
</script>

<div class="comfort-panel">
	<fieldset class="comfort-fieldset">
		<legend><BiText fr="Thème" key="panel.comfort.theme" inline /></legend>
		<div class="comfort-options">
			{#each themes as theme}
				<button
					type="button"
					class="btn"
					class:btn-primary={$settings.ui.theme === theme.value}
					class:btn-secondary={$settings.ui.theme !== theme.value}
					onclick={() => profileStore.updateSettings({ ui: { theme: theme.value } })}
				>
					{bilingualLabel(theme.fr, theme.key, $settings.ui)}
				</button>
			{/each}
		</div>
	</fieldset>

	<fieldset class="comfort-fieldset">
		<legend><BiText fr="Taille des boutons" key="panel.comfort.buttonSize" inline /></legend>
		<div class="comfort-options">
			{#each buttonSizes as size}
				<button
					type="button"
					class="btn"
					class:btn-primary={$settings.ui.buttonSize === size.value}
					class:btn-secondary={$settings.ui.buttonSize !== size.value}
					onclick={() => profileStore.updateSettings({ ui: { buttonSize: size.value } })}
				>
					{bilingualLabel(size.fr, size.key, $settings.ui)}
				</button>
			{/each}
		</div>
	</fieldset>

	<fieldset class="comfort-fieldset">
		<legend><BiText fr="Autres réglages" key="panel.comfort.other" inline /></legend>
		<label class="comfort-check">
			<input
				type="checkbox"
				checked={$settings.ui.showPictograms}
				onchange={(e) =>
					profileStore.updateSettings({ ui: { showPictograms: e.currentTarget.checked } })}
			/>
			<BiText fr="Afficher des pictogrammes" key="panel.comfort.showPictograms" inline />
		</label>
		<label class="comfort-check">
			<input
				type="checkbox"
				checked={$settings.ui.animations}
				onchange={(e) =>
					profileStore.updateSettings({
						ui: { animations: e.currentTarget.checked },
						sensory: { animations: e.currentTarget.checked, reducedMotion: !e.currentTarget.checked }
					})}
			/>
			<BiText fr="Activer les animations" key="panel.comfort.animations" inline />
		</label>
		<label class="comfort-check">
			<input
				type="checkbox"
				checked={$settings.ui.keyboardNavigation}
				onchange={(e) =>
					profileStore.updateSettings({ ui: { keyboardNavigation: e.currentTarget.checked } })}
			/>
			<BiText fr="Navigation clavier renforcée" key="panel.comfort.keyboardNav" inline />
		</label>
		<label class="comfort-check">
			<input
				type="checkbox"
				checked={$settings.ui.interfaceTTS}
				onchange={(e) =>
					profileStore.updateSettings({ ui: { interfaceTTS: e.currentTarget.checked } })}
			/>
			<BiText fr="Lecture vocale de l'interface (si disponible)" key="panel.comfort.interfaceTTS" inline />
		</label>
		{#if $settings.ui.interfaceTTS}
			<p class="comfort-hint">
				<BiText
					fr="Double-clic droit sur un élément pour le lire. Maintenez le clic droit et glissez pour lire une zone."
					key="panel.comfort.interfaceTTSHint"
				/>
			</p>
		{/if}
	</fieldset>
</div>

<style>
	.comfort-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.comfort-fieldset {
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-md);
		margin: 0;
	}

	.comfort-options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-sm);
	}

	.comfort-check {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: var(--btn-min-height);
		cursor: pointer;
	}

	.comfort-hint {
		margin: var(--space-xs) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
