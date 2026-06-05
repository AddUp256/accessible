<script lang="ts">
	import BiText from '$lib/components/ui/BiText.svelte';
	import {
		featureLabelFr,
		isFeatureVisible,
		needsPersonalization,
		type AppFeature
	} from '$lib/modules/profile/feature-visibility';
	import { profileStore } from '$lib/stores/profile';

	let {
		feature,
		children
	}: {
		feature: AppFeature;
		children?: import('svelte').Snippet;
	} = $props();

	const visible = $derived(isFeatureVisible($profileStore, feature));
	const mustStartPersonalization = $derived(needsPersonalization($profileStore));
	const label = $derived(featureLabelFr(feature));
</script>

{#if visible}
	{@render children?.()}
{:else}
	<section class="card feature-guard" aria-labelledby="feature-guard-heading">
		<h2 id="feature-guard-heading">{label}</h2>
		<p>
			{#if mustStartPersonalization}
				<BiText
					fr="Cette zone sera proposée après le parcours de personnalisation. Commencez par choisir vos besoins pour afficher seulement les fonctionnalités utiles."
					key="panel.personalization.routeNeedsStart"
				/>
			{:else}
				<BiText
					fr="Cette zone n'est pas activée dans votre parcours personnalisé. Vous pouvez la réactiver en mode expert ou en refaisant le parcours dans Paramètres."
					key="panel.personalization.routeBlocked"
				/>
			{/if}
		</p>
		<div class="feature-guard-actions">
			{#if mustStartPersonalization}
				<a class="btn btn-primary" href="/onboarding">
					<BiText fr="Personnaliser mon parcours" key="panel.personalization.startOnboarding" inline />
				</a>
			{:else}
				<a class="btn btn-primary" href="/parametres#personalization">
					<BiText fr="Voir mon parcours" key="panel.personalization.viewPath" inline />
				</a>
			{/if}
			<a class="btn btn-secondary" href="/">
				<BiText fr="Retour à l'accueil" key="common.backHome" inline />
			</a>
		</div>
	</section>
{/if}

<style>
	.feature-guard-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-md);
	}
</style>
