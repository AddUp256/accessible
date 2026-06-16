; R?le : Script NSIS Lang Pack Installer : logique installateur Windows et packs de langue.
; Accessible — mode d'installation et sélection des packs de langue (interface bilingue)

LangString accessibleLangModeTitle ${LANG_FRENCH} "Comment souhaitez-vous installer Accessible ?"
LangString accessibleLangModeTitle ${LANG_ENGLISH} "How would you like to install Accessible?"

LangString accessibleLangModeFull ${LANG_FRENCH} "Installation complète (application + langues choisies)"
LangString accessibleLangModeFull ${LANG_ENGLISH} "Full installation (app + selected languages)"

LangString accessibleLangModePacksOnly ${LANG_FRENCH} "Packs de langue uniquement (application déjà installée)"
LangString accessibleLangModePacksOnly ${LANG_ENGLISH} "Language packs only (app already installed)"

LangString accessibleLangNotInstalled ${LANG_FRENCH} "Accessible n'est pas encore installé.$\r$\nChoisissez « Installation complète » ou installez l'application d'abord."
LangString accessibleLangNotInstalled ${LANG_ENGLISH} "Accessible is not installed yet.$\r$\nChoose full installation or install the app first."

LangString accessibleLangSelectTitle ${LANG_FRENCH} "Cochez les langues à installer (interface bilingue, 2e ligne) :"
LangString accessibleLangSelectTitle ${LANG_ENGLISH} "Select languages to install (bilingual UI, second line):"

LangString accessibleLangSelectNone ${LANG_FRENCH} "Sélectionnez au moins une langue."
LangString accessibleLangSelectNone ${LANG_ENGLISH} "Select at least one language."

LangString accessibleShortcutTitle ${LANG_FRENCH} "Raccourci de bureau"
LangString accessibleShortcutTitle ${LANG_ENGLISH} "Desktop shortcut"

LangString accessibleShortcutHint ${LANG_FRENCH} "Accessible peut ajouter un bouton de lancement sur le Bureau."
LangString accessibleShortcutHint ${LANG_ENGLISH} "Accessible can add a launch button on the desktop."

LangString accessibleShortcutCreate ${LANG_FRENCH} "Créer un raccourci Accessible sur le Bureau"
LangString accessibleShortcutCreate ${LANG_ENGLISH} "Create an Accessible shortcut on the desktop"

LangString accessibleToolsTitle ${LANG_FRENCH} "Modules complementaires Windows"
LangString accessibleToolsTitle ${LANG_ENGLISH} "Optional Windows modules"

LangString accessibleToolsHint ${LANG_FRENCH} "Cochez les modules a installer ou configurer pendant l'assistant. Internet est necessaire. L'application reste installee meme si un module optionnel echoue."
LangString accessibleToolsHint ${LANG_ENGLISH} "Select the modules to install or configure during setup. Internet is required. The app remains installed even if an optional module fails."

LangString accessibleToolsTesseract ${LANG_FRENCH} "OCR : Tesseract + pack francais fra"
LangString accessibleToolsTesseract ${LANG_ENGLISH} "OCR: Tesseract + French fra pack"

LangString accessibleToolsHunspell ${LANG_FRENCH} "Orthographe : Hunspell + dictionnaire francais"
LangString accessibleToolsHunspell ${LANG_ENGLISH} "Spelling: Hunspell + French dictionary"

LangString accessibleToolsGrammalecte ${LANG_FRENCH} "Grammaire : Python + Grammalecte"
LangString accessibleToolsGrammalecte ${LANG_ENGLISH} "Grammar: Python + Grammalecte"

LangString accessibleToolsWhisper ${LANG_FRENCH} "Transcription : FFmpeg + whisper.cpp + modele base"
LangString accessibleToolsWhisper ${LANG_ENGLISH} "Transcription: FFmpeg + whisper.cpp + base model"

LangString accessibleToolsPiper ${LANG_FRENCH} "Lecture vocale : Piper + voix francaise"
LangString accessibleToolsPiper ${LANG_ENGLISH} "Speech: Piper + French voice"

