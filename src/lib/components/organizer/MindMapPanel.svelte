<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		addMindMap,
		addMindMapNode,
		buildMindMapTree,
		createMindMap,
		createMindMapFromTemplate,
		MIND_MAP_TEMPLATES,
		removeMindMap,
		removeMindMapNode,
		type MindMapTreeNode
	} from '$lib/modules/organizer/mind-map';
	import {
		downloadMindMapDocx,
		downloadMindMapOdt,
		downloadMindMapOutline
	} from '$lib/services/export';
	import { configLabel, dynamicMessage } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';
	import type { MindMap, MindMapNode } from '$lib/types/profile';

	let newTitle = $state('');
	let selectedMapId = $state<string | null>(null);
	let branchLabel = $state('');
	let branchParentId = $state<string | null>(null);
	let status = $state('');

	const maps = $derived($profileStore.organizer.mindMaps);
	const selectedMap = $derived(
		selectedMapId ? maps.find((map) => map.id === selectedMapId) ?? null : null
	);

	const templateKeys = {
		course: 'cfg.mindmap.template.course',
		project: 'cfg.mindmap.template.project'
	} as const;

	function flattenTree(branches: MindMapTreeNode[]): { node: MindMapNode; depth: number }[] {
		const rows: { node: MindMapNode; depth: number }[] = [];
		function walk(items: MindMapTreeNode[]) {
			for (const item of items) {
				rows.push({ node: item.node, depth: item.depth });
				walk(item.children);
			}
		}
		walk(branches);
		return rows;
	}

	const flatNodes = $derived(selectedMap ? flattenTree(buildMindMapTree(selectedMap.nodes)) : []);

	function createEmpty() {
		if (!newTitle.trim()) return;
		const map = createMindMap(newTitle);
		profileStore.patch((profile) => ({
			...profile,
			organizer: addMindMap(profile.organizer, map)
		}));
		selectedMapId = map.id;
		newTitle = '';
		status = dynamicMessage('dyn.mindmap.created', $settings.ui);
	}

	function createFromTemplate(templateId: (typeof MIND_MAP_TEMPLATES)[number]['id']) {
		const map = createMindMapFromTemplate(templateId);
		if (!map) return;
		const title = configLabel(
			MIND_MAP_TEMPLATES.find((item) => item.id === templateId)?.title ?? '',
			templateKeys[templateId],
			$settings.ui
		);
		profileStore.patch((profile) => ({
			...profile,
			organizer: addMindMap(profile.organizer, map)
		}));
		selectedMapId = map.id;
		status = dynamicMessage('dyn.mindmap.createdNamed', $settings.ui, { name: title });
	}

	function deleteMap(mapId: string) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: removeMindMap(profile.organizer, mapId)
		}));
		if (selectedMapId === mapId) selectedMapId = null;
		status = dynamicMessage('dyn.mindmap.deleted', $settings.ui);
	}

	function addBranch() {
		if (!selectedMapId || !branchLabel.trim()) {
			status = dynamicMessage('dyn.mindmap.needLabel', $settings.ui);
			return;
		}
		const mapId = selectedMapId;
		const parentId =
			branchParentId ?? selectedMap?.nodes.find((node) => node.parentId === null)?.id ?? null;
		profileStore.patch((profile) => ({
			...profile,
			organizer: addMindMapNode(profile.organizer, mapId, branchLabel, parentId)
		}));
		branchLabel = '';
		status = dynamicMessage('dyn.mindmap.branchAdded', $settings.ui);
	}

	function deleteNode(mapId: string, nodeId: string) {
		profileStore.patch((profile) => ({
			...profile,
			organizer: removeMindMapNode(profile.organizer, mapId, nodeId)
		}));
	}

	function exportMap(map: MindMap, format: 'txt' | 'odt' | 'docx') {
		if (map.nodes.length === 0) {
			status = dynamicMessage('dyn.mindmap.exportEmpty', $settings.ui);
			return;
		}
		if (format === 'txt') downloadMindMapOutline(map);
		if (format === 'odt') downloadMindMapOdt(map);
		if (format === 'docx') downloadMindMapDocx(map);
		status = dynamicMessage('dyn.mindmap.exported', $settings.ui);
	}
</script>

