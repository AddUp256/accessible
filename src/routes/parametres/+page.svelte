<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { settings, profileStore } from '$lib/stores/profile';
	import { downloadProfileJson, downloadProfilePdf, downloadProfileDocx, downloadProfileOdt } from '$lib/services/export';
	import { PDF_DISCLAIMER } from '$lib/services/export/build-synthesis';
	import type { ImportErrorCode } from '$lib/services/storage/import';
	import { parseImportedProfileText } from '$lib/services/storage/import';
	import ProfileSwitcher from '$lib/components/profile/ProfileSwitcher.svelte';
	import AppModePanel from '$lib/components/profile/AppModePanel.svelte';
	import ExpertSettingsPanel from '$lib/components/settings/ExpertSettingsPanel.svelte';
	import PersonalizationPanel from '$lib/components/settings/PersonalizationPanel.svelte';
	import AboutPanel from '$lib/components/settings/AboutPanel.svelte';
	import EncryptionPanel from '$lib/components/settings/EncryptionPanel.svelte';
	import LanguageSettingsPanel from '$lib/components/settings/LanguageSettingsPanel.svelte';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import { bilingualLabel, bilingualUi, confirmDynamicMessage, dynamicMessage, type UiKey } from '$lib/i18n';
	import { PROFILE_VERSION } from '$lib/types/profile';
	import { initProfileStorage } from '$lib/services/storage/local';
	import {
		fetchModuleStorageStats,
		getStorageBackend,
		type ModuleStorageStats,
		type StorageBackend
	} from '$lib/services/storage/sqlite';
	import {
		isTauriRuntime,
		tauriDetectPortableMode,
		tauriEnablePortableMode,
		tauriGetSqliteDbPath,
		tauriGetStoragePath
	} from '$lib/services/storage/tauri';
	import type { UISettings } from '$lib/types/profile';
	import { isExpertDetail } from '$lib/utils/detail-level';

	const themes: { value: UISettings['theme']; fr: string; key: UiKey }[] = [
		{ value: 'cream', fr: 'Crème (défaut)', key: 'theme.cream' },
		{ value: 'light', fr: 'Clair', key: 'theme.light' },
		{ value: 'dark', fr: 'Sombre', key: 'theme.dark' },
		{ value: 'highContrast', fr: 'Contraste élevé', key: 'theme.highContrast' }
	];

	const portableActive = $derived(
		bilingualUi('actif', 'panel.storage.portableActive', $settings.ui)
	);
	const portableInactive = $derived(
		bilingualUi('inactif', 'panel.storage.portableInactive', $settings.ui)
	);

	let guestMode = $derived($profileStore.privacy.guestMode);
	let saveMessage = $state('');
	let storagePath = $state('');
	let sqlitePath = $state('');
	let storageBackend = $state<StorageBackend | null>(null);
	let moduleStats = $state<ModuleStorageStats | null>(null);
	let migratedFromJson = $state(false);
	let portableMode = $state(false);

	const expert = $derived(isExpertDetail($profileStore));

	function importErrorMessage(code: ImportErrorCode, version?: string): string {
		const ui = $settings.ui;
		switch (code) {
			case 'invalid':
				return dynamicMessage('dyn.settings.importInvalidProfile', ui);
			case 'not_app':
				return dynamicMessage('dyn.settings.importNotAccessible', ui);
			case 'bad_version':
				return dynamicMessage('dyn.settings.importUnsupportedVersion', ui, {
					version: version ?? '?',
					expected: PROFILE_VERSION
				});
			case 'json':
				return dynamicMessage('dyn.settings.importJsonUnreadable', ui);
		}
	}

	function setStatus(key: Parameters<typeof dynamicMessage>[0], params?: Record<string, string | number>) {
		saveMessage = dynamicMessage(key, $settings.ui, params);
	}

	function showSaved() {
		setStatus(guestMode ? 'dyn.settings.guestNotSaved' : 'dyn.settings.saved');
	}

	function deleteAllData() {
		if (!confirm(confirmDynamicMessage('dyn.settings.deleteConfirm'))) return;
		if (!confirm(confirmDynamicMessage('dyn.settings.deleteConfirmFinal'))) {
			return;
		}
		profileStore.deleteAllData();
		setStatus('dyn.settings.allDeleted');
	}

	async function handleImport(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const result = parseImportedProfileText(text);
			if (!result.ok) {
				saveMessage = importErrorMessage(result.code, result.version);
				return;
			}

			if (!confirm(confirmDynamicMessage('dyn.settings.importConfirm'))) {
				input.value = '';
				return;
			}

			profileStore.importProfile(result.profile);
			setStatus('dyn.settings.importSuccess');
		} catch {
			setStatus('dyn.settings.importReadFailed');
		} finally {
			input.value = '';
		}
	}

	function exportJson() {
		downloadProfileJson(get(profileStore));
		setStatus('dyn.settings.exportJson');
	}

	function exportPdf() {
		downloadProfilePdf(get(profileStore));
		setStatus('dyn.settings.exportPdf');
	}

	function exportOdt() {
		downloadProfileOdt(get(profileStore));
		setStatus('dyn.settings.exportOdt');
	}

	function exportDocx() {
		downloadProfileDocx(get(profileStore));
		setStatus('dyn.settings.exportDocx');
	}

	onMount(async () => {
		if (!isTauriRuntime()) return;
		portableMode = await tauriDetectPortableMode();
		storagePath = await tauriGetStoragePath();
		sqlitePath = await tauriGetSqliteDbPath();
		const initResult = await initProfileStorage();
		if (initResult) {
			migratedFromJson = initResult.migratedFromJson;
		}
		storageBackend = await getStorageBackend();
		moduleStats = await fetchModuleStorageStats();
	});

	async function activatePortableMode() {
		if (!isTauriRuntime()) {
			setStatus('dyn.settings.portableWebOnly');
			return;
		}
		storagePath = await tauriEnablePortableMode();
		portableMode = true;
		setStatus('dyn.settings.portableActivated', { path: storagePath });
	}

	function setTheme(theme: UISettings['theme']) {
		profileStore.updateSettings({ ui: { theme } });
		showSaved();
	}

	function toggleGuestMode() {
		profileStore.patch((p) => ({
			...p,
			privacy: { ...p.privacy, guestMode: !p.privacy.guestMode }
		}));
		showSaved();
	}

	function toggleMedicalInExport() {
		profileStore.patch((p) => ({
			...p,
			declaredProfiles: {
				...p.declaredProfiles,
				visibleInExports: !p.declaredProfiles.visibleInExports
			}
		}));
		showSaved();
	}
