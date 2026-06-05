use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

#[cfg(windows)]
use std::os::windows::process::CommandExt;

use serde::Serialize;
use tauri::Manager;

const VIDEO_EXTENSIONS: &[&str] = &["mp4", "webm", "mov", "mkv", "avi", "m4v"];
static WORK_COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TranscriptSegmentDto {
    pub start_ms: u64,
    pub end_ms: u64,
    pub text: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TranscriptionResultDto {
    pub text: String,
    pub segments: Vec<TranscriptSegmentDto>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WhisperStatusDto {
    pub available: bool,
    pub reason: Option<String>,
}

struct WhisperCommand {
    program: String,
}

fn hidden_command(program: &str) -> Command {
    #[cfg(windows)]
    {
        let mut command = Command::new(program);
        command.creation_flags(0x08000000);
        command
    }
    #[cfg(not(windows))]
    {
        Command::new(program)
    }
}

fn ffmpeg_command() -> Command {
    hidden_command("ffmpeg")
}

fn whisper_commands() -> Vec<WhisperCommand> {
    vec![
        WhisperCommand {
            program: "whisper-cli".to_string(),
        },
        WhisperCommand {
            program: "whisper".to_string(),
        },
        WhisperCommand {
            program: "main".to_string(),
        },
    ]
}

fn whisper_help_works(command: &WhisperCommand) -> bool {
    hidden_command(&command.program)
        .arg("--help")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

pub fn is_whisper_installed() -> bool {
    whisper_commands().iter().any(whisper_help_works)
}

pub fn is_ffmpeg_installed() -> bool {
    ffmpeg_command()
        .arg("-version")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

fn resolve_whisper_model() -> Result<PathBuf, String> {
    let path = std::env::var("WHISPER_MODEL").map_err(|_| {
        "Variable WHISPER_MODEL non définie. Indiquez le chemin vers un modèle Whisper (.bin ou .gguf)."
            .to_string()
    })?;

    let model_path = PathBuf::from(path.trim());
    if !model_path.is_file() {
        return Err(format!(
            "Modèle Whisper introuvable : {}",
            model_path.to_string_lossy()
        ));
    }

    Ok(model_path)
}

pub fn whisper_status() -> WhisperStatusDto {
    if !is_whisper_installed() {
        return WhisperStatusDto {
            available: false,
            reason: Some(
                "Whisper n'est pas installé ou introuvable. Installez whisper.cpp (whisper-cli) et ajoutez-le au PATH."
                    .to_string(),
            ),
        };
    }

    match resolve_whisper_model() {
        Ok(_) => WhisperStatusDto {
            available: true,
            reason: None,
        },
        Err(reason) => WhisperStatusDto {
            available: false,
            reason: Some(reason),
        },
    }
}

fn transcribe_work_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("transcribe");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

fn work_stamp() -> Result<String, String> {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())
        .map(|duration| duration.as_millis())?;
    let counter = WORK_COUNTER.fetch_add(1, Ordering::Relaxed);
    Ok(format!("{}-{}-{}", millis, std::process::id(), counter))
}

fn is_video_filename(filename: &str) -> bool {
    Path::new(filename)
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| VIDEO_EXTENSIONS.contains(&ext.to_lowercase().as_str()))
        .unwrap_or(false)
}

fn safe_media_extension(filename: &str) -> Result<String, String> {
    let ext = Path::new(filename)
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_lowercase())
        .unwrap_or_else(|| "wav".to_string());

    if ext.chars().all(|c| c.is_ascii_alphanumeric()) {
        Ok(ext)
    } else {
        Err("Extension de fichier non prise en charge.".to_string())
    }
}

fn extract_audio_wav(input_path: &Path, output_path: &Path) -> Result<(), String> {
    let output = ffmpeg_command()
        .arg("-y")
        .arg("-i")
        .arg(input_path)
        .arg("-vn")
        .arg("-ar")
        .arg("16000")
        .arg("-ac")
        .arg("1")
        .arg("-c:a")
        .arg("pcm_s16le")
        .arg(output_path)
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("Impossible d'exécuter ffmpeg : {e}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(if stderr.trim().is_empty() {
            "ffmpeg n'a pas pu extraire l'audio.".to_string()
        } else {
            format!("Erreur ffmpeg : {}", stderr.trim())
        });
    }

    Ok(())
}

fn parse_srt_timestamp(value: &str) -> Option<u64> {
    let (time, ms) = value.trim().split_once(',')?;
    let mut parts = time.split(':');
    let hours: u64 = parts.next()?.parse().ok()?;
    let minutes: u64 = parts.next()?.parse().ok()?;
    let seconds: u64 = parts.next()?.parse().ok()?;
    let millis: u64 = ms.parse().ok()?;
    Some(((hours * 3600 + minutes * 60 + seconds) * 1000) + millis)
}

