# Role : script de maintenance qui recree le raccourci Accessible.lnk.
$root = Split-Path -Parent $PSScriptRoot
$icon = Join-Path $root "src-tauri\icons\icon.ico"
if (-not (Test-Path $icon)) {
	$icon = "$env:SystemRoot\System32\imageres.dll,76"
}
$launcher = Join-Path $root "Lancer Accessible.exe"
if (-not (Test-Path -LiteralPath $launcher)) {
	$launcher = Join-Path $root "Lancer Accessible.vbs"
}

$WshShell = New-Object -ComObject WScript.Shell
$sc = $WshShell.CreateShortcut("$root\Accessible.lnk")
$sc.TargetPath = $launcher
$sc.WorkingDirectory = $root
$sc.IconLocation = $icon
$sc.Description = "Lancer l'application Accessible"
$sc.Save()

Write-Host "Raccourci cree : $root\Accessible.lnk"
