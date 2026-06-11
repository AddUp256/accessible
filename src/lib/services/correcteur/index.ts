import { browser } from '$app/environment';

import { isTauriRuntime } from '$lib/services/storage/tauri';

import {
	tauriGrammarCheckText,
	tauriIsGrammalecteAvailable,
	tauriIsHunspellAvailable,
	tauriSpellcheckText
} from './tauri';

import { DYNAMIC_FR } from '$lib/i18n/ui-dynamic';

import type { CorrecteurOptions, CorrecteurResult, CorrecteurService, SpellingIssue } from './types';

const WEB_STUB_REASON = DYNAMIC_FR['dyn.service.correcteurWebStub'];
const HUNSPELL_INSTALL_REASON = DYNAMIC_FR['dyn.service.hunspellMissing'];
const GRAMMALECTE_INSTALL_REASON = DYNAMIC_FR['dyn.service.grammalecteMissing'];

const LOCAL_SPELLING_RULES: {
	pattern: RegExp;
	message: string;
	suggestion: string;
}[] = [
	{
		pattern: /\b[Bb]oujour\b/g,
		message: 'Mot probablement mal orthographié : « Boujour ».',
		suggestion: 'Bonjour'
	},
	{
		pattern: /\b[Vv]ou\b/g,
		message: 'Mot probablement incomplet : « vou ».',
		suggestion: 'vous'
	},
	{
		pattern: /\b[Tt]ousse\b/g,
		message: 'Mot probablement mal orthographié : « tousse ».',
		suggestion: 'tous'
	},
	{
		pattern: /\b[Ss]a va\b/g,
		message: 'Confusion fréquente entre « sa » et « ça ».',
		suggestion: 'ça va'
	},
	{
		pattern: /\b[Cc]a va\b/g,
		message: 'Il manque probablement la cédille.',
		suggestion: 'ça va'
	},
	{
		pattern: /\b[Ss]il vous plait\b/g,
		message: 'Accent recommandé dans cette formule.',
		suggestion: "s'il vous plaît"
	}
];

const LOCAL_GRAMMAR_RULES: {
	pattern: RegExp;
	message: string;
	suggestion: string;
}[] = [
	{
		pattern: /\b[Cc]omment\s+all[ée]?\s+vou?s?\b/g,
		message: 'Formulation probable : « comment allez-vous ».',
		suggestion: 'comment allez-vous'
	},
	{
		pattern: /\b[Jj]e\s+vous\s+remerci\b/g,
		message: 'Le verbe remercier prend généralement « e » ici.',
		suggestion: 'je vous remercie'
	},
	{
		pattern: /\b[Ii]l\s+faut\s+que\s+je\s+vais\b/g,
		message: 'Après « il faut que », on attend souvent le subjonctif.',
		suggestion: "il faut que j'aille"
	}
];

function preserveInitialCase(source: string, suggestion: string): string {
	if (!source[0] || source[0] !== source[0].toUpperCase()) return suggestion;
	return suggestion[0].toUpperCase() + suggestion.slice(1);
}

function localIssuesFromRules(
	text: string,
	rules: typeof LOCAL_SPELLING_RULES,
	kind: 'spelling' | 'grammar'
): SpellingIssue[] {
	return rules.flatMap((rule) =>
		Array.from(text.matchAll(rule.pattern)).map((match) => ({
			kind,
			message: rule.message,
			offset: match.index ?? 0,
			length: match[0].length,
			suggestion: preserveInitialCase(match[0], rule.suggestion)
		}))
	);
}

function findLocalSpellingIssues(text: string) {
	const issues: SpellingIssue[] = localIssuesFromRules(text, LOCAL_SPELLING_RULES, 'spelling');
	const trimmedEnd = text.trimEnd();
	const firstLetter = text.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/);

	if (firstLetter && firstLetter[0] === firstLetter[0].toLowerCase()) {
		issues.unshift({
			kind: 'punctuation',
			message: 'La phrase commence probablement par une majuscule.',
			offset: firstLetter.index ?? 0,
			length: 1,
			suggestion: firstLetter[0].toUpperCase()
		});
	}

	if (trimmedEnd && !/[.!?…]$/.test(trimmedEnd)) {
		issues.push({
			kind: 'punctuation',
			message: 'Une ponctuation finale peut aider à lire la phrase.',
			offset: trimmedEnd.length,
			length: 0,
			suggestion: '.'
		});
	}

	return issues;
}

function findLocalGrammarIssues(text: string) {
	return localIssuesFromRules(text, LOCAL_GRAMMAR_RULES, 'grammar');
}

class StubCorrecteurService implements CorrecteurService {
	isAvailable() {
		return false;
	}

	getUnavailableReason() {
		return WEB_STUB_REASON;
	}

	getGrammarUnavailableReason() {
		return WEB_STUB_REASON;
	}

