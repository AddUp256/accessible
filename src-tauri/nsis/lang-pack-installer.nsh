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

Var AccessibleLangMode     ; 0 = installation complète, 1 = packs de langue uniquement
Var AccessibleDesktopShortcutSel
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
