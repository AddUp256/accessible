' Lance Accessible (exe compilé si disponible, sinon mode développement Tauri).
Option Explicit

Dim fso, shell, root, exe, candidates, i, npmCmd

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
root = fso.GetParentFolderName(WScript.ScriptFullName)

candidates = Array( _
	"src-tauri\target\release\Accessible.exe", _
	"src-tauri\target\release\app.exe", _
	"src-tauri\target\release\bundle\nsis\Accessible.exe", _
	"src-tauri\target\debug\Accessible.exe", _
	"src-tauri\target\debug\app.exe" _
)

For i = 0 To UBound(candidates)
	exe = fso.BuildPath(root, candidates(i))
	If fso.FileExists(exe) Then
		shell.CurrentDirectory = root
		shell.Run """" & exe & """", 1, False
		WScript.Quit 0
	End If
Next

npmCmd = "cmd /c ""cd /d """ & root & """ && npm run tauri:dev"""
shell.CurrentDirectory = root
shell.Run npmCmd, 1, False
