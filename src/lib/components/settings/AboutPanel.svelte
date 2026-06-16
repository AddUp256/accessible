<script lang="ts">
	// R?le : Composant Svelte de param?tres : encapsule l?affichage et les interactions r?utilisables.

	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { onMount } from 'svelte';
	import { REDISTRIBUTABLE_FONTS } from '$lib/config/fonts-catalog';
	import {
		APP_RELEASE_TAG,
		APP_RELEASE_URL,
		APP_VERSION,
		COMMERCIAL_USE_NOTICE,
		EDITOR_CONTACT_NOTICE,
		OPEN_SOURCE_CREDITS,
		RGPD_NOTICE
	} from '$lib/config/open-source-credits';
	import { downloadTextFile, exportFilename } from '$lib/services/export/download';
	import {
		detectInstalledFonts,
		getAccessibleFontsDirectory,
		openAccessibleFontsDirectory,
		type DetectedFont
	} from '$lib/services/fonts';
	import { checkGitHubRelease, releaseCheckState } from '$lib/services/releases';
	import { profileStore, settings } from '$lib/stores/profile';

	let detectedFonts = $state<DetectedFont[]>([]);
	let fontDirectory = $state<string | null>(null);
	let fontStatus = $state('');
	let fontBusy = $state(false);
	let releaseBusy = $state(false);

	function showIntroAgain() {
		profileStore.updateSettings({ ui: { firstLaunchIntroDismissed: false } });
	}

	async function refreshFonts() {
		fontBusy = true;
		fontStatus = '';
		try {
			detectedFonts = await detectInstalledFonts();
			fontStatus =
				detectedFonts.length > 0
					? `${detectedFonts.length} police(s) détectée(s) sur cet appareil.`
					: "Détection indisponible dans ce navigateur. Utilisez l'application installée ou un navigateur compatible avec l'accès aux polices locales.";
		} catch {
			fontStatus =
				"Impossible d'actualiser la liste. Dans le navigateur, l'accès aux polices locales peut demander une autorisation.";
		} finally {
			fontBusy = false;
		}
	}

	async function openFontsFolder() {
		const opened = await openAccessibleFontsDirectory();
		if (opened) {
			fontDirectory = opened;
			fontStatus = `Dossier ouvert : ${opened}`;
		}
	}

	async function refreshReleaseStatus() {
		releaseBusy = true;
		try {
			await checkGitHubRelease(true);
		} finally {
			releaseBusy = false;
		}
	}

	function downloadFeaturesDocument() {
		const content = [
			'# Accessible - fonctionnalités et besoins couverts',
			'',
			'Accessible est une application locale d’aide à l’adaptation du travail numérique. Elle ne pose pas de diagnostic et ne remplace pas un professionnel.',
			'',
			'## Publics concernés',
			'- Personnes ayant besoin d’un environnement plus lisible, plus calme ou plus prévisible.',
			'- Élèves, étudiants, adultes, accompagnants, enseignants, référents handicap ou équipes informatiques.',
			'- Usages avec ou sans diagnostic déclaré.',
			'',
			'## Lire',
			'- Adapter police, taille, interligne, espacement, largeur de colonne et fond.',
			'- Lire à voix haute avec voix système ou moteurs locaux si disponibles.',
			'- Importer image ou PDF avec OCR pour transformer un document en texte modifiable.',
			'- Aide utile pour fatigue visuelle, dyslexie, difficulté de lecture longue, besoin d’audio, contraste ou fond doux.',
			'',
			'## Écrire',
			'- Éditeur simple, mode sans distraction, relecture vocale, prédiction de mots.',
			'- Correction orthographique avec Hunspell et grammaticale avec Grammalecte si installés.',
			'- Aide utile pour difficultés orthographiques, fatigabilité, écriture longue, réduction de frappe et relecture pas à pas.',
			'',
			'## Comprendre et organiser',
			'- Découper des consignes, reformuler, créer des étapes, checklists, routines, minuteurs et cartes mentales.',
			'- Aide utile pour fonctions exécutives, planification, priorisation, mémoire de travail et consignes complexes.',
			'',
			'## Communiquer',
			'- Cartes de communication, pictogrammes ARASAAC, messages préparés et bibliothèque locale.',
			'- Aide utile pour CAA, expression des besoins, situations de surcharge ou communication alternative.',
			'',
			'## Notes et mémoriser',
			'- Notes simples ou Cornell, exports, flashcards avec révision espacée.',
			'- Aide utile pour prise de notes, révisions, mémorisation active et préparation d’examens.',
			'',
			'## Paramètres et confidentialité',
			'- Thèmes crème, clair, sombre et contraste élevé.',
			'- Taille des boutons et textes, pictogrammes, navigation clavier, lecture vocale de l’interface.',
			'- Profil stocké localement, export JSON/PDF/ODT/DOCX, mode invité, chiffrement et mode portable dans l’application installée.',
			'',
			'## Modules optionnels',
			'- Tesseract et tessdata pour OCR local.',
			'- Hunspell et dictionnaires LibreOffice fr_FR pour orthographe.',
			'- Grammalecte CLI pour grammaire.',
			'- FFmpeg et whisper.cpp pour transcription audio/vidéo locale.',
			'- eSpeak NG ou Piper pour voix locales.',
			'',
			'## Utilisation commerciale',
			COMMERCIAL_USE_NOTICE,
			'',
			EDITOR_CONTACT_NOTICE,
			'',
			'## Données personnelles et RGPD',
			RGPD_NOTICE,
			'',
			'Dernière mise à jour du document : génération locale depuis Accessible.'
		].join('\n');

		downloadTextFile(
			content,
			exportFilename('fonctionnalites-besoins', 'md'),
			'text/markdown;charset=utf-8'
		);
	}

	onMount(async () => {
		fontDirectory = await getAccessibleFontsDirectory();
		if (fontDirectory) {
			await refreshFonts();
		}
	});
