/** R?le : Configuration Vite qui branche SvelteKit au serveur de d?veloppement et au build. */
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});
