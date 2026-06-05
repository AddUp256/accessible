<script lang="ts">

	import CorrecteurPanel from '$lib/components/writing/CorrecteurPanel.svelte';
	import WritingControls from '$lib/components/writing/WritingControls.svelte';
	import WritingEditor from '$lib/components/writing/WritingEditor.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { settings } from '$lib/stores/profile';



	let text = $state('');

</script>



<svelte:head>

	<title>Écrire — Accessible</title>

</svelte:head>



<BiHeading fr="Écrire un texte" key="page.write.title" />
<p>
	<BiText fr="Écrivez ou collez un texte. Activez la prédiction de mots pour compléter plus vite. Hunspell (orthographe) et Grammalecte (grammaire) fonctionnent dans l'application desktop si installés." key="page.write.intro" />
</p>



<div class="ecrire-layout" class:ecrire-layout--distraction={$settings.writing.distractionFree}>

	{#if $settings.writing.distractionFree}

		<div class="distraction-banner card">

			<p><strong>Mode sans distraction.</strong> Seul l'éditeur est affiché.</p>

		</div>

	{/if}



	<WritingEditor
		bind:text
		distractionFree={$settings.writing.distractionFree}
		wordPredictionEnabled={$settings.writing.wordPrediction}
	/>



	{#if !$settings.writing.distractionFree}

		<WritingControls />

		<CorrecteurPanel
			{text}
			spellcheckMode={$settings.writing.spellcheck}
			grammarCheckMode={$settings.writing.grammarCheck}
			shortSentenceHint={$settings.writing.shortSentenceHint}
			ontextchange={(value) => (text = value)}
		/>

	{/if}

</div>



<style>

	.ecrire-layout {

		display: grid;

		gap: var(--space-lg);

		margin-top: var(--space-lg);

	}



	@media (min-width: 56rem) {

		.ecrire-layout:not(.ecrire-layout--distraction) {

			grid-template-columns: minmax(16rem, 20rem) 1fr;

		}



		:global(.ecrire-layout:not(.ecrire-layout--distraction) .writing-editor) {

			grid-column: 1 / -1;

		}



		:global(.ecrire-layout:not(.ecrire-layout--distraction) .writing-controls) {

			grid-column: 1;

		}



		:global(.ecrire-layout:not(.ecrire-layout--distraction) .correcteur-panel) {

			grid-column: 2;

		}

	}



	.distraction-banner {

		grid-column: 1 / -1;

	}

</style>