LangString accessibleToolsEspeak ${LANG_FRENCH} "Lecture vocale legere : eSpeak NG"
LangString accessibleToolsEspeak ${LANG_ENGLISH} "Light speech engine: eSpeak NG"

LangString accessibleToolsWingetMissing ${LANG_FRENCH} "Accessible : winget est introuvable. Les modules qui dependent de winget sont ignores."
LangString accessibleToolsWingetMissing ${LANG_ENGLISH} "Accessible: winget was not found. Modules that require winget are skipped."

LangString accessibleToolsDone ${LANG_FRENCH} "Accessible : verification des modules complementaires terminee."
LangString accessibleToolsDone ${LANG_ENGLISH} "Accessible: optional module setup finished."

Var AccessibleLangMode     ; 0 = installation complète, 1 = packs de langue uniquement
Var AccessibleDesktopShortcutSel
Var AccessibleOptTesseractSel
Var AccessibleOptHunspellSel
Var AccessibleOptGrammalecteSel
Var AccessibleOptWhisperSel
Var AccessibleOptPiperSel
Var AccessibleOptEspeakSel
Var AccessibleWingetReady
Var AccessibleLangSelES
Var AccessibleLangSelAR
Var AccessibleLangSelZH
Var AccessibleLangSelIT
Var AccessibleLangSelPT
Var AccessibleLangSelDE
Var AccessibleLangSelHI
Var AccessibleLangSelUK
Var AccessibleLangSelTR

