<script lang="ts">
	import {
		createNamedProfile,
		fetchActiveProfileId,
		fetchStoredProfiles,
		removeNamedProfile,
		type StoredProfileSummary
	} from '$lib/services/storage/local';
	import { isTauriRuntime } from '$lib/services/storage/tauri';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { bilingualUi, confirmDynamicMessage, dynamicMessage, configLabel } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';
	import { activeProfileId, refreshProfileSummaries } from '$lib/stores/profile-profiles';

	let profiles = $state<StoredProfileSummary[]>([]);
	let newProfileName = $state('');
	let status = $state('');
	let busy = $state(false);

	const currentId = $derived($activeProfileId);
	const activeSuffix = $derived(
		bilingualUi('(actif)', 'panel.profiles.active', $settings.ui)
	);
	const deleteLabel = $derived(
		bilingualUi('Supprimer', 'panel.profiles.delete', $settings.ui)
	);

	async function loadProfiles() {
		profiles = await fetchStoredProfiles();
		const activeId = await fetchActiveProfileId();
		activeProfileId.set(activeId);
	}

	async function switchProfile(profileId: string) {
		if (profileId === currentId) return;
		busy = true;
		status = '';
		try {
			await profileStore.switchProfile(profileId);
			status = dynamicMessage('dyn.profiles.activated', $settings.ui);
			await loadProfiles();
		} catch (error) {
			status = error instanceof Error ? error.message : dynamicMessage('dyn.profiles.switchFailed', $settings.ui);
		} finally {
			busy = false;
		}
	}

	async function createProfile() {
		if (!newProfileName.trim()) {
			status = dynamicMessage('dyn.profiles.needName', $settings.ui);
			return;
		}
		busy = true;
		status = '';
		try {
			const created = await createNamedProfile(newProfileName);
			newProfileName = '';
			await profileStore.switchProfile(created.id);
			status = dynamicMessage('dyn.profiles.createdNamed', $settings.ui, { name: created.name });
			await loadProfiles();
		} catch (error) {
			status = error instanceof Error ? error.message : dynamicMessage('dyn.profiles.createFailed', $settings.ui);
		} finally {
			busy = false;
		}
	}

	async function deleteProfile(profileId: string, profileName: string) {
		if (!confirm(confirmDynamicMessage('dyn.profiles.deleteConfirm', { name: profileName }))) return;
		busy = true;
		status = '';
		try {
			if (profileId === currentId) {
				status = dynamicMessage('dyn.profiles.switchBeforeDelete', $settings.ui);
				return;
			}
			await removeNamedProfile(profileId);
			status = dynamicMessage('dyn.profiles.deletedNamed', $settings.ui, { name: profileName });
			await loadProfiles();
			refreshProfileSummaries();
		} catch (error) {
			status = error instanceof Error ? error.message : dynamicMessage('dyn.profiles.deleteFailed', $settings.ui);
		} finally {
			busy = false;
		}
	}

	$effect(() => {
		if (isTauriRuntime()) {
			void loadProfiles();
		}
	});
</script>

<section class="card profile-switcher" aria-labelledby="profiles-heading">
	<BiHeading fr="Profils locaux" key="panel.profiles.title" level={3} id="profiles-heading" />

	{#if isTauriRuntime()}
		<p class="profiles-hint">
			<BiText
				fr="Plusieurs personnes peuvent utiliser Accessible sur le même appareil, chacune avec ses réglages."
				key="panel.profiles.hint"
			/>
		</p>

		{#if profiles.length > 0}
			<ul class="profiles-list">
				{#each profiles as profile (profile.id)}
					<li class="profiles-item">
						<button
							type="button"
							class="btn"
							class:btn-primary={currentId === profile.id}
							class:btn-secondary={currentId !== profile.id}
							disabled={busy}
							onclick={() => switchProfile(profile.id)}
						>
							{profile.name}
							{#if currentId === profile.id}
								<span class="profiles-active">
									<BilingualText
										primary={activeSuffix.primary}
										secondary={activeSuffix.secondary}
										inline
									/>
								</span>
							{/if}
						</button>
						{#if profiles.length > 1 && currentId !== profile.id}
							<button
								type="button"
								class="btn btn-secondary profiles-delete"
								disabled={busy}
								aria-label="Supprimer {profile.name}"
								onclick={() => deleteProfile(profile.id, profile.name)}
							>
								<BilingualText
									primary={deleteLabel.primary}
									secondary={deleteLabel.secondary}
									inline
								/>
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}

		<div class="profiles-create">
			<label for="new-profile-name">
				<BiText fr="Nouveau profil" key="panel.profiles.new" inline />
			</label>
			<div class="profiles-create-row">
				<input
					id="new-profile-name"
					type="text"
					bind:value={newProfileName}
					placeholder={configLabel('Ex. : Profil travail', 'cfg.ph.profileName', $settings.ui)}
					disabled={busy}
				/>
				<button type="button" class="btn btn-primary" disabled={busy} onclick={createProfile}>
					<BiText fr="Créer" key="panel.profiles.create" inline />
				</button>
			</div>
		</div>
	{:else}
		<p class="profiles-hint">
			<BiText
				fr="Un seul profil dans le navigateur. Installez l'application pour gérer plusieurs profils locaux."
				key="panel.profiles.browserHint"
			/>
		</p>
	{/if}

	{#if status}
		<p class="profiles-status" role="status">{status}</p>
	{/if}
</section>

<style>
	.profiles-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.profiles-list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-lg);
		display: grid;
		gap: var(--space-sm);
	}

	.profiles-item {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		align-items: stretch;
	}

	.profiles-item .btn:first-child {
		flex: 1;
	}

	.profiles-active {
		font-weight: 400;
		font-size: var(--font-size-sm);
	}

	.profiles-create label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	.profiles-create-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.profiles-create-row input {
		flex: 1;
		min-width: 12rem;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
		min-height: var(--btn-min-height);
	}

	.profiles-status {
		margin-top: var(--space-md);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
