/** R?le : Configuration d?clarative Tools Catalog : donn?es m?tier sans effet de bord. */
import type { ToolId } from '$lib/types/profile';

export interface ToolCatalogEntry {
	id: ToolId;
	label: string;
	description: string;
}

/** Outils proposés dans le parcours « Je connais déjà mes besoins ». */
export const TOOLS_CATALOG: ToolCatalogEntry[] = [
	{ id: 'read_adapted', label: 'Lire plus facilement', description: 'Adapter un texte à votre confort.' },
	{ id: 'listen_text', label: 'Écouter un texte', description: 'Lire un texte à voix haute.' },
	{ id: 'correct_text', label: 'Corriger un texte', description: 'Corriger l\'orthographe pas à pas.' },
	{ id: 'write_easier', label: 'Écrire plus facilement', description: 'Écrire avec moins d\'effort.' },
	{ id: 'organize_work', label: 'Organiser mon travail', description: 'Checklists, étapes, planning.' },
	{ id: 'reduce_distractions', label: 'Réduire les distractions', description: 'Interface plus calme.' },
	{ id: 'pictograms', label: 'Utiliser des pictogrammes', description: 'Images pour communiquer ou comprendre.' },
	{
		id: 'prepare_appointment',
		label: 'Préparer un rendez-vous',
		description: 'Synthèse à apporter à un professionnel.'
	},
	{ id: 'work_on_pdf', label: 'Travailler sur un PDF', description: 'Lire ou adapter un document PDF.' },
	{ id: 'subtitles', label: 'Utiliser des sous-titres', description: 'Vidéos avec sous-titres.' },
	{ id: 'reduce_typing', label: 'Réduire la frappe', description: 'Moins taper au clavier.' },
	{ id: 'adapt_interface', label: 'Adapter l\'interface', description: 'Thème, taille, confort visuel.' }
];

export const TOOLS_BY_ID = Object.fromEntries(TOOLS_CATALOG.map((t) => [t.id, t])) as Record<
	ToolId,
	ToolCatalogEntry
>;
