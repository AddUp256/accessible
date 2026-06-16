//! R?le : Module Rust Piper : commandes natives et pont syst?me pour Accessible.
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
pub struct PiperStatusDto {
    pub available: bool,
    pub reason: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PiperSynthDto {
    pub wav_path: String,
}

static WORK_COUNTER: AtomicU64 = AtomicU64::new(0);

fn piper_command() -> Command {
    #[cfg(windows)]
    {
        let mut command = Command::new("piper");
        command.creation_flags(0x08000000);
        command
    }
    #[cfg(not(windows))]
    {
        Command::new("piper")
    }
}

pub fn is_piper_installed() -> bool {
    piper_command()
        .arg("--help")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

fn resolve_piper_model(model_path: Option<&str>) -> Result<PathBuf, String> {
    let path = if let Some(custom) = model_path.filter(|p| !p.trim().is_empty()) {
        custom.to_string()
    } else {
        std::env::var("PIPER_MODEL").map_err(|_| {
            "Variable PIPER_MODEL non définie. Indiquez le chemin vers une voix Piper .onnx (français)."
                .to_string()
        })?
    };

    let model_path = PathBuf::from(path.trim());
    if !model_path.is_file() {
        return Err(format!(
            "Modèle Piper introuvable : {}",
            model_path.to_string_lossy()
        ));
    }

    Ok(model_path)
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PiperVoiceDto {
    pub id: String,
    pub label: String,
    pub lang: String,
    pub path: String,
    pub available: bool,
}

fn voice_from_env(id: &str, label: &str, lang: &str, env_key: &str) -> Option<PiperVoiceDto> {
    let path = std::env::var(env_key).ok()?;
    let trimmed = path.trim();
    if trimmed.is_empty() {
        return None;
    }
    let model_path = PathBuf::from(trimmed);
    Some(PiperVoiceDto {
        id: id.to_string(),
        label: label.to_string(),
        lang: lang.to_string(),
        path: trimmed.to_string(),
        available: model_path.is_file(),
    })
}

pub fn list_piper_voices() -> Vec<PiperVoiceDto> {
    let mut voices = Vec::new();
    for voice in [
        voice_from_env("fr", "Français (PIPER_MODEL)", "fr", "PIPER_MODEL"),
        voice_from_env("en", "English (PIPER_MODEL_EN)", "en", "PIPER_MODEL_EN"),
        voice_from_env("es", "Español (PIPER_MODEL_ES)", "es", "PIPER_MODEL_ES"),
        voice_from_env("de", "Deutsch (PIPER_MODEL_DE)", "de", "PIPER_MODEL_DE"),
        voice_from_env("ar", "العربية (PIPER_MODEL_AR)", "ar", "PIPER_MODEL_AR"),
        voice_from_env("zh", "中文 (PIPER_MODEL_ZH)", "zh", "PIPER_MODEL_ZH"),
        voice_from_env("it", "Italiano (PIPER_MODEL_IT)", "it", "PIPER_MODEL_IT"),
        voice_from_env("pt", "Português (PIPER_MODEL_PT)", "pt", "PIPER_MODEL_PT"),
        voice_from_env("hi", "हिन्दी (PIPER_MODEL_HI)", "hi", "PIPER_MODEL_HI"),
        voice_from_env("uk", "Українська (PIPER_MODEL_UK)", "uk", "PIPER_MODEL_UK"),
        voice_from_env("tr", "Türkçe (PIPER_MODEL_TR)", "tr", "PIPER_MODEL_TR"),
    ]
    .into_iter()
    .flatten()
    {
        voices.push(voice);
    }
    voices
}

pub fn piper_status() -> PiperStatusDto {
    if !is_piper_installed() {
        return PiperStatusDto {
            available: false,
            reason: Some(
                "Piper n'est pas installé ou introuvable. Installez Piper TTS et ajoutez-le au PATH."
                    .to_string(),
            ),
        };
    }

    let voices = list_piper_voices();
    if voices.iter().any(|v| v.available) {
        return PiperStatusDto {
            available: true,
            reason: None,
        };
    }

    match resolve_piper_model(None) {
        Ok(_) => PiperStatusDto {
            available: true,
            reason: None,
        },
        Err(reason) => PiperStatusDto {
            available: false,
            reason: Some(reason),
        },
    }
}

fn piper_cache_dir() -> Result<PathBuf, String> {
    let base = std::env::temp_dir().join("accessible-piper");
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

#[tauri::command]
pub fn get_piper_status() -> PiperStatusDto {
    piper_status()
}

#[tauri::command]
pub fn list_piper_voices_cmd() -> Vec<PiperVoiceDto> {
    list_piper_voices()
}

#[tauri::command]
pub fn piper_synthesize(
    text: String,
    rate: Option<f32>,
    model_path: Option<String>,
) -> Result<PiperSynthDto, String> {
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return Err("Aucun texte à lire.".to_string());
    }

    let status = piper_status();
    if !status.available {
        return Err(status
            .reason
            .unwrap_or_else(|| "Piper indisponible.".to_string()));
    }

    let model = resolve_piper_model(model_path.as_deref())?;
    let cache_dir = piper_cache_dir()?;
    let output_path = output_wav_path(&cache_dir);

    let length_scale = 1.0 / clamp_rate(rate.unwrap_or(1.0));

    let mut command = piper_command();
    command
        .arg("--model")
        .arg(&model)
        .arg("--output_file")
        .arg(&output_path)
        .arg("--length_scale")
        .arg(length_scale.to_string())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let mut child = command
        .spawn()
        .map_err(|e| format!("Impossible d'exécuter Piper : {e}"))?;

    if let Some(stdin) = child.stdin.as_mut() {
        stdin
            .write_all(trimmed.as_bytes())
            .map_err(|e| e.to_string())?;
        stdin.write_all(b"\n").map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        return Err(if stderr.trim().is_empty() {
            "Piper n'a pas pu synthétiser le texte.".to_string()
        } else {
            stderr.trim().to_string()
        });
    }

    if !output_path.is_file() {
        return Err("Piper n'a pas produit de fichier audio.".to_string());
    }

    Ok(PiperSynthDto {
        wav_path: output_path.to_string_lossy().to_string(),
    })
}
