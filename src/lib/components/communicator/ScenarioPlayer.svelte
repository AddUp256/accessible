<script lang="ts">
	// R?le : Composant Svelte de communication CAA : encapsule l?affichage et les interactions r?utilisables.

	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		BUILT_IN_COMMUNICATION_CARDS,
		type BuiltInCommunicationCard
	} from '$lib/config/communication-cards';
	import type { SocialScenario } from '$lib/config/social-scenarios';
	import { cardDisplayText } from '$lib/modules/communicator/cards';
	import { profileStore } from '$lib/stores/profile';

	let {
		scenario,
		onclose
	}: {
		scenario: SocialScenario;
		onclose: () => void;
	} = $props();

	let stepIndex = $state(0);

	const step = $derived(scenario.steps[stepIndex]);
	const cards = $derived(
		step.cardIds
			.map((id) => BUILT_IN_COMMUNICATION_CARDS.find((c) => c.id === id))
			.filter((c): c is BuiltInCommunicationCard => !!c)
	);

	function cardLabel(card: BuiltInCommunicationCard): string {
		return cardDisplayText(card, $profileStore.communicator.builtInCardOverrides).label;
	}

	function cardMessage(card: BuiltInCommunicationCard): string {
		return cardDisplayText(card, $profileStore.communicator.builtInCardOverrides).message;
	}

	function nextStep() {
		if (stepIndex < scenario.steps.length - 1) stepIndex += 1;
	}

	function prevStep() {
		if (stepIndex > 0) stepIndex -= 1;
	}
</script>

<section class="scenario-player card" aria-labelledby="scenario-player-title">
	<header class="scenario-player__header">
		<h3 id="scenario-player-title">{scenario.title}</h3>
		<p class="scenario-player__desc">{scenario.description}</p>
		<p class="scenario-player__progress" aria-live="polite">
			Étape {stepIndex + 1} / {scenario.steps.length} — {step.title}
		</p>
	</header>

	<p class="scenario-player__hint">{step.hint}</p>

	<ul class="scenario-player__cards" role="list">
		{#each cards as card (card.id)}
			<li class="scenario-player__card">
				<span class="scenario-player__emoji" aria-hidden="true">{card.emoji}</span>
				<div>
					<strong>{cardLabel(card)}</strong>
					<p>{cardMessage(card)}</p>
					<ReadAloudButton text={cardMessage(card)} />
				</div>
			</li>
		{/each}
	</ul>

	<div class="scenario-player__nav">
		<button type="button" class="btn btn-secondary" disabled={stepIndex === 0} onclick={prevStep}>
			<BiText fr="Étape précédente" key="mod.comm.scenario.prev" inline />
		</button>
		{#if stepIndex < scenario.steps.length - 1}
			<button type="button" class="btn btn-primary" onclick={nextStep}>
				<BiText fr="Étape suivante" key="mod.comm.scenario.next" inline />
			</button>
		{:else}
			<button type="button" class="btn btn-primary" onclick={onclose}>
				<BiText fr="Terminer le scénario" key="mod.comm.scenario.done" inline />
			</button>
		{/if}
		<button type="button" class="btn btn-secondary" onclick={onclose}>
			<BiText fr="Fermer" key="mod.common.close" inline />
		</button>
	</div>
</section>

<style>
	.scenario-player__header {
		margin-bottom: var(--space-md);
	}

	.scenario-player__desc,
	.scenario-player__hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.scenario-player__progress {
		font-weight: 600;
		margin: var(--space-sm) 0 0;
	}

	.scenario-player__cards {
		list-style: none;
		margin: var(--space-md) 0;
		padding: 0;
		display: grid;
		gap: var(--space-sm);
	}

	.scenario-player__card {
		display: flex;
		gap: var(--space-md);
		align-items: flex-start;
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.scenario-player__emoji {
		font-size: 2rem;
		line-height: 1;
	}

	.scenario-player__card p {
		margin: var(--space-xs) 0;
	}

	.scenario-player__nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}
</style>
