<script lang="ts">
	// R?le : Page SvelteKit /routes/onboarding/declared/review : assemble l?interface utilisateur et les actions de cette zone.

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import StepProgress from '$lib/components/ui/StepProgress.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import {
		addFunctionalNeeds,
		completeOnboardingStep,
		recordRejectedSetting,
		setActivatedTools
	} from '$lib/modules/onboarding/actions';
	import {
		collectPresetExtras,
		collectPresetReviewItems,
		mergeAcceptedSettings,
		type PresetReviewItem
	} from '$lib/modules/onboarding/preset-suggestions';
	import { profileStore } from '$lib/stores/profile';
	import type { MedicalProfileId } from '$lib/types/profile';

	let items = $state<PresetReviewItem[]>([]);
	let notes = $state<string[]>([]);
	let decisions = $state<Record<string, 'accepted' | 'rejected' | 'pending'>>({});

	onMount(() => {
		const ids = get(profileStore).declaredProfiles.medicalOrAdministrative.map((p) => p.id);
		if (ids.length === 0) {
			goto('/onboarding/comfort');
			return;
		}

		items = collectPresetReviewItems(ids);
		const extras = collectPresetExtras(ids);
		notes = extras.notes;

		if (items.length === 0) {
			addFunctionalNeeds(extras.functionalNeeds);
			setActivatedTools(extras.tools);
			goto('/onboarding/comfort');
			return;
		}

		decisions = Object.fromEntries(items.map((i) => [i.key, 'pending']));
	});

	function decide(item: PresetReviewItem, accept: boolean) {
		decisions = { ...decisions, [item.key]: accept ? 'accepted' : 'rejected' };
		if (!accept) {
			recordRejectedSetting(item.key, 'medical_preset', 'uncomfortable');
		}
	}

	function acceptAll() {
		for (const item of items) {
			decisions = { ...decisions, [item.key]: 'accepted' };
		}
	}

	function finish() {
		const accepted = items.filter((i) => decisions[i.key] === 'accepted');
		const merged = mergeAcceptedSettings(accepted);
		profileStore.updateSettings(merged);

		const ids = get(profileStore).declaredProfiles.medicalOrAdministrative.map((p) => p.id);
		const extras = collectPresetExtras(ids);
		addFunctionalNeeds(extras.functionalNeeds);
		setActivatedTools(extras.tools);
		completeOnboardingStep('declared_presets');
		goto('/onboarding/comfort');
	}

	const allDecided = $derived(items.every((i) => decisions[i.key] !== 'pending'));
</script>

<svelte:head>
	<title>Réglages proposés — Accessible</title>
</svelte:head>

<StepProgress current={2} total={3} />

<section class="card">
	<BiHeading fr="Réglages proposés" key="onboard.declared.review.heading" />
	<p>Ces réglages sont fréquents. Acceptez ou refusez chacun. Les refus ne seront pas réactivés automatiquement.</p>

	{#each notes as note}
		<p class="note">{note}</p>
	{/each}
</section>

{#if items.length > 0}
	<ul class="preset-list">
		{#each items as item}
			<li class="card preset-item">
				<p>{item.label}</p>
				<div class="preset-actions">
					<button
						type="button"
						class="btn"
						class:btn-primary={decisions[item.key] === 'accepted'}
						class:btn-secondary={decisions[item.key] !== 'accepted'}
						onclick={() => decide(item, true)}
					>
						Accepter
					</button>
					<button
						type="button"
						class="btn"
						class:btn-primary={decisions[item.key] === 'rejected'}
						class:btn-secondary={decisions[item.key] !== 'rejected'}
						onclick={() => decide(item, false)}
					>
						Refuser
					</button>
				</div>
			</li>
		{/each}
	</ul>

	<div class="onboarding-actions">
		<a class="btn btn-secondary" href="/onboarding/declared">Retour</a>
		<button type="button" class="btn btn-secondary" onclick={acceptAll}>Tout accepter</button>
		<button type="button" class="btn btn-primary" disabled={!allDecided} onclick={finish}>Continuer</button>
	</div>
{/if}

<style>
	.note {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.preset-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.preset-actions {
		display: flex;
		gap: var(--space-sm);
		margin-top: var(--space-sm);
	}

	.onboarding-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}
</style>
