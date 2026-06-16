<script lang="ts">
	// R?le : Composant Svelte de compr?hension des consignes : encapsule l?affichage et les interactions r?utilisables.

	import ExplainAgainPanel from '$lib/components/comprehension/ExplainAgainPanel.svelte';
	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		breakdownInstruction,
		extractDeadlineHint,
		stepKindLabel
	} from '$lib/modules/comprehension/instruction-breakdown';
	import { simplifyWithFalcEngine } from '$lib/modules/comprehension/falc-engine';
	import { findLongSentences } from '$lib/modules/writing/long-sentences';
	import { addChecklist, createChecklist } from '$lib/modules/organizer/checklist';
	import { bilingualLabel, dynamicMessage, notifyUserI18n } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';

	let {
		text = $bindable('')
	}: {
		text?: string;
	} = $props();

	let falcMode = $state(true);
	let status = $state('');

	const steps = $derived(breakdownInstruction(text));
	const deadline = $derived(extractDeadlineHint(text));
	const longSentences = $derived(findLongSentences(text));
	const falcResult = $derived(
		falcMode
			? simplifyWithFalcEngine(text, {
					glossary: $profileStore.comprehension?.glossary ?? [],
					level: 'standard',
					useFleLexicon: true
				})
			: null
	);
	const falcText = $derived(falcResult?.text ?? text);
	const readLabel = $derived(
		bilingualLabel('Lire la consigne', 'mod.understand.readInstruction', $settings.ui)
	);

	function sendToOrganiser() {
		if (steps.length === 0) return;

		const title = deadline
			? dynamicMessage('dyn.understand.checklistTitleNamed', $settings.ui, {
					deadline: deadline.slice(0, 40)
				})
			: dynamicMessage('dyn.understand.checklistTitleDefault', $settings.ui);

		profileStore.patch((profile) => ({
			...profile,
			organizer: addChecklist(
				profile.organizer,
				createChecklist(
					title,
					steps.map((step) => `${step.index}. ${step.text}`)
				)
			)
		}));

		status = dynamicMessage('dyn.understand.checklistCreated', $settings.ui);
		notifyUserI18n('dyn.understand.checklistCreated', 'minimal');
	}
</script>

{#if text.trim()}
	<section class="instruction-results card" aria-labelledby="breakdown-heading">
		<div class="instruction-results-header">
			<h3 id="breakdown-heading">
				<BiText fr="Découpage" key="mod.understand.breakdown" inline /> ({steps.length})
			</h3>
			<div class="instruction-results-tools">
				<ExplainAgainPanel {text} />
				<ReadAloudButton text={text} rate={$settings.reading.ttsRate} label={readLabel} />
			</div>
		</div>

		{#if deadline}
			<p class="instruction-deadline" role="note">
				<strong><BiText fr="Date repérée" key="mod.understand.deadline" inline /> :</strong> {deadline}
			</p>
		{/if}

		<label class="instruction-toggle">
			<input type="checkbox" bind:checked={falcMode} />
			<BiText
				fr="Simplification FALC (phrases courtes, mots simples, glossaire personnel)"
				key="mod.understand.falcToggle"
				inline
			/>
		</label>

		{#if falcMode && falcResult}
			<p class="instruction-falc-score" aria-live="polite">
				Score lisibilité indicatif : {falcResult.readabilityScore}/100 — phrases :
				{falcResult.stats.sentences}, moy. {falcResult.stats.avgWordsPerSentence} mots/phrase
			</p>
		{/if}

		{#if falcMode && text.trim()}
			<div class="instruction-falc" aria-label="Version facile à lire">
				{#each falcText.split('\n\n') as paragraph}
					<p>{paragraph}</p>
				{/each}
			</div>
		{/if}

		<ol class="instruction-steps">
			{#each steps as step (step.index)}
				<li>
					<p class="step-kind">{stepKindLabel(step.kind)}</p>
					<p class="step-text">{step.text}</p>
				</li>
			{/each}
		</ol>

		{#if longSentences.length > 0}
			<div class="instruction-long">
				<h4>
					<BiText fr="Phrases longues à surveiller" key="mod.understand.longSentences" inline />
					({longSentences.length})
				</h4>
				<ul>
					{#each longSentences as hint}
						<li>{hint.text}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="instruction-actions">
			<button
				type="button"
				class="btn btn-primary"
				disabled={steps.length === 0}
				onclick={sendToOrganiser}
			>
				<BiText fr="Créer une checklist dans Organiser" key="mod.understand.createChecklist" inline />
			</button>
			<a class="btn btn-secondary" href="/organiser">
				<BiText fr="Voir mes listes" key="mod.understand.viewLists" inline />
			</a>
		</div>

		{#if status}
			<p class="instruction-status" role="status">{status}</p>
		{/if}
	</section>
{/if}

<style>
	.instruction-results-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.instruction-results-header h3 {
		margin: 0;
	}

	.instruction-results-tools {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--space-sm);
	}

	.instruction-deadline {
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		font-size: var(--font-size-sm);
	}

	.instruction-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: var(--btn-min-height);
		margin: var(--space-md) 0;
		cursor: pointer;
	}

	.instruction-falc {
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-lg);
		background: var(--color-bg-elevated);
	}

	.instruction-falc p {
		margin: 0 0 var(--space-md);
		line-height: 1.7;
	}

	.instruction-falc p:last-child {
		margin-bottom: 0;
	}

	.instruction-steps {
		margin: 0;
		padding-left: var(--space-lg);
	}

	.instruction-steps li {
		margin-bottom: var(--space-md);
	}

	.step-kind {
		margin: 0 0 var(--space-xs);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		font-weight: 600;
	}

	.step-text {
		margin: 0;
	}

	.instruction-long {
		margin-top: var(--space-lg);
		padding-top: var(--space-md);
		border-top: 1px solid var(--color-border);
	}

	.instruction-long h4 {
		margin: 0 0 var(--space-sm);
		font-size: var(--font-size-base);
	}

	.instruction-long ul {
		margin: 0;
		padding-left: var(--space-lg);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.instruction-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}

	.instruction-status {
		margin-top: var(--space-md);
		font-size: var(--font-size-sm);
	}
</style>
