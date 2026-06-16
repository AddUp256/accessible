# R?le : Installateur PowerShell local pour d?ployer Accessible et ses packs de langue.
#Requires -Version 5.1
<#
.SYNOPSIS
  Installateur Accessible — application complète ou packs de langue uniquement.

.DESCRIPTION
  1) Installation complète : lance le programme MSI/NSIS Tauri puis copie les packs sélectionnés.
  2) Packs de langue uniquement : ajoute des fichiers .json dans le dossier lang-packs de l'app déjà installée.

  Placez ce script à côté du dossier lang-packs/ (fichiers es.json, de.json, catalog.json, …).
#>
param(
	[switch]$LangPacksOnly,
	[string[]]$Languages,
	[string]$InstallerPath
)

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LangSourceDir = Join-Path $ScriptDir 'lang-packs'
$ProductName = 'Accessible'
$UninstallKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'

function Write-Title($text) {
	Write-Host ''
	Write-Host '=== ' -NoNewline -ForegroundColor Cyan
	Write-Host $text -ForegroundColor Cyan
	Write-Host '=== ' -ForegroundColor Cyan
}

function Get-InstallDirectory {
	$props = @('InstallLocation', 'InstallSource')
	foreach ($key in Get-ItemProperty $UninstallKey -ErrorAction SilentlyContinue) {
		if ($key.DisplayName -like "*$ProductName*") {
			foreach ($prop in $props) {
				$dir = $key.$prop
				if ($dir -and (Test-Path $dir)) {
					$exe = Get-ChildItem -Path $dir -Filter '*.exe' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
					if ($exe) { return $exe.DirectoryName }
					return $dir.TrimEnd('\')
				}
			}
		}
	}
	return $null
}

function Load-Catalog {
	$catPath = Join-Path $LangSourceDir 'catalog.json'
	if (-not (Test-Path $catPath)) {
		throw "catalog.json introuvable dans $LangSourceDir. Lancez d'abord : npm run build:lang-packs"
	}
	return Get-Content $catPath -Raw | ConvertFrom-Json
}

function Select-LanguagesInteractive($catalog) {
	Write-Host 'Langues disponibles (codes) :' -ForegroundColor Yellow
	$i = 1
	$map = @{}
	foreach ($pack in $catalog.packs) {
		Write-Host ("  [{0}] {1} — {2} ({3})" -f $i, $pack.labelFr, $pack.nativeName, $pack.code)
		$map[$i] = $pack.code
		$i++
	}
	Write-Host ''
	Write-Host 'Entrez les numéros séparés par des virgules (ex. 1,2,5) ou "all" pour tout :' -ForegroundColor Gray
	$input = Read-Host
	if ($input.Trim() -eq 'all') {
		return @($catalog.packs.code)
	}
	$selected = @()
	foreach ($part in ($input -split ',')) {
		$n = 0
		if ([int]::TryParse($part.Trim(), [ref]$n) -and $map.ContainsKey($n)) {
			$selected += $map[$n]
		}
	}
	if ($selected.Count -eq 0) {
		throw 'Aucune langue valide sélectionnée.'
	}
	return $selected | Select-Object -Unique
}

function Get-LangPackCodesOnDisk($dest) {
	$skip = @{ catalog = 1; 'installed-languages' = 1 }
	Get-ChildItem -Path $dest -Filter '*.json' -File -ErrorAction SilentlyContinue |
		Where-Object { -not $skip.ContainsKey($_.BaseName) } |
		ForEach-Object { $_.BaseName } |
		Sort-Object -Unique
}

function Install-LanguagePacks($targetDir, [string[]]$codes, [switch]$AddOnly) {
	$dest = Join-Path $targetDir 'lang-packs'
	New-Item -ItemType Directory -Force -Path $dest | Out-Null
	Copy-Item (Join-Path $LangSourceDir 'catalog.json') (Join-Path $dest 'catalog.json') -Force
	foreach ($code in $codes) {
		$src = Join-Path $LangSourceDir "$code.json"
		if (-not (Test-Path $src)) {
			Write-Warning "Pack absent : $src"
			continue
		}
		Copy-Item $src (Join-Path $dest "$code.json") -Force
		Write-Host "  + $code.json" -ForegroundColor Green
	}
	if (-not $AddOnly) {
		foreach ($existing in (Get-LangPackCodesOnDisk $dest)) {
			if ($codes -notcontains $existing) {
				Remove-Item (Join-Path $dest "$existing.json") -Force -ErrorAction SilentlyContinue
				Write-Host "  - $existing.json (non sélectionné)" -ForegroundColor DarkYellow
			}
		}
	}
	$installed = @(Get-LangPackCodesOnDisk $dest)
	$manifest = @{ version = 1; installed = $installed; updatedAt = (Get-Date).ToString('o') }
	$manifest | ConvertTo-Json | Set-Content (Join-Path $dest 'installed-languages.json') -Encoding UTF8
	return $installed
}

function Run-AppInstaller($path) {
	if (-not $path -or -not (Test-Path $path)) {
		Write-Host 'Chemin du programme d''installation (.msi ou .exe) :' -ForegroundColor Yellow
		$path = Read-Host
	}
	if (-not (Test-Path $path)) {
		throw "Installateur introuvable : $path"
	}
	Write-Host "Lancement : $path" -ForegroundColor Cyan
	if ($path -match '\.msi$') {
		Start-Process msiexec.exe -ArgumentList @('/i', "`"$path`"", '/passive') -Wait
	} else {
		Start-Process -FilePath $path -Wait
	}
}

# --- Début ---
Write-Title 'Accessible — installation'

if (-not (Test-Path $LangSourceDir)) {
	throw "Dossier lang-packs introuvable : $LangSourceDir"
}

$catalog = Load-Catalog

$mode = if ($LangPacksOnly) { 'lang' } else { $null }
if (-not $mode) {
	Write-Host 'Que souhaitez-vous faire ?'
	Write-Host '  [1] Installation complète de Accessible (+ choix des langues)'
	Write-Host '  [2] Ajouter des packs de langue uniquement (application déjà installée)'
	$choice = Read-Host 'Votre choix (1 ou 2)'
	$mode = if ($choice -eq '2') { 'lang' } else { 'full' }
}

if (-not $Languages -or $Languages.Count -eq 0) {
	$Languages = Select-LanguagesInteractive $catalog
}

if ($mode -eq 'full') {
	Write-Title 'Installation de l''application'
	Run-AppInstaller $InstallerPath
	Start-Sleep -Seconds 2
}

$installDir = Get-InstallDirectory
if (-not $installDir) {
	throw "Accessible n'est pas installé ou le dossier d'installation est introuvable. Installez d'abord l'application (mode 1)."
}

Write-Title "Copie des packs de langue vers $installDir"
$addOnly = ($mode -eq 'lang')
$done = Install-LanguagePacks $installDir $Languages -AddOnly:$addOnly
Write-Host ''
Write-Host "Terminé. Langues installées : $($done -join ', ')" -ForegroundColor Green
Write-Host "Redémarrez Accessible pour prendre en compte les nouveaux packs." -ForegroundColor Gray
