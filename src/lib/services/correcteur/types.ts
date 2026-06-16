/** R?le : Service de correction orthographique et grammaticale : isole les acc?s navigateur, Tauri ou fichiers locaux. */
export type SpellcheckMode = 'off' | 'global' | 'step_by_step';

export interface SpellingIssue {
	kind: 'spelling' | 'grammar' | 'punctuation';
	message: string;
	offset: number;
	length: number;
	suggestion?: string;
}

export interface CorrecteurSuccess {
	ok: true;
	issues: SpellingIssue[];
	engine: 'hunspell' | 'grammalecte' | 'local';
}

export interface CorrecteurFailure {
	ok: false;
	error: string;
}

export type CorrecteurResult = CorrecteurSuccess | CorrecteurFailure;

export interface CorrecteurOptions {
	lang?: string;
	mode?: SpellcheckMode;
}

export interface CorrecteurService {
	isAvailable(): boolean;
	getUnavailableReason(): string | null;
	getGrammarUnavailableReason(): string | null;
	analyze(text: string, options?: CorrecteurOptions): Promise<CorrecteurResult>;
	analyzeGrammar(text: string, options?: CorrecteurOptions): Promise<CorrecteurResult>;
}
