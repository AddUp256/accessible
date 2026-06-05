<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { ARASAAC_LICENSE_NOTICE, ARASAAC_WEBSITE, arasaacPictogramImageUrl } from '$lib/config/arasaac';
	import {
		addSavedPictogram,
		createPersonalCardWithPictogram,
		createSavedPictogram,
		removeSavedPictogram
	} from '$lib/modules/communicator/pictograms';
	import { addPersonalCard } from '$lib/modules/communicator/cards';
	import { searchArasaacPictograms, type ArasaacSearchResult } from '$lib/services/arasaac';
	import { profileStore, settings } from '$lib/stores/profile';
	import { bilingualLabel, bilingualUi, confirmDynamicMessage, dynamicMessage, configLabel } from '$lib/i18n';

	let query = $state('');
	let results = $state<ArasaacSearchResult[]>([]);
	let status = $state('');
	let busy = $state(false);

	const savedPictograms = $derived($profileStore.communicator.savedPictograms);
	const searchBtnLabel = $derived(
		busy
			? bilingualUi('Recherche…', 'mod.comm.arasaac.searchBusy', $settings.ui)
			: bilingualUi('Chercher', 'mod.comm.arasaac.searchBtn', $settings.ui)
	);
	const removeLabel = $derived(bilingualLabel('Retirer', 'mod.comm.arasaac.remove', $settings.ui));

	async function runSearch() {
		if (!$settings.ui.internetEnabled) {
			status = dynamicMessage('dyn.internet.disabled', $settings.ui);
			return;
		}

		busy = true;
		status = dynamicMessage('dyn.arasaac.searching', $settings.ui);
		results = [];

		const response = await searchArasaacPictograms(query);
		busy = false;

		if (!response.ok) {
			status = response.error;
			return;
		}

		results = response.results;
		status = dynamicMessage('dyn.arasaac.foundCount', $settings.ui, { count: response.results.length });
	}

	function savePictogram(result: ArasaacSearchResult) {
		profileStore.patch((profile) => ({
			...profile,
			communicator: addSavedPictogram(
				profile.communicator,
				createSavedPictogram(result.id, result.label)
			)
		}));
		status = dynamicMessage('dyn.arasaac.addedToLibrary', $settings.ui, { label: result.label });
	}

	function createCardFromPictogram(result: ArasaacSearchResult) {
		const message = result.keywords[0]
			? `Je veux parler de : ${result.keywords[0]}.`
			: result.label;

		profileStore.patch((profile) => {
			const withPictogram = addSavedPictogram(
				profile.communicator,
				createSavedPictogram(result.id, result.label)
			);
			return {
				...profile,
				communicator: addPersonalCard(
					withPictogram,
					createPersonalCardWithPictogram(result.label, message, result.id)
				)
			};
		});

		status = dynamicMessage('dyn.arasaac.cardCreated', $settings.ui, { label: result.label });
	}

	function deleteSaved(pictogramId: number) {
		if (!confirm(confirmDynamicMessage('dyn.arasaac.removeConfirm'))) return;
		profileStore.patch((profile) => ({
			...profile,
			communicator: removeSavedPictogram(profile.communicator, pictogramId)
		}));
		status = dynamicMessage('dyn.arasaac.removed', $settings.ui);
	}
</script>

