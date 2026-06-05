<script lang="ts">
	import { arasaacPictogramImageUrl } from '$lib/config/arasaac';
	import CommunicationCardDisplay from '$lib/components/communicator/CommunicationCardDisplay.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import {
		createPersonalCard,
		removePersonalCard,
		addPersonalCard,
		updatePersonalCard
	} from '$lib/modules/communicator/cards';
	import { resolvePersonalCard } from '$lib/modules/communicator/card-display';
	import { profileStore, settings } from '$lib/stores/profile';
	import { bilingualLabel, bilingualUi, confirmDynamicMessage, dynamicMessage, configLabel } from '$lib/i18n';

	let selectedId = $state<string | null>(null);
	let editing = $state(false);
	let label = $state('');
	let message = $state('');
	let editLabel = $state('');
	let editMessage = $state('');
	let formStatus = $state('');

	const personalCards = $derived($profileStore.communicator.personalCards);
	const selectedCard = $derived(
		selectedId ? personalCards.find((card) => card.id === selectedId) : null
	);
	const selectedDisplay = $derived(
		selectedCard ? resolvePersonalCard(selectedCard, $settings.ui) : null
	);

	const renameLabel = $derived(
		bilingualUi('Modifier la carte', 'mod.comm.personal.editTitle', $settings.ui)
	);
	const deleteLabel = $derived(bilingualLabel('Supprimer', 'common.delete', $settings.ui));

	function addCard() {
		if (!label.trim() || !message.trim()) {
			formStatus = dynamicMessage('dyn.cards.needFields', $settings.ui);
			return;
		}

		profileStore.patch((profile) => ({
			...profile,
			communicator: addPersonalCard(
				profile.communicator,
				createPersonalCard(label, message)
			)
		}));

		label = '';
		message = '';
		formStatus = dynamicMessage('dyn.cards.added', $settings.ui);
	}

	function deleteCard(cardId: string) {
		if (!confirm(confirmDynamicMessage('dyn.cards.deleteConfirm'))) return;
		profileStore.patch((profile) => ({
			...profile,
			communicator: removePersonalCard(profile.communicator, cardId)
		}));
		if (selectedId === cardId) selectedId = null;
	}

	function startEdit() {
		if (!selectedCard) return;
		editLabel = selectedCard.label;
		editMessage = selectedCard.message;
		editing = true;
		formStatus = '';
	}

	function saveEdit() {
		if (!selectedCard || !editLabel.trim() || !editMessage.trim()) {
			formStatus = dynamicMessage('dyn.cards.needFields', $settings.ui);
			return;
		}
		profileStore.patch((profile) => ({
			...profile,
			communicator: updatePersonalCard(profile.communicator, selectedCard.id, {
				label: editLabel,
				message: editMessage
			})
		}));
		editing = false;
		formStatus = dynamicMessage('dyn.cards.modified', $settings.ui);
	}
</script>

<section class="card personal-cards" aria-labelledby="personal-cards-heading">
	<BiHeading fr="Mes cartes personnelles" key="mod.comm.personal.title" level={3} id="personal-cards-heading" />
	<p class="personal-hint">
		<BiText fr="Créez ou modifiez des phrases que vous utilisez souvent." key="mod.comm.personal.hint" />
	</p>

	<div class="personal-form">
		<label for="personal-label"><BiText fr="Titre court" key="mod.comm.personal.shortTitle" inline /></label>
		<input id="personal-label" type="text" bind:value={label} placeholder={configLabel('Ex. : Besoin de calme', 'cfg.ph.personalCardTitle', $settings.ui)} />

		<label for="personal-message"><BiText fr="Message à montrer" key="mod.comm.personal.message" inline /></label>
		<textarea
			id="personal-message"
			rows="3"
			bind:value={message}
			placeholder={configLabel("Ex. : J'ai besoin d'un endroit calme.", 'cfg.ph.personalCardMessage', $settings.ui)}
		></textarea>

		<button type="button" class="btn btn-primary" onclick={addCard}>
			<BiText fr="Ajouter ma carte" key="mod.comm.personal.add" inline />
		</button>
	</div>

	{#if formStatus}
		<p class="personal-status" role="status">{formStatus}</p>
	{/if}

	{#if selectedCard && selectedDisplay && !editing}
		<CommunicationCardDisplay
			label={selectedDisplay.label}
			message={selectedDisplay.message}
			pictogramId={selectedCard.pictogramId}
			onclose={() => (selectedId = null)}
		/>
		<div class="personal-edit-actions">
			<button type="button" class="btn btn-secondary" onclick={startEdit}>
				<BilingualText primary={renameLabel.primary} secondary={renameLabel.secondary} inline />
			</button>
		</div>
	{/if}

	{#if editing && selectedCard}
		<section class="personal-edit-form" aria-labelledby="edit-personal-heading">
			<h4 id="edit-personal-heading">
				<BiText fr="Modifier la carte" key="mod.comm.personal.editTitle" inline /> « {selectedCard.label} »
			</h4>
			<label>
				<span><BiText fr="Titre court" key="mod.comm.personal.shortTitle" inline /></span>
				<input type="text" bind:value={editLabel} />
			</label>
			<label>
				<span><BiText fr="Message à montrer" key="mod.comm.personal.message" inline /></span>
				<textarea rows="3" bind:value={editMessage}></textarea>
			</label>
			<div class="personal-edit-actions">
				<button type="button" class="btn btn-primary" onclick={saveEdit}>
					<BiText fr="Enregistrer" key="common.save" inline />
				</button>
				<button type="button" class="btn btn-secondary" onclick={() => (editing = false)}>Annuler</button>
			</div>
		</section>
	{/if}

	{#if personalCards.length > 0}
		<div class="personal-grid">
			{#each personalCards as card (card.id)}
				<div class="personal-card-item">
					<button
						type="button"
						class="btn btn-secondary personal-card-btn"
						onclick={() => {
							selectedId = card.id;
							editing = false;
						}}
					>
						{#if card.pictogramId !== undefined}
							<img
								class="personal-card-thumb"
								src={arasaacPictogramImageUrl(card.pictogramId)}
								alt=""
								width="32"
								height="32"
							/>
						{/if}
						{card.label}
					</button>
					<button
						type="button"
						class="btn btn-secondary personal-delete"
						aria-label="{deleteLabel} {card.label}"
						onclick={() => deleteCard(card.id)}
					>
						×
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<p class="personal-empty">
			<BiText fr="Aucune carte personnelle pour l'instant." key="mod.comm.personal.empty" />
		</p>
	{/if}
</section>

<style>
	.personal-hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--space-md);
	}

	.personal-form,
	.personal-edit-form {
		display: grid;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.personal-form label,
	.personal-edit-form label {
		font-weight: 600;
		display: grid;
		gap: var(--space-xs);
	}

	.personal-form input,
	.personal-form textarea,
	.personal-edit-form input,
	.personal-edit-form textarea {
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
		min-height: var(--btn-min-height);
	}

	.personal-grid {
		display: grid;
		gap: var(--space-sm);
	}

	.personal-card-item {
		display: flex;
		gap: var(--space-sm);
		align-items: stretch;
	}

	.personal-card-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
	}

	.personal-card-thumb {
		object-fit: contain;
		flex-shrink: 0;
	}

	.personal-delete {
		min-width: var(--btn-min-height);
		padding: 0 var(--space-sm);
	}

	.personal-edit-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.personal-empty,
	.personal-status {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
