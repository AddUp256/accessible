<script lang="ts">

	import ChecklistCard from '$lib/components/organizer/ChecklistCard.svelte';
	import FocusTimer from '$lib/components/organizer/FocusTimer.svelte';
	import KanbanBoard from '$lib/components/organizer/KanbanBoard.svelte';
	import MindMapPanel from '$lib/components/organizer/MindMapPanel.svelte';
	import VisualRoutinesPanel from '$lib/components/organizer/VisualRoutinesPanel.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { CHECKLIST_TEMPLATES } from '$lib/config/checklist-templates';

	import { addChecklist, createChecklist } from '$lib/modules/organizer/checklist';

	import { configLabel, dynamicMessage, CHECKLIST_I18N_KEYS } from '$lib/i18n';

	import { profileStore, settings } from '$lib/stores/profile';



	type OrganiserTab = 'kanban' | 'checklists' | 'routines' | 'mindmaps';

	const organiserTabs: OrganiserTab[] = ['kanban', 'checklists', 'routines', 'mindmaps'];

	const tabButtonIds: Record<OrganiserTab, string> = {
		kanban: 'organiser-tab-kanban',
		checklists: 'organiser-tab-checklists',
		routines: 'organiser-tab-routines',
		mindmaps: 'organiser-tab-mindmaps'
	};

	const tabPanelIds: Record<OrganiserTab, string> = {
		kanban: 'organiser-panel-kanban',
		checklists: 'organiser-panel-checklists',
		routines: 'organiser-panel-routines',
		mindmaps: 'organiser-panel-mindmaps'
	};

	let activeTab = $state<OrganiserTab>('kanban');

	let newTitle = $state('');

	let status = $state('');



	function createFromTemplate(templateId: string) {

		const template = CHECKLIST_TEMPLATES.find((t) => t.id === templateId);

		if (!template) return;



		const title = configLabel(template.title, CHECKLIST_I18N_KEYS[template.id], $settings.ui);

		profileStore.patch((profile) => ({

			...profile,

			organizer: addChecklist(profile.organizer, createChecklist(template.title, template.items))

		}));

		status = dynamicMessage('dyn.organize.listCreatedNamed', $settings.ui, { name: title });

		activeTab = 'checklists';

	}



	function createEmpty() {

		if (!newTitle.trim()) return;

		profileStore.patch((profile) => ({

			...profile,

			organizer: addChecklist(profile.organizer, createChecklist(newTitle))

		}));

		newTitle = '';

		status = dynamicMessage('dyn.organize.listCreated', $settings.ui);

		activeTab = 'checklists';

	}

	function focusTab(tab: OrganiserTab) {
		const button = document.getElementById(tabButtonIds[tab]);
		if (button instanceof HTMLButtonElement) button.focus();
	}

	function selectTab(tab: OrganiserTab, focus = false) {
		activeTab = tab;
		if (focus) queueMicrotask(() => focusTab(tab));
	}

	function handleTabKey(event: KeyboardEvent) {
		if (!(event.target instanceof HTMLButtonElement)) return;

		const currentIndex = organiserTabs.indexOf(activeTab);
		const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
		let nextIndex = fallbackIndex;

		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			nextIndex = (fallbackIndex + 1) % organiserTabs.length;
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			nextIndex = (fallbackIndex - 1 + organiserTabs.length) % organiserTabs.length;
		} else if (event.key === 'Home') {
			nextIndex = 0;
		} else if (event.key === 'End') {
			nextIndex = organiserTabs.length - 1;
		} else {
			return;
		}

		event.preventDefault();
		selectTab(organiserTabs[nextIndex], true);
	}

</script>



<svelte:head>

	<title>Organiser — Accessible</title>

</svelte:head>



<BiHeading fr="Organiser mon travail" key="page.organize.title" />
<p>
	<BiText fr="Découpez votre travail en petites étapes. Utilisez le minuteur, le Kanban ou les checklists. Tout est enregistré sur cet appareil." key="page.organize.intro" />
</p>



<FocusTimer />



