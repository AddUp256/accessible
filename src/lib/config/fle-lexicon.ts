/** R?le : Configuration d?clarative Fle Lexicon : donn?es m?tier sans effet de bord. */
/** Lexique FLE de base — termes courants en contexte scolaire/administratif. */
export interface FleLexiconEntry {
	term: string;
	simple: string;
	example?: string;
}

export const FLE_LEXICON: FleLexiconEntry[] = [
	{ term: 'consigne', simple: 'instruction', example: 'Lisez la consigne.' },
	{ term: 'évaluation', simple: 'contrôle', example: 'Une évaluation demain.' },
	{ term: 'devoirs', simple: 'travail à la maison' },
	{ term: 'emploi du temps', simple: 'horaire des cours' },
	{ term: 'justificatif', simple: 'papier qui prouve' },
	{ term: 'inscription', simple: 'enregistrement' },
	{ term: 'orientation', simple: 'choix de filière' },
	{ term: 'aménagement', simple: 'aide adaptée' },
	{ term: 'handicap', simple: 'difficulté durable' },
	{ term: 'troubles', simple: 'difficultés' },
	{ term: 'compétences', simple: 'capacités' },
	{ term: 'objectifs', simple: 'but à atteindre' },
	{ term: 'rédiger', simple: 'écrire' },
	{ term: 'argumenter', simple: 'expliquer pourquoi' },
	{ term: 'synthèse', simple: 'résumé' },
	{ term: 'bibliographie', simple: 'liste de livres' },
	{ term: 'annexe', simple: 'document en plus' },
	{ term: 'procédure', simple: 'étapes à suivre' },
	{ term: 'délai', simple: 'date limite' },
	{ term: 'convocation', simple: 'lettre pour un rendez-vous' }
];

export const FLE_LEXICON_BY_TERM = Object.fromEntries(
	FLE_LEXICON.map((entry) => [entry.term.toLowerCase(), entry])
) as Record<string, FleLexiconEntry>;
