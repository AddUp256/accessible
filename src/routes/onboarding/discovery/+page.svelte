<script lang="ts">

	import { onMount } from 'svelte';

	import ComfortPanel from '$lib/components/onboarding/ComfortPanel.svelte';
	import MediaReaderPanel from '$lib/components/reading/MediaReaderPanel.svelte';

	import StepProgress from '$lib/components/ui/StepProgress.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import { completeOnboardingStep, setOnboardingPath } from '$lib/modules/onboarding/actions';

	import { DISCOVERY_STEPS, type DiscoveryStepId } from '$lib/modules/onboarding/discovery-steps';

	import { bilingualUi, type UiKey } from '$lib/i18n';

	import { settings } from '$lib/stores/profile';

	import { goto } from '$app/navigation';



	let stepIndex = $state(0);



	onMount(() => {

		setOnboardingPath('discovery');

	});



	const currentStep = $derived(DISCOVERY_STEPS[stepIndex]);

	const total = DISCOVERY_STEPS.length;



	const introKeys: Partial<Record<DiscoveryStepId, UiKey>> = {

		comfort: 'onboard.discovery.comfort.intro',

		reading: 'onboard.discovery.step.reading.intro',

		writing: 'onboard.discovery.step.writing.intro',

		organization: 'onboard.discovery.step.organization.intro',

		media: 'onboard.discovery.step.media.intro',

		sensory: 'onboard.discovery.step.sensory.intro',

		motor: 'onboard.discovery.step.motor.intro',

		communication: 'onboard.discovery.step.communication.intro',

		summary: 'onboard.discovery.step.summary.intro'

	};



	const introFr: Partial<Record<DiscoveryStepId, string>> = {

		comfort: "Testez le confort de l'interface. Les changements sont visibles tout de suite.",

		reading: 'Collez un texte, changez la police et la taille, ou écoutez avec la synthèse vocale.',

		writing: "Écrivez un texte simple ou corrigez-le pas à pas avec l'aide orthographique.",

		organization: 'Découpez votre travail en checklists, minuteur ou cartes Kanban.',

		media: 'Importez un fichier audio ou vidéo, réglez la vitesse et lisez la transcription à voix haute.',

		sensory: 'Testez les réglages sensoriels : animations, sons et notifications.',

		motor: 'Réglez la taille des boutons, le temps de clic, la dictée vocale et les confirmations.',

		communication: 'Cartes de communication et pictogrammes ARASAAC pour exprimer vos besoins.',

		summary:

			'Voici ce que nous avons noté pendant ce parcours. Vous pourrez compléter la synthèse à tout moment.'

	};



	const openModuleLabel = $derived(

		bilingualUi('Ouvrir ce module', 'onboard.discovery.openModule', $settings.ui)

	);



	function next(markCurrent = true) {

		if (markCurrent) completeOnboardingStep(currentStep.id);

		if (stepIndex >= total - 1) {

			goto('/onboarding/complete');

			return;

		}

		stepIndex += 1;

	}



	function skip() {

		completeOnboardingStep(`${currentStep.id}_skipped`);

		next(false);

	}

</script>



<svelte:head>

	<title>Parcours guidé — Accessible</title>

</svelte:head>



<StepProgress current={stepIndex + 1} total={total} />



<section class="card">

	<h2>{currentStep.label}</h2>



	{#if currentStep.id === 'comfort'}

		<p><BiText fr={introFr.comfort!} key={introKeys.comfort!} /></p>

		<ComfortPanel />

	{:else if currentStep.id === 'summary'}

		<p><BiText fr={introFr.summary!} key={introKeys.summary!} /></p>

		<p>

			<BiText

				fr="Consultez Mon profil pour voir vos besoins et aménagements. Exportez une synthèse PDF ou JSON depuis Paramètres."

				key="onboard.discovery.step.summary.detail"

			/>

		</p>

		<div class="discovery-links">

			<a class="btn btn-secondary" href="/profil">Mon profil</a>

			<a class="btn btn-secondary" href="/parametres#export">Exporter ma synthèse</a>

		</div>

	{:else if currentStep.id === 'sensory'}

		<p><BiText fr={introFr.sensory!} key={introKeys.sensory!} /></p>

		<ComfortPanel />

	{:else if currentStep.id === 'media'}

		<p><BiText fr={introFr.media!} key={introKeys.media!} /></p>

		<MediaReaderPanel />

	{:else if currentStep.implemented && 'href' in currentStep && currentStep.href}

		<p><BiText fr={introFr[currentStep.id]!} key={introKeys[currentStep.id]!} /></p>

		<a class="btn btn-secondary" href={currentStep.href}>{openModuleLabel.primary}</a>

	{:else}

		<p><BiText fr={introFr[currentStep.id]!} key={introKeys[currentStep.id]!} /></p>

		<p><BiText fr="Vous pouvez passer cette étape ou revenir plus tard." key="onboard.discovery.stub.hint" /></p>

	{/if}

</section>



<div class="onboarding-actions">

	{#if stepIndex > 0}

		<button type="button" class="btn btn-secondary" onclick={() => (stepIndex -= 1)}>Retour</button>

	{:else}

		<a class="btn btn-secondary" href="/onboarding">Retour</a>

	{/if}

	<button type="button" class="btn btn-secondary" onclick={skip}>Passer cette étape</button>

	<button type="button" class="btn btn-secondary" onclick={skip}>Je ne sais pas</button>

	<button type="button" class="btn btn-primary" onclick={() => next()}>

		{stepIndex >= total - 1 ? 'Terminer' : 'Continuer'}

	</button>

</div>



<style>

	.onboarding-actions {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-sm);

		margin-top: var(--space-lg);

	}



	.discovery-links {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-sm);

		margin-top: var(--space-md);

	}

</style>

