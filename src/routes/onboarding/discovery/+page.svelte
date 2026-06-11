<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { FUNCTIONAL_NEEDS_BY_ID } from '$lib/config/functional-needs';
	import { bilingualUi, type UiKey } from '$lib/i18n';
	import { completeOnboardingStep, setOnboardingPath } from '$lib/modules/onboarding/actions';
	import { profileStore, settings } from '$lib/stores/profile';
	import type { FunctionalNeedEntry, FunctionalNeedId, ToolId } from '$lib/types/profile';

	const discoveryTabs: {
		id: string;
		label: string;
		key: UiKey;
		href: string;
		tools: ToolId[];
		needs: FunctionalNeedId[];
		hint: string;
	}[] = [
		{
			id: 'read',
			label: 'Lire',
			key: 'nav.read',
			href: '/lire?from=discovery',
			tools: ['read_adapted', 'listen_text'],
			needs: [],
			hint: "Tester l'affichage, les polices, l'OCR et la lecture."
		},
		{
			id: 'write',
			label: 'Écrire',
			key: 'nav.write',
			href: '/ecrire?from=discovery',
			tools: ['write_easier', 'correct_text', 'reduce_typing'],
			needs: [],
			hint: "Tester l'éditeur, la correction et les aides à la saisie."
		},
		{
			id: 'organize',
			label: 'Organiser',
			key: 'nav.organize',
			href: '/organiser?from=discovery',
			tools: ['organize_work'],
			needs: [],
			hint: 'Tester les étapes, checklists, minuteur, notes et révisions.'
		},
		{
			id: 'understand',
			label: 'Comprendre',
			key: 'nav.understand',
			href: '/comprendre?from=discovery',
			tools: [],
			needs: ['besoin_consignes_decoupees'],
			hint: 'Tester le découpage des consignes et la reformulation.'
		},
		{
			id: 'communicate',
			label: 'Communiquer',
			key: 'nav.communicate',
			href: '/communiquer?from=discovery',
			tools: ['pictograms'],
			needs: ['besoin_pictogrammes'],
			hint: 'Tester les cartes, pictogrammes et messages à montrer.'
		},
		{
			id: 'notes',
			label: 'Notes',
			key: 'nav.notes',
			href: '/notes?from=discovery',
			tools: [],
			needs: ['difficulte_prise_notes'],
			hint: 'Tester la prise de notes et les exports.'
		}
	];

	onMount(() => {
		if ($profileStore.onboarding.path !== 'discovery') {
			setOnboardingPath('discovery', { reset: false });
		}
	});

	function isDiscoveryTabActive(tab: (typeof discoveryTabs)[number]): boolean {
		const toolActive = tab.tools.some((tool) => $profileStore.activatedTools.includes(tool));
		const profileEntries = Object.values($profileStore.functionalProfiles) as FunctionalNeedEntry[][];
		const needActive = profileEntries.some((entries) =>
			entries.some((entry) => tab.needs.includes(entry.id as FunctionalNeedId))
		);
		return toolActive || needActive;
	}

	function toggleDiscoveryTab(tab: (typeof discoveryTabs)[number]) {
		const now = new Date().toISOString();

		profileStore.patch((profile) => {
			const active =
				tab.tools.some((tool) => profile.activatedTools.includes(tool)) ||
				(Object.values(profile.functionalProfiles) as FunctionalNeedEntry[][]).some((entries) =>
					entries.some((entry) => tab.needs.includes(entry.id as FunctionalNeedId))
				);

			const activatedTools = active
				? profile.activatedTools.filter((tool) => !tab.tools.includes(tool))
				: Array.from(new Set([...profile.activatedTools, ...tab.tools]));

			const functionalProfiles = { ...profile.functionalProfiles };
			for (const need of tab.needs) {
				const category = FUNCTIONAL_NEEDS_BY_ID[need]?.category;
				if (!category) continue;

				if (active) {
					functionalProfiles[category] = functionalProfiles[category].filter(
						(entry) => entry.id !== need
					);
				} else if (!functionalProfiles[category].some((entry) => entry.id === need)) {
					functionalProfiles[category] = [
						...functionalProfiles[category],
						{ id: need, source: 'onboarding', confirmedAt: now, confidence: 'declared' }
					];
				}
			}

			return { ...profile, activatedTools, functionalProfiles };
		});
	}

	function finishDiscovery() {
		completeOnboardingStep('discovery_tabs');
		goto('/onboarding/complete');
	}
</script>

<svelte:head>
	<title>Personnalisation guidée - Accessible</title>
</svelte:head>

<section class="card discovery-tabs" aria-labelledby="discovery-tabs-heading">
	<div class="discovery-heading">
		<h2 id="discovery-tabs-heading">Onglets utiles à tester</h2>
		<p>
			Activez seulement les zones qui peuvent vous servir. Ouvrez un module pour le tester,
			enregistrez si besoin, puis revenez ici.
		</p>
	</div>

	<div class="discovery-tab-grid">
		{#each discoveryTabs as tab}
			{@const label = bilingualUi(tab.label, tab.key, $settings.ui)}
			{@const active = isDiscoveryTabActive(tab)}
			<div class="discovery-tab" class:discovery-tab--active={active}>
				<div class="discovery-tab-copy">
					<strong>
						<BilingualText primary={label.primary} secondary={label.secondary} inline />
					</strong>
					<small>{tab.hint}</small>
				</div>
				<div class="discovery-tab-actions">
					<button
						type="button"
						class="btn"
						class:btn-primary={active}
						class:btn-secondary={!active}
						aria-pressed={active}
						onclick={() => toggleDiscoveryTab(tab)}
					>
						{active ? 'Désactiver' : 'Activer'}
					</button>
					<a class="btn btn-secondary" href={tab.href}>Tester</a>
				</div>
			</div>
		{/each}
	</div>
</section>

<div class="onboarding-actions">
	<a class="btn btn-secondary" href="/onboarding">Retour au choix du parcours</a>
	<button type="button" class="btn btn-primary" onclick={finishDiscovery}>
		Enregistrer et terminer
	</button>
</div>

<style>
	.discovery-tabs {
		display: grid;
		gap: var(--space-lg);
	}

	.discovery-heading p {
		margin: 0;
		color: var(--color-text-muted);
	}

	.discovery-tab-grid {
		display: grid;
		gap: var(--space-sm);
	}

	.discovery-tab {
		display: grid;
		gap: var(--space-sm);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
	}

	.discovery-tab--active {
		border-color: var(--color-accent);
		box-shadow: inset 0.25rem 0 0 var(--color-accent);
	}

	.discovery-tab-copy {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 0;
	}

	.discovery-tab-copy small {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.discovery-tab-actions,
	.onboarding-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.onboarding-actions {
		margin-top: var(--space-lg);
	}

	@media (min-width: 48rem) {
		.discovery-tab {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: center;
		}
	}
</style>
