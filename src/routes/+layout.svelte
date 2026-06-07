<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import '../app.css';
	import '$lib/modules/reading/embedded-fonts';
	import { page } from '$app/stores';
	import CrisisOverlay from '$lib/components/crisis/CrisisOverlay.svelte';
	import UnlockOverlay from '$lib/components/security/UnlockOverlay.svelte';
	import { profileStore, settings } from '$lib/stores/profile';
	import { initProfileFromStorage } from '$lib/services/storage/local';
	import { refreshProfileSummaries } from '$lib/stores/profile-profiles';
	import { isTauriRuntime } from '$lib/services/storage/tauri';
	import { bindAppLifecycle } from '$lib/services/app-lifecycle';
	import RouteFeatureGuard from '$lib/components/profile/RouteFeatureGuard.svelte';
	import AccessibilityShell from '$lib/components/accessibility/AccessibilityShell.svelte';
	import KeyboardNavigation from '$lib/components/accessibility/KeyboardNavigation.svelte';
	import { bootstrapPlugins } from '$lib/plugins';
	import { NAV_PICTOGRAMS } from '$lib/config/nav-pictograms';
	import { isVerySimpleDetail } from '$lib/utils/detail-level';
	import AppToast from '$lib/components/accessibility/AppToast.svelte';
	import GlobalDictation from '$lib/components/accessibility/GlobalDictation.svelte';
	import InterfaceTTS from '$lib/components/accessibility/InterfaceTTS.svelte';
	import FirstLaunchIntro from '$lib/components/onboarding/FirstLaunchIntro.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import QuitAppButton from '$lib/components/ui/QuitAppButton.svelte';
	import InternetToggleButton from '$lib/components/ui/InternetToggleButton.svelte';
	import { bilingualUi, type UiKey } from '$lib/i18n';
	import {
		ensureSecondaryLanguagePack,
		initLanguagePackRuntime,
		refreshLanguagePackRuntime
	} from '$lib/i18n/language-pack-runtime';
	import { isFeatureVisible } from '$lib/modules/profile/feature-visibility';

	let { children } = $props();

	let crisisMode = $state(false);
	let storageReady = $state(false);
	let encryptionLocked = $state(false);

	onMount(() => {
		bootstrapPlugins();
		let unbindLifecycle: (() => void) | undefined;
		void bindAppLifecycle().then((unbind) => {
			unbindLifecycle = unbind;
		});
		void (async () => {
			await initLanguagePackRuntime();
			const result = await initProfileFromStorage((profile) => {
				profileStore.importProfile(profile);
			});

			if (result.locked) {
				encryptionLocked = true;
				return;
			}

			if (isTauriRuntime()) {
				await refreshProfileSummaries();
			}
			const ui = get(settings).ui;
			await ensureSecondaryLanguagePack(ui.secondaryLanguage, ui.bilingualUi);
			storageReady = true;
		})();

		const onVisible = () => {
			if (document.visibilityState === 'visible') {
				void refreshLanguagePackRuntime();
			}
		};
		document.addEventListener('visibilitychange', onVisible);

		return () => {
			unbindLifecycle?.();
			document.removeEventListener('visibilitychange', onVisible);
		};
	});

	function handleUnlocked() {
		encryptionLocked = false;
		storageReady = true;
		void refreshProfileSummaries();
	}

	const navItems: { href: string; label: string; key: UiKey }[] = [
		{ href: '/', label: 'Accueil', key: 'nav.home' },
		{ href: '/lire', label: 'Lire', key: 'nav.read' },
		{ href: '/ecrire', label: 'Écrire', key: 'nav.write' },
		{ href: '/organiser', label: 'Organiser', key: 'nav.organize' },
		{ href: '/comprendre', label: 'Comprendre', key: 'nav.understand' },
		{ href: '/communiquer', label: 'Communiquer', key: 'nav.communicate' },
		{ href: '/notes', label: 'Notes', key: 'nav.notes' },
		{ href: '/memoriser', label: 'Mémoriser', key: 'nav.memorize' },
		{ href: '/profil', label: 'Mon profil', key: 'nav.profile' },
		{ href: '/parametres', label: 'Paramètres', key: 'nav.settings' }
	];

	const pauseLabel = $derived(bilingualUi('Mode pause', 'nav.pause', $settings.ui));
	const effectiveButtonSize = $derived(
		$settings.motor.largeButtons || $settings.ui.buttonSize === 'veryLarge'
			? 'veryLarge'
			: $settings.ui.buttonSize === 'large'
				? 'large'
				: 'normal'
	);
	const verySimple = $derived(isVerySimpleDetail($profileStore));
	const showPictograms = $derived($settings.ui.showPictograms || verySimple);
	const visibleNavItems = $derived(
		navItems.filter((item) => {
			if (verySimple && item.href === '/profil') return false;
			if (item.href === '/' || item.href === '/parametres') return true;
			const feature = item.href.slice(1) as import('$lib/modules/profile/feature-visibility').AppFeature;
			return isFeatureVisible($profileStore, feature);
		})
	);

	function isCurrent(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<svelte:head>
	<title>Accessible</title>
	<meta name="description" content="Adapter votre environnement de lecture et de travail numérique." />
</svelte:head>

<a class="skip-link" href="#main-content"><BiText fr="Aller au contenu" key="common.skipToContent" inline /></a>

{#if encryptionLocked}
	<UnlockOverlay onUnlocked={handleUnlocked} />
{:else if storageReady}
	<div
		class="app-shell"
		data-theme={$settings.ui.theme}
		data-button-size={effectiveButtonSize}
		data-text-size={$settings.ui.textSize ?? 'normal'}
		class:reduce-motion={!$settings.ui.animations || $settings.sensory.reducedMotion || crisisMode}
		class:crisis-active={crisisMode}
	>
		<AccessibilityShell />
		<KeyboardNavigation />
		<InterfaceTTS />
		<GlobalDictation />
		<AppToast />
		{#if !crisisMode}
			<FirstLaunchIntro />
		{/if}
		{#if $profileStore.privacy.guestMode}
			<div class="guest-banner" role="status">
				<BiText fr="Mode invité actif — vos réglages ne sont pas enregistrés." key="banner.guest" inline />
			</div>
		{:else if $profileStore.meta.appMode === 'teacher'}
			<div class="mode-banner" role="status">
				<BiText fr="Mode enseignant — consultez ou exportez une synthèse d'aménagements." key="banner.teacher" inline />
			</div>
		{:else if $profileStore.meta.appMode === 'companion'}
			<div class="mode-banner" role="status">
				<BiText fr="Mode accompagnant — aide à préparer un rendez-vous." key="banner.companion" inline />
			</div>
		{:else if $profileStore.meta.appMode === 'verySimple'}
			<div class="mode-banner" role="status">
				<BiText fr="Interface très simple — gros boutons et textes courts." key="banner.verySimple" inline />
			</div>
		{:else if $profileStore.meta.appMode === 'expert'}
			<div class="mode-banner" role="status">
				<BiText fr="Mode expert — tous les réglages avancés sont visibles." key="banner.expert" inline />
			</div>
		{/if}

		<header class="app-header">
			<div class="header-inner">
				<h1 class="app-title">
					<a href="/">Accessible</a>
				</h1>
				<div class="header-actions">
					<InternetToggleButton />
					<QuitAppButton />
					<button
						type="button"
						class="btn btn-secondary"
						onclick={() => (crisisMode = true)}
						aria-label={bilingualUi('Activer le mode pause', 'crisis.ariaActivate', $settings.ui).primary}
					>
						<BilingualText primary={pauseLabel.primary} secondary={pauseLabel.secondary} inline />
					</button>
				</div>
			</div>
		</header>

		{#if !crisisMode}
			<nav class="app-nav" aria-label="Navigation principale">
				<ul class="nav-list">
					{#each visibleNavItems as item}
						{@const label = bilingualUi(item.label, item.key, $settings.ui)}
						{@const picto = NAV_PICTOGRAMS[item.href]}
						<li>
							<a
								href={item.href}
								aria-current={isCurrent(item.href, $page.url.pathname) ? 'page' : undefined}
							>
								{#if showPictograms && picto}
									<span class="nav-picto" aria-hidden="true">{picto}</span>
								{/if}
								<BilingualText primary={label.primary} secondary={label.secondary} inline />
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}

		<main id="main-content" class="app-main" class:app-main--hidden={crisisMode}>
			<RouteFeatureGuard>
				{@render children()}
			</RouteFeatureGuard>
		</main>

		{#if !crisisMode}
			<footer class="app-footer">
				<p><BiText fr="Accessible ne pose pas de diagnostic." key="footer.disclaimer" inline /></p>
			</footer>
		{/if}
	</div>

	<CrisisOverlay bind:open={crisisMode} />
{:else if !encryptionLocked}
	<p class="loading-shell" role="status"><BiText fr="Chargement…" key="common.loading" inline /></p>
{/if}

<style>
	.loading-shell {
		padding: var(--space-xl);
		text-align: center;
		font-size: var(--font-size-lg);
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-sm);
	}

	:global(.nav-picto) {
		display: inline-block;
		margin-inline-end: 0.35em;
		font-size: 1.15em;
		line-height: 1;
		vertical-align: -0.1em;
	}

	:global(.zone-picto) {
		display: block;
		font-size: 1.75rem;
		line-height: 1;
		margin-bottom: 0.25rem;
	}
</style>
