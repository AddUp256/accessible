<script lang="ts">
	import { profileStore, settings } from '$lib/stores/profile';
	import { TEACHER_DASHBOARD_ACTIONS } from '$lib/config/dashboard-actions';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { bilingualDashboardAction, bilingualUi } from '$lib/i18n';

	const heading = $derived(
		$profileStore.meta.appMode === 'teacher'
			? bilingualUi('Espace enseignant', 'home.teacher.title', $settings.ui)
			: bilingualUi('Espace accompagnant', 'home.teacher.companionTitle', $settings.ui)
	);
</script>

{#if $profileStore.meta.appMode === 'teacher' || $profileStore.meta.appMode === 'companion'}
	<section class="card teacher-home" aria-labelledby="teacher-home-heading">
		<h2 id="teacher-home-heading">
			<BilingualText primary={heading.primary} secondary={heading.secondary} inline />
		</h2>
		<p>
			<BiText
				fr="Préparez ou consultez une synthèse d'aménagements. Les données restent sur cet appareil. Accessible ne pose pas de diagnostic."
				key="home.teacher.intro"
			/>
		</p>

		<div class="teacher-actions">
			<a class="btn btn-primary btn-lg teacher-action" href="/enseignant">
				<strong><BiText fr="Parcours guidé enseignant" key="home.teacher.journeyLink" inline /></strong>
				<span><BiText fr="Étapes pour consulter, exporter et préparer un entretien." key="home.teacher.journeyLinkDesc" inline /></span>
			</a>
			{#each TEACHER_DASHBOARD_ACTIONS as action}
				{@const bi = bilingualDashboardAction(action, $settings.ui, 'teacher')}
				<a class="btn btn-primary btn-lg teacher-action" href={action.href}>
					<strong>
						<BilingualText primary={bi.label.primary} secondary={bi.label.secondary} inline />
					</strong>
					<span>
						<BilingualText
							primary={bi.description.primary}
							secondary={bi.description.secondary}
							inline
						/>
					</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.teacher-home p {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.teacher-actions {
		display: grid;
		gap: var(--space-sm);
	}

	.teacher-action {
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: var(--space-xs);
	}

	.teacher-action span:last-child {
		font-weight: 400;
		font-size: var(--font-size-sm);
	}
</style>
