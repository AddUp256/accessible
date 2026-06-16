<script lang="ts">
	// R?le : Composant Svelte de organisation : encapsule l?affichage et les interactions r?utilisables.

	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		addVisualRoutine,
		createVisualRoutine,
		removeVisualRoutine,
		ROUTINE_TEMPLATES,
		toggleRoutineStep
	} from '$lib/modules/organizer/visual-routine';
	import { configLabel, dynamicMessage, notifyUserI18n, ROUTINE_I18N_KEYS } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';

	let newTitle = $state('');
	let status = $state('');

	const routines = $derived($profileStore.organizer.visualRoutines);

	function createFromTemplate(templateId: string) {
		const template = ROUTINE_TEMPLATES.find((item) => item.id === templateId);
		if (!template) return;
		const title = configLabel(template.title, ROUTINE_I18N_KEYS[template.id], $settings.ui);

		profileStore.patch((profile) => ({
			...profile,
			organizer: addVisualRoutine(
				profile.organizer,
				createVisualRoutine(template.title, [...template.steps])
			)
		}));
		status = dynamicMessage('dyn.routines.createdNamed', $settings.ui, { name: title });
		notifyUserI18n('dyn.routines.createdNamed', 'minimal', { name: title });
	}

	function createEmpty() {
		if (!newTitle.trim()) return;
		profileStore.patch((profile) => ({
			...profile,
			organizer: addVisualRoutine(
				profile.organizer,
				createVisualRoutine(newTitle, ['Première étape', 'Deuxième étape'])
			)
		}));
		newTitle = '';
		status = dynamicMessage('dyn.routines.created', $settings.ui);
	}

	function toggleStep(routineId: string, stepId: string) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: toggleRoutineStep(profile.organizer, routineId, stepId)
		}));
	}

	function deleteRoutine(routineId: string) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: removeVisualRoutine(profile.organizer, routineId)
		}));
		status = dynamicMessage('dyn.routines.deleted', $settings.ui);
	}
</script>

<section class="visual-routines" aria-labelledby="routines-heading">
	<BiHeading fr="Routines visuelles" key="mod.organize.routines.title" level={3} id="routines-heading" />

	<p class="routines-hint">
		<BiText
			fr="Suivez vos habitudes étape par étape avec des pictogrammes. Cochez chaque étape terminée."
			key="mod.organize.routines.hint"
		/>
	</p>

	<div class="routines-templates">
		{#each ROUTINE_TEMPLATES as template}
			<button type="button" class="btn btn-secondary" onclick={() => createFromTemplate(template.id)}>
				{configLabel(template.title, ROUTINE_I18N_KEYS[template.id], $settings.ui)}
			</button>
		{/each}
	</div>

	<div class="routines-create">
		<label for="routine-title">
			<BiText fr="Nouvelle routine" key="mod.organize.routines.newLabel" inline />
		</label>
		<div class="routines-create-row">
			<input id="routine-title" type="text" bind:value={newTitle} placeholder={configLabel('Ex. : Avant de sortir', 'cfg.ph.routineTitle', $settings.ui)} />
			<button type="button" class="btn btn-primary" onclick={createEmpty}>
				<BiText fr="Créer" key="mod.organize.routines.create" inline />
			</button>
		</div>
	</div>

	{#if status}
		<p class="routines-status" role="status">{status}</p>
	{/if}

	{#if routines.length === 0}
		<p class="card routines-empty">
			<BiText fr="Aucune routine. Choisissez un modèle ou créez la vôtre." key="mod.organize.routines.empty" />
		</p>
	{:else}
		<div class="routines-list">
			{#each routines as routine (routine.id)}
				<article class="card routine-card">
					<header class="routine-header">
						<h4>{routine.title}</h4>
						<button
							type="button"
							class="btn btn-secondary"
							data-confirm-key="dyn.routines.deleteConfirm"
							onclick={() => deleteRoutine(routine.id)}
						>
							<BiText fr="Supprimer" key="mod.organize.routines.delete" inline />
						</button>
					</header>
					<ol class="routine-steps">
						{#each routine.steps as step (step.id)}
							<li class="routine-step" class:routine-step--done={step.done}>
								<button
									type="button"
									class="routine-step-btn"
									aria-pressed={step.done}
									onclick={() => toggleStep(routine.id, step.id)}
								>
									<span class="routine-icon" aria-hidden="true">{step.icon}</span>
									<span>{step.label}</span>
								</button>
							</li>
						{/each}
					</ol>
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
	.routines-hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.routines-templates,
	.routines-create-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin: var(--space-md) 0;
	}

	.routines-create label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	.routines-create-row input {
		flex: 1;
		min-width: 12rem;
		min-height: var(--btn-min-height);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
	}

	.routines-status,
	.routines-empty {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.routines-list {
		display: grid;
		gap: var(--space-lg);
		margin-top: var(--space-lg);
	}

	.routine-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.routine-header h4 {
		margin: 0;
	}

	.routine-steps {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-sm);
	}

	.routine-step-btn {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		width: 100%;
		min-height: var(--btn-min-height-lg);
		padding: var(--space-sm) var(--space-md);
		border: 2px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
		font: inherit;
		font-size: var(--font-size-lg);
		font-weight: 600;
		cursor: pointer;
		text-align: left;
	}

	.routine-step--done .routine-step-btn {
		background: rgb(45 90 61 / 0.12);
		border-color: var(--color-accent);
		text-decoration: line-through;
		opacity: 0.85;
	}

	.routine-icon {
		font-size: 1.5rem;
		min-width: 2rem;
		text-align: center;
	}
</style>