fn parse_srt(content: &str) -> Vec<TranscriptSegmentDto> {
    let mut segments = Vec::new();
    let normalized = content.replace("\r\n", "\n");
    let blocks: Vec<&str> = normalized.split("\n\n").collect();

    for block in blocks {
        let lines: Vec<&str> = block.lines().collect();
        if lines.len() < 2 {
            continue;
        }

        let Some(timing_line) = lines.iter().find(|line| line.contains("-->")) else {
            continue;
        };
        let Some((start_raw, end_raw)) = timing_line.split_once("-->") else {
            continue;
        };
        let start_ms = parse_srt_timestamp(start_raw).unwrap_or(0);
        let end_ms = parse_srt_timestamp(end_raw).unwrap_or(start_ms);

        let text_start = lines
            .iter()
            .position(|line| line.contains("-->"))
            .map(|index| index + 1)
            .unwrap_or(1);
        let text = lines[text_start..].join(" ").trim().to_string();

        if text.is_empty() {
            continue;
        }

        segments.push(TranscriptSegmentDto {
            start_ms,
            end_ms,
            text,
        });
    }

    segments
}

fn run_whisper_on_file(
    command: &WhisperCommand,
    model: &Path,
    audio_path: &Path,
    output_prefix: &Path,
    lang: &str,
) -> Result<(), String> {
    let output = hidden_command(&command.program)
        .arg("-m")
        .arg(model)
        .arg("-f")
        .arg(audio_path)
        .arg("-l")
        .arg(lang)
        .arg("-osrt")
        .arg("-of")
        .arg(output_prefix)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("Impossible d'exécuter {} : {e}", command.program))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(if stderr.trim().is_empty() {
            format!("{} n'a pas pu transcrire ce fichier.", command.program)
        } else {
            stderr.trim().to_string()
        });
    }

    Ok(())
}

fn transcribe_audio_path(
    audio_path: &Path,
    lang: &str,
    output_prefix: &Path,
) -> Result<TranscriptionResultDto, String> {
    let model = resolve_whisper_model()?;
    let mut last_error = String::from("Whisper n'a pas pu transcrire ce fichier.");

    for command in whisper_commands() {
        if !whisper_help_works(&command) {
            continue;
        }

        match run_whisper_on_file(&command, &model, audio_path, output_prefix, lang) {
            Ok(()) => {
                let srt_path = PathBuf::from(format!("{}.srt", output_prefix.to_string_lossy()));
                let srt_content = fs::read_to_string(&srt_path).map_err(|e| e.to_string())?;
                let _ = fs::remove_file(&srt_path);

                let segments = parse_srt(&srt_content);
                if segments.is_empty() {
                    return Err("Whisper n'a détecté aucune parole dans ce fichier.".to_string());
                }

                let text = segments
                    .iter()
                    .map(|segment| segment.text.as_str())
                    .collect::<Vec<_>>()
                    .join(" ")
                    .trim()
                    .to_string();

                return Ok(TranscriptionResultDto { text, segments });
            }
            Err(error) => last_error = error,
        }
    }

    Err(last_error)
}

#[tauri::command]
pub fn get_whisper_status() -> WhisperStatusDto {
    whisper_status()
}

#[tauri::command]
pub fn is_whisper_available() -> bool {
    whisper_status().available
}

#[tauri::command]
pub fn transcribe_media_file(
    app: tauri::AppHandle,
    media_bytes: Vec<u8>,
    filename: String,
    lang: Option<String>,
) -> Result<TranscriptionResultDto, String> {
    if media_bytes.is_empty() {
        return Err("Fichier média vide.".to_string());
    }

    let status = whisper_status();
    if !status.available {
        return Err(status
            .reason
            .unwrap_or_else(|| "Whisper indisponible.".to_string()));
    }

    let lang = lang.unwrap_or_else(|| "fr".to_string());
    let work_dir = transcribe_work_dir(&app)?;
    let stamp = work_stamp()?;
    let ext = safe_media_extension(&filename)?;
    let input_path = work_dir.join(format!("media_{stamp}.{ext}"));
    fs::write(&input_path, media_bytes).map_err(|e| e.to_string())?;

    let audio_path = if is_video_filename(&filename) {
        if !is_ffmpeg_installed() {
            let _ = fs::remove_file(&input_path);
            return Err(
                "ffmpeg est requis pour transcrire une vidéo. Installez ffmpeg et ajoutez-le au PATH."
                    .to_string(),
            );
        }

        let wav_path = work_dir.join(format!("audio_{stamp}.wav"));
        if let Err(error) = extract_audio_wav(&input_path, &wav_path) {
            let _ = fs::remove_file(&input_path);
            return Err(error);
        }
        let _ = fs::remove_file(&input_path);
        wav_path
    } else {
        input_path
    };

    let output_prefix = work_dir.join(format!("out_{stamp}"));
    let result = transcribe_audio_path(&audio_path, &lang, &output_prefix);
    let _ = fs::remove_file(&audio_path);

    result
}
