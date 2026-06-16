<script lang="ts">
	// R?le : Page SvelteKit /routes/onboarding : assemble l?interface utilisateur et les actions de cette zone.

	import StepProgress from '$lib/components/ui/StepProgress.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { setOnboardingPath } from '$lib/modules/onboarding/actions';
	import { bilingualUi } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import type { UiKey } from '$lib/i18n';

	const entries: {
		path: 'known' | 'declared' | 'discovery';
		href: string;
		title: string;
		titleKey: UiKey;
		description: string;
		descKey: UiKey;
	}[] = [
		{
			path: 'known',
			href: '/onboarding/known',
			title: 'Je connais déjà mes besoins',
			titleKey: 'onboard.known.title',
			description: "Choisir directement les outils qui m'intéressent.",
			descKey: 'onboard.known.desc'
		},
		{
			path: 'declared',
			href: '/onboarding/declared',
			title: "J'ai déjà un diagnostic ou une reconnaissance",
			titleKey: 'onboard.declared.title',
			description: 'Indiquer un profil administratif ou médical déclaré.',
			descKey: 'onboard.declared.desc'
		},
		{
			path: 'discovery',
			href: '/onboarding/discovery',
			title: 'Je ne sais pas',
			titleKey: 'onboard.discovery.title',
			description: 'Parcours guidé pour repérer mes besoins.',
			descKey: 'onboard.discovery.desc'
		}
	];

	function choose(path: (typeof entries)[number]['path']) {
		setOnboardingPath(path);
	}
</script>

<svelte:head>
	<title>Parcours — Accessible</title>
</svelte:head>

<StepProgress current={1} total={3} label="Choix du parcours" labelKey="onboard.progress.choice" />

<section class="card" aria-labelledby="onboarding-heading">
	<BiHeading
		fr="Comment voulez-vous commencer ?"
		key="onboard.start.title"
		id="onboarding-heading"
	/>
	<p><BiText fr="Une seule idée par choix. Vous pourrez modifier tout ensuite." key="onboard.start.hint" /></p>

	<div class="onboarding-choices">
		{#each entries as entry}
			{@const title = bilingualUi(entry.title, entry.titleKey, $settings.ui)}
			{@const desc = bilingualUi(entry.description, entry.descKey, $settings.ui)}
			<a
				class="btn btn-primary btn-lg onboarding-choice"
				href={entry.href}
				onclick={() => choose(entry.path)}
			>
				<strong>
					<BilingualText primary={title.primary} secondary={title.secondary} inline />
				</strong>
				<span class="onboarding-choice-desc">
					<BilingualText primary={desc.primary} secondary={desc.secondary} inline />
				</span>
			</a>
		{/each}
	</div>
</section>

<p>
	<a class="btn btn-secondary" href="/"><BiText fr="Retour à l'accueil" key="common.backHome" inline /></a>
</p>

<style>
	.onboarding-choices {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-top: var(--space-lg);
	}

	.onboarding-choice {
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: var(--space-xs);
		width: 100%;
	}

	.onboarding-choice-desc {
		font-weight: 400;
		font-size: var(--font-size-sm);
		color: currentColor;
		opacity: 0.95;
	}
</style>