	async analyze(text: string, options: CorrecteurOptions = {}): Promise<CorrecteurResult> {
		if (options.mode === 'off') {
			return { ok: true, issues: [], engine: 'local' };
		}

		if (!text.trim()) {
			return { ok: false, error: 'Aucun texte à corriger.' };
		}

		return { ok: false, error: WEB_STUB_REASON };
	}

	async analyzeGrammar(text: string, options: CorrecteurOptions = {}): Promise<CorrecteurResult> {
		if (options.mode === 'off') {
			return { ok: true, issues: [], engine: 'local' };
		}

		if (!text.trim()) {
			return { ok: false, error: 'Aucun texte à corriger.' };
		}

		return { ok: false, error: WEB_STUB_REASON };
	}
}

class WebCorrecteurService implements CorrecteurService {
	isAvailable() {
		return browser;
	}

	getUnavailableReason() {
		return null;
	}

	getGrammarUnavailableReason() {
		return null;
	}

	async analyze(text: string, options: CorrecteurOptions = {}): Promise<CorrecteurResult> {
		if (options.mode === 'off') {
			return { ok: true, issues: [], engine: 'local' };
		}

		if (!text.trim()) {
			return { ok: false, error: 'Aucun texte à corriger.' };
		}

		return { ok: true, issues: findLocalSpellingIssues(text), engine: 'local' };
	}

	async analyzeGrammar(text: string, options: CorrecteurOptions = {}): Promise<CorrecteurResult> {
		if (options.mode === 'off') {
			return { ok: true, issues: [], engine: 'local' };
		}

		if (!text.trim()) {
			return { ok: false, error: 'Aucun texte à corriger.' };
		}

		return { ok: true, issues: findLocalGrammarIssues(text), engine: 'local' };
	}
}

class TauriCorrecteurService implements CorrecteurService {
	private hunspellReady: boolean | null = null;
	private grammalecteReady: boolean | null = null;

	isAvailable() {
		return browser && isTauriRuntime() && this.hunspellReady !== false;
	}

	getUnavailableReason() {
		if (!browser || !isTauriRuntime()) return WEB_STUB_REASON;
		if (this.hunspellReady === false) return HUNSPELL_INSTALL_REASON;
		return null;
	}

	getGrammarUnavailableReason() {
		if (!browser || !isTauriRuntime()) return WEB_STUB_REASON;
		if (this.grammalecteReady === false) return GRAMMALECTE_INSTALL_REASON;
		return null;
	}

	private async ensureHunspellReady(): Promise<boolean> {
		if (this.hunspellReady !== null) return this.hunspellReady;
		this.hunspellReady = await tauriIsHunspellAvailable();
		return this.hunspellReady;
	}

	private async ensureGrammalecteReady(): Promise<boolean> {
		if (this.grammalecteReady !== null) return this.grammalecteReady;
		this.grammalecteReady = await tauriIsGrammalecteAvailable();
		return this.grammalecteReady;
	}

	async analyze(text: string, options: CorrecteurOptions = {}): Promise<CorrecteurResult> {
		if (options.mode === 'off') {
			return { ok: true, issues: [], engine: 'local' };
		}

		if (!text.trim()) {
			return { ok: false, error: 'Aucun texte à corriger.' };
		}

		if (!(await this.ensureHunspellReady())) {
			return { ok: false, error: HUNSPELL_INSTALL_REASON };
		}

		try {
			const issues = await tauriSpellcheckText(text, options.lang ?? 'fr');
			return { ok: true, issues, engine: 'hunspell' };
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Impossible d\'analyser le texte.';
			return { ok: false, error: message };
		}
	}

	async analyzeGrammar(text: string, options: CorrecteurOptions = {}): Promise<CorrecteurResult> {
		if (options.mode === 'off') {
			return { ok: true, issues: [], engine: 'local' };
		}

		if (!text.trim()) {
			return { ok: false, error: 'Aucun texte à corriger.' };
		}

		if (!(await this.ensureGrammalecteReady())) {
			return { ok: false, error: GRAMMALECTE_INSTALL_REASON };
		}

		try {
			const issues = await tauriGrammarCheckText(text);
			return { ok: true, issues, engine: 'grammalecte' };
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Impossible d\'analyser la grammaire.';
			return { ok: false, error: message };
		}
	}
}

function createCorrecteurService(): CorrecteurService {
	if (browser && isTauriRuntime()) {
		return new TauriCorrecteurService();
	}
	if (browser) return new WebCorrecteurService();
	return new StubCorrecteurService();
}

/** Hunspell (orthographe) + Grammalecte (grammaire) via Tauri. */

export const correcteur: CorrecteurService = createCorrecteurService();

export type {
	CorrecteurFailure,
	CorrecteurOptions,
	CorrecteurResult,
	CorrecteurService,
	CorrecteurSuccess,
	SpellingIssue,
	SpellcheckMode
} from './types';
