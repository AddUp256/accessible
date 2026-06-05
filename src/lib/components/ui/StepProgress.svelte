<script lang="ts">
	import { bilingualUi } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import type { UiKey } from '$lib/i18n';

	let {
		current,
		total,
		label = 'Progression',
		labelKey
	}: {
		current: number;
		total: number;
		label?: string;
		labelKey?: UiKey;
	} = $props();

	const percent = $derived(total > 0 ? Math.round((current / total) * 100) : 0);
	const ariaLabel = $derived(
		labelKey
			? [
					bilingualUi(label, labelKey, $settings.ui).primary,
					bilingualUi(label, labelKey, $settings.ui).secondary
				]
					.filter(Boolean)
					.join(' / ')
			: label
	);
</script>

<div class="step-progress" aria-label={ariaLabel}>
	<div
		class="step-progress-bar"
		role="progressbar"
		aria-valuenow={current}
		aria-valuemin={0}
		aria-valuemax={total}
	>
		<div class="step-progress-fill" style:width="{percent}%"></div>
	</div>
	<p class="step-progress-text">Étape {current} sur {total}</p>
</div>

<style>
	.step-progress {
		margin-bottom: var(--space-lg);
	}

	.step-progress-bar {
		height: 0.5rem;
		background: var(--color-border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.step-progress-fill {
		height: 100%;
		background: var(--color-accent);
		transition: width 0.2s ease;
	}

	.step-progress-text {
		margin: var(--space-xs) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
