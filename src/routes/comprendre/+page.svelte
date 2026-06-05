<script lang="ts">
	import InstructionAnalyzer from '$lib/components/comprehension/InstructionAnalyzer.svelte';
	import PersonalGlossaryPanel from '$lib/components/comprehension/PersonalGlossaryPanel.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { INSTRUCTION_TEMPLATES } from '$lib/config/instruction-templates';
	import { configLabel, INSTRUCTION_I18N_KEYS } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';

	let text = $state('');

	function loadTemplate(templateId: string) {
		const template = INSTRUCTION_TEMPLATES.find((item) => item.id === templateId);
		if (template) text = template.text;
	}
</script>

<svelte:head>
	<title>Comprendre — Accessible</title>
</svelte:head>

<BiHeading fr="Comprendre une consigne" key="page.understand.title" />
<p>
	<BiText fr="Collez une consigne de cours, un devoir ou un e-mail à rédiger. Accessible la découpe en étapes et propose une version plus facile à lire." key="page.understand.intro" />
</p>
<p class="understand-note">
	<BiText fr="Glossaire personnel et simplification FALC disponibles ci-dessous." key="mod.understand.note" />
</p>

<section class="card instruction-input" aria-labelledby="input-heading">
	<BiHeading fr="Votre consigne" key="mod.understand.input.title" level={3} id="input-heading" />

	<div class="instruction-templates">
		<p class="instruction-hint">
			<BiText fr="Exemples à tester :" key="mod.understand.input.examples" inline />
		</p>
		<div class="instruction-template-actions">
			{#each INSTRUCTION_TEMPLATES as template}
				<button type="button" class="btn btn-secondary" onclick={() => loadTemplate(template.id)}>
					{configLabel(template.title, INSTRUCTION_I18N_KEYS[template.id], $settings.ui)}
				</button>
			{/each}
		</div>
	</div>

	<label for="instruction-text">
		<BiText fr="Texte de la consigne" key="mod.understand.input.label" inline />
	</label>
	<textarea
		id="instruction-text"
		rows="8"
		bind:value={text}
		placeholder={configLabel('Collez la consigne ici…', 'cfg.ph.instructionText', $settings.ui)}
	></textarea>
</section>

<InstructionAnalyzer bind:text />

<PersonalGlossaryPanel />

<style>
	.understand-note {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.instruction-hint {
		margin: 0 0 var(--space-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.instruction-template-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	textarea {
		width: 100%;
		font-family: inherit;
		font-size: var(--font-size-base);
		line-height: 1.6;
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		resize: vertical;
	}
</style>
