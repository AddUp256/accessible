<script lang="ts">
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		addChecklistItem,
		checklistProgress,
		removeChecklist,
		removeChecklistItem,
		toggleChecklistItem
	} from '$lib/modules/organizer/checklist';
	import { profileStore, settings } from '$lib/stores/profile';
	import type { Checklist } from '$lib/types/profile';
	import { bilingualLabel, configLabel, confirmDynamicMessage, dynamicMessage } from '$lib/i18n';

	let { checklist }: { checklist: Checklist } = $props();

	let newItemLabel = $state('');

	const progress = $derived(checklistProgress(checklist));
	const deleteLabel = $derived(bilingualLabel('Supprimer', 'common.delete', $settings.ui));

	function toggleItem(itemId: string) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: toggleChecklistItem(profile.organizer, checklist.id, itemId)
		}));
	}

	function addItem() {
		if (!newItemLabel.trim()) return;
		profileStore.patch((profile) => ({
			...profile,
			organizer: addChecklistItem(profile.organizer, checklist.id, newItemLabel)
		}));
		newItemLabel = '';
	}

	function deleteItem(itemId: string) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: removeChecklistItem(profile.organizer, checklist.id, itemId)
		}));
	}

	function deleteChecklist() {
		if (
			!confirm(
				confirmDynamicMessage('dyn.organize.deleteChecklistConfirm', {
					title: checklist.title
				})
			)
		) {
			return;
		}
		profileStore.patch((profile) => ({
			...profile,
			organizer: removeChecklist(profile.organizer, checklist.id)
		}));
	}
</script>

<article class="checklist-card card" aria-labelledby="checklist-{checklist.id}">
	<header class="checklist-header">
		<div>
			<h3 id="checklist-{checklist.id}">{checklist.title}</h3>
			<p class="checklist-progress" aria-live="polite">
				{progress.done} / {progress.total} étape{progress.total === 1 ? '' : 's'} faite{progress.done === 1 ? '' : 's'}
			</p>
		</div>
		<button type="button" class="btn btn-secondary" onclick={deleteChecklist}>
			<BiText fr="Supprimer" key="mod.organize.checklist.delete" inline />
		</button>
	</header>

	<ul class="checklist-items">
		{#each checklist.items as item (item.id)}
			<li class:checklist-item--done={item.done}>
				<label class="checklist-item">
					<input
						type="checkbox"
						checked={item.done}
						onchange={() => toggleItem(item.id)}
					/>
					<span>{item.label}</span>
				</label>
				<button
					type="button"
					class="btn btn-secondary checklist-remove"
					aria-label="{deleteLabel} l'étape {item.label}"
					onclick={() => deleteItem(item.id)}
				>
					×
				</button>
			</li>
		{/each}
	</ul>

	<div class="checklist-add">
		<label class="visually-hidden" for="new-item-{checklist.id}">Nouvelle étape</label>
		<input
			id="new-item-{checklist.id}"
			type="text"
			bind:value={newItemLabel}
			placeholder={configLabel('Ajouter une étape…', 'cfg.ph.checklistStep', $settings.ui)}
			onkeydown={(e) => e.key === 'Enter' && addItem()}
		/>
		<button type="button" class="btn btn-primary" onclick={addItem} disabled={!newItemLabel.trim()}>
			Ajouter
		</button>
	</div>
</article>

<style>
	.checklist-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.checklist-header h3 {
		margin: 0;
	}

	.checklist-progress {
		margin: var(--space-xs) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.checklist-items {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.checklist-items li {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.checklist-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		flex: 1;
		min-height: var(--btn-min-height);
		cursor: pointer;
	}

	.checklist-item--done span {
		text-decoration: line-through;
		color: var(--color-text-muted);
	}

	.checklist-remove {
		min-width: var(--btn-min-height);
		padding: 0 var(--space-sm);
	}

	.checklist-add {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-md);
	}

	.checklist-add input {
		flex: 1;
		min-width: 12rem;
		min-height: var(--btn-min-height);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
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
