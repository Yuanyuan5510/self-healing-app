; Inno Setup Script for Self-Healing File Compression Tool
; Compatible with Inno Setup Compiler 6.5.0

#define MyAppName "Self-Healing File Compression Tool"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Wang.station"
#define MyAppURL "https://api.wangstation.ip-ddns.net/"
#define MyAppExeName "Self-Healing App.exe"

[Setup]
; AppId uniquely identifies this application
AppId={{84C0180A-1C6C-4F39-B67A-413C2F6D5093}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=no
PrivilegesRequired=lowest
OutputDir=j:\node_program\self-healing-app\installer
OutputBaseFilename=SelfHealingApp_{#MyAppVersion}_Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
ShowLanguageDialog=yes

[Languages]
Name: "german"; MessagesFile: "compiler:Languages\German.isl"
; Global top 5 languages support
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinese"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "arabic"; MessagesFile: "compiler:Languages\Arabic.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce; OnlyBelowVersion: 0,6.1

[Files]
Source: "j:\node_program\self-healing-app\dist\win-unpacked\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "j:\node_program\self-healing-app\dist\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; Tasks: quicklaunchicon; OnlyBelowVersion: 0,6.1

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}";

[CustomMessages]
english.CustomWelcomeLabel=Welcome to the {#MyAppName} Setup Wizard
chinese.CustomWelcomeLabel=欢迎使用 {#MyAppName} 安装向导
spanish.CustomWelcomeLabel=Bienvenido al Asistente de Instalación de {#MyAppName}
french.CustomWelcomeLabel=Bienvenue dans l'Assistant d'installation de {#MyAppName}
arabic.CustomWelcomeLabel=مرحبًا بك في معالج تثبيت {#MyAppName}

english.CustomCompletionLabel=Installation of {#MyAppName} is complete
chinese.CustomCompletionLabel={#MyAppName} 安装完成
spanish.CustomCompletionLabel=La instalación de {#MyAppName} se ha completado
french.CustomCompletionLabel=L'installation de {#MyAppName} est terminée
arabic.CustomCompletionLabel=اكتمل تثبيت {#MyAppName}