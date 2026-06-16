/** R?le : Extension Index : registre ou exemple de plugin int?gr?. */
import { registerPlugin } from './registry';
import { demoWordCountPlugin } from './examples/demo-word-count';

let initialized = false;

/** Charge les plugins intégrés (Phase 42). */
export function bootstrapPlugins(): void {
	if (initialized) return;
	registerPlugin(demoWordCountPlugin);
	initialized = true;
}

export { getPluginActions, getRegisteredPlugins } from './registry';
export type { AccessiblePlugin, PluginAction } from './registry';
