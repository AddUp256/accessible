<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import StepProgress from '$lib/components/ui/StepProgress.svelte';
	import { TEACHER_JOURNEY_STEPS } from '$lib/config/teacher-journey';
	import { profileStore, settings } from '$lib/stores/profile';
	import { bilingualUi } from '$lib/i18n';

	let activeStep = $state(0);

	const isTeacher = $derived(
		$profileStore.meta.appMode === 'teacher' || $profileStore.meta.appMode === 'companion'
	);

	const step = $derived(TEACHER_JOURNEY_STEPS[activeStep]);
	const title = $derived(
		$profileStore.meta.appMode === 'teacher'
			? bilingualUi('Parcours enseignant', 'page.teacher.journeyTitle', $settings.ui)
			: bilingualUi('Parcours accompagnant', 'page.teacher.companionJourneyTitle', $settings.ui)
	);
</script>

<svelte:head>
	<title>Enseignant — Accessible</title>
</svelte:head>

{#if !isTeacher}
	<section class="card">
		<BiHeading fr="Parcours enseignant" key="page.teacher.journeyTitle" />
		<p>
			<BiText
				fr="Activez le mode enseignant ou accompagnant dans Paramètres → Mode d'utilisation pour accéder à ce parcours."
				key="page.teacher.modeRequired"
			/>
		</p>
		<a class="btn btn-primary" href="/parametres"><BiText fr="Paramètres" key="nav.settings" inline /></a>
	</section>
{:else}
	<h1>
		<BilingualText primary={title.primary} secondary={title.secondary} inline />
	</h1>
	<p>
		<BiText
			fr="Suivez ces étapes pour préparer ou consulter une synthèse d'aménagements. Accessible ne pose pas de diagnostic."
			key="page.teacher.journeyIntro"
		/>
	</p>

	<StepProgress
		current={activeStep + 1}
		total={TEACHER_JOURNEY_STEPS.length}
		labelKey="page.teacher.journeyProgress"
	/>

	<article class="card teacher-step" aria-labelledby="teacher-step-title">
		<h2 id="teacher-step-title">{step.title}</h2>
		<p>{step.description}</p>
		<a class="btn btn-primary btn-lg" href={step.href}>{step.actionLabel}</a>
	</article>

	<div class="teacher-nav">
		<button
			type="button"
			class="btn btn-secondary"
			disabled={activeStep === 0}
			onclick={() => (activeStep -= 1)}
		>
			<BiText fr="Étape précédente" key="mod.comm.scenario.prev" inline />
		</button>
		{#if activeStep < TEACHER_JOURNEY_STEPS.length - 1}
			<button type="button" class="btn btn-primary" onclick={() => (activeStep += 1)}>
				<BiText fr="Étape suivante" key="mod.comm.scenario.next" inline />
			</button>
		{:else}
			<a class="btn btn-primary" href="/">
				<BiText fr="Retour à l'accueil" key="page.teacher.backHome" inline />
			</a>
		{/if}
	</div>
{/if}

<style>
	.teacher-step h2 {
		margin-top: 0;
	}

	.teacher-step p {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.teacher-nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}
</style>
