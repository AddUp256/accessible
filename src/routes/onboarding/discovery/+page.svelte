<script lang="ts">
	// R?le : Page SvelteKit /routes/onboarding/discovery : assemble l?interface utilisateur et les actions de cette zone.

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { FUNCTIONAL_NEEDS_BY_ID } from '$lib/config/functional-needs';
	import { bilingualUi, type UiKey } from '$lib/i18n';
	import { completeOnboardingStep, setOnboardingPath } from '$lib/modules/onboarding/actions';
	import { flushProfileState } from '$lib/services/app-lifecycle';
	import { profileStore, settings } from '$lib/stores/profile';
	import type { FunctionalNeedEntry, FunctionalNeedId, ToolId } from '$lib/types/profile';

	type DiscoveryTab = {
		id: string;
		label: string;
		key: UiKey;
		href: string;
		tools: ToolId[];
		needs: FunctionalNeedId[];
		hint: string;
	};

	type DiagnosticQuestion = {
		id: string;
		label: string;
		observation: string;
		tools: ToolId[];
		needs: FunctionalNeedId[];
	};

	const discoveryTabs: DiscoveryTab[] = [
		{
			id: 'read',
			label: 'Lire',
			key: 'nav.read',
			href: '/lire?from=discovery',
			tools: ['read_adapted', 'listen_text'],
			needs: [],
			hint: "Tester l'affichage, les polices, l'OCR et la lecture."
		},
		{
			id: 'write',
			label: 'Écrire',
			key: 'nav.write',
			href: '/ecrire?from=discovery',
			tools: ['write_easier', 'correct_text', 'reduce_typing'],
			needs: [],
			hint: "Tester l'éditeur, la correction et les aides à la saisie."
		},
		{
			id: 'organize',
			label: 'Organiser',
			key: 'nav.organize',
			href: '/organiser?from=discovery',
			tools: ['organize_work'],
			needs: [],
			hint: 'Tester les étapes, checklists, minuteur, notes et révisions.'
		},
		{
			id: 'understand',
			label: 'Comprendre',
			key: 'nav.understand',
			href: '/comprendre?from=discovery',
			tools: [],
			needs: ['besoin_consignes_decoupees'],
			hint: 'Tester le découpage des consignes et la reformulation.'
		},
		{
			id: 'communicate',
			label: 'Communiquer',
			key: 'nav.communicate',
			href: '/communiquer?from=discovery',
			tools: ['pictograms'],
			needs: ['besoin_pictogrammes'],
			hint: 'Tester les cartes, pictogrammes et messages à montrer.'
		},
		{
			id: 'notes',
			label: 'Notes',
			key: 'nav.notes',
			href: '/notes?from=discovery',
			tools: [],
			needs: ['difficulte_prise_notes'],
			hint: 'Tester la prise de notes et les exports.'
		}
	];

	const diagnosticQuestions: DiagnosticQuestion[] = [
		{
			id: 'read_fatigue',
			label: 'Lire longtemps fatigue, les lignes se perdent ou le document paraît dense.',
			observation: 'On vérifie d’abord le confort visuel, la taille, l’interligne, le guide-ligne et la lecture audio.',
			tools: ['read_adapted', 'listen_text'],
			needs: ['lecture_longue_fatigante', 'perte_de_ligne', 'besoin_ecoute_audio']
		},
		{
			id: 'scanned_documents',
			label: 'Les PDF scannés, photos de documents ou fichiers non copiables posent problème.',
			observation: 'On prévoit un test OCR et une procédure pour obtenir un texte modifiable.',
			tools: ['work_on_pdf', 'read_adapted'],
			needs: ['besoin_documents_ocerises']
		},
		{
			id: 'write_spelling',
			label: 'Écrire demande beaucoup d’effort, surtout l’orthographe ou la relecture.',
			observation: 'On teste la correction pas à pas, la relecture vocale et la simplification de l’espace d’écriture.',
			tools: ['write_easier', 'correct_text'],
			needs: ['difficulte_orthographique', 'besoin_correction_etape_par_etape']
		},
		{
			id: 'typing_fatigue',
			label: 'Taper au clavier est lent, fatigant ou douloureux.',
			observation: 'On cherche à réduire la frappe avec prédiction de mots, dictée ou textes préparés.',
			tools: ['write_easier', 'reduce_typing'],
			needs: ['difficulte_ecrire_longtemps', 'besoin_prediction_mots', 'besoin_reduire_frappe']
		},
		{
			id: 'instructions',
			label: 'Les consignes longues, orales ou implicites sont difficiles à suivre.',
			observation: 'On découpe les consignes, on reformule et on garde une trace écrite étape par étape.',
			tools: ['organize_work'],
			needs: ['besoin_consignes_decoupees', 'besoin_consignes_ecrites', 'besoin_une_etape_a_la_fois']
		},
		{
			id: 'planning',
			label: 'Commencer, prioriser ou terminer un travail est difficile.',
			observation: 'On teste les checklists, minuteurs, routines et cartes mentales.',
			tools: ['organize_work'],
			needs: ['difficulte_commencer_tache', 'besoin_pauses', 'besoin_previsibilite', 'besoin_cartes_mentales']
		},
		{
			id: 'notes_memory',
			label: 'Prendre des notes ou mémoriser après un cours ou une réunion est compliqué.',
			observation: 'On propose notes simples/Cornell, exports et cartes de révision.',
			tools: ['organize_work'],
			needs: ['difficulte_prise_notes']
		},
		{
			id: 'sensory',
			label: 'Le bruit, les animations, les couleurs ou trop d’informations à l’écran saturent vite.',
			observation: 'On réduit les distractions et on adapte le thème, les animations et la prévisibilité.',
			tools: ['reduce_distractions', 'adapt_interface'],
			needs: ['gene_bruit', 'gene_animations', 'gene_couleurs', 'besoin_environnement_faible_distraction']
		},
		{
			id: 'communication',
			label: 'Il est utile d’avoir des phrases prêtes, pictogrammes ou messages à montrer.',
			observation: 'On prépare des cartes, des pictogrammes et des messages pour demander de l’aide ou expliquer un besoin.',
			tools: ['pictograms', 'prepare_appointment'],
			needs: ['besoin_pictogrammes', 'besoin_consignes_ecrites']
		},
		{
			id: 'video_audio',
			label: 'Les vidéos, audios ou réunions sans transcription/sous-titres sont difficiles.',
			observation: 'On teste les sous-titres, la transcription et les exports de texte.',
			tools: ['subtitles', 'listen_text'],
			needs: ['besoin_sous_titres', 'besoin_ecoute_audio']
		}
	];

	const diagnosticToolIds = new Set(diagnosticQuestions.flatMap((question) => question.tools));
	const diagnosticNeedIds = new Set(diagnosticQuestions.flatMap((question) => question.needs));

	let selectedQuestionIds = $state<string[]>([]);

	onMount(() => {
		if ($profileStore.onboarding.path !== 'discovery') {
			setOnboardingPath('discovery', { reset: false });
		}
		selectedQuestionIds = get(profileStore).onboarding.diagnosticAnswers.filter((questionId) =>
			diagnosticQuestions.some((question) => question.id === questionId)
		);
		if (selectedQuestionIds.length > 0) {
			applyDiagnosticAnswers(selectedQuestionIds);
		}
	});

	function isDiscoveryTabActive(tab: (typeof discoveryTabs)[number]): boolean {
		const toolActive = tab.tools.some((tool) => $profileStore.activatedTools.includes(tool));
		const profileEntries = Object.values($profileStore.functionalProfiles) as FunctionalNeedEntry[][];
		const needActive = profileEntries.some((entries) =>
			entries.some((entry) => tab.needs.includes(entry.id as FunctionalNeedId))
		);
		return toolActive || needActive;
	}

	function applyDiagnosticAnswers(questionIds = selectedQuestionIds) {
		const selectedQuestions = diagnosticQuestions.filter((question) =>
			questionIds.includes(question.id)
		);
		const selectedTools = new Set(selectedQuestions.flatMap((question) => question.tools));
		const selectedNeeds = new Set(selectedQuestions.flatMap((question) => question.needs));
		const now = new Date().toISOString();

		profileStore.patch((profile) => {
			const activatedTools = [
				...profile.activatedTools.filter((tool) => !diagnosticToolIds.has(tool)),
				...selectedTools
			].filter((tool, index, list) => list.indexOf(tool) === index);

			const functionalProfiles = { ...profile.functionalProfiles };
			for (const category of Object.keys(functionalProfiles) as Array<keyof typeof functionalProfiles>) {
				functionalProfiles[category] = functionalProfiles[category].filter(
					(entry) => !diagnosticNeedIds.has(entry.id as FunctionalNeedId)
				);
			}

			for (const need of selectedNeeds) {
				const category = FUNCTIONAL_NEEDS_BY_ID[need]?.category;
				if (!category) continue;
				functionalProfiles[category] = [
					...functionalProfiles[category],
					{ id: need, source: 'onboarding', confirmedAt: now, confidence: 'declared' }
				];
			}

			return {
				...profile,
				activatedTools,
				functionalProfiles,
				onboarding: { ...profile.onboarding, diagnosticAnswers: questionIds }
			};
		});
	}

	function toggleDiagnosticQuestion(questionId: string) {
		const nextQuestionIds = selectedQuestionIds.includes(questionId)
			? selectedQuestionIds.filter((id) => id !== questionId)
			: [...selectedQuestionIds, questionId];
		selectedQuestionIds = nextQuestionIds;
		applyDiagnosticAnswers(nextQuestionIds);
	}

	function toggleDiscoveryTab(tab: (typeof discoveryTabs)[number]) {
		const now = new Date().toISOString();

		profileStore.patch((profile) => {
			const active =
				tab.tools.some((tool) => profile.activatedTools.includes(tool)) ||
				(Object.values(profile.functionalProfiles) as FunctionalNeedEntry[][]).some((entries) =>
					entries.some((entry) => tab.needs.includes(entry.id as FunctionalNeedId))
				);

			const activatedTools = active
				? profile.activatedTools.filter((tool) => !tab.tools.includes(tool))
				: Array.from(new Set([...profile.activatedTools, ...tab.tools]));

			const functionalProfiles = { ...profile.functionalProfiles };
			for (const need of tab.needs) {
				const category = FUNCTIONAL_NEEDS_BY_ID[need]?.category;
				if (!category) continue;

				if (active) {
					functionalProfiles[category] = functionalProfiles[category].filter(
						(entry) => entry.id !== need
					);
				} else if (!functionalProfiles[category].some((entry) => entry.id === need)) {
					functionalProfiles[category] = [
						...functionalProfiles[category],
						{ id: need, source: 'onboarding', confirmedAt: now, confidence: 'declared' }
					];
				}
			}

			return { ...profile, activatedTools, functionalProfiles };
		});
	}

	async function finishDiscovery() {
		applyDiagnosticAnswers(selectedQuestionIds);
		completeOnboardingStep('discovery_tabs');
		await flushProfileState();
		goto('/onboarding/complete');
	}
