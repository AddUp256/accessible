<script lang="ts">
	import { tick } from 'svelte';
	import { page } from '$app/stores';

	const CONTACT_EMAIL = 'contact@atelier-eden.pro';

	const mailTypes = [
		{
			id: 'help',
			label: 'Demande d’aide',
			subject: 'Demande d’aide avec Accessible'
		},
		{
			id: 'bug',
			label: 'Signaler un bug',
			subject: 'Bug à signaler dans Accessible'
		},
		{
			id: 'install',
			label: 'Problème d’installation',
			subject: 'Difficulté d’installation Accessible'
		},
		{
			id: 'accessibility',
			label: 'Problème d’accessibilité',
			subject: 'Accessibilité à améliorer dans Accessible'
		},
		{
			id: 'audio',
			label: 'Audio ou lecture vocale',
			subject: 'Difficulté audio dans Accessible'
		},
		{
			id: 'onboarding',
			label: 'Parcours de départ',
			subject: 'Question sur la personnalisation de départ'
		},
		{
			id: 'feedback',
			label: 'Retour testeur',
			subject: 'Retour de test sur Accessible'
		},
		{
			id: 'other',
			label: 'Autre difficulté',
			subject: 'Difficulté avec Accessible'
		}
	] as const;

	let open = $state(false);
	let selectedType = $state<(typeof mailTypes)[number]['id']>('help');
	let details = $state('');
	let attachmentName = $state('');
	let status = $state('');
	let openerButton: HTMLButtonElement | null = $state(null);
	let firstField: HTMLSelectElement | null = $state(null);

	const selectedMailType = $derived(
		mailTypes.find((type) => type.id === selectedType) ?? mailTypes[0]
	);

	$effect(() => {
		if (typeof window === 'undefined' || !open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closePanel();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});

	async function openPanel() {
		open = true;
		status = '';
		await tick();
		firstField?.focus();
	}

	function closePanel() {
		open = false;
		status = '';
		void tick().then(() => openerButton?.focus());
	}

	function onAttachmentSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		attachmentName = file?.name ?? '';
	}

	function buildBody(): string {
		const pageUrl = $page.url.pathname;
		const attachmentLine = attachmentName
			? `\n\nPièce jointe à ajouter manuellement : ${attachmentName}`
			: '';
		const detailBlock = details.trim() || 'Décrivez ici ce qui se passe, ce que vous faisiez, et ce que vous attendiez.';

		return [
			'Bonjour,',
			'',
			`Type de demande : ${selectedMailType.label}`,
			`Page concernée : ${pageUrl}`,
			'',
			detailBlock,
			attachmentLine,
			'',
			'Merci.',
			'',
			'Note : Accessible ne joint pas automatiquement les fichiers depuis ce bouton. Ajoutez la pièce jointe dans votre messagerie avant l’envoi si nécessaire.'
		].join('\n');
	}

	function mailtoUrl(): string {
		const params = new URLSearchParams({
			subject: `[Accessible] ${selectedMailType.subject}`,
			body: buildBody()
		});
		return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
	}

	function prepareMail() {
		status = attachmentName
			? 'Le mail va s’ouvrir prérempli. Ajoutez la pièce jointe dans votre messagerie avant l’envoi.'
			: 'Le mail va s’ouvrir prérempli.';
		window.location.href = mailtoUrl();
	}

	async function copyMessage() {
		const message = `À : ${CONTACT_EMAIL}\nObjet : [Accessible] ${selectedMailType.subject}\n\n${buildBody()}`;
		try {
			await navigator.clipboard.writeText(message);
			status = 'Message copié. Vous pouvez le coller dans votre messagerie.';
		} catch {
			status = 'Copie indisponible. Vous pouvez sélectionner le texte du formulaire et le recopier.';
		}
	}
</script>