</script>

<section class="card about-panel" id="about" aria-labelledby="about-heading">
	<BiHeading fr="À propos" key="panel.about.title" level={3} id="about-heading" />
	<p class="about-intro">
		<BiText
			fr="Accessible est une application locale. Elle ne pose pas de diagnostic et n'envoie pas vos données en ligne."
			key="panel.about.intro"
		/>
	</p>
	<p class="about-version">
		<BiText fr="Version" key="panel.about.version" inline /> {APP_VERSION}
		<span class="release-link">
			(<a href={APP_RELEASE_URL} target="_blank" rel="noopener noreferrer">{APP_RELEASE_TAG}</a>)
		</span>
	</p>
	<div class="about-release" aria-labelledby="release-check-heading">
		<h4 id="release-check-heading" class="about-subheading">Releases GitHub</h4>
		<p role="status">
			{$releaseCheckState.message}
			{#if $releaseCheckState.checkedAt}
				<span class="release-date">
					Dernière vérification :
					{new Date($releaseCheckState.checkedAt).toLocaleString('fr-FR')}
				</span>
			{/if}
		</p>
		<div class="release-actions">
			<button
				type="button"
				class="btn btn-secondary"
				onclick={refreshReleaseStatus}
				disabled={releaseBusy || !$settings.ui.internetEnabled}
			>
				{releaseBusy || $releaseCheckState.status === 'checking'
					? 'Vérification...'
					: 'Vérifier les releases GitHub'}
			</button>
			{#if $releaseCheckState.htmlUrl}
				<a class="btn btn-secondary" href={$releaseCheckState.htmlUrl} target="_blank" rel="noreferrer">
					Ouvrir GitHub Releases
				</a>
			{/if}
		</div>
		{#if !$settings.ui.internetEnabled}
			<p class="release-note">Activez Internet pour autoriser la vérification GitHub.</p>
		{:else if $releaseCheckState.status === 'update_available'}
			<p class="release-note release-note--update">
				Version installée : {APP_VERSION}. Dernière release : {$releaseCheckState.latestTag}.
			</p>
		{/if}
	</div>
	<p class="about-legal" role="note">{COMMERCIAL_USE_NOTICE}</p>
	<div class="about-legal about-legal--info" role="note">
		<p>{EDITOR_CONTACT_NOTICE}</p>
		<p>{RGPD_NOTICE}</p>
	</div>
	<div class="about-intro-reset">
		<p>
			<BiText
				fr="Vous pouvez réafficher le message d’accueil pour relire le rôle de l’application."
				key="panel.about.introResetHint"
			/>
		</p>
		<button
			type="button"
			class="btn btn-secondary"
			onclick={showIntroAgain}
			disabled={!$settings.ui.firstLaunchIntroDismissed}
		>
			<BiText fr="Afficher le message d'accueil" key="panel.about.showIntro" inline />
		</button>
	</div>

	<div class="about-download">
		<p>
			Téléchargez un document de synthèse listant les fonctionnalités et les besoins fonctionnels
			auxquels elles peuvent répondre.
		</p>
		<button type="button" class="btn btn-secondary" onclick={downloadFeaturesDocument}>
			Télécharger la liste des fonctionnalités
		</button>
	</div>

	<h4 class="about-subheading">
		<BiText fr="Polices embarquées" key="panel.about.fontsTitle" inline />
	</h4>
	<ul class="about-list">
		{#each REDISTRIBUTABLE_FONTS as font}
			<li>
				<strong>{font.name}</strong> —
				{#if font.licenseUrl}
					<a href={font.licenseUrl} target="_blank" rel="noopener noreferrer">{font.license}</a>
				{:else}
					{font.license}
				{/if}
			</li>
		{/each}
	</ul>

	<div class="font-tools" aria-labelledby="font-tools-heading">
		<h4 id="font-tools-heading" class="about-subheading">Polices détectées sur l'ordinateur</h4>
		<p>
			Actualisez la liste pour comparer les polices embarquées avec les polices présentes sur
			l'ordinateur. Dans l'application installée, ajoutez manuellement vos fichiers TTF, OTF, WOFF ou
			WOFF2 dans le dossier Accessible dédié, puis relancez l'actualisation.
		</p>
		<div class="font-tool-actions">
			<button type="button" class="btn btn-secondary" onclick={refreshFonts} disabled={fontBusy}>
				{fontBusy ? 'Actualisation...' : 'Actualiser la liste des polices'}
			</button>
			{#if fontDirectory}
				<button type="button" class="btn btn-secondary" onclick={openFontsFolder}>
					Ouvrir le dossier des polices Accessible
				</button>
			{/if}
		</div>
		{#if fontDirectory}
			<p class="font-directory"><strong>Dossier :</strong> {fontDirectory}</p>
		{/if}
		{#if fontStatus}
			<p class="font-status" role="status">{fontStatus}</p>
		{/if}
		{#if detectedFonts.length > 0}
			<ul class="about-list detected-font-list">
				{#each detectedFonts.slice(0, 80) as font}
					<li>
						<strong>{font.name}</strong> — {font.source}
					</li>
				{/each}
			</ul>
			{#if detectedFonts.length > 80}
				<p class="font-status">Liste limitée aux 80 premières polices pour garder l'écran lisible.</p>
			{/if}
		{/if}
	</div>

	<h4 class="about-subheading">
		<BiText fr="Bibliothèques open source" key="panel.about.libsTitle" inline />
	</h4>
	<ul class="about-list">
		{#each OPEN_SOURCE_CREDITS as lib}
			<li>
				<strong>{lib.name}</strong> — {lib.role} —
				<a href={lib.licenseUrl} target="_blank" rel="noopener noreferrer">{lib.license}</a>
			</li>
		{/each}
	</ul>

	<p class="about-disclaimer" role="note">
		<BiText fr="Accessible ne pose pas de diagnostic." key="footer.disclaimer" />
	</p>
</section>

<style>
	.about-intro {
		margin: 0 0 var(--space-md);
		color: var(--color-text-muted);
	}

	.about-version {
		margin: 0 0 var(--space-lg);
		font-size: var(--font-size-sm);
	}

	.release-link {
		margin-left: var(--space-xs);
	}

	.about-legal,
	.about-release,
	.font-tools {
		margin: 0 0 var(--space-lg);
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
		font-size: var(--font-size-sm);
	}

	.about-legal {
		font-weight: 600;
	}

	.about-legal--info {
		font-weight: 400;
	}

	.about-legal--info p {
		margin: 0 0 var(--space-sm);
	}

	.about-release p {
		margin: 0 0 var(--space-sm);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.release-date {
		display: block;
		margin-top: var(--space-xs);
	}

	.release-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.release-note {
		margin-top: var(--space-sm);
	}

	.release-note--update {
		color: var(--color-warning, #8a4b00);
		font-weight: 700;
	}

	.about-intro-reset {
		margin: 0 0 var(--space-lg);
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
	}

	.about-intro-reset p {
		margin: 0 0 var(--space-sm);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.about-download {
		margin: 0 0 var(--space-lg);
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
	}

	.about-download p {
		margin: 0 0 var(--space-sm);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.about-subheading {
		margin: var(--space-lg) 0 var(--space-sm);
		font-size: var(--font-size-base);
	}

	.about-list {
		margin: 0;
		padding-left: var(--space-lg);
		font-size: var(--font-size-sm);
		line-height: 1.6;
	}

	.about-list li {
		margin-bottom: var(--space-xs);
	}

	.about-list a {
		color: var(--color-accent);
	}

	.about-disclaimer {
		margin: var(--space-lg) 0 0;
		padding: var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		font-weight: 600;
	}

	.font-tools p {
		margin: 0 0 var(--space-sm);
		color: var(--color-text-muted);
	}

	.font-tool-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.font-directory,
	.font-status {
		overflow-wrap: anywhere;
	}

	.detected-font-list {
		max-height: 18rem;
		overflow: auto;
		padding-right: var(--space-sm);
	}
</style>
