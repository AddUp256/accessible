<script lang="ts">
	import {
		BUILT_IN_COMMUNICATION_CARDS,
		COMMUNICATION_CARD_CATEGORIES,
		type BuiltInCommunicationCard,
		type CommunicationCardCategory
	} from '$lib/config/communication-cards';
	import CommunicationCardDisplay from '$lib/components/communicator/CommunicationCardDisplay.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import {
		resolveBuiltInCard,
		setBuiltInCardOverride,
		clearBuiltInCardOverride
	} from '$lib/modules/communicator/card-display';
	import { profileStore, settings } from '$lib/stores/profile';
	import { bilingualUi, configLabel, confirmDynamicMessage, dynamicMessage, COMM_CATEGORY_I18N_KEYS } from '$lib/i18n';

	let {
		onselect
	}: {
		onselect?: (card: { label: string; message: string; emoji?: string }) => void;
	} = $props();

	let selectedId = $state<string | null>(null);
	let editing = $state(false);
	let editLabel = $state('');
	let editMessage = $state('');
	let editStatus = $state('');

	const categories = Object.entries(COMMUNICATION_CARD_CATEGORIES) as [
		CommunicationCardCategory,
		{ label: string }
	][];

	function cardsForCategory(category: CommunicationCardCategory): BuiltInCommunicationCard[] {
		return BUILT_IN_COMMUNICATION_CARDS.filter((card) => card.category === category);
	}

	function selectCard(card: BuiltInCommunicationCard) {
		selectedId = card.id;
		editing = false;
		const resolved = resolveBuiltInCard(card, $profileStore.communicator, $settings.ui);
		onselect?.({ label: resolved.label.primary, message: resolved.message.primary, emoji: card.emoji });
	}

	const selectedCard = $derived(
		selectedId ? BUILT_IN_COMMUNICATION_CARDS.find((card) => card.id === selectedId) : null
	);

	const selectedDisplay = $derived(
		selectedCard
			? resolveBuiltInCard(selectedCard, $profileStore.communicator, $settings.ui)
			: null
	);

	function startEdit() {
		if (!selectedCard) return;
		const override = $profileStore.communicator.builtInCardOverrides[selectedCard.id];
		editLabel = override?.label ?? selectedCard.label;
		editMessage = override?.message ?? selectedCard.message;
		editing = true;
		editStatus = '';
	}

	function saveEdit() {
		if (!selectedCard || !editLabel.trim() || !editMessage.trim()) {
			editStatus = dynamicMessage('dyn.cards.needFields', $settings.ui);
			return;
		}
		profileStore.patch((profile) => ({
			...profile,
			communicator: setBuiltInCardOverride(profile.communicator, selectedCard.id, {
				label: editLabel,
				message: editMessage
			})
		}));
		editing = false;
		editStatus = dynamicMessage('dyn.cards.modified', $settings.ui);
	}

	function resetEdit() {
		if (!selectedCard) return;
		if (!confirm(confirmDynamicMessage('dyn.comm.resetCardConfirm'))) return;
		profileStore.patch((profile) => ({
			...profile,
			communicator: clearBuiltInCardOverride(profile.communicator, selectedCard.id)
		}));
		editing = false;
		editStatus = dynamicMessage('dyn.comm.resetCardDone', $settings.ui);
	}

	const renameLabel = $derived(bilingualUi('Renommer la carte', 'communicator.renameCard', $settings.ui));
</script>

{#if selectedCard && selectedDisplay && !editing}
	<CommunicationCardDisplay
		label={selectedDisplay.label}
		message={selectedDisplay.message}
		emoji={selectedCard.emoji}
		onclose={() => (selectedId = null)}
	/>
	<div class="card-edit-actions">
		<button type="button" class="btn btn-secondary" onclick={startEdit}>
			<BilingualText primary={renameLabel.primary} secondary={renameLabel.secondary} inline />
		</button>
		{#if $profileStore.communicator.builtInCardOverrides[selectedCard.id]}
			<button type="button" class="btn btn-secondary" onclick={resetEdit}>Texte d'origine</button>
		{/if}
	</div>
{/if}

{#if editing && selectedCard}
	<section class="card card-edit-form" aria-labelledby="edit-card-heading">
		<h3 id="edit-card-heading">Modifier la carte « {selectedCard.label} »</h3>
		<label>
			<span>Titre court</span>
			<input type="text" bind:value={editLabel} />
		</label>
		<label>
			<span>Message affiché</span>
			<textarea rows="3" bind:value={editMessage}></textarea>
		</label>
		<div class="card-edit-actions">
			<button type="button" class="btn btn-primary" onclick={saveEdit}>Enregistrer</button>
			<button type="button" class="btn btn-secondary" onclick={() => (editing = false)}>Annuler</button>
		</div>
		{#if editStatus}
			<p role="status">{editStatus}</p>
		{/if}
	</section>
{/if}

{#each categories as [category, meta]}
	{@const cards = cardsForCategory(category)}
	{#if cards.length > 0}
		<section class="card-category" aria-labelledby="category-{category}">
			<h3 id="category-{category}">{configLabel(meta.label, COMM_CATEGORY_I18N_KEYS[category], $settings.ui)}</h3>
			<div class="card-grid">
				{#each cards as card (card.id)}
					{@const display = resolveBuiltInCard(card, $profileStore.communicator, $settings.ui)}
					<button
						type="button"
						class="btn btn-secondary communication-card-btn"
						class:communication-card-btn--active={selectedId === card.id}
						onclick={() => selectCard(card)}
					>
						<span class="card-btn-emoji" aria-hidden="true">{card.emoji}</span>
						<BilingualText primary={display.label.primary} secondary={display.label.secondary} />
					</button>
				{/each}
			</div>
		</section>
	{/if}
{/each}

{#if editStatus && !editing}
	<p class="card-edit-status" role="status">{editStatus}</p>
{/if}

<style>
	.card-category {
		margin-bottom: var(--space-xl);
	}

	.card-category h3 {
		margin: 0 0 var(--space-md);
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: var(--space-sm);
	}

	.communication-card-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
		min-height: calc(var(--btn-min-height) * 1.8);
		text-align: center;
		padding: var(--space-sm);
	}

	.communication-card-btn--active {
		outline: 2px solid var(--color-accent);
	}

	.card-btn-emoji {
		font-size: 1.75rem;
		line-height: 1;
	}

	.card-edit-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin: var(--space-md) 0 var(--space-lg);
	}

	.card-edit-form {
		display: grid;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.card-edit-form label {
		display: grid;
		gap: var(--space-xs);
	}

	.card-edit-form input,
	.card-edit-form textarea {
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
		min-height: var(--btn-min-height);
	}

	.card-edit-status {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
