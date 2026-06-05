<script lang="ts">
	import StepProgress from '$lib/components/ui/StepProgress.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import { MEDICAL_PROFILES, MEDICAL_PROFILE_DISCLAIMER } from '$lib/config/medical-profiles';
	import { completeOnboardingStep, setDeclaredMedicalProfiles, setOnboardingPath } from '$lib/modules/onboarding/actions';
	import type { MedicalProfileId } from '$lib/types/profile';
	import { goto } from '$app/navigation';

	let selected = $state<MedicalProfileId[]>([]);

	function toggle(id: MedicalProfileId) {
		selected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
	}

	function saveDeclaredPath(ids: MedicalProfileId[]) {
		setOnboardingPath('declared');
		setDeclaredMedicalProfiles(ids);
		completeOnboardingStep('declared_medical');
	}

	const nextHref = $derived(
		selected.length > 0 ? '/onboarding/declared/review' : '/onboarding/comfort'
	);

	function skipUnknown() {
		selected = [];
		saveDeclaredPath([]);
		goto('/onboarding/comfort');
	}

	function continuePath() {
		saveDeclaredPath(selected);
		goto(nextHref);
	}
</script>

<svelte:head>
	<title>Reconnaissance déclarée — Accessible</title>
</svelte:head>

<StepProgress current={1} total={3} />

<section class="card disclaimer">
	<BiHeading fr="Profils déclarés" key="onboard.declared.heading" />
	<p>{MEDICAL_PROFILE_DISCLAIMER}</p>
</section>

<section class="card" aria-labelledby="medical-heading">
	<h3 id="medical-heading">Que souhaitez-vous indiquer ?</h3>
	<p>Vous pouvez en choisir plusieurs.</p>

	<ul class="profile-list">
		{#each MEDICAL_PROFILES as profile}
			<li>
				<label class="profile-option">
					<input
						type="checkbox"
						checked={selected.includes(profile.id)}
						onchange={() => toggle(profile.id)}
					/>
					<span>
						<strong>{profile.label}</strong>
						<small>{profile.description}</small>
					</span>
				</label>
			</li>
		{/each}
	</ul>
</section>

<div class="onboarding-actions">
	<a class="btn btn-secondary" href="/onboarding">Retour</a>
	<button type="button" class="btn btn-secondary" onclick={skipUnknown}>
		Je ne sais pas
	</button>
	<button type="button" class="btn btn-primary" onclick={continuePath}>Continuer</button>
</div>

<style>
	.disclaimer {
		border-left: 4px solid var(--color-accent);
	}

	.profile-list {
		list-style: none;
		padding: 0;
		margin: var(--space-md) 0 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		max-height: 24rem;
		overflow-y: auto;
	}

	.profile-option {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		min-height: var(--btn-min-height);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
	}

	.profile-option input {
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.2rem;
		flex-shrink: 0;
	}

	.profile-option span {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.profile-option small {
		color: var(--color-text-muted);
	}

	.onboarding-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}
</style>
