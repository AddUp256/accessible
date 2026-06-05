/** Bibliothèques open source — crédits Paramètres → À propos (Phase 44). */
export interface OpenSourceCredit {
	name: string;
	license: string;
	licenseUrl: string;
	role: string;
}

export const OPEN_SOURCE_CREDITS: OpenSourceCredit[] = [
	{
		name: 'Svelte / SvelteKit',
		license: 'MIT',
		licenseUrl: 'https://opensource.org/licenses/MIT',
		role: 'Interface utilisateur'
	},
	{
		name: 'Vite',
		license: 'MIT',
		licenseUrl: 'https://opensource.org/licenses/MIT',
		role: 'Build frontend'
	},
	{
		name: 'Tauri 2',
		license: 'MIT / Apache 2.0',
		licenseUrl: 'https://github.com/tauri-apps/tauri',
		role: 'Application desktop'
	},
	{
		name: 'jsPDF',
		license: 'MIT',
		licenseUrl: 'https://opensource.org/licenses/MIT',
		role: 'Export PDF'
	},
	{
		name: '@fontsource/*',
		license: 'SIL OFL 1.1',
		licenseUrl: 'https://scripts.sil.org/OFL',
		role: 'Polices embarquées'
	}
];

export const APP_VERSION = '0.0.1';