</script>

<svelte:head>
	<title>Paramètres — Accessible</title>
</svelte:head>

<BiHeading fr="Paramètres" key="page.settings.title" />

<AppModePanel />

<LanguageSettingsPanel />

<ExpertSettingsPanel />

<section class="card" aria-labelledby="theme-heading">
	<BiHeading fr="Thème de l'interface" key="panel.theme.title" level={3} id="theme-heading" />
	<p><BiText fr="Le thème choisi est enregistré automatiquement." key="panel.theme.hint" /></p>
	<div class="settings-options">
		{#each themes as theme}
			<button
				type="button"
				class="btn"
				class:btn-primary={$settings.ui.theme === theme.value}
				class:btn-secondary={$settings.ui.theme !== theme.value}
				onclick={() => setTheme(theme.value)}
			>
				{bilingualLabel(theme.fr, theme.key, $settings.ui)}
			</button>
		{/each}
	</div>
</section>

<section class="card" id="export" aria-labelledby="export-heading">
	<BiHeading fr="Exporter ma synthèse" key="panel.export.title" level={3} id="export-heading" />
	<p>{PDF_DISCLAIMER}</p>
	<p class="settings-hint">
		<BiText
			fr="Les fichiers sont créés sur votre appareil. Rien n'est envoyé en ligne."
			key="panel.export.hint"
		/>
	</p>

	<label class="settings-checkbox">
		<input
			type="checkbox"
			checked={$profileStore.declaredProfiles.visibleInExports}
			onchange={toggleMedicalInExport}
		/>
		<BiText
			fr="Inclure les profils médicaux déclarés dans l'export"
			key="panel.export.includeMedical"
			inline
		/>
	</label>

	<div class="settings-options">
		<button type="button" class="btn btn-primary" onclick={exportJson}>
			<BiText fr="Télécharger JSON" key="panel.export.downloadJson" inline />
		</button>
		<button type="button" class="btn btn-primary" onclick={exportPdf}>
			<BiText fr="Télécharger PDF" key="panel.export.downloadPdf" inline />
		</button>
		<button type="button" class="btn btn-secondary" onclick={exportOdt}>
			<BiText fr="Télécharger ODT" key="panel.export.downloadOdt" inline />
		</button>
		<button type="button" class="btn btn-secondary" onclick={exportDocx}>
			<BiText fr="Télécharger DOCX" key="panel.export.downloadDocx" inline />
		</button>
	</div>

	<div class="import-block" id="import">
		<label class="import-label" for="profile-import">
			<BiText fr="Importer un profil JSON" key="panel.export.importLabel" inline />
		</label>
		<input
			id="profile-import"
			type="file"
			accept=".json,application/json"
			onchange={handleImport}
		/>
		<p class="settings-hint">
			<BiText fr="Remplace le profil actuel après confirmation." key="panel.export.importHint" />
		</p>
	</div>
</section>

<ProfileSwitcher />

<section class="card" id="storage" aria-labelledby="storage-heading">
	<BiHeading fr="Stockage local" key="panel.storage.title" level={3} id="storage-heading" />
	{#if isTauriRuntime()}
		<p class="settings-hint">
			<BiText fr="Profil enregistré sur cet appareil uniquement." key="panel.storage.tauriHint" />
		</p>
		<p>
			<BiText fr="Moteur principal" key="panel.storage.engineLabel" inline /> :
			<strong>{storageBackend === 'sqlite' ? 'SQLite' : 'JSON'}</strong>
			{#if migratedFromJson}
				<span class="settings-hint">
					<BiText fr=" (migré depuis profile.json)" key="panel.storage.migrated" inline />
				</span>
			{/if}
		</p>
		{#if expert}
			{#if sqlitePath}
				<p>
					<small
						><BiText fr="Base SQLite" key="panel.storage.sqlitePath" inline /> : {sqlitePath}</small
					>
				</p>
			{/if}
			{#if storagePath}
				<p>
					<small
						><BiText fr="Sauvegarde JSON" key="panel.storage.jsonPath" inline /> : {storagePath}</small
					>
				</p>
			{/if}
			{#if moduleStats}
				<p class="settings-hint">
					{dynamicMessage('dyn.settings.storageStats', $settings.ui, {
						notes: moduleStats.notes,
						decks: moduleStats.flashcardDecks,
						cards: moduleStats.flashcardCards,
						checklists: moduleStats.checklists,
						kanban: moduleStats.kanbanTasks,
						caa: moduleStats.personalCards,
						pictograms: moduleStats.savedPictograms
					})}
				</p>
			{/if}
			<p>
				<BiText fr="Mode portable" key="panel.storage.portableLabel" inline /> :
				<strong>
					{#if portableMode}
						<BilingualText
							primary={portableActive.primary}
							secondary={portableActive.secondary}
							inline
						/>
					{:else}
						<BilingualText
							primary={portableInactive.primary}
							secondary={portableInactive.secondary}
							inline
						/>
					{/if}
				</strong>
			</p>
			{#if !portableMode}
				<button type="button" class="btn btn-secondary" onclick={activatePortableMode}>
					<BiText
						fr="Activer le mode portable (dossier ./data/)"
						key="panel.storage.portableActivate"
						inline
					/>
				</button>
			{/if}
		{:else}
			<p class="settings-hint">
				<BiText
					fr="Activez le mode expert pour voir les chemins de fichiers et les compteurs détaillés."
					key="panel.storage.expertHint"
				/>
			</p>
		{/if}
	{:else}
		<p class="settings-hint">
			<BiText
				fr="Navigateur : profil dans le stockage local du navigateur. Installez l'application pour un fichier dans %APPDATA%/Accessible/."
				key="panel.storage.browserHint"
			/>
		</p>
	{/if}
</section>

<section class="card" aria-labelledby="privacy-heading">
	<BiHeading fr="Vie privée" key="panel.privacy.title" level={3} id="privacy-heading" />
	<EncryptionPanel />
	<label class="settings-checkbox">
		<input type="checkbox" checked={guestMode} onchange={toggleGuestMode} />
		<BiText
			fr="Mode invité (ne pas enregistrer mes réglages)"
			key="panel.privacy.guestMode"
			inline
		/>
	</label>
	<p class="settings-hint">
		<BiText
			fr="En mode invité, vos réglages disparaissent à la fermeture de l'application."
			key="panel.privacy.guestHint"
		/>
	</p>
	<button type="button" class="btn btn-secondary" onclick={deleteAllData}>
		<BiText fr="Supprimer toutes les données" key="panel.privacy.deleteAll" inline />
	</button>
</section>

<AboutPanel />

<PersonalizationPanel />

{#if saveMessage}
	<p class="settings-status" role="status">{saveMessage}</p>
{/if}

<style>
	.settings-options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-md);
	}

	.settings-checkbox {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: var(--btn-min-height);
		cursor: pointer;
	}

	.settings-hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.settings-status {
		margin-top: var(--space-md);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-elevated);
		border-radius: var(--radius);
	}

	.import-block {
		margin-top: var(--space-lg);
	}

	.import-label {
		display: block;
		margin-bottom: var(--space-xs);
		font-weight: 600;
	}

	#profile-import {
		min-height: var(--btn-min-height);
	}
</style>
