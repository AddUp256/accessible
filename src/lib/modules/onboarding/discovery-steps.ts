/** Étapes du parcours « Je ne sais pas ». */
export const DISCOVERY_STEPS = [
	{ id: 'comfort', label: 'Confort d\'interface', implemented: true },
	{ id: 'reading', label: 'Lecture', implemented: true, href: '/lire' },
	{ id: 'writing', label: 'Écriture', implemented: true, href: '/ecrire' },
	{ id: 'organization', label: 'Organisation', implemented: true, href: '/organiser' },
	{ id: 'media', label: 'Audio / vidéo', implemented: true, href: '/lire' },
	{ id: 'sensory', label: 'Sensoriel / attention', implemented: true },
	{ id: 'motor', label: 'Accès moteur', implemented: true, href: '/parametres' },
	{ id: 'communication', label: 'Communication', implemented: true, href: '/communiquer' },
	{ id: 'summary', label: 'Synthèse', implemented: true }
] as const;

export type DiscoveryStepId = (typeof DISCOVERY_STEPS)[number]['id'];
