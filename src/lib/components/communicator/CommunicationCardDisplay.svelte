<script lang="ts">
	// R?le : Composant Svelte de communication CAA : encapsule l?affichage et les interactions r?utilisables.

	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { arasaacPictogramImageUrl } from '$lib/config/arasaac';
	import { settings } from '$lib/stores/profile';
	import { bilingualUi, dynamicMessage } from '$lib/i18n';

	let {
		label,
		message,
		emoji = '',
		pictogramId,
		messageForTts,
		onclose
	}: {
		label: { primary: string; secondary?: string };
		message: { primary: string; secondary?: string };
		emoji?: string;
		pictogramId?: number;
		messageForTts?: string;
		onclose?: () => void;
	} = $props();

	const pictogramUrl = $derived(
		pictogramId !== undefined ? arasaacPictogramImageUrl(pictogramId) : null
	);

	const ttsText = $derived(
		messageForTts ?? [message.primary, message.secondary].filter(Boolean).join('. ')
	);

	const closeLabel = $derived(bilingualUi('Fermer', 'common.close', $settings.ui));

	const copyLabel = $derived(bilingualUi('Copier le texte', 'mod.comm.copyText', $settings.ui));
	const readAloudLabel = $derived(bilingualUi('Relire à voix haute', 'mod.write.readAloud', $settings.ui));

	let copyStatus = $state('');

	async function copyMessage() {
		try {
			await navigator.clipboard.writeText(ttsText);
			copyStatus = dynamicMessage('dyn.comm.messageCopied', $settings.ui);
		} catch {
			copyStatus = dynamicMessage('dyn.comm.copyFailed', $settings.ui);
		}
	}
</script>

<div class="card-display card" role="region" aria-labelledby="card-display-title">
	<div class="card-display-header">
		<h3 id="card-display-title">
			{#if pictogramUrl}
				<img class="card-pictogram" src={pictogramUrl} alt="" width="64" height="64" />
			{:else if emoji}
				<span class="card-emoji" aria-hidden="true">{emoji}</span>
			{/if}
			<BilingualText primary={label.primary} secondary={label.secondary} />
		</h3>
		{#if onclose}
			<button type="button" class="btn btn-secondary" onclick={onclose}>
				<BilingualText primary={closeLabel.primary} secondary={closeLabel.secondary} inline />
			</button>
		{/if}
	</div>

	<div class="card-display-message">
		<BilingualText primary={message.primary} secondary={message.secondary} />
	</div>

	<div class="card-display-actions">
		<ReadAloudButton
			text={ttsText}
			rate={$settings.reading.ttsRate}
			label={[readAloudLabel.primary, readAloudLabel.secondary].filter(Boolean).join(' / ')}
		/>
		<button type="button" class="btn btn-secondary" onclick={copyMessage}>
			<BilingualText primary={copyLabel.primary} secondary={copyLabel.secondary} inline />
		</button>
	</div>

	{#if copyStatus}
		<p class="card-display-status" role="status">{copyStatus}</p>
	{/if}
</div>

<style>
	.card-display-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.card-display-header h3 {
		margin: 0;
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--font-size-lg);
	}

	.card-emoji {
		font-size: 2rem;
		line-height: 1;
	}

	.card-pictogram {
		object-fit: contain;
		flex-shrink: 0;
	}

	.card-display-message {
		font-size: var(--font-size-lg);
		line-height: 1.6;
		padding: var(--space-lg);
		background: var(--color-bg);
		border-radius: var(--radius);
		margin: 0 0 var(--space-md);
	}

	.card-display-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.card-display-status {
		margin: var(--space-sm) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
