<script lang="ts">
	import { onMount } from 'svelte';
	import { correcteur } from '$lib/services/correcteur';
	import {
		tauriIsGrammalecteAvailable,
		tauriIsHunspellAvailable
	} from '$lib/services/correcteur/tauri';
	import { findLongSentences } from '$lib/modules/writing/long-sentences';
	import { isTauriRuntime } from '$lib/services/storage/tauri';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import {
		bilingualUi,
		dynamicMessage,
		resolveSpellcheckLang,
		translateServiceMessage
	} from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import type { SpellcheckMode, SpellingIssue } from '$lib/services/correcteur/types';
	import type { LongSentenceHint } from '$lib/modules/writing/long-sentences';

	let {
		text,
		spellcheckMode = 'step_by_step',
		grammarCheckMode = 'off',
		shortSentenceHint = true,
		ontextchange
	}: {
		text: string;
		spellcheckMode?: SpellcheckMode;
		grammarCheckMode?: SpellcheckMode;
		shortSentenceHint?: boolean;
		ontextchange?: (text: string) => void;
	} = $props();

	let status = $state('');
	let busy = $state(false);
	let longSentences = $state<LongSentenceHint[]>([]);
	let spellingIssues = $state<SpellingIssue[]>([]);
	let grammarIssues = $state<SpellingIssue[]>([]);
	let spellingStepIndex = $state(0);
	let grammarStepIndex = $state(0);
	let hunspellReady = $state<boolean | null>(null);
	let grammalecteReady = $state<boolean | null>(null);

	const unavailableReason = $derived(correcteur.getUnavailableReason());
	const grammarUnavailableReason = $derived(correcteur.getGrammarUnavailableReason());
	const spellcheckActive = $derived(spellcheckMode !== 'off');
	const grammarActive = $derived(grammarCheckMode !== 'off');
	const analysisActive = $derived(spellcheckActive || grammarActive);
	const unavailableReasonDisplay = $derived(
		unavailableReason ? translateServiceMessage(unavailableReason, $settings.ui) : null
	);
	const grammarUnavailableReasonDisplay = $derived(
		grammarUnavailableReason
			? translateServiceMessage(grammarUnavailableReason, $settings.ui)
			: null
	);
	const visibleSpellingIssues = $derived(
		spellcheckMode === 'step_by_step'
			? spellingIssues.slice(spellingStepIndex, spellingStepIndex + 1)
			: spellingIssues
	);
	const visibleGrammarIssues = $derived(
		grammarCheckMode === 'step_by_step'
			? grammarIssues.slice(grammarStepIndex, grammarStepIndex + 1)
			: grammarIssues
	);

	const spellcheckLang = $derived(
		resolveSpellcheckLang($settings.ui.secondaryLanguage, $settings.ui.bilingualUi)
	);

	onMount(async () => {
		if (!isTauriRuntime()) return;
		hunspellReady = await tauriIsHunspellAvailable();
		grammalecteReady = await tauriIsGrammalecteAvailable();
	});

	function refreshLongSentences() {
		longSentences = shortSentenceHint ? findLongSentences(text) : [];
	}

	function applySuggestion(issue: SpellingIssue, source: 'spelling' | 'grammar') {
		if (!issue.suggestion) return;
		const before = text.slice(0, issue.offset);
		const after = text.slice(issue.offset + issue.length);
		ontextchange?.(before + issue.suggestion + after);
		status = dynamicMessage('dyn.write.suggestionApplied', $settings.ui, {
			suggestion: issue.suggestion
		});
		if (source === 'spelling') {
			spellingIssues = [];
			spellingStepIndex = 0;
		} else {
			grammarIssues = [];
			grammarStepIndex = 0;
		}
	}

	function nextSpellingStep() {
		if (spellingStepIndex < spellingIssues.length - 1) {
			spellingStepIndex += 1;
		}
	}

	function nextGrammarStep() {
		if (grammarStepIndex < grammarIssues.length - 1) {
			grammarStepIndex += 1;
		}
	}

	async function analyze() {
		status = '';
		spellingIssues = [];
		grammarIssues = [];
		spellingStepIndex = 0;
		grammarStepIndex = 0;
		busy = true;

		try {
			if (shortSentenceHint) {
				longSentences = findLongSentences(text);
			} else {
				longSentences = [];
			}

			if (!analysisActive) {
				status =
					longSentences.length > 0
						? dynamicMessage('dyn.write.longSentencesCount', $settings.ui, {
								count: longSentences.length
							})
						: dynamicMessage('dyn.write.correctionOffNoLong', $settings.ui);
				return;
			}

			const messages: string[] = [];

			if (spellcheckActive) {
				const result = await correcteur.analyze(text, {
					mode: spellcheckMode,
					lang: spellcheckLang
				});
				if (result.ok) {
					spellingIssues = result.issues;
					messages.push(
						result.issues.length > 0
							? dynamicMessage('dyn.write.spellingIssues', $settings.ui, {
									count: result.issues.length
								})
							: dynamicMessage('dyn.write.noSpellingErrors', $settings.ui)
					);
				} else {
					messages.push(translateServiceMessage(result.error, $settings.ui));
				}
			}

			if (grammarActive) {
				const result = await correcteur.analyzeGrammar(text, { mode: grammarCheckMode, lang: 'fr' });
				if (result.ok) {
					grammarIssues = result.issues;
					messages.push(
						result.issues.length > 0
							? dynamicMessage('dyn.write.grammarIssues', $settings.ui, {
									count: result.issues.length
								})
							: dynamicMessage('dyn.write.noGrammarErrors', $settings.ui)
					);
				} else {
					messages.push(translateServiceMessage(result.error, $settings.ui));
				}
			}

			status = messages.join(' ');
		} catch {
			status = dynamicMessage('dyn.write.analyzeFailed', $settings.ui);
		} finally {
			busy = false;
		}
	}

	$effect(() => {
		text;
		shortSentenceHint;
		spellcheckMode;
		grammarCheckMode;
		spellingStepIndex = 0;
		grammarStepIndex = 0;
		if (shortSentenceHint && text.trim()) {
			refreshLongSentences();
		} else if (!shortSentenceHint) {
			longSentences = [];
		}
	});
	const analyzeBtn = $derived(
		busy
			? bilingualUi('Analyse…', 'mod.write.correct.analyzeBusy', $settings.ui)
			: analysisActive
				? bilingualUi('Analyser le texte', 'mod.write.correct.analyze', $settings.ui)
				: bilingualUi('Vérifier les phrases longues', 'mod.write.correct.checkLong', $settings.ui)
	);