<div class="organiser-tabs" role="tablist" aria-label="Modes d'organisation">

	<button

		id={tabButtonIds.kanban}

		type="button"

		role="tab"

		class="btn"

		class:btn-primary={activeTab === 'kanban'}

		class:btn-secondary={activeTab !== 'kanban'}

		aria-selected={activeTab === 'kanban'}

		aria-controls={tabPanelIds.kanban}

		tabindex={activeTab === 'kanban' ? 0 : -1}

		onclick={() => selectTab('kanban')}

		onkeydown={handleTabKey}

	>
		<BiText fr="Kanban" key="mod.organize.tab.kanban" inline />
	</button>

	<button

		id={tabButtonIds.checklists}

		type="button"

		role="tab"

		class="btn"

		class:btn-primary={activeTab === 'checklists'}

		class:btn-secondary={activeTab !== 'checklists'}

		aria-selected={activeTab === 'checklists'}

		aria-controls={tabPanelIds.checklists}

		tabindex={activeTab === 'checklists' ? 0 : -1}

		onclick={() => selectTab('checklists')}

		onkeydown={handleTabKey}

	>
		<BiText fr="Checklists" key="mod.organize.tab.checklists" inline />
	</button>

	<button
		id={tabButtonIds.routines}
		type="button"
		role="tab"
		class="btn"
		class:btn-primary={activeTab === 'routines'}
		class:btn-secondary={activeTab !== 'routines'}
		aria-selected={activeTab === 'routines'}
		aria-controls={tabPanelIds.routines}
		tabindex={activeTab === 'routines' ? 0 : -1}
		onclick={() => selectTab('routines')}
		onkeydown={handleTabKey}
	>
		<BiText fr="Routines visuelles" key="mod.organize.tab.routines" inline />
	</button>
	<button
		id={tabButtonIds.mindmaps}
		type="button"
		role="tab"
		class="btn"
		class:btn-primary={activeTab === 'mindmaps'}
		class:btn-secondary={activeTab !== 'mindmaps'}
		aria-selected={activeTab === 'mindmaps'}
		aria-controls={tabPanelIds.mindmaps}
		tabindex={activeTab === 'mindmaps' ? 0 : -1}
		onclick={() => selectTab('mindmaps')}
		onkeydown={handleTabKey}
	>
		<BiText fr="Cartes mentales" key="mod.organize.tab.mindmaps" inline />
	</button>

</div>



{#if activeTab === 'kanban'}

	<div
		id={tabPanelIds.kanban}
		role="tabpanel"
		aria-labelledby={tabButtonIds.kanban}
		tabindex="0"
	>
		<KanbanBoard />
	</div>

{:else if activeTab === 'routines'}

	<div
		id={tabPanelIds.routines}
		role="tabpanel"
		aria-labelledby={tabButtonIds.routines}
		tabindex="0"
	>
		<VisualRoutinesPanel />
	</div>

{:else if activeTab === 'mindmaps'}

	<div
		id={tabPanelIds.mindmaps}
		role="tabpanel"
		aria-labelledby={tabButtonIds.mindmaps}
		tabindex="0"
	>
		<MindMapPanel />
	</div>

{:else}

	<div
		id={tabPanelIds.checklists}
		role="tabpanel"
		aria-labelledby={tabButtonIds.checklists}
		tabindex="0"
	>
	<section class="card organiser-create" aria-labelledby="create-heading">
		<BiHeading fr="Nouvelle liste" key="mod.organize.newList" level={3} id="create-heading" />

		<div class="organiser-new">
			<label for="checklist-title">
				<BiText fr="Titre de la liste" key="mod.organize.listTitle" inline />
			</label>

			<input

				id="checklist-title"

				type="text"

				bind:value={newTitle}

				placeholder={configLabel('Ex. : Préparer mon exposé', 'cfg.ph.organizeList', $settings.ui)}

				onkeydown={(e) => e.key === 'Enter' && createEmpty()}

			/>

			<button type="button" class="btn btn-primary" onclick={createEmpty} disabled={!newTitle.trim()}>
				<BiText fr="Créer la liste" key="mod.organize.createList" inline />
			</button>
		</div>

		<div class="organiser-templates">
			<p class="organiser-hint">
				<BiText fr="Modèles de listes" key="mod.organize.templates" inline />
			</p>

			<div class="organiser-template-actions">

				{#each CHECKLIST_TEMPLATES as template}

					<button

						type="button"

						class="btn btn-secondary"

						onclick={() => createFromTemplate(template.id)}

					>

						{configLabel(template.title, CHECKLIST_I18N_KEYS[template.id], $settings.ui)}

					</button>

				{/each}

			</div>

		</div>

	</section>



	{#if status}

		<p class="organiser-status" role="status">{status}</p>

	{/if}



	{#if $profileStore.organizer.checklists.length === 0}

		<p class="organiser-empty card">Aucune liste pour l'instant. Créez-en une ci-dessus.</p>

	{:else}

		<div class="organiser-lists">

			{#each $profileStore.organizer.checklists as checklist (checklist.id)}

				<ChecklistCard {checklist} />

			{/each}

		</div>

	{/if}

	</div>

{/if}



<p class="organiser-note">
	<a href="/notes">Prendre des notes</a>
</p>



<style>

	.organiser-tabs {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-sm);

		margin: var(--space-lg) 0;

	}



	.organiser-create label {

		display: block;

		font-weight: 600;

		margin-bottom: var(--space-xs);

	}



	.organiser-new {

		display: grid;

		gap: var(--space-sm);

		margin-bottom: var(--space-lg);

	}



	.organiser-new input {

		min-height: var(--btn-min-height);

		padding: var(--space-sm) var(--space-md);

		border: 1px solid var(--color-border);

		border-radius: var(--radius);

		font: inherit;

	}



	.organiser-hint {

		margin: 0 0 var(--space-sm);

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.organiser-template-actions {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-sm);

	}



	.organiser-status {

		margin: var(--space-md) 0;

		padding: var(--space-sm) var(--space-md);

		background: var(--color-bg-elevated);

		border-radius: var(--radius);

	}



	.organiser-empty {

		color: var(--color-text-muted);

	}



	.organiser-lists {

		display: grid;

		gap: var(--space-lg);

		margin-top: var(--space-lg);

	}



	.organiser-note {

		margin-top: var(--space-xl);

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}

</style>

