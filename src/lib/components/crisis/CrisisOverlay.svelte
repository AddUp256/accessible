<script lang="ts">
	// R?le : Composant Svelte de mode pause : encapsule l?affichage et les interactions r?utilisables.

	import { CRISIS_CARDS } from '$lib/config/crisis-cards';
	import { tts } from '$lib/services/tts';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let selectedCard = $state<string | null>(null);
	let elapsedSeconds = $state(0);
	let timerId: ReturnType<typeof setInterval> | undefined;

	function formatTime(total: number): string {
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function startPause() {
		tts.stop();
		elapsedSeconds = 0;
		if (timerId) clearInterval(timerId);
		timerId = setInterval(() => {
			elapsedSeconds += 1;
		}, 1000);
	}

	function stopPause() {
		if (timerId) clearInterval(timerId);
		timerId = undefined;
	}

	function resume() {
		stopPause();
		selectedCard = null;
		open = false;
	}

	function showCard(id: string) {
		selectedCard = id;
	}

	$effect(() => {
		if (open) {
			startPause();
		} else {
			stopPause();
			selectedCard = null;
		}

		return () => stopPause();
	});
</script>

{#if open}
	<div class="crisis-overlay" role="dialog" aria-modal="true" aria-labelledby="crisis-title">
		<div class="crisis-panel">
			<BiHeading fr="Mode pause" key="crisis.title" id="crisis-title" />
			<p><BiText fr="Prenez votre temps. Reprenez quand vous voulez." key="crisis.hint" /></p>

			<p class="crisis-timer" aria-live="polite">Temps de pause : {formatTime(elapsedSeconds)}</p>

			{#if selectedCard}
				{@const card = CRISIS_CARDS.find((c) => c.id === selectedCard)}
				{#if card}
					<div class="crisis-card-display card">
						<strong>{card.label}</strong>
						<p>{card.message}</p>
					</div>
				{/if}
			{/if}

			<div class="crisis-cards">
				{#each CRISIS_CARDS as card}
					<button type="button" class="btn btn-secondary" onclick={() => showCard(card.id)}>
						{card.label}
					</button>
				{/each}
			</div>

			<div class="crisis-actions">
				<button type="button" class="btn btn-primary btn-lg" onclick={resume}>
					<BiText fr="Reprendre" key="crisis.resume" inline />
				</button>
				<a class="btn btn-secondary" href="/" onclick={resume}>Fermer l'activité</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.crisis-timer {
		font-size: var(--font-size-lg);
		font-weight: 600;
		margin: var(--space-md) 0;
	}

	.crisis-cards {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		justify-content: center;
		margin: var(--space-lg) 0;
	}

	.crisis-card-display {
		margin-bottom: var(--space-md);
		text-align: left;
		width: 100%;
	}

	.crisis-card-display p {
		margin: var(--space-sm) 0 0;
	}

	.crisis-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
</style>
