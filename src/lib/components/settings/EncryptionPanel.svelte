<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { bilingualUi, dynamicMessage } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';
	import {
		changeProfilePassword,
		disableProfileEncryption,
		enableProfileEncryption,
		isProfileEncryptionEnabled,
		lockProfileSession
	} from '$lib/services/storage/encryption';

	let enabled = $state(false);
	let status = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let currentPassword = $state('');
	let newPassword = $state('');
	let newPasswordConfirm = $state('');

	const statusActive = $derived(
		bilingualUi('Chiffrement actif', 'panel.encryption.statusActive', $settings.ui)
	);
	const statusInactive = $derived(
		bilingualUi('Non chiffré', 'panel.encryption.statusInactive', $settings.ui)
	);
	const statusLabel = $derived(
		bilingualUi('État', 'panel.encryption.statusLabel', $settings.ui)
	);

	onMount(async () => {
		enabled = await isProfileEncryptionEnabled();
	});

	async function refreshStatus() {
		enabled = await isProfileEncryptionEnabled();
	}

	async function activateEncryption() {
		status = '';
		if (password.length < 8) {
			status = dynamicMessage('dyn.encryption.passwordTooShort', $settings.ui);
			return;
		}
		if (password !== confirmPassword) {
			status = dynamicMessage('dyn.encryption.passwordMismatch', $settings.ui);
			return;
		}

		try {
			await enableProfileEncryption(password, get(profileStore));
			await refreshStatus();
			password = '';
			confirmPassword = '';
			status = dynamicMessage('dyn.encryption.enabled', $settings.ui);
		} catch (error) {
			status = error instanceof Error ? error.message : dynamicMessage('dyn.encryption.enableFailed', $settings.ui);
		}
	}

	async function deactivateEncryption() {
		status = '';
		try {
			const profile = get(profileStore);
			await disableProfileEncryption(currentPassword, profile);
			await refreshStatus();
			currentPassword = '';
			status = dynamicMessage('dyn.encryption.disabled', $settings.ui);
		} catch (error) {
			status = error instanceof Error ? error.message : dynamicMessage('dyn.encryption.disableFailed', $settings.ui);
		}
	}

	async function updatePassword() {
		status = '';
		if (newPassword.length < 8) {
			status = dynamicMessage('dyn.encryption.newPasswordTooShort', $settings.ui);
			return;
		}
		if (newPassword !== newPasswordConfirm) {
			status = dynamicMessage('dyn.encryption.newPasswordMismatch', $settings.ui);
			return;
		}

		try {
			await changeProfilePassword(currentPassword, newPassword, get(profileStore));
			currentPassword = '';
			newPassword = '';
			newPasswordConfirm = '';
			status = dynamicMessage('dyn.encryption.passwordChanged', $settings.ui);
		} catch (error) {
			status = error instanceof Error ? error.message : dynamicMessage('dyn.encryption.changeFailed', $settings.ui);
		}
	}

	function lockNow() {
		lockProfileSession();
		status = dynamicMessage('dyn.encryption.sessionLocked', $settings.ui);
	}
</script>

<section class="card encryption-panel" aria-labelledby="encryption-heading">
	<BiHeading fr="Chiffrement du profil" key="panel.encryption.title" level={3} id="encryption-heading" />
	<p class="encryption-hint">
		<BiText
			fr="Protège le fichier profil et la sauvegarde JSON avec un mot de passe local. Le mot de passe n'est jamais enregistré et ne peut pas être récupéré."
			key="panel.encryption.hint1"
		/>
	</p>
	<p class="encryption-hint">
		<BiText
			fr="Les tables SQLite normalisées (notes, flashcards, etc.) restent en clair sur le disque en cette version."
			key="panel.encryption.hint2"
		/>
	</p>

	<p>
		<BilingualText primary={statusLabel.primary} secondary={statusLabel.secondary} inline /> :
		<strong>
			{#if enabled}
				<BilingualText primary={statusActive.primary} secondary={statusActive.secondary} inline />
			{:else}
				<BilingualText primary={statusInactive.primary} secondary={statusInactive.secondary} inline />
			{/if}
		</strong>
	</p>

	{#if !enabled}
		<div class="encryption-block">
			<h4><BiText fr="Activer le chiffrement" key="panel.encryption.enable.title" inline /></h4>
			<label class="encryption-field">
				<span
					><BiText
						fr="Nouveau mot de passe (8 caractères minimum)"
						key="panel.encryption.passwordNew"
						inline
					/></span
				>
				<input type="password" autocomplete="new-password" bind:value={password} />
			</label>
			<label class="encryption-field">
				<span><BiText fr="Confirmer le mot de passe" key="panel.encryption.passwordConfirm" inline /></span>
				<input type="password" autocomplete="new-password" bind:value={confirmPassword} />
			</label>
			<button type="button" class="btn btn-primary" onclick={activateEncryption}>
				<BiText fr="Activer le chiffrement" key="panel.encryption.enableBtn" inline />
			</button>
		</div>
	{:else}
		<div class="encryption-block">
			<h4><BiText fr="Modifier le mot de passe" key="panel.encryption.change.title" inline /></h4>
			<label class="encryption-field">
				<span><BiText fr="Mot de passe actuel" key="panel.encryption.passwordCurrent" inline /></span>
				<input type="password" autocomplete="current-password" bind:value={currentPassword} />
			</label>
			<label class="encryption-field">
				<span><BiText fr="Nouveau mot de passe" key="panel.encryption.passwordNewShort" inline /></span>
				<input type="password" autocomplete="new-password" bind:value={newPassword} />
			</label>
			<label class="encryption-field">
				<span
					><BiText
						fr="Confirmer le nouveau mot de passe"
						key="panel.encryption.passwordNewConfirm"
						inline
					/></span
				>
				<input type="password" autocomplete="new-password" bind:value={newPasswordConfirm} />
			</label>
			<button type="button" class="btn btn-secondary" onclick={updatePassword}>
				<BiText fr="Changer le mot de passe" key="panel.encryption.changeBtn" inline />
			</button>
		</div>

		<div class="encryption-block">
			<h4><BiText fr="Désactiver ou verrouiller" key="panel.encryption.disable.title" inline /></h4>
			<label class="encryption-field">
				<span><BiText fr="Mot de passe actuel" key="panel.encryption.passwordCurrent" inline /></span>
				<input type="password" autocomplete="current-password" bind:value={currentPassword} />
			</label>
			<div class="encryption-actions">
				<button type="button" class="btn btn-secondary" onclick={deactivateEncryption}>
					<BiText fr="Désactiver le chiffrement" key="panel.encryption.disableBtn" inline />
				</button>
				<button type="button" class="btn btn-secondary" onclick={lockNow}>
					<BiText fr="Verrouiller la session" key="panel.encryption.lockBtn" inline />
				</button>
			</div>
		</div>
	{/if}

	{#if status}
		<p class="encryption-status" role="status">{status}</p>
	{/if}
</section>

<style>
	.encryption-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.encryption-block {
		margin-top: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.encryption-block h4 {
		margin: 0;
		font-size: var(--font-size-base);
	}

	.encryption-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.encryption-field input {
		min-height: var(--btn-min-height);
		font-size: var(--font-size-base);
	}

	.encryption-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.encryption-status {
		margin-top: var(--space-md);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