; Présence avant installation (mode packs uniquement — ne pas supprimer l'existant)
Var AccessibleHadES
Var AccessibleHadAR
Var AccessibleHadZH
Var AccessibleHadIT
Var AccessibleHadPT
Var AccessibleHadDE
Var AccessibleHadHI
Var AccessibleHadUK
Var AccessibleHadTR

; Contrôles des pages personnalisées
Var LangModeRadioFull
Var LangModeRadioPacksOnly
Var LangChkES
Var LangChkAR
Var LangChkZH
Var LangChkIT
Var LangChkPT
Var LangChkDE
Var LangChkHI
Var LangChkUK
Var LangChkTR
Var DesktopShortcutChk
Var OptionalTesseractChk
Var OptionalHunspellChk
Var OptionalGrammalecteChk
Var OptionalWhisperChk
Var OptionalPiperChk
Var OptionalEspeakChk

!macro AccessibleRecordHad LANGCODE HADVAR
  StrCpy ${HADVAR} 0
  IfFileExists "$INSTDIR\lang-packs\${LANGCODE}.json" 0 +2
    StrCpy ${HADVAR} 1
!macroend

!macro NSIS_HOOK_PREINSTALL
  CreateDirectory "$INSTDIR\lang-packs"
  !insertmacro AccessibleRecordHad "es" $AccessibleHadES
  !insertmacro AccessibleRecordHad "ar" $AccessibleHadAR
  !insertmacro AccessibleRecordHad "zh" $AccessibleHadZH
  !insertmacro AccessibleRecordHad "it" $AccessibleHadIT
  !insertmacro AccessibleRecordHad "pt" $AccessibleHadPT
  !insertmacro AccessibleRecordHad "de" $AccessibleHadDE
  !insertmacro AccessibleRecordHad "hi" $AccessibleHadHI
  !insertmacro AccessibleRecordHad "uk" $AccessibleHadUK
  !insertmacro AccessibleRecordHad "tr" $AccessibleHadTR
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ${If} $AccessibleLangMode = 0
  ${AndIf} $AccessibleDesktopShortcutSel = ${BST_CHECKED}
    Call CreateOrUpdateDesktopShortcut
  ${EndIf}
  ${If} $AccessibleLangMode = 0
    Call AccessibleInstallSelectedOptionalTools
  ${EndIf}
  !insertmacro AccessibleFinalizeLangPacks
!macroend

Function AccessibleSkipIfLangOnly
  ${If} $AccessibleLangMode = 1
    Abort
  ${EndIf}
FunctionEnd

Function AccessibleSkipIfPassiveOrLangOnly
  Call SkipIfPassive
  Call AccessibleSkipIfLangOnly
FunctionEnd

; --- Page 1 : type d'installation ---
Function AccessibleLangModePage
  Call SkipIfPassive
  StrCpy $AccessibleLangMode 0
  StrCpy $AccessibleLangSelES 0
  StrCpy $AccessibleLangSelAR 0
  StrCpy $AccessibleLangSelZH 0
  StrCpy $AccessibleLangSelIT 0
  StrCpy $AccessibleLangSelPT 0
  StrCpy $AccessibleLangSelDE 0
  StrCpy $AccessibleLangSelHI 0
  StrCpy $AccessibleLangSelUK 0
  StrCpy $AccessibleLangSelTR 0
  nsDialogs::Create 1018
  Pop $0
  ${IfThen} $(^RTL) = 1 ${|} nsDialogs::SetRTL $(^RTL) ${|}

  ${NSD_CreateLabel} 0 0 100% 24u "$(accessibleLangModeTitle)"
  Pop $1

  ${NSD_CreateRadioButton} 10u 40u 100% 12u "$(accessibleLangModeFull)"
  Pop $LangModeRadioFull
  ${NSD_CreateRadioButton} 10u 58u 100% 12u "$(accessibleLangModePacksOnly)"
  Pop $LangModeRadioPacksOnly

  ${If} $AccessibleLangMode = 1
    SendMessage $LangModeRadioPacksOnly ${BM_SETCHECK} ${BST_CHECKED} 0
  ${Else}
    SendMessage $LangModeRadioFull ${BM_SETCHECK} ${BST_CHECKED} 0
  ${EndIf}

  nsDialogs::Show
FunctionEnd

Function AccessibleLangModeLeave
  ${NSD_GetState} $LangModeRadioPacksOnly $0
  ${If} $0 = ${BST_CHECKED}
    StrCpy $AccessibleLangMode 1
    ReadRegStr $INSTDIR SHCTX "${MANUPRODUCTKEY}" ""
    ${If} $INSTDIR == ""
      MessageBox MB_ICONEXCLAMATION "$(accessibleLangNotInstalled)"
      Abort
    ${EndIf}
  ${Else}
    StrCpy $AccessibleLangMode 0
  ${EndIf}
FunctionEnd

; --- Page 2 : langues à installer ---
Function AccessibleLangSelectPage
  Call SkipIfPassive
  nsDialogs::Create 1018
  Pop $0
  ${IfThen} $(^RTL) = 1 ${|} nsDialogs::SetRTL $(^RTL) ${|}

  ${NSD_CreateLabel} 0 0 100% 24u "$(accessibleLangSelectTitle)"
  Pop $1

  ${NSD_CreateCheckbox} 10u 36u 45% 10u "Español (es)"
  Pop $LangChkES
  ${NSD_CreateCheckbox} 55% 36u 45% 10u "العربية (ar)"
  Pop $LangChkAR
  ${NSD_CreateCheckbox} 10u 52u 45% 10u "中文 (zh)"
  Pop $LangChkZH
  ${NSD_CreateCheckbox} 55% 52u 45% 10u "Italiano (it)"
  Pop $LangChkIT
  ${NSD_CreateCheckbox} 10u 68u 45% 10u "Português (pt)"
  Pop $LangChkPT
  ${NSD_CreateCheckbox} 55% 68u 45% 10u "Deutsch (de)"
  Pop $LangChkDE
  ${NSD_CreateCheckbox} 10u 84u 45% 10u "हिन्दी (hi)"
  Pop $LangChkHI
  ${NSD_CreateCheckbox} 55% 84u 45% 10u "Українська (uk)"
  Pop $LangChkUK
  ${NSD_CreateCheckbox} 10u 100u 45% 10u "Türkçe (tr)"
  Pop $LangChkTR

  ; Par défaut : tout cocher en installation complète
  ${If} $AccessibleLangMode = 0
    SendMessage $LangChkES ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkAR ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkZH ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkIT ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkPT ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkDE ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkHI ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkUK ${BM_SETCHECK} ${BST_CHECKED} 0
    SendMessage $LangChkTR ${BM_SETCHECK} ${BST_CHECKED} 0
  ${Else}
    ; Packs uniquement : pré-cocher les langues déjà installées
    IfFileExists "$INSTDIR\lang-packs\es.json" 0 +2
      SendMessage $LangChkES ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\ar.json" 0 +2
      SendMessage $LangChkAR ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\zh.json" 0 +2
      SendMessage $LangChkZH ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\it.json" 0 +2
      SendMessage $LangChkIT ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\pt.json" 0 +2
      SendMessage $LangChkPT ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\de.json" 0 +2
      SendMessage $LangChkDE ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\hi.json" 0 +2
      SendMessage $LangChkHI ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\uk.json" 0 +2
      SendMessage $LangChkUK ${BM_SETCHECK} ${BST_CHECKED} 0
    IfFileExists "$INSTDIR\lang-packs\tr.json" 0 +2
      SendMessage $LangChkTR ${BM_SETCHECK} ${BST_CHECKED} 0
  ${EndIf}

  nsDialogs::Show
FunctionEnd

Function AccessibleLangSelectLeave
  ${NSD_GetState} $LangChkES $AccessibleLangSelES
  ${NSD_GetState} $LangChkAR $AccessibleLangSelAR
  ${NSD_GetState} $LangChkZH $AccessibleLangSelZH
  ${NSD_GetState} $LangChkIT $AccessibleLangSelIT
  ${NSD_GetState} $LangChkPT $AccessibleLangSelPT
  ${NSD_GetState} $LangChkDE $AccessibleLangSelDE
  ${NSD_GetState} $LangChkHI $AccessibleLangSelHI
  ${NSD_GetState} $LangChkUK $AccessibleLangSelUK
  ${NSD_GetState} $LangChkTR $AccessibleLangSelTR

  IntOp $0 $AccessibleLangSelES + $AccessibleLangSelAR
  IntOp $0 $0 + $AccessibleLangSelZH
  IntOp $0 $0 + $AccessibleLangSelIT
  IntOp $0 $0 + $AccessibleLangSelPT
  IntOp $0 $0 + $AccessibleLangSelDE
  IntOp $0 $0 + $AccessibleLangSelHI
  IntOp $0 $0 + $AccessibleLangSelUK
  IntOp $0 $0 + $AccessibleLangSelTR
  ${If} $0 < 1
    MessageBox MB_ICONEXCLAMATION "$(accessibleLangSelectNone)"
    Abort
  ${EndIf}
FunctionEnd

; --- Page 3 : raccourci de bureau ---
Function AccessibleDesktopShortcutPage
  Call AccessibleSkipIfPassiveOrLangOnly
  StrCpy $AccessibleDesktopShortcutSel ${BST_CHECKED}
  nsDialogs::Create 1018
  Pop $0
  ${IfThen} $(^RTL) = 1 ${|} nsDialogs::SetRTL $(^RTL) ${|}

  ${NSD_CreateLabel} 0 0 100% 18u "$(accessibleShortcutTitle)"
  Pop $1
  ${NSD_CreateLabel} 0 26u 100% 24u "$(accessibleShortcutHint)"
  Pop $2
  ${NSD_CreateCheckbox} 10u 60u 100% 12u "$(accessibleShortcutCreate)"
  Pop $DesktopShortcutChk
  SendMessage $DesktopShortcutChk ${BM_SETCHECK} ${BST_CHECKED} 0

  nsDialogs::Show
FunctionEnd

Function AccessibleDesktopShortcutLeave
  ${NSD_GetState} $DesktopShortcutChk $AccessibleDesktopShortcutSel
FunctionEnd

; --- Page 4 : modules complementaires Windows ---
Function AccessibleOptionalToolsPage
  Call AccessibleSkipIfPassiveOrLangOnly
  StrCpy $AccessibleOptTesseractSel 0
  StrCpy $AccessibleOptHunspellSel 0
  StrCpy $AccessibleOptGrammalecteSel 0
  StrCpy $AccessibleOptWhisperSel 0
  StrCpy $AccessibleOptPiperSel 0
  StrCpy $AccessibleOptEspeakSel 0
  StrCpy $AccessibleWingetReady ""

  nsDialogs::Create 1018
  Pop $0
  ${IfThen} $(^RTL) = 1 ${|} nsDialogs::SetRTL $(^RTL) ${|}

  ${NSD_CreateLabel} 0 0 100% 16u "$(accessibleToolsTitle)"
  Pop $1
  ${NSD_CreateLabel} 0 24u 100% 34u "$(accessibleToolsHint)"
  Pop $2

  ${NSD_CreateCheckbox} 10u 70u 100% 12u "$(accessibleToolsTesseract)"
  Pop $OptionalTesseractChk
  ${NSD_CreateCheckbox} 10u 88u 100% 12u "$(accessibleToolsHunspell)"
  Pop $OptionalHunspellChk
  ${NSD_CreateCheckbox} 10u 106u 100% 12u "$(accessibleToolsGrammalecte)"
  Pop $OptionalGrammalecteChk
  ${NSD_CreateCheckbox} 10u 124u 100% 12u "$(accessibleToolsWhisper)"
  Pop $OptionalWhisperChk
  ${NSD_CreateCheckbox} 10u 142u 100% 12u "$(accessibleToolsPiper)"
  Pop $OptionalPiperChk
  ${NSD_CreateCheckbox} 10u 160u 100% 12u "$(accessibleToolsEspeak)"
  Pop $OptionalEspeakChk

  nsDialogs::Show
FunctionEnd

Function AccessibleOptionalToolsLeave
  ${NSD_GetState} $OptionalTesseractChk $AccessibleOptTesseractSel
  ${NSD_GetState} $OptionalHunspellChk $AccessibleOptHunspellSel
  ${NSD_GetState} $OptionalGrammalecteChk $AccessibleOptGrammalecteSel
  ${NSD_GetState} $OptionalWhisperChk $AccessibleOptWhisperSel
  ${NSD_GetState} $OptionalPiperChk $AccessibleOptPiperSel
  ${NSD_GetState} $OptionalEspeakChk $AccessibleOptEspeakSel
FunctionEnd

!macro AccessibleWingetInstall PACKAGE LABEL
  Call AccessibleEnsureWinget
  ${If} $AccessibleWingetReady = 1
    DetailPrint "Accessible: installation ${LABEL}"
    nsExec::ExecToLog 'winget install --id ${PACKAGE} --exact --source winget --accept-package-agreements --accept-source-agreements --disable-interactivity'
    Pop $9
    ${If} $9 = 0
      DetailPrint "Accessible: ${LABEL} pret ou deja installe."
    ${Else}
      DetailPrint "Accessible: ${LABEL} non installe (code $9)."
    ${EndIf}
  ${EndIf}
!macroend

Function AccessibleEnsureWinget
  ${If} $AccessibleWingetReady != ""
    Return
  ${EndIf}
  nsExec::ExecToStack 'winget --version'
  Pop $8
  Pop $9
  ${If} $8 = 0
    StrCpy $AccessibleWingetReady 1
  ${Else}
    StrCpy $AccessibleWingetReady 0
    DetailPrint "$(accessibleToolsWingetMissing)"
  ${EndIf}
FunctionEnd

Function AccessibleBroadcastEnvironment
  System::Call 'user32::SendMessageTimeout(p 0xffff, i 0x001A, p 0, t "Environment", i 0, i 5000, *p .r0)'
FunctionEnd

Function AccessibleInstallTesseract
  !insertmacro AccessibleWingetInstall "UB-Mannheim.TesseractOCR" "Tesseract OCR"

  StrCpy $0 "$PROGRAMFILES64\Tesseract-OCR"
  IfFileExists "$0\tesseract.exe" accessible_tesseract_root_found 0
  StrCpy $0 "$PROGRAMFILES\Tesseract-OCR"
  IfFileExists "$0\tesseract.exe" accessible_tesseract_root_found 0
  StrCpy $0 "$PROGRAMFILES32\Tesseract-OCR"
  IfFileExists "$0\tesseract.exe" accessible_tesseract_root_found 0
  StrCpy $0 "$LOCALAPPDATA\Programs\Tesseract-OCR"
  IfFileExists "$0\tesseract.exe" accessible_tesseract_root_found 0
  DetailPrint "Accessible: Tesseract introuvable apres installation."
  Goto accessible_tesseract_done

  accessible_tesseract_root_found:
    StrCpy $1 "$0\tessdata"
    CreateDirectory "$1"
    Delete "$TEMP\accessible-fra.traineddata"
    DetailPrint "Accessible: telechargement du pack Tesseract fra."
    NSISdl::download "https://raw.githubusercontent.com/tesseract-ocr/tessdata/main/fra.traineddata" "$TEMP\accessible-fra.traineddata"
    Pop $2
    ${If} $2 == "success"
      CopyFiles /SILENT "$TEMP\accessible-fra.traineddata" "$1\fra.traineddata"
      WriteRegExpandStr HKCU "Environment" "TESSDATA_PREFIX" "$1"
      Call AccessibleBroadcastEnvironment
      DetailPrint "Accessible: pack Tesseract fra installe."
    ${Else}
      DetailPrint "Accessible: echec du telechargement du pack Tesseract fra ($2)."
    ${EndIf}

  accessible_tesseract_done:
FunctionEnd

Function AccessibleInstallHunspell
  !insertmacro AccessibleWingetInstall "FSFhu.Hunspell" "Hunspell"

  StrCpy $0 "$APPDATA\hunspell\dicts"
  CreateDirectory "$0"
  Delete "$0\fr_FR.aff"
  Delete "$0\fr_FR.dic"
  DetailPrint "Accessible: telechargement du dictionnaire Hunspell fr_FR."
  NSISdl::download "https://raw.githubusercontent.com/LibreOffice/dictionaries/master/fr_FR/fr.aff" "$0\fr_FR.aff"
  Pop $1
  ${If} $1 == "success"
    NSISdl::download "https://raw.githubusercontent.com/LibreOffice/dictionaries/master/fr_FR/fr.dic" "$0\fr_FR.dic"
    Pop $2
    ${If} $2 == "success"
      CopyFiles /SILENT "$0\fr_FR.aff" "$0\fr.aff"
      CopyFiles /SILENT "$0\fr_FR.dic" "$0\fr.dic"
      WriteRegExpandStr HKCU "Environment" "DICPATH" "$0"
      Call AccessibleBroadcastEnvironment
      DetailPrint "Accessible: dictionnaire Hunspell fr_FR installe."
    ${Else}
      DetailPrint "Accessible: echec du telechargement fr_FR.dic ($2)."
    ${EndIf}
  ${Else}
    DetailPrint "Accessible: echec du telechargement fr_FR.aff ($1)."
  ${EndIf}
FunctionEnd

Function AccessibleInstallGrammalecte
  !insertmacro AccessibleWingetInstall "Python.Python.3.12" "Python 3.12"

  StrCpy $0 "$LOCALAPPDATA\Accessible\Grammalecte"
  CreateDirectory "$0"
  Delete "$0\grammalecte.zip"
  DetailPrint "Accessible: telechargement de Grammalecte."
  NSISdl::download "https://www.grammalecte.net/zip/Grammalecte-fr-v2.3.0.zip" "$0\grammalecte.zip"
  Pop $1
  ${If} $1 == "success"
    nsExec::ExecToLog '"tar.exe" -xf "$0\grammalecte.zip" -C "$0"'
    Pop $2
    ${If} $2 = 0
      ${If} ${FileExists} "$0\grammalecte\grammar_checker.py"
        WriteRegExpandStr HKCU "Environment" "GRAMMALECTE_PATH" "$0\grammalecte"
        WriteRegExpandStr HKCU "Environment" "GRAMMALECTE_CLI" "$0\grammalecte\grammar_checker.py"
        Call AccessibleBroadcastEnvironment
        DetailPrint "Accessible: Grammalecte est configure."
      ${Else}
        DetailPrint "Accessible: grammar_checker.py est introuvable apres extraction."
      ${EndIf}
    ${Else}
      DetailPrint "Accessible: extraction Grammalecte impossible (code $2)."
    ${EndIf}
  ${Else}
    DetailPrint "Accessible: echec du telechargement Grammalecte ($1)."
  ${EndIf}
FunctionEnd

Function AccessibleInstallWhisper
  !insertmacro AccessibleWingetInstall "Gyan.FFmpeg" "FFmpeg"

  StrCpy $0 "$LOCALAPPDATA\Accessible\whisper.cpp"
  CreateDirectory "$0"
  Delete "$0\whisper-bin-x64.zip"
  DetailPrint "Accessible: telechargement de whisper.cpp."
  NSISdl::download "https://github.com/ggml-org/whisper.cpp/releases/latest/download/whisper-bin-x64.zip" "$0\whisper-bin-x64.zip"
  Pop $1
  ${If} $1 == "success"
    nsExec::ExecToLog '"tar.exe" -xf "$0\whisper-bin-x64.zip" -C "$0"'
    Pop $2
    ${If} $2 = 0
      CreateDirectory "$0\models"
      NSISdl::download "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin?download=true" "$0\models\ggml-base.bin"
      Pop $3
      ${If} $3 == "success"
        ${If} ${FileExists} "$0\Release\whisper-cli.exe"
          WriteRegExpandStr HKCU "Environment" "WHISPER_CLI" "$0\Release\whisper-cli.exe"
        ${EndIf}
        WriteRegExpandStr HKCU "Environment" "WHISPER_MODEL" "$0\models\ggml-base.bin"
        Call AccessibleBroadcastEnvironment
        DetailPrint "Accessible: whisper.cpp et le modele base sont configures."
      ${Else}
        DetailPrint "Accessible: echec du telechargement du modele Whisper ($3)."
      ${EndIf}
    ${Else}
      DetailPrint "Accessible: extraction whisper.cpp impossible (code $2)."
    ${EndIf}
  ${Else}
    DetailPrint "Accessible: echec du telechargement whisper.cpp ($1)."
  ${EndIf}
FunctionEnd

Function AccessibleInstallPiper
  StrCpy $0 "$LOCALAPPDATA\Accessible\Piper"
  CreateDirectory "$0"
  Delete "$0\piper_windows_amd64.zip"
  DetailPrint "Accessible: telechargement de Piper."
  NSISdl::download "https://github.com/rhasspy/piper/releases/latest/download/piper_windows_amd64.zip" "$0\piper_windows_amd64.zip"
  Pop $1
  ${If} $1 == "success"
    nsExec::ExecToLog '"tar.exe" -xf "$0\piper_windows_amd64.zip" -C "$0"'
    Pop $2
    ${If} $2 = 0
      CreateDirectory "$0\voices"
      NSISdl::download "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx?download=true" "$0\voices\fr_FR-siwis-medium.onnx"
      Pop $3
      ${If} $3 == "success"
        NSISdl::download "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json?download=true" "$0\voices\fr_FR-siwis-medium.onnx.json"
        Pop $4
        ${If} $4 == "success"
          WriteRegExpandStr HKCU "Environment" "PIPER_MODEL" "$0\voices\fr_FR-siwis-medium.onnx"
          WriteRegExpandStr HKCU "Environment" "PIPER_CONFIG" "$0\voices\fr_FR-siwis-medium.onnx.json"
          Call AccessibleBroadcastEnvironment
          DetailPrint "Accessible: Piper et la voix francaise sont configures."
        ${Else}
          DetailPrint "Accessible: echec du telechargement de la configuration Piper ($4)."
        ${EndIf}
      ${Else}
        DetailPrint "Accessible: echec du telechargement de la voix Piper ($3)."
      ${EndIf}
    ${Else}
      DetailPrint "Accessible: extraction Piper impossible (code $2)."
    ${EndIf}
  ${Else}
    DetailPrint "Accessible: echec du telechargement Piper ($1)."
  ${EndIf}
FunctionEnd

Function AccessibleInstallEspeak
  !insertmacro AccessibleWingetInstall "eSpeak-NG.eSpeak-NG" "eSpeak NG"
FunctionEnd

Function AccessibleInstallSelectedOptionalTools
  ${If} $AccessibleOptTesseractSel = ${BST_CHECKED}
    Call AccessibleInstallTesseract
  ${EndIf}
  ${If} $AccessibleOptHunspellSel = ${BST_CHECKED}
    Call AccessibleInstallHunspell
  ${EndIf}
  ${If} $AccessibleOptGrammalecteSel = ${BST_CHECKED}
    Call AccessibleInstallGrammalecte
  ${EndIf}
  ${If} $AccessibleOptWhisperSel = ${BST_CHECKED}
    Call AccessibleInstallWhisper
  ${EndIf}
  ${If} $AccessibleOptPiperSel = ${BST_CHECKED}
    Call AccessibleInstallPiper
  ${EndIf}
  ${If} $AccessibleOptEspeakSel = ${BST_CHECKED}
    Call AccessibleInstallEspeak
  ${EndIf}
  DetailPrint "$(accessibleToolsDone)"
FunctionEnd

!macro AccessibleFinalizeLangPacks
  ; Installation complète : ne garder que les langues cochées.
  ; Packs uniquement : retirer seulement les fichiers nouveaux non cochés (conserver l'existant).
  !insertmacro AccessibleRemoveLangIfNotSelected "es" $AccessibleLangSelES $AccessibleHadES
  !insertmacro AccessibleRemoveLangIfNotSelected "ar" $AccessibleLangSelAR $AccessibleHadAR
  !insertmacro AccessibleRemoveLangIfNotSelected "zh" $AccessibleLangSelZH $AccessibleHadZH
  !insertmacro AccessibleRemoveLangIfNotSelected "it" $AccessibleLangSelIT $AccessibleHadIT
  !insertmacro AccessibleRemoveLangIfNotSelected "pt" $AccessibleLangSelPT $AccessibleHadPT
  !insertmacro AccessibleRemoveLangIfNotSelected "de" $AccessibleLangSelDE $AccessibleHadDE
  !insertmacro AccessibleRemoveLangIfNotSelected "hi" $AccessibleLangSelHI $AccessibleHadHI
  !insertmacro AccessibleRemoveLangIfNotSelected "uk" $AccessibleLangSelUK $AccessibleHadUK
  !insertmacro AccessibleRemoveLangIfNotSelected "tr" $AccessibleLangSelTR $AccessibleHadTR
  !insertmacro AccessibleWriteInstalledManifest
!macroend

!macro AccessibleRemoveLangIfNotSelected LANGCODE FLAG HADVAR
  ${If} ${FLAG} <> 1
    ${If} $AccessibleLangMode = 0
      Delete "$INSTDIR\lang-packs\${LANGCODE}.json"
    ${Else}
      ${If} ${HADVAR} = 0
        Delete "$INSTDIR\lang-packs\${LANGCODE}.json"
      ${EndIf}
    ${EndIf}
  ${EndIf}
!macroend

; Écrit le manifeste à partir des fichiers réellement présents
!macro AccessibleWriteInstalledManifest
  FileOpen $0 "$INSTDIR\lang-packs\installed-languages.json" w
  FileWrite $0 "{$\r$\n  $\"version$\": 1,$\r$\n  $\"installed$\": ["
  StrCpy $1 0
  !insertmacro AccessibleAppendIfFileExists "es"
  !insertmacro AccessibleAppendIfFileExists "ar"
  !insertmacro AccessibleAppendIfFileExists "zh"
  !insertmacro AccessibleAppendIfFileExists "it"
  !insertmacro AccessibleAppendIfFileExists "pt"
  !insertmacro AccessibleAppendIfFileExists "de"
  !insertmacro AccessibleAppendIfFileExists "hi"
  !insertmacro AccessibleAppendIfFileExists "uk"
  !insertmacro AccessibleAppendIfFileExists "tr"
  FileWrite $0 "]$\r$\n}$\r$\n"
  FileClose $0
!macroend

!macro AccessibleAppendIfFileExists LANGCODE
  IfFileExists "$INSTDIR\lang-packs\${LANGCODE}.json" 0 +4
    ${If} $1 > 0
      FileWrite $0 ", "
    ${EndIf}
    FileWrite $0 "$\"${LANGCODE}$\""
    IntOp $1 $1 + 1
!macroend