</script>

<svelte:head>
	<title>Personnalisation guidée - Accessible</title>
</svelte:head>

<section class="card diagnostic-flow" aria-labelledby="diagnostic-flow-heading">
	<div class="discovery-heading">
		<h2 id="diagnostic-flow-heading">Repérage guidé des besoins</h2>
		<p>
			Cochez ce que vous observez dans votre travail quotidien. Accessible traduit ces réponses en
			zones à tester, sans poser de diagnostic et sans remplacer un professionnel.
		</p>
	</div>

	<ol class="diagnostic-steps">
		<li>Décrire la situation concrète : lire, écrire, organiser, comprendre, communiquer.</li>
		<li>Repérer ce qui fatigue, bloque, ralentit ou demande de l’aide extérieure.</li>
		<li>Tester les zones proposées, puis désactiver ce qui ne sert pas.</li>
		<li>Télécharger la synthèse pour reproduire les réglages dans l’environnement de travail.</li>
	</ol>

	<div class="diagnostic-question-grid">
		{#each diagnosticQuestions as question}
			<label class="diagnostic-question">
				<input
					type="checkbox"
					checked={selectedQuestionIds.includes(question.id)}
					onchange={() => toggleDiagnosticQuestion(question.id)}
				/>
				<span>
					<strong>{question.label}</strong>
					<small>{question.observation}</small>
				</span>
			</label>
		{/each}
	</div>
</section>

<section class="card discovery-tabs" aria-labelledby="discovery-tabs-heading">
	<div class="discovery-heading">
		<h2 id="discovery-tabs-heading">Onglets utiles à tester</h2>
		<p>
			Les zones ci-dessous sont pré-cochées selon les réponses ci-dessus. Ouvrez un module pour le
			tester, enregistrez si besoin, puis revenez ici.
		</p>
	</div>

	<div class="discovery-tab-grid">
		{#each discoveryTabs as tab}
			{@const label = bilingualUi(tab.label, tab.key, $settings.ui)}
			{@const active = isDiscoveryTabActive(tab)}
			<div class="discovery-tab" class:discovery-tab--active={active}>
				<div class="discovery-tab-copy">
					<strong>
						<BilingualText primary={label.primary} secondary={label.secondary} inline />
					</strong>
					<small>{tab.hint}</small>
				</div>
				<div class="discovery-tab-actions">
					<button
						type="button"
						class="btn"
						class:btn-primary={active}
						class:btn-secondary={!active}
						aria-pressed={active}
						onclick={() => toggleDiscoveryTab(tab)}
					>
						{active ? 'Désactiver' : 'Activer'}
					</button>
					<a class="btn btn-secondary" href={tab.href}>Tester</a>
				</div>
			</div>
		{/each}
	</div>
</section>

<div class="onboarding-actions">
	<a class="btn btn-secondary" href="/onboarding">Retour au choix du parcours</a>
	<button type="button" class="btn btn-primary" onclick={finishDiscovery}>
		Enregistrer et terminer
	</button>
</div>

<style>
	.diagnostic-flow,
	.discovery-tabs {
		display: grid;
		gap: var(--space-lg);
	}

	.diagnostic-steps {
		margin: 0;
		padding-left: var(--space-lg);
		color: var(--color-text-muted);
	}

	.diagnostic-question-grid {
		display: grid;
		gap: var(--space-sm);
	}

	.diagnostic-question {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		min-height: var(--btn-min-height);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
		cursor: pointer;
	}

	.diagnostic-question:has(input:checked) {
		border-color: var(--color-accent);
		box-shadow: inset 0.25rem 0 0 var(--color-accent);
	}

	.diagnostic-question input {
		width: 1.25rem;
		height: 1.25rem;
		flex: 0 0 auto;
		margin-top: 0.2rem;
	}

	.diagnostic-question span {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 0;
	}

	.diagnostic-question small {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.discovery-heading p {
		margin: 0;
		color: var(--color-text-muted);
	}

	.discovery-tab-grid {
		display: grid;
		gap: var(--space-sm);
	}

	.discovery-tab {
		display: grid;
		gap: var(--space-sm);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
	}

	.discovery-tab--active {
		border-color: var(--color-accent);
		box-shadow: inset 0.25rem 0 0 var(--color-accent);
	}

	.discovery-tab-copy {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 0;
	}

	.discovery-tab-copy small {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.discovery-tab-actions,
	.onboarding-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.onboarding-actions {
		margin-top: var(--space-lg);
	}

	@media (min-width: 48rem) {
		.discovery-tab {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: center;
		}
	}
</style>
