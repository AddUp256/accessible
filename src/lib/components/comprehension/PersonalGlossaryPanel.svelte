<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		addGlossaryEntry,
		createGlossaryEntry,
		removeGlossaryEntry
	} from '$lib/modules/comprehension/glossary';
	import { configLabel, dynamicMessage, notifyUserI18n } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';

	let term = $state('');
	let definition = $state('');
	let status = $state('');

	const entries = $derived($profileStore.comprehension.glossary);

	function addEntry() {
		if (!term.trim() || !definition.trim()) {
			status = dynamicMessage('dyn.glossary.needWord', $settings.ui);
			return;
		}
		profileStore.patch((profile) => ({
			...profile,
			comprehension: addGlossaryEntry(
				profile.comprehension,
				createGlossaryEntry(term, definition)
			)
		}));
		term = '';
		definition = '';
		status = dynamicMessage('dyn.glossary.added', $settings.ui);
		notifyUserI18n('dyn.glossary.added', 'minimal');
	}

	function removeEntry(entryId: string) {
		profileStore.patch((profile) => ({
			...profile,
			comprehension: removeGlossaryEntry(profile.comprehension, entryId)
		}));
		status = dynamicMessage('dyn.glossary.removed', $settings.ui);
	}
</script>

<section class="card glossary-panel" aria-labelledby="glossary-heading">
	<BiHeading fr="Glossaire personnel" key="mod.understand.glossary.title" level={3} id="glossary-heading" />
	<p class="glossary-hint">
		<BiText
			fr="Ajoutez des mots difficiles et une version simple. Ils seront utilisés pour la simplification FALC."
			key="mod.understand.glossary.hint"
		/>
	</p>

	<div class="glossary-form">
		<label for="glossary-term">
			<BiText fr="Mot ou expression" key="mod.understand.glossary.term" inline />
		</label>
		<input id="glossary-term" type="text" bind:value={term} placeholder={configLabel('Ex. : dissertation', 'cfg.ph.glossaryTerm', $settings.ui)} />

		<label for="glossary-definition">
			<BiText fr="Version simple" key="mod.understand.glossary.definition" inline />
		</label>
		<input id="glossary-definition" type="text" bind:value={definition} placeholder={configLabel('Ex. : devoir écrit', 'cfg.ph.glossaryDefinition', $settings.ui)} />

		<button type="button" class="btn btn-primary" onclick={addEntry}>
			<BiText fr="Ajouter au glossaire" key="mod.understand.glossary.add" inline />
		</button>
	</div>

	{#if status}
		<p class="glossary-status" role="status">{status}</p>
	{/if}

	{#if entries.length === 0}
		<p class="glossary-empty">
			<BiText fr="Aucun mot dans le glossaire." key="mod.understand.glossary.empty" />
		</p>
	{:else}
		<ul class="glossary-list">
			{#each entries as entry (entry.id)}
				<li class="glossary-item">
					<strong>{entry.term}</strong>
					<span aria-hidden="true">→</span>
					<span>{entry.definition}</span>
					<button
						type="button"
						class="btn btn-secondary"
						data-confirm-key="dyn.glossary.removeConfirm"
						onclick={() => removeEntry(entry.id)}
					>
						<BiText fr="Retirer" key="mod.understand.glossary.remove" inline />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.glossary-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.glossary-form label {
		display: block;
		font-weight: 600;
		margin: var(--space-md) 0 var(--space-xs);
	}

	.glossary-form input {
		width: 100%;
		min-height: var(--btn-min-height);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
	}

	.glossary-status,
	.glossary-empty {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-md);
	}

	.glossary-list {
		list-style: none;
		padding: 0;
		margin: var(--space-lg) 0 0;
		display: grid;
		gap: var(--space-sm);
	}

	.glossary-item {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
	}
</style>
