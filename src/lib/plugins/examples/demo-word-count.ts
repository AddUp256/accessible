import type { AccessiblePlugin } from '../registry';

/** Exemple d’extension — ajoute une action tableau de bord vers l’écriture. */
export const demoWordCountPlugin: AccessiblePlugin = {
	id: 'demo-word-count',
	name: 'Compteur de mots (démo)',
	description: 'Extension exemple Phase 42 — raccourci vers l’éditeur pour compter des mots.',
	version: '1.0.0',
	register(ctx: import('../registry').PluginContext) {
		ctx.registerAction({
			id: 'plugin_demo_word_count',
			href: '/ecrire',
			label: 'Compteur mots (plugin démo)',
			description: 'Exemple d’extension enregistrée via le registre de plugins.',
			zone: 'ecrire'
		});
	}
};
