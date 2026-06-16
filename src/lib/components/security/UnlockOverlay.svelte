<script lang="ts">
	// R?le : Composant Svelte de s?curit? locale : encapsule l?affichage et les interactions r?utilisables.


	import { profileStore, settings } from '$lib/stores/profile';
	import { unlockWithPassword } from '$lib/services/storage/encryption';

	import { refreshProfileSummaries } from '$lib/stores/profile-profiles';

	import BiHeading from '$lib/components/ui/BiHeading.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import BilingualText from '$lib/components/ui/BilingualText.svelte';

	import {

		bilingualUi,

		dynamicMessage,

		translateServiceMessage

	} from '$lib/i18n';

	let {

		onUnlocked

	}: {

		onUnlocked: () => void;

	} = $props();



	let password = $state('');

	let error = $state('');

	let loading = $state(false);



	const submitLabel = $derived(bilingualUi('Déverrouiller', 'unlock.submit', $settings.ui));

	const submittingLabel = $derived(

		bilingualUi('Déverrouillage…', 'unlock.submitting', $settings.ui)

	);



	async function submit(event: Event) {

		event.preventDefault();

		error = '';

		loading = true;



		try {

			const profile = await unlockWithPassword(password);

			profileStore.importProfile(profile);

			await refreshProfileSummaries();

			password = '';

			onUnlocked();

		} catch (cause) {

			const message =

				cause instanceof Error

					? cause.message

					: dynamicMessage('dyn.encryption.unlockFailed', $settings.ui);

			error = translateServiceMessage(message, $settings.ui);

		} finally {

			loading = false;

		}

	}

</script>



<div class="unlock-overlay" role="dialog" aria-modal="true" aria-labelledby="unlock-heading">

	<section class="unlock-card card">

		<BiHeading fr="Profil protégé" key="unlock.title" id="unlock-heading" />

		<p>

			<BiText

				fr="Votre profil est chiffré sur cet appareil. Entrez votre mot de passe pour continuer."

				key="unlock.hint"

			/>

		</p>

		<p class="unlock-warning">

			<BiText

				fr="Si vous oubliez votre mot de passe, vos données ne pourront pas être récupérées."

				key="unlock.warning"

			/>

		</p>



		<form class="unlock-form" onsubmit={submit}>

			<label class="unlock-field">

				<span><BiText fr="Mot de passe" key="unlock.passwordLabel" inline /></span>

				<input

					type="password"

					autocomplete="current-password"

					bind:value={password}

					required

					minlength="8"

					disabled={loading}

				/>

			</label>



			{#if error}

				<p class="unlock-error" role="alert">{error}</p>

			{/if}



			<button type="submit" class="btn btn-primary" disabled={loading || password.length < 8}>

				{#if loading}

					<BilingualText

						primary={submittingLabel.primary}

						secondary={submittingLabel.secondary}

						inline

					/>

				{:else}

					<BilingualText primary={submitLabel.primary} secondary={submitLabel.secondary} inline />

				{/if}

			</button>

		</form>

	</section>

</div>



<style>

	.unlock-overlay {

		position: fixed;

		inset: 0;

		z-index: 1000;

		display: grid;

		place-items: center;

		padding: var(--space-lg);

		background: color-mix(in srgb, var(--color-bg) 85%, black);

	}



	.unlock-card {

		width: min(100%, 28rem);

	}



	.unlock-warning {

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.unlock-form {

		display: flex;

		flex-direction: column;

		gap: var(--space-md);

		margin-top: var(--space-lg);

	}



	.unlock-field {

		display: flex;

		flex-direction: column;

		gap: var(--space-xs);

	}



	.unlock-field input {

		min-height: var(--btn-min-height);

		font-size: var(--font-size-base);

	}



	.unlock-error {

		margin: 0;

		color: var(--color-danger, #8b1e1e);

		font-size: var(--font-size-sm);

	}

</style>


