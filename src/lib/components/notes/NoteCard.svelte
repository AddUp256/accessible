<script lang="ts">
	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import { noteToMarkdown, sanitizeFilename } from '$lib/modules/notes/note';
	import { downloadNoteDocx, downloadNoteOdt } from '$lib/services/export';
	import { downloadTextFile } from '$lib/services/export/download';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { settings } from '$lib/stores/profile';
	import type { Note } from '$lib/types/profile';

	let {
		note,
		onedit,
		ondelete
	}: {
		note: Note;
		onedit?: (note: Note) => void;
		ondelete?: (noteId: string) => void;
	} = $props();

	function exportMarkdown() {
		const filename = `accessible-note-${sanitizeFilename(note.title)}.md`;
		downloadTextFile(noteToMarkdown(note), filename, 'text/markdown;charset=utf-8');
	}

	function formatDate(iso: string): string {
		return iso.slice(0, 10);
	}
</script>

<article class="note-card card">
	<header class="note-card-header">
		<h3>{note.title}</h3>
		<small>Mis à jour le {formatDate(note.updatedAt)}</small>
	</header>

	{#if note.format === 'cornell'}
		<div class="note-cornell-preview">
			{#if note.cornellCue?.trim()}
				<p><strong>Mots-clés :</strong> {note.cornellCue}</p>
			{/if}
			{#if note.body.trim()}
				<p>{note.body.length > 160 ? `${note.body.slice(0, 157)}…` : note.body}</p>
			{/if}
			{#if note.cornellSummary?.trim()}
				<p><strong>Résumé :</strong> {note.cornellSummary}</p>
			{/if}
		</div>
	{:else if note.body.trim()}
		<p class="note-preview">{note.body.length > 200 ? `${note.body.slice(0, 197)}…` : note.body}</p>
	{:else}
		<p class="note-preview note-preview--empty">Note vide.</p>
	{/if}

	<div class="note-actions">
		<button type="button" class="btn btn-secondary" onclick={() => onedit?.(note)}>Modifier</button>
		<button type="button" class="btn btn-secondary" onclick={exportMarkdown}>
			<BiText fr="Export Markdown" key="mod.notes.exportMarkdown" inline />
		</button>
		<button type="button" class="btn btn-secondary" onclick={() => downloadNoteOdt(note)}>
			<BiText fr="Export ODT" key="mod.notes.exportOdt" inline />
		</button>
		<button type="button" class="btn btn-secondary" onclick={() => downloadNoteDocx(note)}>
			<BiText fr="Export DOCX" key="mod.notes.exportDocx" inline />
		</button>
		<ReadAloudButton
			text={`${note.title}. ${note.format === 'cornell' ? `${note.cornellCue ?? ''}. ${note.body}. ${note.cornellSummary ?? ''}` : note.body}`}
			rate={$settings.reading.ttsRate}
			label="Lire"
		/>
		<button
			type="button"
			class="btn btn-secondary"
			data-confirm-key="dyn.notes.deleteConfirm"
			onclick={() => ondelete?.(note.id)}
		>
			Supprimer
		</button>
	</div>
</article>

<style>
	.note-card-header h3 {
		margin: 0 0 var(--space-xs);
	}

	.note-card-header small {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.note-preview {
		margin: var(--space-md) 0;
		white-space: pre-wrap;
		line-height: 1.6;
	}

	.note-cornell-preview {
		margin: var(--space-md) 0;
		display: grid;
		gap: var(--space-sm);
		line-height: 1.6;
	}

	.note-cornell-preview p {
		margin: 0;
	}

	.note-preview--empty {
		color: var(--color-text-muted);
		font-style: italic;
	}

	.note-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		align-items: flex-start;
	}
</style>
