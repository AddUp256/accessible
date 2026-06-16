<script lang="ts">
	// R?le : Composant Svelte de accessibilit? globale : encapsule l?affichage et les interactions r?utilisables.

	import { toastMessage } from '$lib/services/notifications';
</script>

{#if $toastMessage}
	<div class="app-toast" role="status" aria-live="polite">{$toastMessage}</div>
{/if}

<style>
	.app-toast {
		position: fixed;
		bottom: var(--space-lg);
		left: 50%;
		transform: translateX(-50%);
		z-index: 1001;
		background: var(--color-bg-elevated);
		color: var(--color-text);
		border: 2px solid var(--color-accent);
		border-radius: var(--radius);
		padding: var(--space-sm) var(--space-lg);
		font-weight: 600;
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.12);
		max-width: min(90vw, 28rem);
		text-align: center;
	}
</style>
