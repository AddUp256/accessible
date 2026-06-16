<script lang="ts">
	// R?le : Page SvelteKit /routes : assemble l?interface utilisateur et les actions de cette zone.

	import ReadAloudButton from '$lib/components/ui/ReadAloudButton.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { ZONE_PICTOGRAMS } from '$lib/config/nav-pictograms';
	import {
		filterNavZones,
		needsPersonalization
	} from '$lib/modules/profile/feature-visibility';
	import { bilingualUi, type UiKey } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';
	import { isVerySimpleDetail } from '$lib/utils/detail-level';

	const welcomeLines: { fr: string; key: UiKey }[] = [
		{ fr: 'Accessible ne pose pas de diagnostic.', key: 'home.welcome.line1' },
		{ fr: 'Accessible vous aide à repérer vos besoins.', key: 'home.welcome.line2' },
		{ fr: 'Accessible vous aide à tester des réglages.', key: 'home.welcome.line3' },
		{
			fr: 'Accessible vous aide à préparer un rendez-vous si besoin.',
			key: 'home.welcome.line4'
		}
	];

	const zoneKeys: Record<string, UiKey> = {
		'/lire': 'nav.read',
		'/ecrire': 'nav.write',
		'/organiser': 'nav.organize',
		'/comprendre': 'nav.understand',
		'/communiquer': 'nav.communicate'
	};

	const verySimple = $derived(isVerySimpleDetail($profileStore));
	const visibleZones = $derived(filterNavZones($profileStore));
	const shouldStartPersonalization = $derived(needsPersonalization($profileStore));
	const shouldShowPersonalizationStart = $derived(
		shouldStartPersonalization && !$settings.ui.firstLaunchIntroDismissed
	);
	const showPictograms = $derived($settings.ui.showPictograms || verySimple);
	const welcomeSpeech = $derived(welcomeLines.map((line) => line.fr).join(' '));
</script>

<svelte:head>
	<title>Accueil — Accessible</title>
</svelte:head>

<section class="welcome-intro card" aria-labelledby="welcome-heading">
	<BiHeading fr="Bienvenue" key="home.welcome" id="welcome-heading" />
	{#each welcomeLines as line}
		<p><BiText fr={line.fr} key={line.key} /></p>
	{/each}
	<ReadAloudButton
		text={welcomeSpeech}
	/>
</section>

{#if shouldShowPersonalizationStart}
	<section class="personalization-start card" aria-labelledby="personalization-start-heading">
		<BiHeading
			fr="Commencer par personnaliser le parcours"
			key="home.personalization.title"
			id="personalization-start-heading"
		/>
		<p>
			<BiText
				fr="Quelques choix rapides permettent de garder seulement les zones utiles pour vous au départ. Vous pourrez modifier ces choix ou tout réafficher ensuite dans Paramètres."
				key="home.personalization.body"
			/>
		</p>
		<a class="btn btn-primary btn-lg" href="/onboarding">
			<BiText fr="Personnaliser mon parcours" key="home.personalization.start" inline />
		</a>
	</section>
{:else if visibleZones.length > 0}
	<section aria-labelledby="zones-heading">
		<BiHeading fr="Les 5 zones" key="home.zones" id="zones-heading" />
		<p><BiText fr="Choisissez une zone principale." key="home.zonesHint" /></p>
		<div class="dashboard-zones">
			{#each visibleZones as zone}
				{@const label = bilingualUi(zone.label, zoneKeys[zone.href], $settings.ui)}
				{@const picto = ZONE_PICTOGRAMS[zone.href]}
				<a class="btn btn-secondary btn-lg" href={zone.href}>
					{#if showPictograms && picto}
						<span class="zone-picto" aria-hidden="true">{picto}</span>
					{/if}
					<BilingualText primary={label.primary} secondary={label.secondary} inline />
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.dashboard-zones {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-md);
	}

	.personalization-start {
		max-width: 46rem;
	}

	.personalization-start p {
		margin-top: 0;
		color: var(--color-text-muted);
		font-size: var(--font-size-lg);
	}

</style>
