/** R?le : Configuration d?clarative Open Source Credits : donn?es m?tier sans effet de bord. */
import packageInfo from '../../../package.json';

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

export const APP_VERSION = packageInfo.version;
export const APP_RELEASE_TAG = `v${APP_VERSION}`;
export const APP_RELEASE_URL = `https://github.com/AddUp256/accessible/releases/tag/${APP_RELEASE_TAG}`;

export const COMMERCIAL_USE_NOTICE =
	"Sauf autorisation écrite, préalable, expresse et spécifique d’Atelier Eden, toute reproduction, adaptation, diffusion, intégration, extraction, revente, mise à disposition ou exploitation du contenu éditorial, pédagogique, graphique, documentaire ou méthodologique d’Accessible à des fins commerciales, directes ou indirectes, est interdite. Toute utilisation non autorisée pourra donner lieu à une demande de retrait, de réparation du préjudice subi et, le cas échéant, à des poursuites judiciaires.";

export const EDITOR_CONTACT_NOTICE =
	"Éditeur et contact : Atelier Eden — contact@atelier-eden.pro. Adresse postale et représentant légal à compléter avant publication juridique.";

export const RGPD_NOTICE =
	"RGPD : Accessible fonctionne localement, sans compte utilisateur, sans télémétrie et sans serveur applicatif. Les profils, notes, exports et réglages restent sous le contrôle de l’utilisateur sur son appareil, sauf action volontaire d’export, d’import, de partage ou d’activation d’un service tiers.";
