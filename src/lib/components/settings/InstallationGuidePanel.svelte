<script lang="ts">
	// R?le : Composant Svelte de param?tres : encapsule l?affichage et les interactions r?utilisables.

	import { onMount } from 'svelte';
	import { tauriIsHunspellAvailable, tauriIsGrammalecteAvailable } from '$lib/services/correcteur/tauri';
	import {
		tauriIsTesseractAvailable,
		tauriIsTesseractLanguageAvailable
	} from '$lib/services/ocr/tauri';
	import { isTauriRuntime } from '$lib/services/storage/tauri';
	import { tauriGetWhisperStatus } from '$lib/services/transcription/tauri';
	import { tauriGetEspeakStatus, tauriGetPiperStatus } from '$lib/services/tts/tauri';

	const releaseUrl = 'https://github.com/AddUp256/accessible/releases';
	const browserUrl = 'https://addup256.github.io/accessible/';
	type ModuleId = 'tesseract' | 'hunspell' | 'grammalecte' | 'whisper' | 'piper' | 'espeak';
	type ModuleStatusLevel = 'checking' | 'ready' | 'partial' | 'missing' | 'browser';
	type ModuleStatus = {
		level: ModuleStatusLevel;
		text: string;
	};
	type WindowsCommand = {
		label: string;
		summary: string;
		command: string;
		moduleId?: ModuleId;
	};

	const browserOnlyStatus: ModuleStatus = {
		level: 'browser',
		text: 'Statut complet disponible dans l’application installée.'
	};
	const checkingStatus: ModuleStatus = { level: 'checking', text: 'Vérification en cours...' };
	const initialModuleStatuses: Record<ModuleId, ModuleStatus> = {
		tesseract: checkingStatus,
		hunspell: checkingStatus,
		grammalecte: checkingStatus,
		whisper: checkingStatus,
		piper: checkingStatus,
		espeak: checkingStatus
	};
	const windowsCommands: WindowsCommand[] = [
		{
			label: 'OCR : Tesseract + pack français fra',
			moduleId: 'tesseract',
			summary:
				'Installe Tesseract, ajoute le pack français depuis tessdata, déclare TESSDATA_PREFIX et ajoute Tesseract au PATH utilisateur.',
			command: [
				'$ErrorActionPreference = "Stop"',
				'winget install --id UB-Mannheim.TesseractOCR --exact --source winget --accept-package-agreements --accept-source-agreements',
				'$roots = @($env:ProgramFiles + "\\Tesseract-OCR", ${env:ProgramFiles(x86)} + "\\Tesseract-OCR")',
				'$root = $roots | Where-Object { Test-Path (Join-Path $_ "tesseract.exe") } | Select-Object -First 1',
				'if (-not $root) { throw "Tesseract est installé mais tesseract.exe est introuvable. Relancez PowerShell puis réessayez." }',
				'$tessdata = Join-Path $root "tessdata"',
				'New-Item -ItemType Directory -Force $tessdata | Out-Null',
				'Invoke-WebRequest "https://raw.githubusercontent.com/tesseract-ocr/tessdata/main/fra.traineddata" -OutFile (Join-Path $tessdata "fra.traineddata")',
				'setx TESSDATA_PREFIX $tessdata',
				'$userPath = [Environment]::GetEnvironmentVariable("Path", "User")',
				'if (-not $userPath) { $userPath = "" }',
				'if ($userPath -notlike ("*" + $root + "*")) { setx Path (($userPath.TrimEnd(";")) + ";" + $root) }',
				'& (Join-Path $root "tesseract.exe") --list-langs'
			].join('\n')
		},
		{
			label: 'Orthographe : Hunspell + dictionnaire français',
			moduleId: 'hunspell',
			summary:
				'Installe Hunspell, télécharge fr.aff/fr.dic depuis LibreOffice, les expose sous fr_FR et déclare DICPATH.',
			command: [
				'$ErrorActionPreference = "Stop"',
				'winget install --id FSFhu.Hunspell --exact --source winget --accept-package-agreements --accept-source-agreements',
				'$dictDir = Join-Path $env:APPDATA "hunspell\\dicts"',
				'New-Item -ItemType Directory -Force $dictDir | Out-Null',
				'Invoke-WebRequest "https://raw.githubusercontent.com/LibreOffice/dictionaries/master/fr_FR/fr.aff" -OutFile (Join-Path $dictDir "fr_FR.aff")',
				'Invoke-WebRequest "https://raw.githubusercontent.com/LibreOffice/dictionaries/master/fr_FR/fr.dic" -OutFile (Join-Path $dictDir "fr_FR.dic")',
				'Copy-Item (Join-Path $dictDir "fr_FR.aff") (Join-Path $dictDir "fr.aff") -Force',
				'Copy-Item (Join-Path $dictDir "fr_FR.dic") (Join-Path $dictDir "fr.dic") -Force',
				'setx DICPATH $dictDir',
				'Write-Host "Dictionnaires Hunspell installés dans $dictDir. Relancez Accessible."'
			].join('\n')
		},
		{
			label: 'Grammaire : Grammalecte CLI / Serveur',
			moduleId: 'grammalecte',
			summary:
				'Télécharge la dernière archive CLI/serveur officielle, trouve grammar_checker.py et déclare Grammalecte pour Accessible.',
			command: [
				'$ErrorActionPreference = "Stop"',
				'winget install --id Python.Python.3.12 --exact --source winget --accept-package-agreements --accept-source-agreements',
				'$target = Join-Path $env:LOCALAPPDATA "Accessible\\Grammalecte"',
				'New-Item -ItemType Directory -Force $target | Out-Null',
				'$page = (Invoke-WebRequest "https://www.grammalecte.net/" -UseBasicParsing).Content',
				'$match = [regex]::Match($page, "((https://www\\.grammalecte\\.net)?/zip/Grammalecte-fr-v[0-9.]+\\.zip)")',
				'if ($match.Success) { $zipUrl = $match.Value; if ($zipUrl -notmatch "^https?://") { $zipUrl = "https://www.grammalecte.net" + $zipUrl } } else { $zipUrl = "https://www.grammalecte.net/zip/Grammalecte-fr-v2.3.0.zip" }',
				'$zip = Join-Path $target "grammalecte.zip"',
				'Invoke-WebRequest $zipUrl -OutFile $zip',
				'Expand-Archive $zip -DestinationPath $target -Force',
				'$checker = Get-ChildItem $target -Recurse -Filter "grammar_checker.py" | Where-Object { Test-Path (Join-Path $_.Directory.FullName "__init__.py") } | Select-Object -First 1',
				'if (-not $checker) { throw "grammar_checker.py est introuvable dans l archive Grammalecte." }',
				'$root = $checker.Directory.FullName',
				'setx GRAMMALECTE_CLI $checker.FullName',
				'setx GRAMMALECTE_PATH $root',
				'$py = Get-Command py -ErrorAction SilentlyContinue',
				'$probe = Join-Path $target "test-grammalecte.py"',
				"@'",
				'import json, sys',
				'from pathlib import Path',
				'root = Path(sys.argv[1])',
				'sys.path.insert(0, str(root.parent))',
				'import grammalecte.grammar_checker as gc',
				'checker = gc.GrammarChecker("fr")',
				'print(checker.getParagraphErrorsAsJSON(0, "Je suis aller a la maison.", bContext=True, bSpellSugg=True))',
				"'@ | Set-Content -Encoding UTF8 $probe",
				'if ($py) { & py -3 $probe $root } else { Write-Host "Python est installé. Relancez PowerShell si py n est pas encore disponible." }',
				'Write-Host "Grammalecte est déclaré. Fermez puis relancez Accessible."'
			].join('\n')
		},
		{
			label: 'Transcription : FFmpeg + whisper.cpp + modèle rapide',
			moduleId: 'whisper',
			summary:
				'Installe FFmpeg, télécharge le dernier whisper.cpp x64, ajoute whisper-cli au PATH et configure un modèle de transcription local.',
			command: [
				'$ErrorActionPreference = "Stop"',
				'winget install --id Gyan.FFmpeg --exact --source winget --accept-package-agreements --accept-source-agreements',
				'$root = Join-Path $env:LOCALAPPDATA "Accessible\\whisper.cpp"',
				'New-Item -ItemType Directory -Force $root | Out-Null',
				'$release = Invoke-RestMethod "https://api.github.com/repos/ggml-org/whisper.cpp/releases/latest"',
				'$asset = $release.assets | Where-Object { $_.name -eq "whisper-bin-x64.zip" } | Select-Object -First 1',
				'if (-not $asset) { throw "Archive whisper-bin-x64.zip introuvable dans la dernière release." }',
				'$zip = Join-Path $root $asset.name',
				'Invoke-WebRequest $asset.browser_download_url -OutFile $zip',
				'Expand-Archive $zip -DestinationPath $root -Force',
				'$cli = Get-ChildItem $root -Recurse -Filter "whisper-cli.exe" | Select-Object -First 1',
				'if (-not $cli) { throw "whisper-cli.exe est introuvable dans l archive téléchargée." }',
				'$bin = $cli.Directory.FullName',
				'$userPath = [Environment]::GetEnvironmentVariable("Path", "User")',
				'if (-not $userPath) { $userPath = "" }',
				'if ($userPath -notlike ("*" + $bin + "*")) { setx Path (($userPath.TrimEnd(";")) + ";" + $bin) }',
				'$modelDir = Join-Path $root "models"',
				'New-Item -ItemType Directory -Force $modelDir | Out-Null',
				'$model = Join-Path $modelDir "ggml-base.bin"',
				'Invoke-WebRequest "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin?download=true" -OutFile $model',
				'setx WHISPER_MODEL $model',
				'& $cli.FullName --help',
				'Write-Host "Transcription prête. Relancez Accessible."'
			].join('\n')
		},
		{
			label: 'Lecture vocale locale : Piper + voix française',
			moduleId: 'piper',
			summary:
				'Télécharge Piper pour Windows x64, ajoute piper.exe au PATH et déclare une voix française dans PIPER_MODEL / PIPER_CONFIG.',
			command: [
				'$ErrorActionPreference = "Stop"',
				'$root = Join-Path $env:LOCALAPPDATA "Accessible\\Piper"',
				'New-Item -ItemType Directory -Force $root | Out-Null',
				'$release = Invoke-RestMethod "https://api.github.com/repos/rhasspy/piper/releases/latest"',
				'$asset = $release.assets | Where-Object { $_.name -like "*windows*amd64*.zip" -or $_.name -like "*windows*x86_64*.zip" } | Select-Object -First 1',
				'if (-not $asset) { throw "Archive Piper Windows x64 introuvable dans la dernière release." }',
				'$zip = Join-Path $root $asset.name',
				'Invoke-WebRequest $asset.browser_download_url -OutFile $zip',
				'Expand-Archive $zip -DestinationPath $root -Force',
				'$exe = Get-ChildItem $root -Recurse -Filter "piper.exe" | Select-Object -First 1',
				'if (-not $exe) { throw "piper.exe est introuvable dans l archive téléchargée." }',
				'$voices = Join-Path $root "voices"',
				'New-Item -ItemType Directory -Force $voices | Out-Null',
				'$model = Join-Path $voices "fr_FR-siwis-medium.onnx"',
				'$config = "$model.json"',
				'Invoke-WebRequest "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx?download=true" -OutFile $model',
				'Invoke-WebRequest "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json?download=true" -OutFile $config',
				'$bin = $exe.Directory.FullName',
				'$userPath = [Environment]::GetEnvironmentVariable("Path", "User")',
				'if (-not $userPath) { $userPath = "" }',
				'if ($userPath -notlike ("*" + $bin + "*")) { setx Path (($userPath.TrimEnd(";")) + ";" + $bin) }',
				'setx PIPER_MODEL $model',
				'setx PIPER_CONFIG $config',
				'& $exe.FullName --help',
				'Write-Host "Piper est prêt. Relancez Accessible."'
			].join('\n')
		},
		{
			label: 'Lecture vocale locale : eSpeak NG',
			moduleId: 'espeak',
			summary: 'Installe un moteur vocal local léger, utilisé si les voix système ou Piper ne suffisent pas.',
			command:
				'winget install --id eSpeak-NG.eSpeak-NG --exact --source winget --accept-package-agreements --accept-source-agreements'
		},
		{
			label: 'Vérifier les modules',
			summary:
				'Affiche les versions et les variables attendues. Fermez puis relancez Accessible après une installation.',
			command: [
				'$ErrorActionPreference = "Continue"',
				'Get-Command tesseract,hunspell,ffmpeg,whisper-cli,piper,espeak-ng -ErrorAction SilentlyContinue | Select-Object Name,Source',
				'Write-Host "TESSDATA_PREFIX=$env:TESSDATA_PREFIX"',
				'Write-Host "DICPATH=$env:DICPATH"',
				'Write-Host "GRAMMALECTE_CLI=$env:GRAMMALECTE_CLI"',
				'Write-Host "WHISPER_MODEL=$env:WHISPER_MODEL"',
				'Write-Host "PIPER_MODEL=$env:PIPER_MODEL"',
				'Write-Host "PIPER_CONFIG=$env:PIPER_CONFIG"',
				'tesseract --list-langs'
			].join('\n')
		}
	];

	let copyStatus = $state('');
	let statusBusy = $state(false);
	let moduleStatuses = $state<Record<ModuleId, ModuleStatus>>({ ...initialModuleStatuses });

	function moduleStatus(id?: ModuleId): ModuleStatus | null {
		return id ? moduleStatuses[id] : null;
	}

	function formatErrorStatus(error: unknown, fallback: string): ModuleStatus {
		return {
			level: 'missing',
			text: error instanceof Error && error.message ? error.message : fallback
		};
	}

	async function refreshModuleStatuses() {
		if (!isTauriRuntime()) {
			moduleStatuses = {
				tesseract: browserOnlyStatus,
				hunspell: browserOnlyStatus,
				grammalecte: browserOnlyStatus,
				whisper: browserOnlyStatus,
				piper: browserOnlyStatus,
				espeak: browserOnlyStatus
			};
			return;
		}

		statusBusy = true;
		moduleStatuses = { ...initialModuleStatuses };
		const next: Record<ModuleId, ModuleStatus> = { ...initialModuleStatuses };

		try {
			const [tesseractInstalled, frenchPack] = await Promise.all([
				tauriIsTesseractAvailable(),
				tauriIsTesseractLanguageAvailable('fra')
			]);
			next.tesseract =
				tesseractInstalled && frenchPack
					? { level: 'ready', text: 'Prêt : Tesseract et le pack fra sont détectés.' }
					: tesseractInstalled
						? { level: 'partial', text: 'Tesseract est détecté, mais le pack français fra manque.' }
						: { level: 'missing', text: 'Tesseract n’est pas encore détecté.' };
		} catch (error) {
			next.tesseract = formatErrorStatus(error, 'Tesseract n’a pas pu être vérifié.');
		}

		try {
			next.hunspell = (await tauriIsHunspellAvailable())
				? { level: 'ready', text: 'Prêt : Hunspell et un dictionnaire français sont détectés.' }
				: { level: 'missing', text: 'Hunspell ou son dictionnaire français manque.' };
		} catch (error) {
			next.hunspell = formatErrorStatus(error, 'Hunspell n’a pas pu être vérifié.');
		}

		try {
			next.grammalecte = (await tauriIsGrammalecteAvailable())
				? { level: 'ready', text: 'Prêt : Grammalecte est détecté pour l’analyse grammaticale.' }
				: { level: 'missing', text: 'Grammalecte n’est pas encore détecté par Accessible.' };
		} catch (error) {
			next.grammalecte = formatErrorStatus(error, 'Grammalecte n’a pas pu être vérifié.');
		}

		try {
			const whisper = await tauriGetWhisperStatus();
			next.whisper = whisper.available
				? { level: 'ready', text: 'Prêt : Whisper et le modèle de transcription sont détectés.' }
				: { level: 'partial', text: whisper.reason ?? 'Whisper est incomplet ou non configuré.' };
		} catch (error) {
			next.whisper = formatErrorStatus(error, 'Whisper n’a pas pu être vérifié.');
		}

		try {
			const piper = await tauriGetPiperStatus();
			next.piper = piper.available
				? { level: 'ready', text: 'Prêt : Piper et une voix locale sont détectés.' }
				: { level: 'partial', text: piper.reason ?? 'Piper est incomplet ou non configuré.' };
		} catch (error) {
			next.piper = formatErrorStatus(error, 'Piper n’a pas pu être vérifié.');
		}

		try {
			const espeak = await tauriGetEspeakStatus();
			next.espeak = espeak.available
				? { level: 'ready', text: 'Prêt : eSpeak NG est détecté.' }
				: { level: 'missing', text: espeak.reason ?? 'eSpeak NG n’est pas encore détecté.' };
		} catch (error) {
			next.espeak = formatErrorStatus(error, 'eSpeak NG n’a pas pu être vérifié.');
		}

		moduleStatuses = next;
		statusBusy = false;
	}

	async function copyCommand(command: string) {
		try {
			await navigator.clipboard.writeText(command);
			copyStatus = 'Commande copiée.';
		} catch {
			copyStatus = 'Copie indisponible. Sélectionnez la commande et copiez-la manuellement.';
		}
	}

	onMount(() => {
		void refreshModuleStatuses();
	});
