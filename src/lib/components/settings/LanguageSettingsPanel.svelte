<script lang="ts">

	import { profileStore, settings } from '$lib/stores/profile';

	import {

		INTERFACE_LANGUAGES,

		OTHER_INTERFACE_LANGUAGES,

		PRIORITY_INTERFACE_LANGUAGES

	} from '$lib/i18n/languages';

	import { bilingualUi } from '$lib/i18n';

	import {
		ensureSecondaryLanguagePack,
		installedLanguageCodes,
		isLanguagePackInstalled,
		refreshLanguagePackRuntime
	} from '$lib/i18n/language-pack-runtime';
	import { onMount } from 'svelte';

	import { isPriorityLanguage } from '$lib/i18n/priority-languages';

	import BilingualText from '$lib/components/ui/BilingualText.svelte';

	import BiText from '$lib/components/ui/BiText.svelte';

	import type { UISettings } from '$lib/types/profile';



	function patchUi(partial: Partial<UISettings>) {

		profileStore.updateSettings({ ui: partial });

	}



	const title = $derived(bilingualUi('Interface bilingue', 'settings.bilingual.title', $settings.ui));

	const hint = $derived(

		bilingualUi(

			'Affiche le français et votre langue côte à côte (menus, cartes de communication).',

			'settings.bilingual.hint',

			$settings.ui

		)

	);

	const enableLabel = $derived(

		bilingualUi('Activer l\'interface bilingue', 'settings.bilingual.enable', $settings.ui)

	);

	const languageLabel = $derived(

		bilingualUi('Ma langue (en plus du français)', 'settings.bilingual.language', $settings.ui)

	);



	const installedSet = $derived(new Set($installedLanguageCodes));



	const priorityOptions = $derived(
		PRIORITY_INTERFACE_LANGUAGES.filter((lang) => installedSet.has(lang.code))
	);



	const otherOptions = $derived(OTHER_INTERFACE_LANGUAGES);



	const selectedNeedsPack = $derived(
		$settings.ui.bilingualUi &&
			isPriorityLanguage($settings.ui.secondaryLanguage) &&
			!isLanguagePackInstalled($settings.ui.secondaryLanguage)
	);



	async function onLanguageChange(code: string) {
		patchUi({ secondaryLanguage: code });
		if ($settings.ui.bilingualUi) {
			await ensureSecondaryLanguagePack(code, true);
		}
	}

	const installedListLabel = $derived(
		$installedLanguageCodes.filter((c) => c !== 'en').join(', ') || '—'
	);

	onMount(() => {
		void refreshLanguagePackRuntime();
	});
</script>



<section class="card language-settings" aria-labelledby="language-settings-heading">

	<h3 id="language-settings-heading">

		<BilingualText primary={title.primary} secondary={title.secondary} />

	</h3>

	<p class="language-hint">

		<BilingualText primary={hint.primary} secondary={hint.secondary} />

	</p>



	<label class="language-check">

		<input

			type="checkbox"

			checked={$settings.ui.bilingualUi}

			onchange={(e) => patchUi({ bilingualUi: e.currentTarget.checked })}

		/>

		<BilingualText primary={enableLabel.primary} secondary={enableLabel.secondary} />

	</label>



	{#if $settings.ui.bilingualUi}

		<label class="language-field">

			<span>

				<BilingualText primary={languageLabel.primary} secondary={languageLabel.secondary} />

			</span>

			<select

				value={$settings.ui.secondaryLanguage}

				onchange={(e) => void onLanguageChange(e.currentTarget.value)}

			>
				<option value="en">Anglais — English</option>
				{#if priorityOptions.length > 0}
					<optgroup label="Langues installées (prioritaires)">

						{#each priorityOptions as language (language.code)}

							<option value={language.code}>

								{language.nameFr} — {language.nativeName}

							</option>

						{/each}

					</optgroup>

				{/if}

				{#if otherOptions.length > 0}

					<optgroup label="Autres langues (aperçu partiel)">

						{#each otherOptions as language (language.code)}

							<option value={language.code}>

								{language.nameFr} — {language.nativeName}

							</option>

						{/each}

					</optgroup>

				{/if}

			</select>

		</label>



		{#if selectedNeedsPack}

			<p class="language-warn" role="status">

				<BiText

					fr="Ce pack de langue n'est pas installé sur cet appareil. Relancez l'installateur Accessible en mode « packs de langue » pour le télécharger."

					key="settings.bilingual.packMissing"

				/>

			</p>

		{/if}



		<p class="language-note">

			<BiText

				fr="Installation locale : au premier lancement de l'installateur, choisissez les langues à télécharger. Pour en ajouter plus tard, relancez l'installateur Accessible et sélectionnez « Packs de langue uniquement »."

				key="settings.bilingual.installPacksHint"

			/>

		</p>

		<p class="language-installed" aria-live="polite">
			<BiText fr="Langues installées sur cet appareil :" key="settings.bilingual.installedLabel" />
			{installedListLabel}
		</p>

		<p class="language-note">
			<BiText
				fr="Le français reste toujours affiché. Si une traduction manque pour votre langue, seul le français apparaît pour cet élément."
				key="settings.bilingual.note"
			/>
		</p>

	{/if}

</section>



<style>

	.language-hint,

	.language-note,

	.language-installed,

	.language-warn {

		font-size: var(--font-size-sm);

		color: var(--color-text-muted);

	}



	.language-warn {

		color: var(--color-warning, #8a4b00);

		font-weight: 600;

	}



	.language-check {

		display: flex;

		align-items: flex-start;

		gap: var(--space-sm);

		min-height: var(--btn-min-height);

		cursor: pointer;

		margin: var(--space-md) 0;

	}



	.language-field {

		display: flex;

		flex-direction: column;

		gap: var(--space-xs);

		margin-bottom: var(--space-md);

	}



	.language-field select {

		min-height: var(--btn-min-height);

		font-size: var(--font-size-base);

	}

</style>

