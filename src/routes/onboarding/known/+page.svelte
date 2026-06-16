<script lang="ts">
	// R?le : Page SvelteKit /routes/onboarding/known : assemble l?interface utilisateur et les actions de cette zone.


	import StepProgress from '$lib/components/ui/StepProgress.svelte';

	import BiHeading from '$lib/components/ui/BiHeading.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import { TOOLS_CATALOG } from '$lib/config/tools-catalog';

	import { configLabel, TOOL_I18N_KEYS } from '$lib/i18n';

	import { completeOnboardingStep, setActivatedTools, setOnboardingPath } from '$lib/modules/onboarding/actions';

	import { settings } from '$lib/stores/profile';

	import type { ToolId } from '$lib/types/profile';
	import { goto } from '$app/navigation';



	let selected = $state<ToolId[]>([]);



	function toggleTool(id: ToolId) {

		selected = selected.includes(id) ? selected.filter((t) => t !== id) : [...selected, id];

	}



	function saveKnownPath(tools: ToolId[], stepId: string) {

		setOnboardingPath('known');

		setActivatedTools(tools);

		completeOnboardingStep(stepId);

	}



	function skipPath() {

		saveKnownPath([], 'known_tools_skipped');

		goto('/onboarding/comfort');

	}



	function continuePath() {

		if (selected.length === 0) return;

		saveKnownPath(selected, 'known_tools');

		goto('/onboarding/comfort');

	}

</script>



<svelte:head>

	<title>Mes besoins — Accessible</title>

</svelte:head>



<StepProgress current={1} total={2} />



<section class="card">

	<BiHeading fr="Quels outils vous intéressent ?" key="onboard.known.heading" />

	<p><BiText fr="Cochez une ou plusieurs options. Vous pourrez en ajouter d'autres plus tard." key="onboard.known.hint" /></p>



	<ul class="tool-list">

		{#each TOOLS_CATALOG as tool}

			<li>

				<label class="tool-option">

					<input

						type="checkbox"

						checked={selected.includes(tool.id)}

						onchange={() => toggleTool(tool.id)}

					/>

					<span>

						<strong>{configLabel(tool.label, TOOL_I18N_KEYS[tool.id].label, $settings.ui)}</strong>

						<small>{configLabel(tool.description, TOOL_I18N_KEYS[tool.id].desc, $settings.ui)}</small>

					</span>

				</label>

			</li>

		{/each}

	</ul>

</section>



<div class="onboarding-actions">

	<a class="btn btn-secondary" href="/onboarding"><BiText fr="Retour" key="onboard.common.back" inline /></a>

	<button type="button" class="btn btn-secondary" onclick={skipPath}>

		<BiText fr="Passer cette étape" key="onboard.known.skip" inline />

	</button>

	<button

		type="button"

		class="btn btn-primary"

		onclick={continuePath}

		disabled={selected.length === 0}

	>

		<BiText fr="Continuer" key="onboard.common.continue" inline />

	</button>

</div>



<style>

	.tool-list {

		list-style: none;

		padding: 0;

		margin: var(--space-lg) 0 0;

		display: flex;

		flex-direction: column;

		gap: var(--space-sm);

	}



	.tool-option {

		display: flex;

		align-items: flex-start;

		gap: var(--space-md);

		min-height: var(--btn-min-height);

		padding: var(--space-sm);

		border: 1px solid var(--color-border);

		border-radius: var(--radius);

		cursor: pointer;

	}



	.tool-option input {

		width: 1.25rem;

		height: 1.25rem;

		margin-top: 0.2rem;

		flex-shrink: 0;

	}



	.tool-option span {

		display: flex;

		flex-direction: column;

		gap: var(--space-xs);

	}



	.tool-option small {

		color: var(--color-text-muted);

	}



	.onboarding-actions {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-sm);

		margin-top: var(--space-lg);

	}

</style>

