Unicode true
!include "MUI2.nsh"
!include "LogicLib.nsh"

Name "OpenDeepL"
OutFile "..\release\OpenDeepL-Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\OpenDeepL"
InstallDirRegKey HKCU "Software\OpenDeepL" "InstallDir"
RequestExecutionLevel user
!define UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\OpenDeepL"

!define MUI_ABORTWARNING
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\OpenDeepL.exe"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "OpenDeepL" SecMain
  SectionIn RO
  SetOutPath "$INSTDIR"
  File /r "..\release\OpenDeepL-app\*.*"
  WriteRegStr HKCU "Software\OpenDeepL" "InstallDir" "$INSTDIR"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayName" "OpenDeepL"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayVersion" "1.0.0"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "Publisher" "OpenDeepL"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayIcon" "$INSTDIR\OpenDeepL.exe"
  WriteRegStr HKCU "${UNINSTALL_KEY}" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKCU "${UNINSTALL_KEY}" "QuietUninstallString" "$\"$INSTDIR\Uninstall.exe$\" /S"
  WriteRegDWORD HKCU "${UNINSTALL_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINSTALL_KEY}" "NoRepair" 1
SectionEnd

Section "Desktop shortcut" SecDesktop
  CreateShortcut "$DESKTOP\OpenDeepL.lnk" "$INSTDIR\OpenDeepL.exe"
SectionEnd

Section "Start menu shortcut" SecStartMenu
  CreateDirectory "$SMPROGRAMS\OpenDeepL"
  CreateShortcut "$SMPROGRAMS\OpenDeepL\OpenDeepL.lnk" "$INSTDIR\OpenDeepL.exe"
  CreateShortcut "$SMPROGRAMS\OpenDeepL\Uninstall OpenDeepL.lnk" "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\OpenDeepL.lnk"
  Delete "$SMPROGRAMS\OpenDeepL\OpenDeepL.lnk"
  Delete "$SMPROGRAMS\OpenDeepL\Uninstall OpenDeepL.lnk"
  RMDir "$SMPROGRAMS\OpenDeepL"
  DeleteRegKey HKCU "${UNINSTALL_KEY}"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "Software\OpenDeepL"
SectionEnd

LangString DESC_SecMain ${LANG_ENGLISH} "Install the OpenDeepL application."
LangString DESC_SecDesktop ${LANG_ENGLISH} "Create a shortcut on the desktop."
LangString DESC_SecStartMenu ${LANG_ENGLISH} "Create shortcuts in the Start menu."
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} $(DESC_SecDesktop)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} $(DESC_SecStartMenu)
!insertmacro MUI_FUNCTION_DESCRIPTION_END
