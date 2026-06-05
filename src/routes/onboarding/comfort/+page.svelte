<script lang="ts">
	import ComfortPanel from '$lib/components/onboarding/ComfortPanel.svelte';
	import ReadingPane from '$lib/components/reading/ReadingPane.svelte';
	import StepProgress from '$lib/components/ui/StepProgress.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { FONT_COMPARE_SAMPLES } from '$lib/config/fonts-catalog';
	import { completeOnboardingStep } from '$lib/modules/onboarding/actions';
	import { settings } from '$lib/stores/profile';
	import { goto } from '$app/navigation';

	const previewText = FONT_COMPARE_SAMPLES.long;

	function finish() {
		completeOnboardingStep('comfort');
		goto('/onboarding/complete');
	}
</script>

<svelte:head>
	<title>Confort d'interface — Accessible</title>
</svelte:head>

<StepProgress current={1} total={1} label="Confort d'interface" labelKey="onboard.comfort.heading" />

<section class="card comfort-preview" aria-label="Aperçu">
	<BiHeading fr="Aperçu" key="page.read.preview" level={3} />
	<p><BiText fr="Testez ces réglages. L'aperçu change tout de suite." key="onboard.comfort.previewHint" /></p>
	<ReadingPane text={previewText} settings={$settings.reading} />
</section>

<section class="card">
	<BiHeading fr="Confort d'interface" key="onboard.comfort.heading" />
</section>

<ComfortPanel />

<div class="onboarding-actions">
	<a class="btn btn-secondary" href="/onboarding">Retour au parcours</a>
	<button type="button" class="btn btn-primary btn-lg" onclick={finish}>Terminer cette étape</button>
</div>

<style>
	.onboarding-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}
</style>
