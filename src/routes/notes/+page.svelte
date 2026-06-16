<script lang="ts">
	// R?le : Page SvelteKit /routes/notes : assemble l?interface utilisateur et les actions de cette zone.


	import NoteCard from '$lib/components/notes/NoteCard.svelte';

	import OnboardingTestReturn from '$lib/components/onboarding/OnboardingTestReturn.svelte';

	import BiHeading from '$lib/components/ui/BiHeading.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import { addNote, createNote, removeNote, updateNote } from '$lib/modules/notes/note';

	import { dynamicMessage, notifyUserI18n, configLabel } from '$lib/i18n';

	import { profileStore, settings } from '$lib/stores/profile';

	import type { Note, NoteFormat } from '$lib/types/profile';



	let title = $state('');

	let body = $state('');

	let cornellCue = $state('');

	let cornellSummary = $state('');

	let format = $state<NoteFormat>('simple');

	let editingId = $state<string | null>(null);

	let status = $state('');



	const notes = $derived($profileStore.notes.notes);



	function resetForm() {

		title = '';

		body = '';

		cornellCue = '';

		cornellSummary = '';

		format = 'simple';

		editingId = null;

	}



	function saveNote() {

		if (!title.trim() && !body.trim() && !cornellCue.trim() && !cornellSummary.trim()) {

			status = dynamicMessage('dyn.notes.needContent', $settings.ui);

			return;

		}



		if (editingId) {

			const noteId = editingId;

			profileStore.patch((profile) => ({

				...profile,

				notes: updateNote(profile.notes, noteId, title, body, format, cornellCue, cornellSummary)

			}));

		} else {

			profileStore.patch((profile) => ({

				...profile,

				notes: addNote(

					profile.notes,

					createNote(title, body, format, cornellCue, cornellSummary)

				)

			}));

		}

		const toastKey = editingId ? 'dyn.notes.updated' : 'dyn.notes.saved';

		status = dynamicMessage(toastKey, $settings.ui);

		notifyUserI18n(toastKey, 'minimal');

		resetForm();

	}



	function startEdit(note: Note) {

		editingId = note.id;

		title = note.title;

		body = note.body;

		format = note.format ?? 'simple';

		cornellCue = note.cornellCue ?? '';

		cornellSummary = note.cornellSummary ?? '';

		status = '';

	}



	function deleteNote(noteId: string) {

		profileStore.patch((profile) => ({

			...profile,

			notes: removeNote(profile.notes, noteId)

		}));

		if (editingId === noteId) resetForm();

		status = dynamicMessage('dyn.notes.deleted', $settings.ui);

		notifyUserI18n('dyn.notes.deleted', 'minimal');

	}

</script>



<svelte:head>

	<title>Notes — Accessible</title>

</svelte:head>



<BiHeading fr="Mes notes" key="page.notes.title" />

<p>

	<BiText

		fr="Prenez des notes structurées sur votre appareil. Exportez en Markdown. Format Cornell disponible pour cours et révisions."

		key="page.notes.intro"

	/>

</p>



<OnboardingTestReturn moduleLabel="Notes" />

