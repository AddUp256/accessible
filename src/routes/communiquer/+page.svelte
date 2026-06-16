<script lang="ts">
	// R?le : Page SvelteKit /routes/communiquer : assemble l?interface utilisateur et les actions de cette zone.


	import ArasaacPanel from '$lib/components/communicator/ArasaacPanel.svelte';

	import CommunicationCardGrid from '$lib/components/communicator/CommunicationCardGrid.svelte';

	import OnboardingTestReturn from '$lib/components/onboarding/OnboardingTestReturn.svelte';

	import PersonalCardsPanel from '$lib/components/communicator/PersonalCardsPanel.svelte';

	import ScenarioPlayer from '$lib/components/communicator/ScenarioPlayer.svelte';

	import BiHeading from '$lib/components/ui/BiHeading.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import BilingualText from '$lib/components/ui/BilingualText.svelte';

	import { COMMUNICATION_SCENARIOS, BUILT_IN_COMMUNICATION_CARDS } from '$lib/config/communication-cards';

	import { CAA_ROUTINE_TEMPLATES, SOCIAL_SCENARIOS } from '$lib/config/social-scenarios';

	import { configLabel, COMM_SCENARIO_I18N_KEYS } from '$lib/i18n';
	import { notifyUserI18n } from '$lib/i18n';

	import {

		addVisualRoutine,

		createVisualRoutine,

		createRoutineStep

	} from '$lib/modules/organizer/visual-routine';

	import { resolveBuiltInCard } from '$lib/modules/communicator/card-display';

	import { profileStore, settings } from '$lib/stores/profile';



	let activeScenario = $state<string | null>(null);

	let playingScenarioId = $state<string | null>(null);



	const scenarioCards = $derived(

		activeScenario

			? COMMUNICATION_SCENARIOS.find((scenario) => scenario.id === activeScenario)

			: null

	);



	const playingScenario = $derived(

		playingScenarioId ? SOCIAL_SCENARIOS.find((s) => s.id === playingScenarioId) ?? null : null

	);



	function importCaaRoutine(templateId: string) {

		const template = CAA_ROUTINE_TEMPLATES.find((t) => t.id === templateId);

		if (!template) return;

		const routine = createVisualRoutine(template.title);

		routine.steps = template.steps.map((step) => createRoutineStep(step.label, step.icon));

		profileStore.patch((profile) => ({

			...profile,

			organizer: addVisualRoutine(profile.organizer, routine)

		}));

		notifyUserI18n('dyn.comm.routineImported', 'minimal', { title: template.title });

	}

</script>



<svelte:head>

	<title>Communiquer — Accessible</title>

</svelte:head>



<BiHeading fr="Communiquer" key="page.communicate.title" />

<p>

	<BiText fr="Choisissez une carte à montrer ou à lire à voix haute. Utile en cours, au travail ou avec votre entourage. Vous pouvez aussi importer des pictogrammes ARASAAC (section ci-dessous)." key="page.communicate.intro" />

</p>



<OnboardingTestReturn moduleLabel="Communiquer" />

<section class="card scenarios" aria-labelledby="social-scenarios-heading">

	<BiHeading fr="Scénarios sociaux guidés" key="page.communicate.socialScenarios" level={3} id="social-scenarios-heading" />

	<p class="scenario-intro">

		<BiText fr="Parcourez un scénario étape par étape avec les cartes suggérées à chaque moment." key="page.communicate.socialScenariosIntro" />

	</p>

	<div class="scenario-actions">

		{#each SOCIAL_SCENARIOS as scenario}

			<button

				type="button"

				class="btn btn-primary"

				onclick={() => (playingScenarioId = scenario.id)}

			>

				{scenario.title}

			</button>

		{/each}

	</div>



	{#if playingScenario}

		<ScenarioPlayer

			scenario={playingScenario}

			onclose={() => (playingScenarioId = null)}

		/>

	{/if}

</section>



<section class="card scenarios" aria-labelledby="scenarios-heading">

	<BiHeading fr="Situations courantes" key="page.communicate.scenarios" level={3} id="scenarios-heading" />

	<div class="scenario-actions">

		{#each COMMUNICATION_SCENARIOS as scenario}

			<button

				type="button"

				class="btn"

				class:btn-primary={activeScenario === scenario.id}

				class:btn-secondary={activeScenario !== scenario.id}

				onclick={() =>

					(activeScenario = activeScenario === scenario.id ? null : scenario.id)}

			>

				{configLabel(scenario.title, COMM_SCENARIO_I18N_KEYS[scenario.id], $settings.ui)}

			</button>

		{/each}

	</div>



	{#if scenarioCards}

		<p class="scenario-hint"><BiText fr="Cartes suggérées pour cette situation :" key="cfg.comm.scenario.hint" /></p>

		<ul class="scenario-list">

			{#each scenarioCards.cardIds as cardId}

				{@const card = BUILT_IN_COMMUNICATION_CARDS.find((item) => item.id === cardId)}

				{#if card}
					{@const display = resolveBuiltInCard(card, $profileStore.communicator, $settings.ui)}
					<li>
						{card.emoji}
						<BilingualText
							primary={display.label.primary}
							secondary={display.label.secondary}
							inline={true}
						/>
					</li>
				{/if}

			{/each}

		</ul>

	{/if}

</section>



<section class="card" aria-labelledby="caa-routines-heading">

	<BiHeading fr="Routines CAA" key="page.communicate.caaRoutines" level={3} id="caa-routines-heading" />

	<p class="scenario-intro">

		<BiText fr="Importez une routine visuelle préremplie dans Organiser pour préparer des situations de communication." key="page.communicate.caaRoutinesIntro" />

	</p>

	<div class="scenario-actions">

		{#each CAA_ROUTINE_TEMPLATES as template}

			<button type="button" class="btn btn-secondary" onclick={() => importCaaRoutine(template.id)}>

				{template.title}

			</button>

		{/each}

	</div>

</section>



<label class="settings-checkbox card">

	<input

		type="checkbox"

		checked={$settings.communication.communicationCardsEnabled}

		onchange={(e) =>

			profileStore.updateSettings({

				communication: { communicationCardsEnabled: e.currentTarget.checked }

			})}

	/>

	Activer les cartes de communication dans mon profil (export synthèse)

</label>



<CommunicationCardGrid />



<ArasaacPanel />



<PersonalCardsPanel />



<p class="comm-note">

	Le mode pause (menu principal) propose aussi des cartes rapides en situation de crise.

</p>



<style>

	.scenario-actions {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-sm);

		margin-bottom: var(--space-md);

	}



	.scenario-intro,

	.scenario-hint {

		margin: 0 0 var(--space-sm);

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.scenario-list {

		margin: 0;

		padding-left: var(--space-lg);

	}



	.settings-checkbox {

		display: flex;

		align-items: center;

		gap: var(--space-sm);

		min-height: var(--btn-min-height);

		margin: var(--space-lg) 0;

		cursor: pointer;

	}



	.comm-note {

		margin-top: var(--space-xl);

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}

</style>

