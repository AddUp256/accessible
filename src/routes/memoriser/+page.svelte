<script lang="ts">
	// R?le : Page SvelteKit /routes/memoriser : assemble l?interface utilisateur et les actions de cette zone.

	import FlashcardStudy from '$lib/components/memorization/FlashcardStudy.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { FLASHCARD_TEMPLATES } from '$lib/config/flashcard-templates';
	import {
		addCardToDeck,
		addDeck,
		createDeck,
		createFlashcard,
		removeCardFromDeck,
		removeDeck,
		updateCardSchedule
	} from '$lib/modules/memorization/flashcards';
	import {
		applyReview,
		countDueCards,
		formatNextReview,
		type ReviewRating
	} from '$lib/modules/memorization/spaced-repetition';
	import { configLabel, confirmDynamicMessage, dynamicMessage, FLASHCARD_I18N_KEYS } from '$lib/i18n';
	import { downloadDeckAnkiCsv } from '$lib/services/export';
	import { profileStore, settings } from '$lib/stores/profile';

	let newDeckTitle = $state('');
	let selectedDeckId = $state<string | null>(null);
	let cardFront = $state('');
	let cardBack = $state('');
	let status = $state('');

	const decks = $derived($profileStore.memorization.decks);
	const selectedDeck = $derived(
		selectedDeckId ? decks.find((deck) => deck.id === selectedDeckId) : null
	);
	const ankiExportHelp =
		'Télécharge un fichier CSV compatible avec l’import Anki : recto, verso et nom du deck. Importez ensuite ce fichier dans Anki sur votre ordinateur.';

	function createEmptyDeck() {
		if (!newDeckTitle.trim()) {
			status = dynamicMessage('dyn.memorize.needDeckTitle', $settings.ui);
			return;
		}
		const deck = createDeck(newDeckTitle);
		profileStore.patch((profile) => ({
			...profile,
			memorization: addDeck(profile.memorization, deck)
		}));
		selectedDeckId = deck.id;
		newDeckTitle = '';
		status = dynamicMessage('dyn.memorize.deckCreated', $settings.ui);
	}

	function createFromTemplate(templateId: string) {
		const template = FLASHCARD_TEMPLATES.find((item) => item.id === templateId);
		if (!template) return;

		const title = configLabel(template.title, FLASHCARD_I18N_KEYS[template.id], $settings.ui);

		const deck = createDeck(
			template.title,
			template.cards.map((card) => createFlashcard(card.front, card.back))
		);
		profileStore.patch((profile) => ({
			...profile,
			memorization: addDeck(profile.memorization, deck)
		}));
		selectedDeckId = deck.id;
		status = dynamicMessage('dyn.memorize.deckCreatedNamed', $settings.ui, { name: title });
	}

	function addCard() {
		if (!selectedDeckId) {
			status = dynamicMessage('dyn.memorize.needDeck', $settings.ui);
			return;
		}
		if (!cardFront.trim() || !cardBack.trim()) {
			status = dynamicMessage('dyn.memorize.needCardFields', $settings.ui);
			return;
		}

		const deckId = selectedDeckId;
		profileStore.patch((profile) => ({
			...profile,
			memorization: addCardToDeck(
				profile.memorization,
				deckId,
				createFlashcard(cardFront, cardBack)
			)
		}));
		cardFront = '';
		cardBack = '';
		status = dynamicMessage('dyn.memorize.cardAdded', $settings.ui);
	}

	function deleteDeck(deckId: string) {
		if (!confirm(confirmDynamicMessage('dyn.memorize.deleteDeckConfirm'))) return;
		profileStore.patch((profile) => ({
			...profile,
			memorization: removeDeck(profile.memorization, deckId)
		}));
		if (selectedDeckId === deckId) selectedDeckId = null;
		status = dynamicMessage('dyn.memorize.deckDeleted', $settings.ui);
	}

	function deleteCard(deckId: string, cardId: string) {
		profileStore.patch((profile) => ({
			...profile,
			memorization: removeCardFromDeck(profile.memorization, deckId, cardId)
		}));
	}

	function handleReview(deckId: string, cardId: string, rating: ReviewRating) {
		profileStore.patch((profile) => {
			const deck = profile.memorization.decks.find((item) => item.id === deckId);
			const card = deck?.cards.find((item) => item.id === cardId);
			if (!card) return profile;

			const schedule = applyReview(card.schedule, rating);
			return {
				...profile,
				memorization: updateCardSchedule(profile.memorization, deckId, cardId, schedule)
			};
		});
	}

	function exportDeckAnki(deck: (typeof decks)[number]) {
		if (deck.cards.length === 0) {
			status = dynamicMessage('dyn.memorize.exportEmpty', $settings.ui);
			return;
		}
		downloadDeckAnkiCsv(deck);
		status = dynamicMessage('dyn.memorize.exportAnki', $settings.ui);
	}
</script>

<svelte:head>
	<title>Mémoriser — Accessible</title>
</svelte:head>