<section class="mind-maps" aria-labelledby="mindmaps-heading">
	<BiHeading fr="Cartes mentales" key="mod.organize.mindmaps.title" level={3} id="mindmaps-heading" />
	<p class="mindmaps-hint">
		<BiText
			fr="Organisez vos idées en branches. Exportez en texte, ODT ou DOCX."
			key="mod.organize.mindmaps.hint"
		/>
	</p>

	<div class="mindmaps-templates">
		{#each MIND_MAP_TEMPLATES as template}
			<button type="button" class="btn btn-secondary" onclick={() => createFromTemplate(template.id)}>
				{configLabel(template.title, templateKeys[template.id], $settings.ui)}
			</button>
		{/each}
	</div>

	<label for="mindmap-title">
		<BiText fr="Nouvelle carte" key="mod.organize.mindmaps.newLabel" inline />
	</label>
	<div class="mindmaps-create">
		<input
			id="mindmap-title"
			type="text"
			bind:value={newTitle}
			placeholder={configLabel('Ex. : Révision histoire', 'cfg.ph.mindmapTitle', $settings.ui)}
		/>
		<button type="button" class="btn btn-primary" onclick={createEmpty}>
			<BiText fr="Créer" key="mod.organize.mindmaps.create" inline />
		</button>
	</div>

	{#if status}
		<p class="mindmaps-status" role="status">{status}</p>
	{/if}

	{#if maps.length === 0}
		<p class="mindmaps-empty">
			<BiText fr="Aucune carte mentale. Choisissez un modèle ou créez la vôtre." key="mod.organize.mindmaps.empty" />
		</p>
	{:else}
		<div class="mindmaps-list">
			{#each maps as map (map.id)}
				<div class="mindmaps-item">
					<button
						type="button"
						class="btn"
						class:btn-primary={selectedMapId === map.id}
						class:btn-secondary={selectedMapId !== map.id}
						onclick={() => (selectedMapId = map.id)}
					>
						{map.title}
					</button>
					<button type="button" class="btn btn-secondary" onclick={() => deleteMap(map.id)}>
						<BiText fr="Supprimer" key="mod.organize.mindmaps.delete" inline />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#if selectedMap}
		<section class="card mindmap-editor" aria-labelledby="mindmap-editor-heading">
			<h4 id="mindmap-editor-heading">{selectedMap.title}</h4>

			<ul class="mindmap-tree" role="tree" aria-label={selectedMap.title}>
				{#each flatNodes as row (row.node.id)}
					<li
						role="treeitem"
						aria-level={row.depth + 1}
						aria-selected="false"
						style={`--depth: ${row.depth}`}
					>
						<div class="mindmap-node">
							<span>{row.node.label}</span>
							{#if row.node.parentId !== null}
								<button
									type="button"
									class="btn btn-secondary node-delete"
									onclick={() => deleteNode(selectedMap.id, row.node.id)}
								>
									×
								</button>
							{/if}
							<button
								type="button"
								class="btn btn-secondary node-add-child"
								onclick={() => (branchParentId = row.node.id)}
							>
								<BiText fr="+ branche" key="mod.organize.mindmaps.addBranch" inline />
							</button>
						</div>
					</li>
				{/each}
			</ul>

			<label for="branch-label">
				<BiText fr="Ajouter une branche" key="mod.organize.mindmaps.branchLabel" inline />
			</label>
			<div class="mindmaps-create">
				<input
					id="branch-label"
					type="text"
					bind:value={branchLabel}
					placeholder={configLabel('Ex. : Chapitre 2', 'cfg.ph.mindmapBranch', $settings.ui)}
				/>
				<button type="button" class="btn btn-primary" onclick={addBranch}>
					<BiText fr="Ajouter" key="mod.organize.mindmaps.add" inline />
				</button>
			</div>

			<div class="mindmaps-export">
				<button type="button" class="btn btn-secondary" onclick={() => exportMap(selectedMap, 'txt')}>
					<BiText fr="Exporter TXT" key="mod.organize.mindmaps.exportTxt" inline />
				</button>
				<button type="button" class="btn btn-secondary" onclick={() => exportMap(selectedMap, 'odt')}>
					<BiText fr="Exporter ODT" key="mod.organize.mindmaps.exportOdt" inline />
				</button>
				<button type="button" class="btn btn-secondary" onclick={() => exportMap(selectedMap, 'docx')}>
					<BiText fr="Exporter DOCX" key="mod.organize.mindmaps.exportDocx" inline />
				</button>
			</div>
		</section>
	{/if}
</section>

<style>
	.mindmaps-hint,
	.mindmaps-empty,
	.mindmaps-status {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.mindmaps-templates,
	.mindmaps-list,
	.mindmaps-create,
	.mindmaps-export {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin: var(--space-md) 0;
	}

	.mindmaps-create input,
	#mindmap-title,
	#branch-label {
		flex: 1 1 14rem;
		min-height: var(--btn-min-height);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
	}

	.mindmaps-item {
		display: flex;
		gap: var(--space-xs);
	}

	.mindmap-tree {
		list-style: none;
		padding: 0;
		margin: var(--space-md) 0;
	}

	.mindmap-tree li {
		margin-left: calc(var(--depth, 0) * 1.5rem);
		margin-bottom: var(--space-sm);
	}

	.mindmap-node {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		border-left: 4px solid var(--color-accent, #2f6fed);
	}

	.node-delete,
	.node-add-child {
		min-height: var(--btn-min-height);
	}
</style>
