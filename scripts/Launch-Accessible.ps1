param(
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$LogPath = Join-Path $Root "accessible-launcher.log"
$Port = 5173

function Write-LaunchLog {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8
    Write-Host $Message
}

function Read-JsonVersion {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    return (Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json).version
}

function Read-CargoVersion {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    $match = Select-String -LiteralPath $Path -Pattern '^\s*version\s*=\s*"([^"]+)"' | Select-Object -First 1
    if ($match) { return $match.Matches[0].Groups[1].Value }
    return $null
}

function Stop-WorkspacePort {
    param([int]$LocalPort)

    $listeners = Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue
    foreach ($listener in $listeners) {
        $process = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction SilentlyContinue
        if (-not $process) { continue }

        $cmd = [string]$process.CommandLine
        if ($cmd -like "*$Root*" -and ($cmd -match "vite|tauri|npm")) {
            Write-LaunchLog "Arret ancien serveur du depot sur le port $LocalPort (PID $($listener.OwningProcess))."
            Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
        } else {
            throw "Le port $LocalPort est occupe par un autre processus : PID $($listener.OwningProcess). Fermez-le ou changez de port."
        }
    }
}

function Get-NewestSourceTime {
    $paths = @(
        "package.json",
        "package-lock.json",
        "vite.config.ts",
        "svelte.config.js",
        "src",
        "static",
        "src-tauri\Cargo.toml",
        "src-tauri\tauri.conf.json",
        "src-tauri\src"
    )

    $latest = [datetime]"1970-01-01"
    foreach ($relative in $paths) {
        $path = Join-Path $Root $relative
        if (-not (Test-Path -LiteralPath $path)) { continue }
        $items = Get-ChildItem -LiteralPath $path -Recurse -Force -ErrorAction SilentlyContinue
        if ((Get-Item -LiteralPath $path).PSIsContainer -eq $false) {
            $items = @((Get-Item -LiteralPath $path)) + $items
        }
        foreach ($item in $items) {
            if ($item.LastWriteTime -gt $latest) { $latest = $item.LastWriteTime }
        }
    }
    return $latest
}

Set-Location -LiteralPath $Root
Write-LaunchLog "Lancement Accessible depuis $Root"

$npm = Get-Command npm.cmd, npm -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $npm) {
    throw "npm est introuvable. Installez Node.js ou ajoutez npm au PATH."
}
Write-LaunchLog "npm detecte : $($npm.Source)"

$packageVersion = Read-JsonVersion (Join-Path $Root "package.json")
$tauriVersion = Read-JsonVersion (Join-Path $Root "src-tauri\tauri.conf.json")
$cargoVersion = Read-CargoVersion (Join-Path $Root "src-tauri\Cargo.toml")
Write-LaunchLog "Versions : package=$packageVersion ; tauri=$tauriVersion ; cargo=$cargoVersion"

$versions = @($packageVersion, $tauriVersion, $cargoVersion) | Where-Object { $_ }
if (($versions | Select-Object -Unique).Count -gt 1) {
    throw "Versions incoherentes : package=$packageVersion ; tauri=$tauriVersion ; cargo=$cargoVersion."
}

if (-not (Test-Path -LiteralPath (Join-Path $Root "node_modules"))) {
    Write-LaunchLog "node_modules absent : installation des dependances npm."
    & $npm.Source install
    if ($LASTEXITCODE -ne 0) { throw "npm install a echoue." }
}

$debugExe = Join-Path $Root "src-tauri\target\debug\app.exe"
$newestSource = Get-NewestSourceTime
if (-not (Test-Path -LiteralPath $debugExe)) {
    Write-LaunchLog "Executable debug absent : Tauri reconstruira l'application."
} elseif ((Get-Item -LiteralPath $debugExe).LastWriteTime -lt $newestSource) {
    Write-LaunchLog "Sources plus recentes que l'executable debug : Tauri reconstruira l'application."
} else {
    Write-LaunchLog "Executable debug a jour ; verification Tauri au lancement."
}

if ($CheckOnly) {
    Write-LaunchLog "Verification seule terminee."
    exit 0
}

Stop-WorkspacePort -LocalPort $Port

Write-LaunchLog "Demarrage de l'application locale."
& $npm.Source run tauri:dev 2>&1 | Tee-Object -FilePath $LogPath -Append
exit $LASTEXITCODE