<section class="card arasaac-panel" aria-labelledby="arasaac-heading" id="arasaac">
	<BiHeading fr="Pictogrammes ARASAAC" key="mod.comm.arasaac.title" level={3} id="arasaac-heading" />
	<p class="arasaac-notice">{ARASAAC_LICENSE_NOTICE}</p>
	<p class="arasaac-link">
		<a href={ARASAAC_WEBSITE} target="_blank" rel="noopener noreferrer">Site ARASAAC</a>
		<BiText fr="— recherche en ligne, import manuel dans Accessible." key="mod.comm.arasaac.linkHint" inline />
	</p>

	<form
		class="arasaac-search"
		onsubmit={(event) => {
			event.preventDefault();
			void runSearch();
		}}
	>
		<label for="arasaac-query">
			<BiText fr="Chercher un pictogramme (français)" key="mod.comm.arasaac.searchLabel" inline />
		</label>
		<div class="arasaac-search-row">
			<input
				id="arasaac-query"
				type="search"
				bind:value={query}
				placeholder={configLabel('Ex. : pause, aide, calme', 'cfg.ph.arasaacSearch', $settings.ui)}
				disabled={busy}
			/>
			<button type="submit" class="btn btn-primary" disabled={busy || !query.trim()}>
				<BilingualText
					primary={searchBtnLabel.primary}
					secondary={searchBtnLabel.secondary}
					inline
				/>
			</button>
		</div>
	</form>

	{#if status}
		<p class="arasaac-status" role="status">{status}</p>
	{/if}

	{#if results.length > 0}
		<h4 class="arasaac-subheading"><BiText fr="Résultats" key="mod.comm.arasaac.results" inline /></h4>
		<ul class="arasaac-results">
			{#each results as result (result.id)}
				<li class="arasaac-result">
					<img src={result.imageUrl} alt="" width="80" height="80" loading="lazy" />
					<div class="arasaac-result-body">
						<p class="arasaac-result-label">{result.label}</p>
						<div class="arasaac-result-actions">
							<button
								type="button"
								class="btn btn-secondary"
								onclick={() => savePictogram(result)}
							>
								<BiText fr="Bibliothèque" key="mod.comm.arasaac.toLibrary" inline />
							</button>
							<button
								type="button"
								class="btn btn-primary"
								onclick={() => createCardFromPictogram(result)}
							>
								<BiText fr="Créer une carte" key="mod.comm.arasaac.createCard" inline />
							</button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	<h4 class="arasaac-subheading"><BiText fr="Ma bibliothèque locale" key="mod.comm.arasaac.library" inline /></h4>
	{#if savedPictograms.length > 0}
		<ul class="arasaac-saved">
			{#each savedPictograms as pictogram (pictogram.id)}
				<li class="arasaac-saved-item">
					<img
						src={arasaacPictogramImageUrl(pictogram.id)}
						alt=""
						width="64"
						height="64"
						loading="lazy"
					/>
					<span>{pictogram.label}</span>
					<button
						type="button"
						class="btn btn-secondary"
						aria-label="{removeLabel} {pictogram.label}"
						onclick={() => deleteSaved(pictogram.id)}
					>
						<BiText fr="Retirer" key="mod.comm.arasaac.remove" inline />
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="arasaac-empty">
			<BiText
				fr="Aucun pictogramme importé. Cherchez un mot puis ajoutez à la bibliothèque."
				key="mod.comm.arasaac.empty"
			/>
		</p>
	{/if}
</section>

<style>
	.arasaac-notice {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		padding: var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
		margin-bottom: var(--space-md);
	}

	.arasaac-link {
		font-size: var(--font-size-sm);
		margin-bottom: var(--space-lg);
	}

	.arasaac-search {
		display: grid;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.arasaac-search label {
		font-weight: 600;
	}

	.arasaac-search-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.arasaac-search-row input {
		flex: 1;
		min-width: 12rem;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
		min-height: var(--btn-min-height);
	}

	.arasaac-subheading {
		margin: var(--space-lg) 0 var(--space-md);
		font-size: var(--font-size-md);
	}

	.arasaac-results,
	.arasaac-saved {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-sm);
	}

	.arasaac-result,
	.arasaac-saved-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg-elevated);
	}

	.arasaac-result img,
	.arasaac-saved-item img {
		flex-shrink: 0;
		object-fit: contain;
	}

	.arasaac-result-body {
		flex: 1;
		min-width: 0;
	}

	.arasaac-result-label {
		margin: 0 0 var(--space-sm);
		font-weight: 600;
	}

	.arasaac-result-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.arasaac-status,
	.arasaac-empty {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
