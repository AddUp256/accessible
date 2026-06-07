param(
    [switch]$SkipTesseract,
    [switch]$SkipFFmpeg,
    [switch]$SkipEspeak
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Install-WingetPackage {
    param(
        [string]$Name,
        [string]$Id
    )

    Write-Step "Installation de $Name"
    winget install --id $Id --exact --source winget --accept-package-agreements --accept-source-agreements
}

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Error "Winget est introuvable. Installez App Installer depuis le Microsoft Store, puis relancez ce script."
}

Write-Host "Accessible - installation automatique des moteurs optionnels Windows"
Write-Host "Ce script installe les outils externes les plus courants. Vous pouvez le relancer sans risque."

if (-not $SkipTesseract) {
    Install-WingetPackage -Name "Tesseract OCR" -Id "UB-Mannheim.TesseractOCR"
}

if (-not $SkipFFmpeg) {
    Install-WingetPackage -Name "FFmpeg" -Id "Gyan.FFmpeg"
}

if (-not $SkipEspeak) {
    Install-WingetPackage -Name "eSpeak NG" -Id "eSpeak-NG.eSpeak-NG"
}

Write-Step "Verification rapide"
$checks = @("tesseract", "ffmpeg", "espeak-ng")
foreach ($command in $checks) {
    $found = Get-Command $command -ErrorAction SilentlyContinue
    if ($found) {
        Write-Host "[OK] $command -> $($found.Source)" -ForegroundColor Green
    } else {
        Write-Host "[A VERIFIER] $command n'est pas encore dans le PATH. Redemarrez Windows ou ajoutez le dossier d'installation au PATH." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Termine. Redemarrez Accessible pour que les moteurs soient detectes."
