@echo off
REM Double-clic ou raccourci bureau — délègue au lanceur VBS (sans fenêtre console pour l'exe).
cd /d "%~dp0"
wscript.exe //nologo "%~dp0Lancer Accessible.vbs"
