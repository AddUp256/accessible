<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		featureLabelFr,
		isFullAccessMode,
		isPersonalizationActive,
		listHiddenFeatures
	} from '$lib/modules/profile/feature-visibility';
	import { profileStore, settings } from '$lib/stores/profile';
	import { bilingualLabel } from '$lib/i18n';

	const personalized = $derived(isPersonalizationActive($profileStore));
	const fullAccess = $derived(isFullAccessMode($profileStore));
	const hidden = $derived(listHiddenFeatures($profileStore));

	function featureUiLabel(feature: (typeof hidden)[number]): string {
		const fr = featureLabelFr(feature);
		const keyMap: Record<string, string> = {
			lire: 'nav.read',
			ecrire: 'nav.write',
			organiser: 'nav.organize',
			comprendre: 'nav.understand',
			communiquer: 'nav.communicate',
			profil: 'nav.profile',
			notes: 'panel.personalization.notes',
			memoriser: 'panel.personalization.memoriser'
		};
		const key = keyMap[feature];
		if (!key) return fr;
		return bilingualLabel(fr, key as import('$lib/i18n').UiKey, $settings.ui);
	}
</script>

<section class="card personalization-panel" id="personalization" aria-labelledby="personalization-heading">
	<BiHeading
		fr="Mon parcours personnalisé"
		key="panel.personalization.title"
		level={3}
		id="personalization-heading"
	/>
	<p class="personalization-intro">
		<BiText
			fr="Seules les zones correspondant à vos outils et besoins fonctionnels sont mises en avant. Le reste reste accessible en mode expert ou en refaisant le parcours."
			key="panel.personalization.intro"
		/>
	</p>

	{#if fullAccess}
		<p class="personalization-status" role="status">
			<BiText fr="Mode expert ou accompagnant : toutes les fonctionnalités sont visibles." key="panel.personalization.fullAccess" />
		</p>
	{:else if !personalized}
		<p class="personalization-status" role="status">
			<BiText
				fr="Parcours non personnalisé : les zones métier restent masquées jusqu'à ce que vous choisissiez celles qui vous sont utiles."
				key="panel.personalization.notConfigured"
			/>
		</p>
		<a class="btn btn-primary" href="/onboarding">
			<BiText fr="Personnaliser mon parcours" key="panel.personalization.startOnboarding" inline />
		</a>
	{:else if hidden.length > 0}
		<p class="personalization-status">
			<BiText fr="Zones masquées pour simplifier votre usage :" key="panel.personalization.hiddenLabel" />
		</p>
		<ul class="personalization-hidden">
			{#each hidden as feature}
				<li>{featureUiLabel(feature)}</li>
			{/each}
		</ul>
		<p class="personalization-hint">
			<BiText
				fr="Pour tout réafficher : activez le mode expert dans Paramètres, changez de profil, ou recommencez le parcours."
				key="panel.personalization.reactivateHint"
			/>
		</p>
		<div class="personalization-actions">
			<a class="btn btn-secondary" href="/onboarding">
				<BiText fr="Refaire le parcours" key="panel.personalization.redoOnboarding" inline />
			</a>
			<a class="btn btn-secondary" href="/parametres#app-mode">
				<BiText fr="Passer en mode expert" key="panel.personalization.expertLink" inline />
			</a>
		</div>
	{:else}
		<p class="personalization-status" role="status">
			<BiText fr="Toutes vos zones sélectionnées sont visibles." key="panel.personalization.allVisible" />
		</p>
	{/if}
</section>

<style>
	.personalization-intro,
	.personalization-hint,
	.personalization-status {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.personalization-hidden {
		margin: var(--space-sm) 0 var(--space-md);
		padding-left: var(--space-lg);
	}

	.personalization-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-md);
	}
</style>
