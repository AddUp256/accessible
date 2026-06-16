/** R?le : Configuration SvelteKit statique, avec base GitHub Pages et mode runes. */
import adapter from '@sveltejs/adapter-static';

const githubPagesBase = process.env.GITHUB_PAGES === 'true' ? '/accessible' : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force le mode runes sur le projet, sauf pour les biblioth?ques. ? retirer lorsque Svelte 6 le rendra inutile.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		paths: {
			base: githubPagesBase
		}
	}
};

export default config;
