<script lang="ts">
	import { profileStore, settings } from '$lib/stores/profile';
	import { EXPERT_DASHBOARD_ACTIONS } from '$lib/config/dashboard-actions';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { bilingualDashboardAction } from '$lib/i18n';
</script>

{#if $profileStore.meta.appMode === 'expert'}
	<section class="card expert-home" aria-labelledby="expert-home-heading">
		<BiHeading fr="Mode expert" key="home.expert.title" id="expert-home-heading" />
		<p><BiText fr="Tous les réglages avancés sont visibles. Consultez les paramètres détaillés ou les panneaux de chaque module." key="home.expert.intro" /></p>

		<div class="expert-actions">
			{#each EXPERT_DASHBOARD_ACTIONS as action}
				{@const bi = bilingualDashboardAction(action, $settings.ui, 'expert')}
				<a class="btn btn-secondary btn-lg expert-action" href={action.href}>
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
	.expert-home p {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.expert-actions {
		display: grid;
		gap: var(--space-sm);
	}

	.expert-action {
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: var(--space-xs);
	}

	.expert-action span:last-child {
		font-weight: 400;
		font-size: var(--font-size-sm);
	}
</style>