<section class="card note-editor" aria-labelledby="editor-heading">

	<h3 id="editor-heading">{editingId ? 'Modifier la note' : 'Nouvelle note'}</h3>



	<fieldset class="note-format-fieldset">

		<legend><BiText fr="Format de note" key="page.notes.formatLegend" inline /></legend>

		<div class="note-format-options">

			<label class="note-format-option">

				<input type="radio" name="note-format" value="simple" bind:group={format} />

				<BiText fr="Note simple" key="page.notes.formatSimple" inline />

			</label>

			<label class="note-format-option">

				<input type="radio" name="note-format" value="cornell" bind:group={format} />

				<BiText fr="Format Cornell" key="page.notes.formatCornell" inline />

			</label>

		</div>

	</fieldset>



	<label for="note-title"><BiText fr="Titre" key="page.notes.titleLabel" inline /></label>

	<input

		id="note-title"

		type="text"

		bind:value={title}

		placeholder={configLabel('Ex. : Cours de maths — fractions', 'cfg.ph.noteTitle', $settings.ui)}

	/>



	{#if format === 'cornell'}

		<label for="note-cue"><BiText fr="Mots-clés / questions (colonne gauche)" key="page.notes.cornellCue" inline /></label>

		<textarea id="note-cue" rows="4" bind:value={cornellCue} placeholder={configLabel('Questions, dates, vocabulaire…', 'cfg.ph.noteCornellCue', $settings.ui)}></textarea>



		<label for="note-body"><BiText fr="Notes de cours (zone principale)" key="page.notes.cornellBody" inline /></label>

		<textarea id="note-body" rows="8" bind:value={body} placeholder={configLabel('Contenu du cours…', 'cfg.ph.noteCornellBody', $settings.ui)}></textarea>



		<label for="note-summary"><BiText fr="Résumé (bas de page)" key="page.notes.cornellSummary" inline /></label>

		<textarea id="note-summary" rows="3" bind:value={cornellSummary} placeholder={configLabel('Synthèse en quelques phrases…', 'cfg.ph.noteCornellSummary', $settings.ui)}></textarea>

	{:else}

		<label for="note-body-simple"><BiText fr="Contenu" key="page.notes.bodyLabel" inline /></label>

		<textarea

			id="note-body-simple"

			rows="8"

			bind:value={body}

			placeholder={configLabel('Écrivez vos idées, résumés ou questions…', 'cfg.ph.noteSimple', $settings.ui)}

		></textarea>

	{/if}



	<div class="note-editor-actions">

		<button type="button" class="btn btn-primary" onclick={saveNote}>

			{editingId ? 'Enregistrer' : 'Créer la note'}

		</button>

		{#if editingId}

			<button type="button" class="btn btn-secondary" onclick={resetForm}>Annuler</button>

		{/if}

	</div>



	{#if status}

		<p class="note-status" role="status">{status}</p>

	{/if}

</section>



{#if notes.length === 0}

	<p class="note-empty card">Aucune note. Créez-en une ci-dessus.</p>

{:else}

	<div class="note-list">

		{#each notes as note (note.id)}

			<NoteCard {note} onedit={startEdit} ondelete={deleteNote} />

		{/each}

	</div>

{/if}



<style>

	.note-format-fieldset {

		border: 0;

		padding: 0;

		margin: 0 0 var(--space-md);

		display: block;

	}

	.note-format-fieldset legend {

		margin-bottom: var(--space-xs);

		font-weight: 600;

	}



	.note-format-options {

		display: flex;

		flex-wrap: wrap;

		align-items: center;

		gap: var(--space-md) var(--space-xl);

	}



	.note-format-option {

		display: inline-flex;

		align-items: center;

		gap: var(--space-sm);

		width: fit-content;

		padding: var(--space-xs) 0;

		cursor: pointer;

		min-height: var(--btn-min-height);

	}

	.note-format-option :global(.bilingual-text) {

		display: inline-flex;

	}



	.note-editor label {

		display: block;

		font-weight: 600;

		margin: var(--space-md) 0 var(--space-xs);

	}



	.note-editor label:first-of-type {

		margin-top: 0;

	}

	.note-editor .note-format-option {

		display: inline-flex;

		align-items: center;

		gap: var(--space-sm);

		width: fit-content;

		min-height: var(--btn-min-height);

		margin: 0;

		padding: var(--space-xs) 0;

		cursor: pointer;

	}

	.note-editor .note-format-option :global(.bilingual-text) {

		display: inline-flex;

	}

	.note-format-option input[type='radio'] {

		flex: 0 0 auto;

		width: 1.25rem;

		height: 1.25rem;

		min-height: 0;

		margin: 0;

		padding: 0;

	}



	.note-editor input:not([type='radio']),

	.note-editor textarea {

		width: 100%;

		padding: var(--space-sm) var(--space-md);

		border: 1px solid var(--color-border);

		border-radius: var(--radius);

		font: inherit;

		line-height: 1.6;

	}



	.note-editor input:not([type='radio']) {

		min-height: var(--btn-min-height);

	}



	.note-editor-actions {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-sm);

		margin-top: var(--space-md);

	}



	.note-status {

		margin-top: var(--space-md);

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.note-empty {

		margin-top: var(--space-lg);

		color: var(--color-text-muted);

	}



	.note-list {

		display: grid;

		gap: var(--space-lg);

		margin-top: var(--space-lg);

	}

</style>


