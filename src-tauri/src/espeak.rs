//! R?le : Module Rust Espeak : commandes natives et pont syst?me pour Accessible.
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::Serialize;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EspeakStatusDto {
    pub available: bool,
    pub reason: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EspeakSynthDto {
    pub wav_path: String,
}

static WORK_COUNTER: AtomicU64 = AtomicU64::new(0);

fn espeak_command_name() -> Option<&'static str> {
    for name in ["espeak-ng", "espeak"] {
        let ok = {
            #[cfg(windows)]
            let mut command = Command::new(name);
            #[cfg(windows)]
            command.creation_flags(0x08000000);
            #[cfg(not(windows))]
            let mut command = Command::new(name);
            command
                .arg("--version")
                .output()
                .map(|output| output.status.success())
                .unwrap_or(false)
        };
        if ok {
            return Some(name);
        }
    }
    None
}

fn espeak_command() -> Result<Command, String> {
    let name = espeak_command_name().ok_or_else(|| {
        "eSpeak NG n'est pas installé ou introuvable. Installez espeak-ng et ajoutez-le au PATH."
            .to_string()
    })?;
    #[cfg(windows)]
    {
        let mut command = Command::new(name);
        command.creation_flags(0x08000000);
        Ok(command)
    }
    #[cfg(not(windows))]
    {
        Ok(Command::new(name))
    }
}

pub fn is_espeak_installed() -> bool {
    espeak_command_name().is_some()
}

fn resolve_espeak_voice() -> String {
    std::env::var("ESPEAK_VOICE")
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
        .unwrap_or_else(|| "fr".to_string())
}

fn espeak_cache_dir() -> Result<PathBuf, String> {
    let base = std::env::temp_dir().join("accessible-espeak");
    fs::create_dir_all(&base).map_err(|e| e.to_string())?;
    Ok(base)
}

fn output_wav_path(cache_dir: &Path) -> PathBuf {
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0);
    let counter = WORK_COUNTER.fetch_add(1, Ordering::Relaxed);
    cache_dir.join(format!(
        "tts_{}-{}-{}.wav",
        stamp,
        std::process::id(),
        counter
    ))
}

fn clamp_rate(rate: f32) -> f32 {
    rate.clamp(0.5, 2.0)
}

fn rate_to_wpm(rate: f32) -> u32 {
    (175.0 * clamp_rate(rate)).round() as u32
}

pub fn espeak_status() -> EspeakStatusDto {
    if !is_espeak_installed() {
        return EspeakStatusDto {
            available: false,
            reason: Some(
                "eSpeak NG n'est pas installé ou introuvable. Installez espeak-ng et ajoutez-le au PATH."
                    .to_string(),
            ),
        };
    }

    EspeakStatusDto {
        available: true,
        reason: None,
    }
}

#[tauri::command]
pub fn get_espeak_status() -> EspeakStatusDto {
    espeak_status()
}

#[tauri::command]
pub fn espeak_synthesize(text: String, rate: Option<f32>) -> Result<EspeakSynthDto, String> {
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return Err("Aucun texte à lire.".to_string());
    }

    let status = espeak_status();
    if !status.available {
        return Err(status
            .reason
            .unwrap_or_else(|| "eSpeak NG indisponible.".to_string()));
    }

    let cache_dir = espeak_cache_dir()?;
    let output_path = output_wav_path(&cache_dir);
    let voice = resolve_espeak_voice();
    let wpm = rate_to_wpm(rate.unwrap_or(1.0));

    let mut command = espeak_command()?;
    command
        .arg("-v")
        .arg(&voice)
        .arg("-s")
        .arg(wpm.to_string())
        .arg("-w")
        .arg(&output_path)
        .arg("--stdin")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let mut child = command
        .spawn()
        .map_err(|e| format!("Impossible d'exécuter eSpeak NG : {e}"))?;

    if let Some(stdin) = child.stdin.as_mut() {
        stdin
            .write_all(trimmed.as_bytes())
            .map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(if stderr.trim().is_empty() {
            "eSpeak NG n'a pas pu synthétiser le texte.".to_string()
        } else {
            stderr.trim().to_string()
        });
    }

    if !output_path.is_file() {
        return Err("eSpeak NG n'a pas produit de fichier audio.".to_string());
    }

    Ok(EspeakSynthDto {
        wav_path: output_path.to_string_lossy().to_string(),
    })
}
