<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let {
		moduleLabel,
		onSave
	}: {
		moduleLabel: string;
		onSave?: () => void | Promise<void>;
	} = $props();

	let busy = $state(false);
	const active = $derived($page.url.searchParams.get('from') === 'discovery');

	async function saveAndReturn() {
		busy = true;
		try {
			await onSave?.();
			await goto('/onboarding/discovery');
		} finally {
			busy = false;
		}
	}
</script>

{#if active}
	<section class="card onboarding-test-return" aria-label="Retour à la personnalisation">
		<div>
			<strong>Test du module {moduleLabel}</strong>
			<p>
				Réglez ce qui vous convient. Vos choix utiles sont conservés dans votre profil.
			</p>
		</div>
		<button type="button" class="btn btn-primary" disabled={busy} onclick={saveAndReturn}>
			{busy ? 'Enregistrement...' : 'Enregistrer et revenir'}
		</button>
	</section>
{/if}

<style>
	.onboarding-test-return {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		margin: var(--space-lg) 0;
		border-color: var(--color-accent);
	}

	.onboarding-test-return p {
		margin: var(--space-xs) 0 0;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}
</style>