</script>

<section class="correcteur-panel card" aria-labelledby="correcteur-heading">
	<BiHeading fr="Aide à la correction" key="mod.write.correct.title" level={3} id="correcteur-heading" />

	<p class="correcteur-hint">
		{#if isTauriRuntime() && hunspellReady === true}
			<BiText fr="Hunspell est prêt (orthographe)." key="mod.write.correct.hunspellReady" inline />
		{:else if isTauriRuntime() && hunspellReady === false}
			<BiText
				fr="Installez Hunspell et le dictionnaire français (fr_FR) pour l'orthographe."
				key="mod.write.correct.hunspellMissing"
			/>
		{/if}
		{#if isTauriRuntime() && grammalecteReady === true}
			<BiText fr="Grammalecte est prêt (grammaire)." key="mod.write.correct.grammalecteReady" inline />
		{:else if isTauriRuntime() && grammalecteReady === false}
			<BiText
				fr="Installez Grammalecte (CLI) ou définissez GRAMMALECTE_CLI pour la grammaire."
				key="mod.write.correct.grammalecteMissing"
			/>
		{:else if !analysisActive && unavailableReasonDisplay}
			{unavailableReasonDisplay}
		{:else if grammarActive && grammarUnavailableReasonDisplay && !spellcheckActive}
			{grammarUnavailableReasonDisplay}
		{:else if !isTauriRuntime()}
			Dans le navigateur : aide locale rapide (fautes fréquentes, ponctuation, phrases longues).
			Hunspell et Grammalecte restent disponibles dans l'application installée.
		{:else}
			<BiText
				fr="Orthographe (Hunspell), grammaire (Grammalecte) et phrases longues."
				key="mod.write.correct.hintDefault"
			/>
		{/if}
	</p>

	<details class="correcteur-install-guide">
		<summary>Installer la correction avancée</summary>
		<div class="install-guide-content">
			<p>
				Dans le navigateur, Accessible utilise une aide locale rapide. Pour la correction complète,
				utilisez l'application installée avec Hunspell, le dictionnaire français et Grammalecte CLI.
			</p>
			<ul>
				<li>
					Hunspell :
					<code>winget install --id FSFhu.Hunspell --exact --source winget</code>
					ou la page
					<a href="https://github.com/hunspell/hunspell" target="_blank" rel="noreferrer">
						Hunspell
					</a>.
				</li>
				<li>
					Dictionnaire français <code>fr_FR</code> : installez le dictionnaire fourni par votre
					distribution ou récupérez les fichiers <code>fr_FR.aff</code> et <code>fr_FR.dic</code>
					depuis
					<a
						href="https://github.com/LibreOffice/dictionaries/tree/master/fr_FR"
						target="_blank"
						rel="noreferrer"
					>
						LibreOffice dictionaries
					</a>.
				</li>
				<li>
					Grammalecte :
					<a href="https://grammalecte.net/" target="_blank" rel="noreferrer">
						télécharger Grammalecte
					</a>, puis indiquer le chemin du script CLI :
					<code>setx GRAMMALECTE_CLI "C:\chemin\grammalecte-cli.py"</code>.
				</li>
			</ul>
			<p>Après installation, fermez Accessible puis relancez-le pour rafraîchir la détection.</p>
		</div>
	</details>

	<button
		type="button"
		class="btn btn-primary"
		disabled={busy || !text.trim()}
		onclick={analyze}
	>
		<BilingualText primary={analyzeBtn.primary} secondary={analyzeBtn.secondary} inline />
	</button>

	{#if grammarIssues.length > 0}
		<div class="grammar-issues" aria-live="polite">
			<h4>
				<BiText fr="Grammaire" key="mod.write.correct.grammar" inline /> ({grammarCheckMode === 'step_by_step'
					? `${grammarStepIndex + 1}/${grammarIssues.length}`
					: grammarIssues.length})
			</h4>
			<ul>
				{#each visibleGrammarIssues as issue}
					<li>
						<p>{issue.message}</p>
						{#if issue.suggestion}
							<p class="issue-suggestion">
								<BiText fr="Suggestion" key="mod.write.correct.suggestion" inline /> :
								<strong>{issue.suggestion}</strong>
							</p>
							{#if ontextchange}
								<button
									type="button"
									class="btn btn-secondary"
									onclick={() => applySuggestion(issue, 'grammar')}
								>
									Appliquer « {issue.suggestion} »
								</button>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
			{#if grammarCheckMode === 'step_by_step' && grammarStepIndex < grammarIssues.length - 1}
				<button type="button" class="btn btn-secondary" onclick={nextGrammarStep}>
					<BiText fr="Point suivant" key="mod.write.correct.nextGrammar" inline />
				</button>
			{/if}
		</div>
	{/if}

	{#if spellingIssues.length > 0}
		<div class="spelling-issues" aria-live="polite">
			<h4>
				<BiText fr="Orthographe" key="mod.write.correct.spelling" inline /> ({spellcheckMode === 'step_by_step'
					? `${spellingStepIndex + 1}/${spellingIssues.length}`
					: spellingIssues.length})
			</h4>
			<ul>
				{#each visibleSpellingIssues as issue}
					<li>
						<p>{issue.message}</p>
						{#if issue.suggestion}
							<p class="issue-suggestion">
								<BiText fr="Suggestion" key="mod.write.correct.suggestion" inline /> :
								<strong>{issue.suggestion}</strong>
							</p>
							{#if ontextchange}
								<button
									type="button"
									class="btn btn-secondary"
									onclick={() => applySuggestion(issue, 'spelling')}
								>
									Appliquer « {issue.suggestion} »
								</button>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
			{#if spellcheckMode === 'step_by_step' && spellingStepIndex < spellingIssues.length - 1}
				<button type="button" class="btn btn-secondary" onclick={nextSpellingStep}>
					<BiText fr="Mot suivant" key="mod.write.correct.nextWord" inline />
				</button>
			{/if}
		</div>
	{/if}

	{#if longSentences.length > 0}
		<div class="long-sentences" aria-live="polite">
			<h4>
				<BiText fr="Phrases longues" key="mod.write.correct.longSentences" inline /> ({longSentences.length})
			</h4>
			<p class="correcteur-hint">
				<BiText
					fr="Une phrase courte est souvent plus facile à lire. Vous pouvez la couper en deux."
					key="mod.write.correct.longHint"
				/>
			</p>
			<ol>
				{#each longSentences as hint}
					<li>
						<strong>Phrase {hint.index}</strong> — {hint.wordCount} mots
						<p class="sentence-preview">{hint.text}</p>
					</li>
				{/each}
			</ol>
		</div>
	{/if}

	{#if status}
		<p class="correcteur-status" role="status">{status}</p>
	{/if}
</section>

<style>
	.correcteur-hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--space-md);
	}

	.correcteur-install-guide {
		margin: 0 0 var(--space-md);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg-elevated);
	}

	.correcteur-install-guide summary {
		cursor: pointer;
		font-weight: 700;
	}

	.install-guide-content {
		margin-top: var(--space-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.install-guide-content ul {
		margin: var(--space-sm) 0;
		padding-left: var(--space-lg);
	}

	.install-guide-content li + li {
		margin-top: var(--space-sm);
	}

	.install-guide-content code {
		display: inline-block;
		max-width: 100%;
		white-space: normal;
		overflow-wrap: anywhere;
	}

	.spelling-issues,
	.grammar-issues,
	.long-sentences {
		margin-top: var(--space-lg);
	}

	.spelling-issues h4,
	.grammar-issues h4,
	.long-sentences h4 {
		margin: 0 0 var(--space-sm);
	}

	.spelling-issues ul,
	.grammar-issues ul {
		margin: var(--space-sm) 0 0;
		padding-left: var(--space-lg);
	}

	.spelling-issues li + li,
	.grammar-issues li + li {
		margin-top: var(--space-md);
	}

	.issue-suggestion {
		margin: var(--space-xs) 0;
		font-size: var(--font-size-sm);
	}

	.long-sentences ol {
		margin: var(--space-sm) 0 0;
		padding-left: var(--space-lg);
	}

	.sentence-preview {
		margin: var(--space-xs) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.correcteur-status {
		margin: var(--space-md) 0 0;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		font-size: var(--font-size-sm);
	}
</style>