</script>

<section id="installation" class="card installation-panel" aria-labelledby="installation-heading">
	<h3 id="installation-heading">Installation et dépendances</h3>
	<p class="installation-hint">
		Accessible peut s’utiliser dans le navigateur pour tester rapidement, ou comme application installée
		pour les fonctions locales les plus complètes. Les réglages, notes, profils et exports fonctionnent
		sans compte.
	</p>

	<div class="install-paths" aria-label="Choisir une version">
		<section class="install-path" aria-labelledby="install-browser-heading">
			<h4 id="install-browser-heading">Ouvrir la version navigateur</h4>
			<ol>
				<li>Ouvrir le lien navigateur ci-dessous.</li>
				<li>Autoriser l’audio si le navigateur le demande.</li>
				<li>Passer par le message d’introduction puis la personnalisation.</li>
			</ol>
			<a class="btn btn-secondary" href={browserUrl} target="_blank" rel="noreferrer">
				Ouvrir Accessible dans le navigateur
			</a>
			<p class="installation-note">
				OCR image disponible avec Internet au premier lancement. Les PDF OCRisés, Hunspell,
				Grammalecte, Piper et eSpeak restent prévus pour l’application installée.
			</p>
		</section>

		<section class="install-path" aria-labelledby="install-desktop-heading">
			<h4 id="install-desktop-heading">Installer sur l’ordinateur</h4>
			<ol>
				<li>Ouvrir la page <a href={releaseUrl} target="_blank" rel="noreferrer">Releases GitHub</a>.</li>
				<li>Choisir la dernière version publiée.</li>
				<li>
					Télécharger le fichier adapté : Windows x64, macOS Apple Silicon, macOS Intel ou Linux
					x64.
				</li>
				<li>Ouvrir le fichier téléchargé et suivre l’assistant d’installation.</li>
				<li>Lancer Accessible, puis passer par le message d’introduction et la personnalisation.</li>
			</ol>
		</section>
	</div>

	<details class="optional-tools" aria-labelledby="optional-tools-heading" open>
		<summary id="optional-tools-heading">Modules optionnels sous Windows</summary>
		<p class="installation-hint">
			Ouvrir PowerShell, copier chaque commande, accepter les confirmations Windows, puis redémarrer
			Accessible. Les commandes ci-dessous installent ou configurent les modules les plus utiles :
			OCR français, correction orthographique, correction grammaticale, transcription locale et voix
			locale. Elles utilisent les sources officielles quand le module dépend d’un fichier externe.
		</p>
		<ul class="source-links" aria-label="Sources des modules optionnels">
			<li><a href="https://github.com/tesseract-ocr/tessdata" target="_blank" rel="noreferrer">Tesseract tessdata</a></li>
			<li><a href="https://github.com/LibreOffice/dictionaries/tree/master/fr_FR" target="_blank" rel="noreferrer">LibreOffice dictionaries fr_FR</a></li>
			<li><a href="https://www.grammalecte.net/" target="_blank" rel="noreferrer">Grammalecte CLI</a></li>
			<li><a href="https://github.com/ggml-org/whisper.cpp/releases/latest" target="_blank" rel="noreferrer">whisper.cpp</a></li>
			<li><a href="https://github.com/rhasspy/piper/releases/latest" target="_blank" rel="noreferrer">Piper TTS</a></li>
		</ul>
		<div class="module-status-actions">
			<button type="button" class="btn btn-secondary" onclick={refreshModuleStatuses} disabled={statusBusy}>
				{statusBusy ? 'Vérification...' : 'Actualiser les voyants'}
			</button>
		</div>
		<div class="command-list">
			{#each windowsCommands as item}
				{@const status = moduleStatus(item.moduleId)}
				<details class="command-row">
					<summary class="command-summary">
						<span class="command-title">{item.label}</span>
						{#if status}
							<span class={`tool-status tool-status--${status.level}`}>
								<span class="tool-status-dot" aria-hidden="true"></span>
								{status.text}
							</span>
						{/if}
					</summary>
					<p>{item.summary}</p>
					<code>{item.command}</code>
					<button
						type="button"
						class="btn btn-secondary"
						aria-label={`Copier la commande ${item.label}`}
						onclick={() => copyCommand(item.command)}
					>
						Copier
					</button>
				</details>
			{/each}
		</div>
		{#if copyStatus}
			<p class="install-status" role="status">{copyStatus}</p>
		{/if}
	</details>

	<details>
		<summary>Compatibilités et modules optionnels</summary>
		<ul>
			<li>Version navigateur : Chrome, Edge, Firefox ou Safari récents.</li>
			<li>Windows 10/11 x64 : installateur NSIS ou MSI.</li>
			<li>macOS Apple Silicon et Intel : DMG/app, non notarisation possible selon la release.</li>
			<li>Linux x64 : AppImage ou paquet Debian, Ubuntu 22.04 / Debian 12 ou plus récent conseillé.</li>
			<li>OCR image navigateur : Tesseract.js chargé à la demande.</li>
			<li>OCR PDF : application installée avec Tesseract système.</li>
			<li>Audio/vidéo : FFmpeg améliore les conversions et traitements multimédias.</li>
			<li>Lecture locale : eSpeak NG ou Piper peuvent être utilisés si présents et configurés.</li>
		</ul>
	</details>
</section>

<style>
	.installation-panel {
		display: grid;
		gap: var(--space-md);
	}

	.installation-panel h3,
	.installation-panel h4,
	.installation-panel p {
		margin-top: 0;
	}

	.installation-hint,
	.installation-note {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.installation-note {
		margin: var(--space-sm) 0 0;
	}

	.install-paths {
		display: grid;
		gap: var(--space-lg);
	}

	.install-path,
	.optional-tools {
		display: grid;
		gap: var(--space-sm);
	}

	.optional-tools {
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-md);
		background: var(--color-bg);
	}

	.install-path {
		padding-bottom: var(--space-md);
		border-bottom: 1px solid var(--color-border);
	}

	@media (min-width: 56rem) {
		.install-paths {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.install-path {
			padding-right: var(--space-lg);
			padding-bottom: 0;
			border-right: 1px solid var(--color-border);
			border-bottom: 0;
		}

		.install-path + .install-path {
			padding-right: 0;
			border-right: 0;
		}
	}

	.command-list {
		display: grid;
		gap: var(--space-sm);
	}

	.command-row {
		display: grid;
		gap: var(--space-xs);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg-elevated);
	}

	.command-summary {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
	}

	.command-title {
		font-weight: 700;
	}

	.module-status-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.tool-status {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		max-width: 100%;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		font-weight: 600;
	}

	.tool-status-dot {
		width: 0.75rem;
		height: 0.75rem;
		flex: 0 0 0.75rem;
		border-radius: 999px;
		background: var(--color-border);
	}

	.tool-status--ready .tool-status-dot {
		background: var(--color-accent);
	}

	.tool-status--partial .tool-status-dot,
	.tool-status--checking .tool-status-dot,
	.tool-status--browser .tool-status-dot {
		background: #a66f00;
	}

	.tool-status--missing .tool-status-dot {
		background: #b3261e;
	}

	.command-row p,
	.source-links {
		margin: 0;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.source-links {
		padding-left: var(--space-lg);
		line-height: 1.6;
	}

	.command-row code {
		display: block;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
		color: var(--color-text);
		font-size: var(--font-size-sm);
	}

	.install-status {
		margin: var(--space-sm) 0 0;
		font-size: var(--font-size-sm);
		font-weight: 600;
	}

	.installation-panel > details:not(.optional-tools) {
		border-top: 1px solid var(--color-border);
		padding-top: var(--space-md);
	}

	summary {
		min-height: var(--btn-min-height);
		cursor: pointer;
		font-weight: 700;
	}
</style>
