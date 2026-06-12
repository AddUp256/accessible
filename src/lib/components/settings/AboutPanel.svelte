<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { REDISTRIBUTABLE_FONTS } from '$lib/config/fonts-catalog';
	import { APP_VERSION, OPEN_SOURCE_CREDITS } from '$lib/config/open-source-credits';
	import { downloadTextFile, exportFilename } from '$lib/services/export/download';
	import { profileStore, settings } from '$lib/stores/profile';

	function showIntroAgain() {
		profileStore.updateSettings({ ui: { firstLaunchIntroDismissed: false } });
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
			'Dernière mise à jour du document : génération locale depuis Accessible.'
		].join('\n');

		downloadTextFile(
			content,
			exportFilename('fonctionnalites-besoins', 'md'),
			'text/markdown;charset=utf-8'
		);
	}
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
	</p>
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
</style>
