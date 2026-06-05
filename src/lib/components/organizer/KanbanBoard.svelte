<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { KANBAN_COLUMNS } from '$lib/config/kanban-columns';
	import { KANBAN_I18N_KEYS } from '$lib/i18n/ui-modules';
	import {
		addKanbanTask,
		createKanbanTask,
		moveKanbanTask,
		removeKanbanTask,
		tasksForColumn
	} from '$lib/modules/organizer/kanban';
	import { profileStore, settings } from '$lib/stores/profile';
	import type { KanbanColumnId } from '$lib/types/profile';
	import { bilingualLabel, configLabel, dynamicMessage } from '$lib/i18n';

	let newTaskTitle = $state('');
	let formStatus = $state('');

	const tasks = $derived($profileStore.organizer.kanbanTasks);

	function addTask() {
		if (!newTaskTitle.trim()) {
			formStatus = dynamicMessage('dyn.kanban.needTitle', $settings.ui);
			return;
		}

		profileStore.patch((profile) => ({
			...profile,
			organizer: addKanbanTask(profile.organizer, createKanbanTask(newTaskTitle))
		}));

		newTaskTitle = '';
		formStatus = dynamicMessage('dyn.kanban.taskAdded', $settings.ui, {
			column: bilingualLabel('À faire', KANBAN_I18N_KEYS.todo.label, $settings.ui)
		});
	}

	function changeColumn(taskId: string, column: KanbanColumnId) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: moveKanbanTask(profile.organizer, taskId, column)
		}));
	}

	function deleteTask(taskId: string) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: removeKanbanTask(profile.organizer, taskId)
		}));
	}
</script>

<section class="kanban-board card" aria-labelledby="kanban-heading">
	<BiHeading fr="Tableau Kanban" key="mod.organize.kanban.title" level={3} id="kanban-heading" />
	<p class="kanban-hint">
		<BiText
			fr="Trois colonnes : à faire, en cours, terminé. Déplacez une tâche avec le menu."
			key="mod.organize.kanban.hint"
		/>
	</p>

	<div class="kanban-add">
		<label for="kanban-new-task">
			<BiText fr="Nouvelle tâche" key="mod.organize.kanban.newTask" inline />
		</label>
		<div class="kanban-add-row">
			<input
				id="kanban-new-task"
				type="text"
				bind:value={newTaskTitle}
				placeholder={configLabel('Ex. : Relire mon devoir', 'cfg.ph.kanbanTask', $settings.ui)}
				onkeydown={(e) => e.key === 'Enter' && addTask()}
			/>
			<button type="button" class="btn btn-primary" onclick={addTask}>
				<BiText fr="Ajouter" key="mod.organize.kanban.add" inline />
			</button>
		</div>
		{#if formStatus}
			<p class="kanban-status" role="status">{formStatus}</p>
		{/if}
	</div>

	<div class="kanban-columns">
		{#each KANBAN_COLUMNS as column}
			{@const columnTasks = tasksForColumn(tasks, column.id)}
			<section class="kanban-column" aria-labelledby="kanban-col-{column.id}">
				<h4 id="kanban-col-{column.id}">
					{bilingualLabel(column.label, KANBAN_I18N_KEYS[column.id].label, $settings.ui)}
					<span class="kanban-count">({columnTasks.length})</span>
				</h4>
				<p class="kanban-column-hint">
					{bilingualLabel(column.hint, KANBAN_I18N_KEYS[column.id].hint, $settings.ui)}
				</p>

				<ul class="kanban-task-list">
					{#each columnTasks as task (task.id)}
						<li class="kanban-task card">
							<p class="kanban-task-title">{task.title}</p>
							<label class="kanban-move-label">
								<BiText fr="Déplacer vers" key="mod.organize.kanban.moveTo" inline />
								<select
									value={task.column}
									onchange={(e) =>
										changeColumn(task.id, e.currentTarget.value as KanbanColumnId)}
								>
									{#each KANBAN_COLUMNS as target}
										<option value={target.id}>
											{bilingualLabel(
												target.label,
												KANBAN_I18N_KEYS[target.id].label,
												$settings.ui
											)}
										</option>
									{/each}
								</select>
							</label>
							<button
								type="button"
								class="btn btn-secondary kanban-delete"
								onclick={() => deleteTask(task.id)}
							>
								<BiText fr="Supprimer" key="common.delete" inline />
							</button>
						</li>
					{:else}
						<li class="kanban-empty">{dynamicMessage('dyn.kanban.noTasks', $settings.ui)}</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</section>

<style>
	.kanban-hint {
		margin: 0 0 var(--space-md);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.kanban-add {
		margin-bottom: var(--space-lg);
	}

	.kanban-add label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	.kanban-add-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.kanban-add-row input {
		flex: 1;
		min-width: 12rem;
		min-height: var(--btn-min-height);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
	}

	.kanban-status {
		margin: var(--space-sm) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.kanban-columns {
		display: grid;
		gap: var(--space-md);
	}

	@media (min-width: 56rem) {
		.kanban-columns {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.kanban-column h4 {
		margin: 0 0 var(--space-xs);
	}

	.kanban-count {
		font-weight: 400;
		color: var(--color-text-muted);
	}

	.kanban-column-hint {
		margin: 0 0 var(--space-md);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.kanban-task-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-sm);
	}

	.kanban-task {
		padding: var(--space-md);
	}

	.kanban-task-title {
		margin: 0 0 var(--space-sm);
		font-weight: 600;
	}

	.kanban-move-label {
		display: grid;
		gap: var(--space-xs);
		font-size: var(--font-size-sm);
		margin-bottom: var(--space-sm);
	}

	.kanban-move-label select {
		min-height: var(--btn-min-height);
		font: inherit;
	}

	.kanban-delete {
		width: 100%;
	}

	.kanban-empty {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		padding: var(--space-sm) 0;
	}
</style>
