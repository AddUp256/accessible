<script lang="ts">
	const releaseUrl = 'https://github.com/AddUp256/accessible/releases';
	const windowsCommand =
		'powershell -ExecutionPolicy Bypass -NoProfile -File scripts\\install-windows-optional-tools.ps1';

	let copyStatus = $state('');

	async function copyCommand() {
		try {
			await navigator.clipboard.writeText(windowsCommand);
			copyStatus = 'Commande copiée.';
		} catch {
			copyStatus = 'Copie indisponible. Sélectionnez la commande et copiez-la manuellement.';
		}
	}
</script>

<section class="card installation-panel" aria-labelledby="installation-heading">
	<h3 id="installation-heading">Installation et dépendances</h3>
	<p class="installation-hint">
		L’application fonctionne seule pour les réglages, notes, profils, organisation et exports. Certains
		moteurs externes ajoutent l’OCR, la lecture locale ou le traitement audio quand ils sont installés.
	</p>

	<div class="install-grid">
		<div>
			<h4>Installer Accessible</h4>
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
		</div>

		<div>
			<h4>Automatiser sous Windows</h4>
			<p class="installation-hint">
				Depuis le dossier du projet, cette commande installe Tesseract OCR, FFmpeg et eSpeak NG avec
				Winget.
			</p>
			<div class="command-row">
				<code>{windowsCommand}</code>
				<button type="button" class="btn btn-secondary" onclick={copyCommand}>Copier</button>
			</div>
			<p class="installation-hint">
				Si Windows demande une confirmation, accepter l’installation, puis redémarrer Accessible.
			</p>
			{#if copyStatus}
				<p class="install-status" role="status">{copyStatus}</p>
			{/if}
		</div>
	</div>

	<details>
		<summary>Compatibilités et modules optionnels</summary>
		<ul>
			<li>Windows 10/11 x64 : installateur NSIS ou MSI.</li>
			<li>macOS Apple Silicon et Intel : DMG/app, non notarisation possible selon la release.</li>
			<li>Linux x64 : AppImage ou paquet Debian, Ubuntu 22.04 / Debian 12 ou plus récent conseillé.</li>
			<li>OCR : Tesseract OCR doit être installé pour reconnaître du texte dans une image ou un PDF.</li>
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

	.installation-hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.install-grid {
		display: grid;
		gap: var(--space-lg);
	}

	@media (min-width: 56rem) {
		.install-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.command-row {
		display: grid;
		gap: var(--space-sm);
	}

	.command-row code {
		display: block;
		overflow-wrap: anywhere;
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

	details {
		border-top: 1px solid var(--color-border);
		padding-top: var(--space-md);
	}

	summary {
		min-height: var(--btn-min-height);
		cursor: pointer;
		font-weight: 700;
	}
</style>
