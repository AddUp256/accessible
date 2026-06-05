<script lang="ts">
	import { profileStore } from '$lib/stores/profile';
	import { MEDICAL_PROFILES_BY_ID } from '$lib/config/medical-profiles';
	import { TOOLS_BY_ID } from '$lib/config/tools-catalog';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
</script>

<svelte:head>
	<title>Parcours terminé — Accessible</title>
</svelte:head>

<section class="card">
	<BiHeading fr="Parcours enregistré" key="onboard.complete.heading" />
	<p><BiText fr="Vos choix sont sauvegardés. Vous pouvez les modifier à tout moment." key="onboard.complete.body" /></p>

	{#if $profileStore.onboarding.path}
		<p><strong>Parcours :</strong> {$profileStore.onboarding.path}</p>
	{/if}

	{#if $profileStore.activatedTools.length > 0}
		<h3>Outils activés</h3>
		<ul>
			{#each $profileStore.activatedTools as toolId}
				<li>{TOOLS_BY_ID[toolId]?.label ?? toolId}</li>
			{/each}
		</ul>
	{/if}

	{#if $profileStore.declaredProfiles.medicalOrAdministrative.length > 0}
		<h3>Profils déclarés</h3>
		<ul>
			{#each $profileStore.declaredProfiles.medicalOrAdministrative as entry}
				<li>{MEDICAL_PROFILES_BY_ID[entry.id]?.label ?? entry.id}</li>
			{/each}
		</ul>
	{/if}

	{#if $profileStore.rejectedSettings.length > 0}
		<h3>Réglages refusés</h3>
		<p class="hint">Ces réglages ne seront pas réactivés automatiquement.</p>
		<ul>
			{#each $profileStore.rejectedSettings as rejected}
				<li><small>{rejected.key}</small></li>
			{/each}
		</ul>
	{/if}
</section>

<div class="onboarding-actions">
	<a class="btn btn-primary btn-lg" href="/">Aller à l'accueil</a>
	<a class="btn btn-secondary" href="/profil">Voir mon profil</a>
	<a class="btn btn-secondary" href="/parametres">Paramètres</a>
</div>

<style>
	.hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.onboarding-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}
</style>