<div class="support-root" data-interface-tts-skip>
	<button
		bind:this={openerButton}
		type="button"
		class="support-bubble"
		onclick={openPanel}
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-controls="support-mail-panel"
		aria-label="Demander de l’aide ou signaler un bug"
	>
		Aide
	</button>

	{#if open}
		<div
			id="support-mail-panel"
			class="support-panel"
			role="dialog"
			aria-labelledby="support-mail-title"
			aria-describedby="support-mail-hint"
		>
			<div class="support-heading">
				<h2 id="support-mail-title">Besoin d’aide ?</h2>
				<button
					type="button"
					class="btn btn-secondary support-close"
					onclick={closePanel}
					aria-label="Fermer l’aide"
				>
					×
				</button>
			</div>

			<p id="support-mail-hint" class="support-hint">
				Prépare un mail à {CONTACT_EMAIL}. Choisissez le sujet, ajoutez une précision et, si besoin,
				joignez une capture dans votre messagerie.
			</p>

			<label class="support-field" for="support-mail-type">
				<span>Type de demande</span>
				<select id="support-mail-type" bind:this={firstField} bind:value={selectedType}>
					{#each mailTypes as type}
						<option value={type.id}>{type.label}</option>
					{/each}
				</select>
			</label>

			<label class="support-field" for="support-mail-details">
				<span>Détail utile</span>
				<textarea
					id="support-mail-details"
					bind:value={details}
					rows="5"
					placeholder="Exemple : la page, le bouton utilisé, le résultat attendu, le message d’erreur."
				></textarea>
			</label>

			<label class="support-field" for="support-mail-attachment">
				<span>Pièce jointe</span>
				<input
					id="support-mail-attachment"
					type="file"
					accept="image/*,.pdf,.txt,.log,.json,.zip"
					onchange={onAttachmentSelected}
				/>
			</label>
			{#if attachmentName}
				<p class="support-hint">
					Fichier sélectionné : <strong>{attachmentName}</strong>. Il faudra l’ajouter dans la
					messagerie ouverte.
				</p>
			{/if}

			<div class="support-actions">
				<button type="button" class="btn btn-primary" onclick={prepareMail}>Préparer le mail</button>
				<button type="button" class="btn btn-secondary" onclick={copyMessage}>Copier le message</button>
			</div>

			{#if status}
				<p class="support-status" role="status">{status}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.support-root {
		position: fixed;
		right: var(--space-lg);
		bottom: var(--space-lg);
		z-index: 850;
	}

	.support-bubble {
		min-width: 4.5rem;
		min-height: 4.5rem;
		border-radius: 999px;
		border: 2px solid var(--color-border);
		background: var(--color-accent);
		color: var(--color-accent-text);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.2);
	}

	.support-bubble:hover {
		background: var(--color-accent-hover);
	}

	.support-panel {
		position: absolute;
		right: 0;
		bottom: calc(100% + var(--space-sm));
		width: min(26rem, calc(100vw - 2rem));
		max-height: min(42rem, calc(100vh - 7rem));
		overflow: auto;
		padding: var(--space-lg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg-elevated);
		color: var(--color-text);
		box-shadow: 0 1rem 2rem rgb(0 0 0 / 0.22);
	}

	.support-heading {
		position: sticky;
		top: calc(-1 * var(--space-lg));
		z-index: 1;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-sm);
		margin: calc(-1 * var(--space-lg)) 0 var(--space-sm);
		padding: var(--space-lg) 0 var(--space-sm);
		background: var(--color-bg-elevated);
	}

	.support-heading h2 {
		margin: 0;
		font-size: var(--font-size-lg);
	}

	.support-close {
		min-width: var(--btn-min-height);
		width: var(--btn-min-height);
		padding: 0;
		font-size: var(--font-size-lg);
	}

	.support-hint,
	.support-status {
		margin: 0 0 var(--space-md);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.support-field {
		display: grid;
		gap: var(--space-xs);
		margin-bottom: var(--space-md);
		font-weight: 600;
	}

	.support-field select,
	.support-field input,
	.support-field textarea {
		width: 100%;
		min-height: var(--btn-min-height);
		border-radius: var(--radius);
		padding: var(--space-sm);
		font: inherit;
		font-weight: 400;
	}

	.support-field textarea {
		resize: vertical;
		min-height: 8rem;
	}

	.support-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.support-status {
		margin: var(--space-md) 0 0;
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
		color: var(--color-text);
	}

	@media (max-width: 40rem) {
		.support-root {
			right: var(--space-md);
			bottom: var(--space-md);
		}

		.support-panel {
			position: fixed;
			left: var(--space-md);
			right: var(--space-md);
			bottom: calc(var(--space-md) + 5rem);
			width: auto;
			max-height: calc(100vh - 7rem);
		}
	}
</style>
