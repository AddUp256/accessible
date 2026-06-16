<script lang="ts">
	// R?le : Composant Svelte de parcours d?accueil : encapsule l?affichage et les interactions r?utilisables.

	import { goto } from '$app/navigation';
	import { profileStore, settings } from '$lib/stores/profile';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { bilingualUi, type UiKey } from '$lib/i18n';

	let hiddenForSession = $state(false);
	let continueButton = $state<HTMLButtonElement>();

	const visible = $derived(!$settings.ui.firstLaunchIntroDismissed && !hiddenForSession);
	const continueLabel = $derived(bilingualUi('Commencer le parcours', 'profile.path.start', $settings.ui));

	const features: { fr: string; key: UiKey }[] = [
		{
			fr: 'Lire : police, taille, fond, synthèse vocale, OCR image ou PDF et aide audio/vidéo.',
			key: 'intro.feature.read'
		},
		{
			fr: 'Écrire et comprendre : éditeur simple, prédiction de mots, correction si les moteurs sont installés, consignes découpées.',
			key: 'intro.feature.write'
		},
		{
			fr: 'Organiser, noter, mémoriser : checklists, minuteur, Kanban, routines, notes Cornell et flashcards.',
			key: 'intro.feature.organize'
		},
		{
			fr: 'Communiquer et préparer : cartes CAA, pictogrammes, profil de besoins et export JSON, PDF, ODT ou DOCX.',
			key: 'intro.feature.communicate'
		}
	];

	function closeForSession() {
		hiddenForSession = true;
	}

	async function startPersonalization() {
		profileStore.updateSettings({ ui: { firstLaunchIntroDismissed: true } });
		hiddenForSession = true;
		await goto('/onboarding');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeForSession();
		}
	}

	$effect(() => {
		if (visible && continueButton) {
			continueButton.focus();
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
	<div class="first-launch-overlay">
		<dialog
			open
			class="first-launch-dialog card"
			aria-modal="true"
			aria-labelledby="first-launch-title"
			aria-describedby="first-launch-lead first-launch-audience first-launch-use first-launch-privacy"
		>
			<BiHeading fr="Bienvenue dans Accessible" key="intro.title" id="first-launch-title" />

			<p id="first-launch-lead" class="first-launch-lead">
				<BiText
					fr="Accessible est une application locale pour adapter la lecture, l’écriture, l’organisation et la communication."
					key="intro.lead"
				/>
			</p>
			<p id="first-launch-audience">
				<BiText
					fr="Elle s’adresse aux personnes qui ont besoin d’un environnement plus lisible, plus calme ou plus prévisible, avec ou sans diagnostic, ainsi qu’aux accompagnants et enseignants."
					key="intro.audience"
				/>
			</p>
			<p id="first-launch-use">
				<BiText
					fr="Commencez par le parcours guidé pour garder seulement les zones utiles au départ. Les réglages se testent, se modifient et peuvent être exportés en synthèse."
					key="intro.use"
				/>
			</p>

			<div class="first-launch-features" aria-labelledby="first-launch-features-title">
				<BiHeading
					fr="Fonctions disponibles"
					key="intro.featuresTitle"
					level={3}
					id="first-launch-features-title"
				/>
				<ul>
					{#each features as feature}
						<li><BiText fr={feature.fr} key={feature.key} /></li>
					{/each}
				</ul>
			</div>

			<p id="first-launch-privacy" class="first-launch-privacy">
				<BiText
					fr="Les données restent sur cet appareil. Accessible ne pose pas de diagnostic et ne remplace pas un professionnel."
					key="intro.privacy"
				/>
			</p>

			<div class="first-launch-actions">
				<button
					type="button"
					class="btn btn-primary"
					onclick={startPersonalization}
					bind:this={continueButton}
				>
					<BilingualText
						primary={continueLabel.primary}
						secondary={continueLabel.secondary}
						inline
					/>
				</button>
			</div>
		</dialog>
	</div>
{/if}

<style>
	.first-launch-overlay {
		position: fixed;
		inset: 0;
		z-index: 950;
		display: grid;
		place-items: center;
		padding: var(--space-lg);
		background: var(--color-overlay);
	}

	.first-launch-dialog {
		width: min(100%, 42rem);
		max-height: calc(100vh - (2 * var(--space-lg)));
		overflow: auto;
		position: static;
		margin: 0;
		border: 1px solid var(--color-border);
	}

	.first-launch-dialog :global(h2),
	.first-launch-dialog :global(h3),
	.first-launch-dialog p {
		margin-top: 0;
	}

	.first-launch-lead {
		font-size: var(--font-size-lg);
		font-weight: 600;
	}

	.first-launch-features {
		margin-top: var(--space-lg);
	}

	.first-launch-features ul {
		margin: var(--space-sm) 0 0;
		padding-left: 1.25rem;
	}

	.first-launch-features li + li {
		margin-top: var(--space-sm);
	}

	.first-launch-privacy {
		margin-top: var(--space-lg);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.first-launch-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}

	.first-launch-actions .btn {
		min-width: 11rem;
	}
</style>
