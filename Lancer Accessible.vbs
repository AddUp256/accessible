' Role : compatibilite avec les anciens raccourcis.
' Le vrai bouton est Lancer Accessible.exe ; ce script delegue au meme controle PowerShell.
Option Explicit

Dim fso, shell, root, script, command

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
root = fso.GetParentFolderName(WScript.ScriptFullName)
script = fso.BuildPath(root, "scripts\Launch-Accessible.ps1")

command = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & script & """"
shell.CurrentDirectory = root
shell.Run command, 0, False
