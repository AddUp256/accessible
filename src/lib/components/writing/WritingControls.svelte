<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { settings, profileStore } from '$lib/stores/profile';
	import type { WritingSettings } from '$lib/types/profile';

	function patchWriting(partial: Partial<WritingSettings>) {
		profileStore.updateSettings({ writing: partial });
	}
</script>

<aside class="writing-controls card" aria-label="Réglages d'écriture">
	<BiHeading fr="Réglages" key="mod.common.settings" level={3} />

	<fieldset class="control-fieldset">
		<legend><BiText fr="Correction" key="mod.write.spellcheckLegend" inline /></legend>
		<label class="control-radio">
			<input
				type="radio"
				name="spellcheck"
				value="off"
				checked={$settings.writing.spellcheck === 'off'}
				onchange={() => patchWriting({ spellcheck: 'off' })}
			/>
			<BiText fr="Désactivée" key="mod.common.disabled" inline />
		</label>
		<label class="control-radio">
			<input
				type="radio"
				name="spellcheck"
				value="global"
				checked={$settings.writing.spellcheck === 'global'}
				onchange={() => patchWriting({ spellcheck: 'global' })}
			/>
			<BiText fr="Surligner toutes les erreurs" key="mod.common.highlightAll" inline />
		</label>
		<label class="control-radio">
			<input
				type="radio"
				name="spellcheck"
				value="step_by_step"
				checked={$settings.writing.spellcheck === 'step_by_step'}
				onchange={() => patchWriting({ spellcheck: 'step_by_step' })}
			/>
			<BiText fr="Étape par étape" key="mod.common.stepByStep" inline />
		</label>
	</fieldset>

	<fieldset class="control-fieldset">
		<legend><BiText fr="Grammaire (Grammalecte)" key="mod.write.grammarLegend" inline /></legend>
		<label class="control-radio">
			<input
				type="radio"
				name="grammarCheck"
				value="off"
				checked={$settings.writing.grammarCheck === 'off'}
				onchange={() => patchWriting({ grammarCheck: 'off' })}
			/>
			<BiText fr="Désactivée" key="mod.common.disabled" inline />
		</label>
		<label class="control-radio">
			<input
				type="radio"
				name="grammarCheck"
				value="global"
				checked={$settings.writing.grammarCheck === 'global'}
				onchange={() => patchWriting({ grammarCheck: 'global' })}
			/>
			<BiText fr="Toutes les erreurs" key="mod.common.allErrors" inline />
		</label>
		<label class="control-radio">
			<input
				type="radio"
				name="grammarCheck"
				value="step_by_step"
				checked={$settings.writing.grammarCheck === 'step_by_step'}
				onchange={() => patchWriting({ grammarCheck: 'step_by_step' })}
			/>
			<BiText fr="Étape par étape" key="mod.common.stepByStep" inline />
		</label>
	</fieldset>

	<label class="control-checkbox">
		<input
			type="checkbox"
			checked={$settings.writing.wordPrediction}
			onchange={(e) => patchWriting({ wordPrediction: e.currentTarget.checked })}
		/>
		<BiText fr="Prédiction de mots" key="mod.write.wordPrediction" inline />
	</label>

	<label class="control-checkbox">
		<input
			type="checkbox"
			checked={$settings.writing.shortSentenceHint}
			onchange={(e) => patchWriting({ shortSentenceHint: e.currentTarget.checked })}
		/>
		<BiText fr="Signaler les phrases longues" key="mod.write.shortSentenceHint" inline />
	</label>

	<label class="control-checkbox">
		<input
			type="checkbox"
			checked={$settings.writing.distractionFree}
			onchange={(e) => patchWriting({ distractionFree: e.currentTarget.checked })}
		/>
		<BiText fr="Mode sans distraction" key="mod.write.distractionFree" inline />
	</label>

	<p class="control-hint">
		<BiText fr="Les réglages sont enregistrés automatiquement." key="mod.common.autoSaved" />
	</p>
</aside>

<style>
	.control-fieldset {
		border: none;
		padding: 0;
		margin: 0 0 var(--space-md);
	}

	.control-fieldset legend {
		font-weight: 600;
		margin-bottom: var(--space-sm);
	}

	.control-radio,
	.control-checkbox {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: var(--btn-min-height);
		cursor: pointer;
	}

	.control-hint {
		margin: var(--space-md) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
