# Recrée le raccourci Accessible.lnk à la racine du projet (chemins absolus).
$root = Split-Path -Parent $PSScriptRoot
$icon = Join-Path $root "src-tauri\icons\icon.ico"
if (-not (Test-Path $icon)) {
	$icon = "$env:SystemRoot\System32\imageres.dll,76"
}

$WshShell = New-Object -ComObject WScript.Shell
$sc = $WshShell.CreateShortcut("$root\Accessible.lnk")
$sc.TargetPath = Join-Path $root "Lancer Accessible.vbs"
$sc.WorkingDirectory = $root
$sc.IconLocation = $icon
$sc.Description = "Lancer l'application Accessible"
$sc.Save()

Write-Host "Raccourci créé : $root\Accessible.lnk"
