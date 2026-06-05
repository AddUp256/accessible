<script lang="ts">
	import { APP_MODES, applyAppMode } from '$lib/config/app-modes';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { MODE_I18N_KEYS } from '$lib/i18n/ui-panels';
	import { bilingualUi, dynamicMessage, type UiKey } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';
	import type { AppMode } from '$lib/types/profile';

	let status = $state('');

	function setMode(mode: AppMode) {
		profileStore.patch((profile) => applyAppMode(profile, mode));
		const keys = MODE_I18N_KEYS[mode];
		const label = bilingualUi(
			APP_MODES.find((item) => item.id === mode)?.label ?? mode,
			keys.label as UiKey,
			$settings.ui
		);
		status = dynamicMessage('dyn.appMode.activated', $settings.ui, { mode: label.primary });
	}
</script>

<section class="card app-mode-panel" id="app-mode" aria-labelledby="app-mode-heading">
	<BiHeading fr="Mode d'utilisation" key="panel.appMode.title" level={3} id="app-mode-heading" />
	<p class="app-mode-hint">
		<BiText
			fr="Accessible ne pose pas de diagnostic. Le mode enseignant sert à consulter ou exporter une synthèse d'aménagements."
			key="panel.appMode.hint"
		/>
	</p>

	<fieldset class="app-mode-fieldset">
		<legend class="visually-hidden">
			<BiText fr="Choisir un mode" key="panel.appMode.legend" inline />
		</legend>
		{#each APP_MODES as mode}
			{@const keys = MODE_I18N_KEYS[mode.id]}
			{@const label = bilingualUi(mode.label, keys.label as UiKey, $settings.ui)}
			{@const desc = bilingualUi(mode.description, keys.desc as UiKey, $settings.ui)}
			<label class="app-mode-option">
				<input
					type="radio"
					name="appMode"
					value={mode.id}
					checked={$profileStore.meta.appMode === mode.id}
					onchange={() => setMode(mode.id)}
				/>
				<span class="app-mode-body">
					<strong>
						<BilingualText primary={label.primary} secondary={label.secondary} inline />
					</strong>
					<span class="app-mode-desc">
						<BilingualText primary={desc.primary} secondary={desc.secondary} inline />
					</span>
				</span>
			</label>
		{/each}
	</fieldset>

	{#if status}
		<p class="app-mode-status" role="status">{status}</p>
	{/if}
</section>

<style>
	.app-mode-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.app-mode-fieldset {
		border: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-sm);
	}

	.app-mode-option {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		min-height: var(--btn-min-height);
		color: var(--color-text);
		background: var(--color-bg);
	}

	.app-mode-option:has(input:checked) {
		outline: 2px solid var(--color-accent);
		background: var(--color-bg-elevated);
	}

	.app-mode-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.app-mode-desc {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.app-mode-status {
		margin-top: var(--space-md);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
