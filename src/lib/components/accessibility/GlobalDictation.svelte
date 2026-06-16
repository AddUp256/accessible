<script lang="ts">
	// R?le : Composant Svelte de accessibilit? globale : encapsule l?affichage et les interactions r?utilisables.

	import { onMount } from 'svelte';
	import { bilingualLabel, dynamicMessage } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import {
		getDictationCapabilities,
		recognizeOnce,
		resolveDictationLang,
		type DictationCapabilities
	} from '$lib/services/dictation';

	let active = $state(false);
	let status = $state('');
	let caps = $state<DictationCapabilities>({ webSpeech: false, tauriNative: false, any: false });

	const dictationStart = $derived(bilingualLabel('🎤 Dictée', 'mod.dictation.button', $settings.ui));
	const dictationStop = $derived(
		bilingualLabel('⏹ Dictée', 'mod.dictation.buttonStop', $settings.ui)
	);
	const ariaLabel = $derived(
		bilingualLabel(
			active ? 'Arrêter la dictée vocale' : 'Démarrer la dictée vocale',
			active ? 'mod.dictation.ariaStop' : 'mod.dictation.ariaStart',
			$settings.ui
		)
	);
	const tooltip = $derived(bilingualLabel('Dictée vocale', 'mod.dictation.tooltip', $settings.ui));
	const visible = $derived($settings.motor.dictationEnabled);

	onMount(() => {
		void getDictationCapabilities().then((result) => {
			caps = result;
		});
	});

	function targetTextarea(): HTMLTextAreaElement | HTMLInputElement | null {
		const el = document.activeElement;
		if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return el;
		return null;
	}

	function insertTranscript(field: HTMLTextAreaElement | HTMLInputElement, transcript: string) {
		const start = field.selectionStart ?? field.value.length;
		const end = field.selectionEnd ?? field.value.length;
		const before = field.value.slice(0, start);
		const after = field.value.slice(end);
		const spacer = before && !before.endsWith(' ') ? ' ' : '';
		field.value = `${before}${spacer}${transcript}${after}`;
		field.dispatchEvent(new Event('input', { bubbles: true }));
		const caret = (before + spacer + transcript).length;
		field.setSelectionRange(caret, caret);
	}

	async function toggle() {
		if (active) {
			active = false;
			status = dynamicMessage('dyn.dictation.stopped', $settings.ui);
			return;
		}

		if (!caps.any) {
			status = dynamicMessage('dyn.dictation.unavailable', $settings.ui);
			return;
		}

		const field = targetTextarea();
		if (!field) {
			status = dynamicMessage('dyn.dictation.focusField', $settings.ui);
			return;
		}

		active = true;
		status = dynamicMessage(
			caps.tauriNative ? 'dyn.dictation.windowsListening' : 'dyn.dictation.listening',
			$settings.ui
		);

		try {
			const lang = resolveDictationLang($settings.ui.secondaryLanguage, $settings.ui.bilingualUi);
			const transcript = await recognizeOnce(lang);
			insertTranscript(field, transcript);
			status = dynamicMessage('dyn.dictation.done', $settings.ui);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (message === 'DICTATION_EMPTY') {
				status = dynamicMessage('dyn.dictation.empty', $settings.ui);
			} else if (message === 'DICTATION_UNAVAILABLE') {
				status = dynamicMessage('dyn.dictation.unavailable', $settings.ui);
			} else {
				status = message;
			}
		} finally {
			active = false;
		}
	}
</script>

{#if visible}
	<div class="global-dictation">
		<button
			type="button"
			class="btn btn-secondary global-dictation-btn"
			class:global-dictation-btn--active={active}
			class:global-dictation-btn--unavailable={!caps.any}
			onclick={toggle}
			title={tooltip}
			aria-label={ariaLabel}
		>
			{active ? dictationStop : dictationStart}
		</button>
		{#if status}
			<span class="global-dictation-status">{status}</span>
		{/if}
	</div>
{/if}

<style>
	.global-dictation {
		position: fixed;
		bottom: var(--space-lg);
		right: var(--space-lg);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--space-xs);
	}

	.global-dictation-btn {
		box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
	}

	.global-dictation-btn--active {
		background: var(--color-accent);
		color: var(--color-accent-text);
		border-color: var(--color-accent);
	}

	.global-dictation-btn--unavailable:not(.global-dictation-btn--active) {
		border-style: dashed;
		opacity: 0.9;
	}

	.global-dictation-status {
		font-size: var(--font-size-sm);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-xs) var(--space-sm);
		max-width: 16rem;
	}
</style>
