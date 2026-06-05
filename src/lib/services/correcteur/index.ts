import { browser } from '$app/environment';

import { isTauriRuntime } from '$lib/services/storage/tauri';

import {
	tauriGrammarCheckText,
	tauriIsGrammalecteAvailable,
	tauriIsHunspellAvailable,
	tauriSpellcheckText
} from './tauri';

import { DYNAMIC_FR } from '$lib/i18n/ui-dynamic';

import type { CorrecteurOptions, CorrecteurResult, CorrecteurService } from './types';

const WEB_STUB_REASON = DYNAMIC_FR['dyn.service.correcteurWebStub'];
const HUNSPELL_INSTALL_REASON = DYNAMIC_FR['dyn.service.hunspellMissing'];
const GRAMMALECTE_INSTALL_REASON = DYNAMIC_FR['dyn.service.grammalecteMissing'];

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