<BiHeading fr="Mémoriser avec des flashcards" key="page.memorize.title" />
<p>
	<BiText fr="Créez des cartes question / réponse et révisez à votre rythme. Tout reste sur votre appareil." key="page.memorize.intro" />
</p>

<section class="card deck-create" aria-labelledby="deck-create-heading">
	<h3 id="deck-create-heading">Nouveau deck</h3>

	<label for="deck-title">Titre du deck</label>
	<input
		id="deck-title"
		type="text"
		bind:value={newDeckTitle}
		placeholder={configLabel('Ex. : Vocabulaire anglais', 'cfg.ph.flashcardDeck', $settings.ui)}
	/>

	<button type="button" class="btn btn-primary" onclick={createEmptyDeck}>Créer un deck vide</button>

	<p class="mem-hint">Modèles :</p>
	<div class="template-actions">
		{#each FLASHCARD_TEMPLATES as template}
			<button type="button" class="btn btn-secondary" onclick={() => createFromTemplate(template.id)}>
				{configLabel(template.title, FLASHCARD_I18N_KEYS[template.id], $settings.ui)}
			</button>
		{/each}
	</div>
</section>

{#if status}
	<p class="mem-status" role="status">{status}</p>
{/if}

{#if decks.length > 0}
	<section class="card deck-picker" aria-labelledby="deck-picker-heading">
		<h3 id="deck-picker-heading">Mes decks ({decks.length})</h3>
		<div class="deck-list">
			{#each decks as deck (deck.id)}
				<div class="deck-item">
					<button
						type="button"
						class="btn"
						class:btn-primary={selectedDeckId === deck.id}
						class:btn-secondary={selectedDeckId !== deck.id}
						onclick={() => (selectedDeckId = deck.id)}
					>
						{deck.title} ({deck.cards.length}{countDueCards(deck.cards) > 0
							? ` · ${countDueCards(deck.cards)} à réviser`
							: ''})
					</button>
					<button
						type="button"
						class="btn btn-secondary deck-delete"
						onclick={() => deleteDeck(deck.id)}
					>
						Supprimer
					</button>
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if selectedDeck}
	<section class="card card-add" aria-labelledby="card-add-heading">
		<h3 id="card-add-heading">Ajouter une carte — {selectedDeck.title}</h3>

		<div class="deck-export">
			<button
				type="button"
				class="btn btn-secondary"
				title={ankiExportHelp}
				aria-describedby="anki-export-help"
				onclick={() => exportDeckAnki(selectedDeck)}
			>
				<BiText fr="Exporter CSV Anki" key="mod.memorize.exportAnki" inline />
			</button>
			<p id="anki-export-help" class="anki-export-help">{ankiExportHelp}</p>
		</div>

		<label for="card-front">Recto (question)</label>
		<input id="card-front" type="text" bind:value={cardFront} placeholder={configLabel('Ex. : What is…?', 'cfg.ph.flashcardFront', $settings.ui)} />

		<label for="card-back">Verso (réponse)</label>
		<textarea id="card-back" rows="3" bind:value={cardBack} placeholder={configLabel("Ex. : C'est…", 'cfg.ph.flashcardBack', $settings.ui)}></textarea>

		<button type="button" class="btn btn-primary" onclick={addCard}>Ajouter la carte</button>

		{#if selectedDeck.cards.length > 0}
			<ul class="card-list">
				{#each selectedDeck.cards as card (card.id)}
					<li>
						<strong>{card.front}</strong> → {card.back}
						<span class="card-schedule">{formatNextReview(card.schedule)}</span>
						<button
							type="button"
							class="btn btn-secondary card-delete"
							onclick={() => deleteCard(selectedDeck.id, card.id)}
						>
							×
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<FlashcardStudy
		cards={selectedDeck.cards}
		deckTitle={selectedDeck.title}
		onreview={(cardId, rating) => handleReview(selectedDeck.id, cardId, rating)}
	/>
{/if}

<style>
	.deck-export {
		margin-bottom: var(--space-md);
	}

	.anki-export-help {
		max-width: 42rem;
		margin: var(--space-xs) 0 0;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.deck-create label,
	.card-add label {
		display: block;
		font-weight: 600;
		margin: var(--space-md) 0 var(--space-xs);
	}

	.deck-create label:first-of-type {
		margin-top: 0;
	}

	.deck-create input,
	.card-add input,
	.card-add textarea {
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
		min-height: var(--btn-min-height);
	}

	.mem-hint {
		margin: var(--space-lg) 0 var(--space-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.template-actions,
	.deck-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.deck-item {
		display: flex;
		gap: var(--space-xs);
		align-items: stretch;
	}

	.mem-status {
		margin: var(--space-md) 0;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
	}

	.card-list {
		margin: var(--space-lg) 0 0;
		padding-left: var(--space-lg);
	}

	.card-list li {
		margin-bottom: var(--space-sm);
	}

	.card-schedule {
		display: inline-block;
		margin-left: var(--space-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.card-delete {
		margin-left: var(--space-sm);
		min-width: var(--btn-min-height);
		padding: 0 var(--space-sm);
	}
</style>
