<script lang="ts">
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		REVIEW_RATING_LABELS,
		applyReview,
		countDueCards,
		filterDueCards,
		type ReviewRating
	} from '$lib/modules/memorization/spaced-repetition';
	import { shuffleCards } from '$lib/modules/memorization/flashcards';
	import type { Flashcard } from '$lib/types/profile';
	import { settings } from '$lib/stores/profile';
	import { bilingualLabel } from '$lib/i18n';

	let {
		cards,
		deckTitle,
		onreview
	}: {
		cards: Flashcard[];
		deckTitle: string;
		onreview?: (cardId: string, rating: ReviewRating) => void;
	} = $props();

	let sessionCards = $state<Flashcard[]>([]);
	let index = $state(0);
	let revealed = $state(false);
	let started = $state(false);
	let completed = $state(false);
	let reviewAll = $state(false);

	const dueCount = $derived(countDueCards(cards));
	const reviewTitle = $derived(
		bilingualLabel('Réviser', 'mod.memorize.study.title', $settings.ui)
	);
	const current = $derived(sessionCards[index]);
	const progress = $derived(
		sessionCards.length > 0 ? `${index + 1} / ${sessionCards.length}` : '0 / 0'
	);

	function startSession(allCards: boolean) {
		reviewAll = allCards;
		const pool = allCards ? cards : filterDueCards(cards);
		sessionCards = shuffleCards(pool);
		index = 0;
		revealed = false;
		started = true;
		completed = false;
	}

	function reveal() {
		revealed = true;
	}

	function rateCard(rating: ReviewRating) {
		if (current) {
			onreview?.(current.id, rating);
		}
		nextCard();
	}

	function nextCard() {
		if (index >= sessionCards.length - 1) {
			started = false;
			completed = true;
			return;
		}
		index += 1;
		revealed = false;
	}

	function restart() {
		startSession(reviewAll);
	}
</script>

<section class="study-session card" aria-labelledby="study-heading">
	<h3 id="study-heading">{reviewTitle} — {deckTitle}</h3>

	{#if cards.length === 0}
		<p class="study-empty">
			<BiText fr="Ajoutez des cartes à ce deck pour commencer." key="mod.memorize.study.empty" />
		</p>
	{:else if completed}
		<p class="study-done" role="status">
			<BiText fr="Session terminée. Bravo !" key="mod.memorize.study.done" />
		</p>
		<div class="study-start-actions">
			{#if dueCount > 0}
				<button type="button" class="btn btn-primary" onclick={() => startSession(false)}>
					<BiText fr="Réviser les cartes du jour" key="mod.memorize.study.reviewDue" inline />
					({dueCount})
				</button>
			{/if}
			<button type="button" class="btn btn-secondary" onclick={() => startSession(true)}>
				<BiText fr="Réviser toutes les cartes" key="mod.memorize.study.reviewAll" inline />
			</button>
		</div>
	{:else if !started}
		<p class="study-hint">
			{dueCount > 0
				? `${dueCount} carte${dueCount === 1 ? '' : 's'} à réviser aujourd'hui sur ${cards.length}.`
				: `Aucune carte prévue aujourd'hui. ${cards.length} carte${cards.length === 1 ? '' : 's'} au total.`}
		</p>
		<p class="study-note">
			<BiText
				fr="Indiquez si chaque réponse était difficile, correcte ou facile. L'app planifie la prochaine révision pour vous."
				key="mod.memorize.study.note"
			/>
		</p>
		<div class="study-start-actions">
			<button
				type="button"
				class="btn btn-primary btn-lg"
				disabled={dueCount === 0}
				onclick={() => startSession(false)}
			>
				<BiText fr="Réviser les cartes du jour" key="mod.memorize.study.reviewDue" inline />
				({dueCount})
			</button>
			<button type="button" class="btn btn-secondary" onclick={() => startSession(true)}>
				<BiText fr="Réviser toutes les cartes" key="mod.memorize.study.reviewAll" inline />
			</button>
		</div>
	{:else if current}
		<p class="study-progress" aria-live="polite">
			<BiText fr="Carte" key="mod.memorize.study.cardProgress" inline /> {progress}
		</p>

		<div class="study-card">
			<p class="study-label"><BiText fr="Question" key="mod.memorize.study.question" inline /></p>
			<p class="study-front">{current.front}</p>

			{#if revealed}
				<p class="study-label"><BiText fr="Réponse" key="mod.memorize.study.answer" inline /></p>
				<p class="study-back">{current.back}</p>
			{:else}
				<button type="button" class="btn btn-secondary" onclick={reveal}>
					<BiText fr="Voir la réponse" key="mod.memorize.study.reveal" inline />
				</button>
			{/if}
		</div>

		{#if revealed}
			<fieldset class="study-ratings">
				<legend><BiText fr="Comment s'est passée cette carte ?" key="mod.memorize.study.ratingLegend" inline /></legend>
				<div class="study-rating-actions">
					{#each Object.entries(REVIEW_RATING_LABELS) as [rating, meta] (rating)}
						<button
							type="button"
							class="btn btn-secondary study-rating-btn"
							onclick={() => rateCard(rating as ReviewRating)}
						>
							<span class="study-rating-label">{meta.label}</span>
							<span class="study-rating-hint">{meta.hint}</span>
						</button>
					{/each}
				</div>
			</fieldset>
		{/if}

		<div class="study-actions">
			<button type="button" class="btn btn-secondary" onclick={restart}>Mélanger à nouveau</button>
		</div>
	{/if}
</section>

<style>
	.study-hint,
	.study-empty,
	.study-note {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.study-start-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-md);
	}

	.study-progress {
		font-weight: 600;
		margin-bottom: var(--space-md);
	}

	.study-card {
		padding: var(--space-lg);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		margin-bottom: var(--space-md);
	}

	.study-label {
		margin: 0 0 var(--space-xs);
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.study-front,
	.study-back {
		margin: 0 0 var(--space-lg);
		font-size: var(--font-size-lg);
		line-height: 1.6;
	}

	.study-ratings {
		border: none;
		margin: 0 0 var(--space-md);
		padding: 0;
	}

	.study-ratings legend {
		font-weight: 600;
		margin-bottom: var(--space-sm);
	}

	.study-rating-actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: var(--space-sm);
	}

	.study-rating-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		min-height: calc(var(--btn-min-height) * 1.4);
	}

	.study-rating-label {
		font-weight: 600;
	}

	.study-rating-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.study-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.study-done {
		margin-top: var(--space-md);
		font-weight: 600;
	}
</style>
