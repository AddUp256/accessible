/** R?le : Extension Registry : registre ou exemple de plugin int?gr?. */
export interface PluginAction {
	id: string;
	href: string;
	label: string;
	description: string;
	zone: 'lire' | 'ecrire' | 'organiser' | 'comprendre' | 'communiquer' | 'profil' | 'parametres';
}

export interface PluginContext {
	registerAction(action: PluginAction): void;
}

export interface AccessiblePlugin {
	id: string;
	name: string;
	description: string;
	version: string;
	register(ctx: PluginContext): void;
}

const actions: PluginAction[] = [];
const plugins: AccessiblePlugin[] = [];

export function registerPlugin(plugin: AccessiblePlugin): void {
	if (plugins.some((p) => p.id === plugin.id)) return;
	const ctx: PluginContext = {
		registerAction(action) {
			if (actions.some((a) => a.id === action.id)) return;
			actions.push(action);
		}
	};
	plugin.register(ctx);
	plugins.push(plugin);
}

export function initPlugins(): void {
	for (const plugin of plugins) {
		/* D?j? enregistr?. */
	}
}

export function getPluginActions(): PluginAction[] {
	return [...actions];
}

export function getRegisteredPlugins(): AccessiblePlugin[] {
	return [...plugins];
}
