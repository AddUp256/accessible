/** R?le : Logique m?tier de organisation : fonctions pures ou r?gles locales testables hors interface. */
import type { MindMap, MindMapNode, OrganizerData } from '$lib/types/profile';
import { createId } from '$lib/modules/organizer/checklist';

export function createMindMapNode(label: string, parentId: string | null = null): MindMapNode {
	return {
		id: createId('mnode'),
		label: label.trim(),
		parentId
	};
}

export function createMindMap(title: string, nodes: MindMapNode[] = []): MindMap {
	const now = new Date().toISOString();
	const root =
		nodes.find((node) => node.parentId === null) ??
		createMindMapNode(title.trim() || 'Idée centrale', null);

	const normalizedNodes = nodes.length > 0 ? nodes : [root];

	return {
		id: createId('mmap'),
		title: title.trim() || 'Ma carte mentale',
		nodes: normalizedNodes,
		createdAt: now,
		updatedAt: now
	};
}

export function addMindMap(data: OrganizerData, map: MindMap): OrganizerData {
	return { ...data, mindMaps: [map, ...data.mindMaps] };
}

export function removeMindMap(data: OrganizerData, mapId: string): OrganizerData {
	return { ...data, mindMaps: data.mindMaps.filter((map) => map.id !== mapId) };
}

export function updateMindMap(
	data: OrganizerData,
	mapId: string,
	updater: (map: MindMap) => MindMap
): OrganizerData {
	return {
		...data,
		mindMaps: data.mindMaps.map((map) =>
			map.id === mapId ? { ...updater(map), updatedAt: new Date().toISOString() } : map
		)
	};
}

export function addMindMapNode(
	data: OrganizerData,
	mapId: string,
	label: string,
	parentId: string | null
): OrganizerData {
	return updateMindMap(data, mapId, (map) => ({
		...map,
		nodes: [...map.nodes, createMindMapNode(label, parentId)]
	}));
}

export function removeMindMapNode(data: OrganizerData, mapId: string, nodeId: string): OrganizerData {
	return updateMindMap(data, mapId, (map) => {
		const toRemove = new Set<string>([nodeId]);
		let changed = true;
		while (changed) {
			changed = false;
			for (const node of map.nodes) {
				if (node.parentId && toRemove.has(node.parentId) && !toRemove.has(node.id)) {
					toRemove.add(node.id);
					changed = true;
				}
			}
		}
		return {
			...map,
			nodes: map.nodes.filter((node) => !toRemove.has(node.id))
		};
	});
}

export interface MindMapTreeNode {
	node: MindMapNode;
	depth: number;
	children: MindMapTreeNode[];
}

export function buildMindMapTree(
	nodes: MindMapNode[],
	parentId: string | null = null,
	depth = 0
): MindMapTreeNode[] {
	return nodes
		.filter((node) => node.parentId === parentId)
		.map((node) => ({
			node,
			depth,
			children: buildMindMapTree(nodes, node.id, depth + 1)
		}));
}

export const MIND_MAP_TEMPLATES = [
	{
		id: 'course',
		title: 'Cours',
		root: 'Sujet du cours',
		branches: ['Définitions', 'Exemples', 'À retenir']
	},
	{
		id: 'project',
		title: 'Projet',
		root: 'Mon projet',
		branches: ['Objectif', 'Étapes', 'Ressources', 'Deadline']
	}
] as const;

export function createMindMapFromTemplate(
	templateId: (typeof MIND_MAP_TEMPLATES)[number]['id']
): MindMap | null {
	const template = MIND_MAP_TEMPLATES.find((item) => item.id === templateId);
	if (!template) return null;

	const root = createMindMapNode(template.root, null);
	const branchNodes = template.branches.map((label) => createMindMapNode(label, root.id));
	return createMindMap(template.title, [root, ...branchNodes]);
}
