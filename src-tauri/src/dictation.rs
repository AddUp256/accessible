use std::process::{Command, Stdio};

use serde::Serialize;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DictationStatusDto {
    pub available: bool,
    pub reason: Option<String>,
}

fn culture_for_lang(lang: &str) -> &'static str {
    match lang.trim().to_lowercase().as_str() {
        "en" | "en-us" | "en-gb" => "en-US",
        "es" | "es-es" => "es-ES",
        "de" | "de-de" => "de-DE",
        "it" | "it-it" => "it-IT",
        "pt" | "pt-pt" | "pt-br" => "pt-PT",
        "ar" | "ar-sa" | "ar-eg" => "ar-SA",
        "zh" | "zh-cn" | "zh-hans" => "zh-CN",
        "hi" | "hi-in" => "hi-IN",
        "uk" | "uk-ua" => "uk-UA",
        "tr" | "tr-tr" => "tr-TR",
        _ => "fr-FR",
    }
}

#[cfg(windows)]
fn run_powershell(script: &str) -> Result<String, String> {
    let mut command = Command::new("powershell");
    command
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            script,
        ])
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    command.creation_flags(0x08000000);

    let output = command
        .output()
        .map_err(|e| format!("Impossible de lancer PowerShell : {e}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

    if !output.status.success() {
        return Err(if stderr.is_empty() {
            if stdout.is_empty() {
                "La dictée Windows n'a pas abouti.".to_string()
            } else {
                stdout
            }
        } else {
            stderr
        });
    }

    Ok(stdout)
}

#[cfg(windows)]
pub fn dictation_status() -> DictationStatusDto {
    let script = r#"
try {
  Add-Type -AssemblyName System.Speech
  'ok'
} catch {
  Write-Error 'System.Speech indisponible'
  exit 1
}
"#;
    match run_powershell(script) {
        Ok(_) => DictationStatusDto {
            available: true,
            reason: None,
        },
        Err(reason) => DictationStatusDto {
            available: false,
            reason: Some(reason),
        },
    }
}

#[cfg(not(windows))]
pub fn dictation_status() -> DictationStatusDto {
    DictationStatusDto {
        available: false,
        reason: Some(
            "La dictée native est disponible sur Windows (application installée).".to_string(),
        ),
    }
}

#[tauri::command]
pub fn get_dictation_status() -> DictationStatusDto {
    dictation_status()
}

#[tauri::command]
pub fn dictation_recognize_once(lang: Option<String>) -> Result<String, String> {
    let culture = culture_for_lang(lang.as_deref().unwrap_or("fr"));

    #[cfg(windows)]
    {
        let status = dictation_status();
        if !status.available {
            return Err(status
                .reason
                .unwrap_or_else(|| "Dictée indisponible.".to_string()));
        }

        let script = format!(
            r#"
Add-Type -AssemblyName System.Speech
$culture = [System.Globalization.CultureInfo]::new('{culture}')
$rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine($culture)
$rec.SetInputToDefaultAudioDevice()
$rec.BabbleTimeout = [TimeSpan]::FromSeconds(0)
$rec.InitialSilenceTimeout = [TimeSpan]::FromSeconds(8)
$rec.EndSilenceTimeout = [TimeSpan]::FromSeconds(1)
$result = $rec.Recognize()
if ($null -eq $result) {{ exit 2 }}
$result.Text
"#
        );

        let output = run_powershell(&script)?;
        if output.is_empty() {
            return Err("Aucune parole détectée. Réessayez.".to_string());
        }
        return Ok(output);
    }

    #[cfg(not(windows))]
    {
        let _ = culture;
        Err(dictation_status()
            .reason
            .unwrap_or_else(|| "Dictée indisponible.".to_string()))
    }
}
