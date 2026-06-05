<script lang="ts">

	import FontCompareTable from '$lib/components/reading/FontCompareTable.svelte';

	import ReadingPane from '$lib/components/reading/ReadingPane.svelte';

	import BiHeading from '$lib/components/ui/BiHeading.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import {

		FONT_COMPARE_SAMPLES,

		FONT_COMPARE_VARIANTS,

		FONT_CONFUSABLE_COMPARE,

		FONT_CONFUSABLE_GROUPS

	} from '$lib/config/fonts-catalog';

	import {

		applyComparatorVariant,

		applyPreferredComparisonVariant,

		recordReadingComparison

	} from '$lib/modules/reading/preferences';

	import { FONT_FAMILY_STACK } from '$lib/modules/reading/font-stacks';

	import { settings } from '$lib/stores/profile';

	import {

		configLabel,

		dynamicMessage,

		FONT_SAMPLE_I18N_KEYS,

		FONT_VARIANT_I18N_KEYS

	} from '$lib/i18n';

	import { CONFIG_FR, type ConfigKey } from '$lib/i18n/ui-config';

	import type { ReadingSettings } from '$lib/types/profile';



	let sampleKey = $state<keyof typeof FONT_COMPARE_SAMPLES>('long');

	let preferred = $state<string | null>(null);

	let mostFatiguing = $state<string | null>(null);

	let statusMessage = $state('');



	const sampleText = $derived(FONT_COMPARE_SAMPLES[sampleKey]);

	const isTableSample = $derived(sampleKey === 'table');



	function variantToSettings(v: (typeof FONT_COMPARE_VARIANTS)[number]): ReadingSettings {

		const base = $settings.reading;

		return {

			...base,

			font: v.fontId,

			fontSize: v.fontSize,

			lineHeight: v.lineHeight,

			background: v.background,

			lineGuide: 'lineGuide' in v ? Boolean(v.lineGuide) : false,

			alternatingLines: 'alternatingLines' in v ? Boolean(v.alternatingLines) : false,

			falcMode: 'falcSample' in v ? Boolean(v.falcSample) : false

		};

	}



	function confusableFontStyle(fontId: (typeof FONT_CONFUSABLE_COMPARE)[number]['fontId']): string {

		return `font-family: ${FONT_FAMILY_STACK[fontId]}; font-size: 1.25rem; line-height: 1.6;`;

	}



	function applyVariant(v: (typeof FONT_COMPARE_VARIANTS)[number]) {

		applyComparatorVariant({

			fontId: v.fontId,

			fontSize: v.fontSize,

			lineHeight: v.lineHeight,

			background: v.background,

			lineGuide: 'lineGuide' in v ? v.lineGuide : false,

			alternatingLines: 'alternatingLines' in v ? v.alternatingLines : false,

			falcMode: 'falcSample' in v ? v.falcSample : false

		});

		statusMessage = dynamicMessage('dyn.font.variantApplied', $settings.ui, {

			name: configLabel(v.label, FONT_VARIANT_I18N_KEYS[v.id], $settings.ui)

		});

	}



	function pickPreferred(variantId: string) {
		preferred = variantId;
		if (mostFatiguing === variantId) mostFatiguing = null;
	}

	function pickMostFatiguing(variantId: string) {
		mostFatiguing = variantId;
		if (preferred === variantId) preferred = null;
	}

	function saveComparison() {
		recordReadingComparison({
			step: 'reading_font_compare',
			options: FONT_COMPARE_VARIANTS.map((v) => v.id),
			preferred,
			mostFatiguing
		});

		const applied = applyPreferredComparisonVariant(preferred, FONT_COMPARE_VARIANTS);
		statusMessage = applied
			? dynamicMessage('dyn.font.compareSavedApplied', $settings.ui)
			: dynamicMessage('dyn.font.compareSaved', $settings.ui);
	}

</script>



