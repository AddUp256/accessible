<script lang="ts">
	import { profileStore } from '$lib/stores/profile';
	import { MEDICAL_PROFILES_BY_ID } from '$lib/config/medical-profiles';
	import { FUNCTIONAL_NEEDS_BY_ID } from '$lib/config/functional-needs';
	import { TOOLS_BY_ID } from '$lib/config/tools-catalog';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { bilingualUi } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import type { FunctionalCategory } from '$lib/types/profile';

	const categories: FunctionalCategory[] = [
		'reading',
		'writing',
		'organization',
		'sensory',
		'motor',
		'communication',
		'language'
	];

	const pathLabel = $derived(bilingualUi('Parcours', 'profile.path.label', $settings.ui));
	const themeLabel = $derived(bilingualUi('Thème', 'profile.themeLabel', $settings.ui));
	const buttonSizeLabel = $derived(
		bilingualUi('Taille boutons', 'profile.buttonSizeLabel', $settings.ui)
	);
	const rejectedLabel = $derived(
		bilingualUi('Réglages refusés', 'profile.rejectedLabel', $settings.ui)
	);
</script>

<svelte:head>
	<title>Mon profil — Accessible</title>
</svelte:head>

<BiHeading fr="Mon profil" key="page.profile.title" />

<section class="card">
	<BiHeading fr="Parcours" key="profile.path.title" level={3} />
	<p>
		{#if $profileStore.onboarding.path}
			<BilingualText primary={pathLabel.primary} secondary={pathLabel.secondary} inline /> :
			<strong>{$profileStore.onboarding.path}</strong>
		{:else}
			<BiText fr="Aucun parcours commencé." key="profile.path.none" inline />
			<a href="/onboarding"><BiText fr="Commencer le parcours" key="profile.path.start" inline /></a>
		{/if}
	</p>
	{#if $profileStore.onboarding.completedSteps.length > 0}
		<p>
			<small
				><BiText fr="Étapes complétées" key="profile.path.steps" inline /> :
				{$profileStore.onboarding.completedSteps.length}</small
			>
		</p>
	{/if}
</section>

{#if $profileStore.declaredProfiles.medicalOrAdministrative.length > 0}
	<section class="card">
		<BiHeading fr="Profils déclarés" key="profile.declared.title" level={3} />
		<p class="hint">
			<BiText fr="Déclaratifs — Accessible ne pose pas de diagnostic." key="profile.declared.hint" />
		</p>
		<ul>
			{#each $profileStore.declaredProfiles.medicalOrAdministrative as entry}
				<li>{MEDICAL_PROFILES_BY_ID[entry.id]?.label ?? entry.id}</li>
			{/each}
		</ul>
	</section>
{/if}

{#if $profileStore.activatedTools.length > 0}
	<section class="card">
		<BiHeading fr="Outils activés" key="profile.tools.title" level={3} />
		<ul>
			{#each $profileStore.activatedTools as id}
				<li>{TOOLS_BY_ID[id]?.label ?? id}</li>
			{/each}
		</ul>
	</section>
{/if}

<section class="card">
	<BiHeading fr="Besoins fonctionnels enregistrés" key="profile.functional.title" level={3} />
	{#each categories as category}
		{@const entries = $profileStore.functionalProfiles[category]}
		{#if entries.length > 0}
			<h4>{category}</h4>
			<ul>
				{#each entries as entry (entry.id)}
					<li>{FUNCTIONAL_NEEDS_BY_ID[entry.id]?.label ?? entry.id}</li>
				{/each}
			</ul>
		{/if}
	{/each}
	{#if Object.values($profileStore.functionalProfiles).every((e) => e.length === 0)}
		<p><BiText fr="Aucun besoin fonctionnel enregistré pour l'instant." key="profile.functional.empty" /></p>
	{/if}
</section>

<section class="card">
	<BiHeading fr="Réglages actuels" key="profile.settings.title" level={3} />
	<p>
		<BilingualText primary={themeLabel.primary} secondary={themeLabel.secondary} inline /> :
		{$profileStore.settings.ui.theme}
	</p>
	<p>
		<BilingualText primary={buttonSizeLabel.primary} secondary={buttonSizeLabel.secondary} inline /> :
		{$profileStore.settings.ui.buttonSize}
	</p>
	{#if $profileStore.rejectedSettings.length > 0}
		<p>
			<BilingualText primary={rejectedLabel.primary} secondary={rejectedLabel.secondary} inline /> :
			{$profileStore.rejectedSettings.length}
		</p>
	{/if}
</section>

<a class="btn btn-secondary" href="/"><BiText fr="Retour à l'accueil" key="common.backHome" inline /></a>
<a class="btn btn-primary" href="/parametres">
	<BiText fr="Exporter ma synthèse" key="profile.exportBtn" inline />
</a>

<style>
	.hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
