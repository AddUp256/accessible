import { invoke } from '@tauri-apps/api/core';
import type { SpellingIssue } from './types';

export async function tauriIsHunspellAvailable(): Promise<boolean> {
	return invoke<boolean>('is_hunspell_available');
}

export async function tauriSpellcheckText(text: string, lang = 'fr'): Promise<SpellingIssue[]> {
	return invoke<SpellingIssue[]>('spellcheck_text', { text, lang });
}

export async function tauriIsGrammalecteAvailable(): Promise<boolean> {
	return invoke<boolean>('is_grammalecte_available');
}

export async function tauriGrammarCheckText(text: string): Promise<SpellingIssue[]> {
	return invoke<SpellingIssue[]>('grammar_check_text', { text });
}