<section class="comparator" aria-labelledby="comparator-heading">

	<BiHeading fr="Comparer l'affichage" key="mod.read.compare.title" level={3} id="comparator-heading" />

	<p>

		<BiText

			fr="Même texte, plusieurs versions. Quelle est la plus confortable ? Laquelle fatigue le plus ?"

			key="mod.read.compare.intro"

		/>

	</p>



	<label class="sample-picker">

		<span><BiText fr="Texte d'exemple" key="mod.read.compare.sample" inline /></span>

		<select bind:value={sampleKey}>

			{#each Object.keys(FONT_COMPARE_SAMPLES) as key}

				{@const sampleI18nKey = FONT_SAMPLE_I18N_KEYS[key] as ConfigKey}

				<option value={key}>{configLabel(CONFIG_FR[sampleI18nKey], sampleI18nKey, $settings.ui)}</option>

			{/each}

		</select>

	</label>



	<div class="comparator-grid">

		{#each FONT_COMPARE_VARIANTS as variant}

			<article class="comparator-card card">

				<h4>{configLabel(variant.label, FONT_VARIANT_I18N_KEYS[variant.id], $settings.ui)}</h4>

				{#if isTableSample}

					<FontCompareTable settings={variantToSettings(variant)} />

				{:else}

					<ReadingPane text={sampleText} settings={variantToSettings(variant)} />

				{/if}

				<div class="comparator-picks">

					<button
						type="button"
						class="btn btn-secondary"
						class:btn-comparator-preferred={preferred === variant.id}
						aria-pressed={preferred === variant.id}
						onclick={() => pickPreferred(variant.id)}
					>
						<BiText fr="Plus confortable" key="mod.read.compare.mostComfortable" inline />
					</button>

					<button
						type="button"
						class="btn btn-secondary"
						class:btn-comparator-fatigue={mostFatiguing === variant.id}
						aria-pressed={mostFatiguing === variant.id}
						onclick={() => pickMostFatiguing(variant.id)}
					>
						<BiText fr="Fatigue le plus" key="mod.read.compare.mostFatiguing" inline />
					</button>

					<button type="button" class="btn btn-primary" onclick={() => applyVariant(variant)}>

						<BiText fr="Appliquer" key="mod.read.compare.apply" inline />

					</button>

				</div>

			</article>

		{/each}

	</div>



	<section class="comparator-advanced card" aria-labelledby="comparator-advanced-heading">

		<BiHeading

			fr="Comparaison avancée"

			key="mod.read.compare.advancedTitle"

			level={4}

			id="comparator-advanced-heading"

		/>

		<p class="comparator-advanced-intro">

			<BiText

				fr="Comparez des caractères souvent confondus et un tableau de devoirs entre trois polices recommandées."

				key="mod.read.compare.advancedIntro"

			/>

		</p>



		<h5 class="comparator-subheading">

			<BiText fr="Caractères confus" key="mod.read.compare.confusablesTitle" inline />

		</h5>

		<p class="comparator-hint">

			<BiText

				fr="Regardez si certaines lettres ou chiffres se ressemblent trop."

				key="mod.read.compare.confusablesIntro"

			/>

		</p>

		<div class="confusables-grid" role="table" aria-label="Comparaison de caractères confus">

			<div class="confusables-row confusables-row--head" role="row">

				<span role="columnheader" class="confusables-label">

					<BiText fr="Groupe" key="mod.read.compare.confusablesGroup" inline />

				</span>

				{#each FONT_CONFUSABLE_COMPARE as fontCol}

					<span role="columnheader">{fontCol.label}</span>

				{/each}

			</div>

			{#each FONT_CONFUSABLE_GROUPS as group}

				<div class="confusables-row" role="row">

					<span role="rowheader" class="confusables-label">{group.label}</span>

					{#each FONT_CONFUSABLE_COMPARE as fontCol}

						<span role="cell" class="confusables-cell" style={confusableFontStyle(fontCol.fontId)}>

							{group.sample}

						</span>

					{/each}

				</div>

			{/each}

		</div>



		<h5 class="comparator-subheading">

			<BiText fr="Tableau de devoirs" key="mod.read.compare.tableTitle" inline />

		</h5>

		<p class="comparator-hint">

			<BiText

				fr="Même tableau avec vos réglages de lecture actuels."

				key="mod.read.compare.tableIntro"

			/>

		</p>

		<FontCompareTable settings={$settings.reading} />

	</section>



	<div class="comparator-footer">

		<button type="button" class="btn btn-secondary" onclick={saveComparison}>

			<BiText fr="Enregistrer mes réponses" key="mod.read.compare.saveAnswers" inline />

		</button>

		{#if statusMessage}

			<p role="status" class="status">{statusMessage}</p>

		{/if}

	</div>

</section>



<style>

	.sample-picker {

		display: flex;

		flex-direction: column;

		gap: var(--space-xs);

		margin: var(--space-md) 0;

		max-width: 20rem;

	}



	.comparator-grid {

		display: grid;

		gap: var(--space-lg);

	}



	@media (min-width: 48rem) {

		.comparator-grid {

			grid-template-columns: repeat(2, 1fr);

		}

	}



	.comparator-card h4 {

		margin: 0 0 var(--space-sm);

	}



	.comparator-picks {

		display: flex;

		flex-wrap: wrap;

		gap: var(--space-xs);

		margin-top: var(--space-sm);

	}



	.comparator-advanced {

		margin-top: var(--space-xl);

	}



	.comparator-advanced-intro {

		margin: 0 0 var(--space-lg);

		color: var(--color-text-muted);

		font-size: var(--font-size-sm);

	}



	.comparator-subheading {

		margin: var(--space-lg) 0 var(--space-xs);

		font-size: var(--font-size-base);

	}



	.comparator-hint {

		margin: 0 0 var(--space-md);

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.confusables-grid {

		display: grid;

		gap: var(--space-xs);

		overflow-x: auto;

	}



	.confusables-row {

		display: grid;

		grid-template-columns: minmax(6rem, 8rem) repeat(3, minmax(10rem, 1fr));

		gap: var(--space-sm);

		align-items: center;

		padding: var(--space-sm) 0;

		border-bottom: 1px solid var(--color-border);

	}



	.confusables-row--head {

		font-weight: 600;

		font-size: var(--font-size-sm);

		border-bottom-width: 2px;

	}



	.confusables-label {

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.confusables-cell {

		padding: var(--space-xs) var(--space-sm);

		background: var(--color-bg-elevated);

		border-radius: var(--radius);

		word-break: break-word;

	}



	.comparator-footer {

		margin-top: var(--space-lg);

	}



	.status {

		margin-top: var(--space-sm);

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}

	:global(.btn-comparator-preferred) {
		background: var(--color-accent);
		color: var(--color-accent-text);
		border-color: var(--color-accent);
	}

	:global(.btn-comparator-fatigue) {
		background: var(--color-text-muted);
		color: var(--color-bg);
		border-color: var(--color-text-muted);
		opacity: 0.85;
	}

</style>

